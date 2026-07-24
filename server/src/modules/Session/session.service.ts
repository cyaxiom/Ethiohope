import { SessionDAO } from "./session.dao";
import { SessionModel, ISession } from "./session.model";
import { CreateSessionDTO, UpdateSessionDTO } from "./session.dto";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import axios from "axios";
import { Types } from "mongoose";
import { ScheduleModel } from "../Schedule/schedule.model";
import { BatchModel } from "../Batches/batch.model";
import { PhaseModel } from "../Phases/phase.model";
import { EnrollmentModel } from "../Enrollments/enrollment.model";
import { emailService } from "@infra/mail/email.service";
import { User } from "@modules/User/user.schema";
import { ChildModel } from "../Child/child.model";
import { scheduleSlotToUtcRange, ETHIOPIA_TZ } from "@common/utils/timezone";

export class SessionService {
  private sessionDAO = new SessionDAO();

  private async getZoomAccessToken(): Promise<string> {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!accountId || !clientId || !clientSecret) {
      throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Zoom API credentials not configured");
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
        null,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to get Zoom access token");
    }
  }

  private async createZoomMeeting(title: string, startTime: string, duration: number) {
    const token = await this.getZoomAccessToken();

    try {
      const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
          topic: title,
          type: 2, // Scheduled meeting
          start_time: startTime,
          duration: duration,
          settings: {
            join_before_host: true,
            host_video: true,
            participant_video: true,
            waiting_room: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        join_url: response.data.join_url,
        start_url: response.data.start_url,
        id: response.data.id,
      };
    } catch (error) {
      throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to create Zoom meeting");
    }
  }

  public async createSession(data: CreateSessionDTO, userId: string): Promise<ISession> {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Start time must be before end time");
    }

    const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

    // Auto-create two zoom meetings for different age groups (9-12 and 13-18)
    const zoomMeetingJunior = await this.createZoomMeeting(`${data.title} (Junior 9-12)`, start.toISOString(), durationMinutes);
    const zoomMeetingSenior = await this.createZoomMeeting(`${data.title} (Senior 13-18)`, start.toISOString(), durationMinutes);

    const sessionData = {
      ...data,
      createdBy: new Types.ObjectId(userId) as any,
      // Fallback/Main links
      zoomLink: zoomMeetingJunior.start_url, 
      join_url: zoomMeetingJunior.join_url,
      zoomMeetingId: zoomMeetingJunior.id.toString(),

      // Junior Specific
      zoomLinkJunior: zoomMeetingJunior.start_url,
      joinUrlJunior: zoomMeetingJunior.join_url,
      zoomMeetingIdJunior: zoomMeetingJunior.id.toString(),

      // Senior Specific
      zoomLinkSenior: zoomMeetingSenior.start_url,
      joinUrlSenior: zoomMeetingSenior.join_url,
      zoomMeetingIdSenior: zoomMeetingSenior.id.toString(),
    };

    const session = await this.sessionDAO.create(sessionData as any);
    
    // Background Trigger: Notify students (STEP 4.1.7)
    this.notifyStudentsInBatch(session.batchId.toString(), session).catch(err => console.error("Notification broadcast failed:", err));

    return session;
  }

  public async createSessionFromSchedule(
    scheduleId: string,
    data: { targetDate: string; programId?: string; phaseId?: string },
    userId: string
  ): Promise<ISession> {
    const schedule = await ScheduleModel.findById(scheduleId);
    if (!schedule) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Schedule not found");
    }

    let { targetDate, programId, phaseId } = data;

    if (!programId || !phaseId) {
      const batch = await BatchModel.findById(schedule.batch);
      if (!batch) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Could not find batch with ID ${schedule.batch} for this schedule.`);
      }

      const activeProgramId = programId || batch.program.toString();
      programId = activeProgramId;
      
      if (!phaseId) {
        const phase = await PhaseModel.findOne({ program: activeProgramId }).sort({ orderIndex: 1 });
        if (phase) {
            phaseId = phase._id.toString();
        }
        // If still no phaseId, that's okay, we'll allow creating the session without a phase as per user requirement.
      }
    }

    if (!programId) {
       throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Could not resolve program for this schedule.");
    }


    const tz = (schedule as any).timeZone || ETHIOPIA_TZ;
    const { start, end } = scheduleSlotToUtcRange(
      targetDate,
      schedule.startTime,
      schedule.endTime,
      tz
    );

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid date or time format");
    }

    if (start >= end) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Start time must be before end time");
    }

    const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

    const zoomMeetingJunior = await this.createZoomMeeting(
      `${schedule.sessionLabel} (Junior 9-12)`,
      start.toISOString(),
      durationMinutes
    );

    const zoomMeetingSenior = await this.createZoomMeeting(
      `${schedule.sessionLabel} (Senior 13-18)`,
      start.toISOString(),
      durationMinutes
    );

    const sessionData = {
      programId: programId as string,
      phaseId: phaseId as string,
      batchId: schedule.batch.toString(),
      scheduleId: schedule._id.toString(),
      sessionType: schedule.type.toLowerCase(),
      title: schedule.sessionLabel,
      startTime: start,
      endTime: end,
      createdBy: new Types.ObjectId(userId) as any,
      
      // Fallback/Default
      zoomLink: zoomMeetingJunior.start_url,
      join_url: zoomMeetingJunior.join_url,
      zoomMeetingId: zoomMeetingJunior.id.toString(),

      // Junior Specific
      zoomLinkJunior: zoomMeetingJunior.start_url,
      joinUrlJunior: zoomMeetingJunior.join_url,
      zoomMeetingIdJunior: zoomMeetingJunior.id.toString(),

      // Senior Specific
      zoomLinkSenior: zoomMeetingSenior.start_url,
      joinUrlSenior: zoomMeetingSenior.join_url,
      zoomMeetingIdSenior: zoomMeetingSenior.id.toString(),
    };

    const session = await this.sessionDAO.create(sessionData as any);

    // Background Trigger: Notify students (STEP 4.1.7)
    this.notifyStudentsInBatch(session.batchId.toString(), session).catch(err => console.error("Notification broadcast failed:", err));

    return session;
  }

  public async getSessions(filters: any): Promise<ISession[]> {
    return await this.sessionDAO.findAll(filters);
  }

  public async getStudentSessions(userId: string): Promise<ISession[]> {
    // 1. Find all active enrollments for this user (parent or child? plan says logged-in student)
    // Assuming the user logged in is the student (Child) or the parent viewing for child.
    // metadata says "logged-in student".
    
    const enrollments = await EnrollmentModel.find({ 
      $or: [{ parent: userId }, { child: userId }],
      status: 'ACTIVE' 
    });

    if (enrollments.length === 0) {
      return [];
    }

    const sessionFilters: any[] = enrollments.map(enr => ({
      programId: enr.program,
      batchId: enr.batch,
      scheduleId: { $in: enr.selectedSchedules },
      $or: [
        { phaseId: enr.phase },
        { phaseId: { $exists: false } },
        { phaseId: null }
      ]
    }));

    return await SessionModel.find({ $or: sessionFilters })
      .populate('batchId', 'batchName')
      .sort({ startTime: -1 });
  }

  public async getSessionJoinUrl(sessionId: string, userId: string, role: string): Promise<string> {
    const session = await this.sessionDAO.findById(sessionId);
    if (!session) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Session not found");
    }

    // Admin/Instructor logic
    if (role === "admin" || session.createdBy.toString() === userId) {
      return session.zoomLink || session.join_url as string;
    }

    // Student/Parent logic: Enforce rigorous validation (STEP 4.1.4)
    const enrollment = await EnrollmentModel.findOne({
      $or: [{ parent: userId }, { child: userId }],
      program: session.programId,
      phase: session.phaseId,
      batch: session.batchId,
      selectedSchedules: session.scheduleId,
      status: 'ACTIVE'
    });

    if (!enrollment) {
      throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access denied. No active enrollment found for this session.");
    }

    // Attendance logging removed for this phase as per user request.

    // Determine which link to send based on child's age (STEP 4.1.4 update)
    const child = await ChildModel.findById(enrollment.child);
    if (!child) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Child record not found for this enrollment.");
    }

    const age = (child as any).age;
    
    // 9-12 gets junior link, 13-18 gets senior link
    if (age >= 9 && age <= 12) {
      return session.joinUrlJunior || session.join_url as string;
    } else if (age >= 13 && age <= 18) {
      return session.joinUrlSenior || session.join_url as string;
    }

    if (!session.join_url) {
       throw new HttpException(HttpStatusCodes.NOT_FOUND, "Join URL not found");
    }

    return session.join_url;
  }

  private async notifyStudentsInBatch(batchId: string, session: ISession) {
    // 1. Fetch all active enrollments for this batch
    const enrollments = await EnrollmentModel.find({ batch: batchId, status: 'ACTIVE' }).populate('parent');
    
    // 2. Extract unique parent emails
    const emails = Array.from(new Set(enrollments.map((enr: any) => enr.parent?.email).filter(e => !!e)));

    if (emails.length === 0) return;

    const sessionDetails = {
      title: session.title,
      startTime: session.startTime.toLocaleString(),
      type: session.sessionType.toUpperCase()
    };

    // 3. Send emails (using Promise.allSettled to ensure failure of one doesn't stop others)
    await Promise.allSettled(emails.map(email => 
      emailService.sendSessionNotificationEmail(email as string, sessionDetails)
    ));
  }

  public async updateSession(id: string, data: UpdateSessionDTO): Promise<ISession> {
    const session = await this.sessionDAO.findById(id);
    if (!session) {
       throw new HttpException(HttpStatusCodes.NOT_FOUND, "Session not found");
    }

    let updateData: any = { ...data };

    // Handle Rescheduling logic
    if (data.targetDate) {
      const scheduleId = data.scheduleId || session.scheduleId;
      if (!scheduleId) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Cannot reschedule a session that has no schedule template.");
      }

      const schedule = await ScheduleModel.findById(scheduleId);
      if (!schedule) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, "Schedule template not found");
      }

      const tz = (schedule as any).timeZone || ETHIOPIA_TZ;
      const { start, end } = scheduleSlotToUtcRange(
        data.targetDate,
        schedule.startTime,
        schedule.endTime,
        tz
      );

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid date format");
      }

      updateData.startTime = start;
      updateData.endTime = end;

      const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);
      const token = await this.getZoomAccessToken();

      // 1. Update main/legacy meeting if it exists
      if (session.zoomMeetingId) {
        try {
          await axios.patch(`https://api.zoom.us/v2/meetings/${session.zoomMeetingId}`, {
            start_time: start.toISOString(),
            duration: durationMinutes
          }, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          });
        } catch (err) { console.error("Failed to update main zoom meeting:", err); }
      }

      // 2. Handle Junior Meeting (Create if missing, else Update)
      if (!session.zoomMeetingIdJunior) {
        try {
          const zoomJunior = await this.createZoomMeeting(`${session.title} (Junior 9-12)`, start.toISOString(), durationMinutes);
          updateData.zoomLinkJunior = zoomJunior.start_url;
          updateData.joinUrlJunior = zoomJunior.join_url;
          updateData.zoomMeetingIdJunior = zoomJunior.id.toString();
          
          // If the main link was also missing, use this as default
          if (!session.zoomMeetingId) {
            updateData.zoomLink = zoomJunior.start_url;
            updateData.join_url = zoomJunior.join_url;
            updateData.zoomMeetingId = zoomJunior.id.toString();
          }
        } catch (err) { console.error("Failed to create missing Junior meeting during reschedule:", err); }
      } else {
        try {
          await axios.patch(`https://api.zoom.us/v2/meetings/${session.zoomMeetingIdJunior}`, {
            start_time: start.toISOString(),
            duration: durationMinutes
          }, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          });
        } catch (err) { console.error("Failed to update Junior zoom meeting:", err); }
      }

      // 3. Handle Senior Meeting (Create if missing, else Update)
      if (!session.zoomMeetingIdSenior) {
        try {
          const zoomSenior = await this.createZoomMeeting(`${session.title} (Senior 13-18)`, start.toISOString(), durationMinutes);
          updateData.zoomLinkSenior = zoomSenior.start_url;
          updateData.joinUrlSenior = zoomSenior.join_url;
          updateData.zoomMeetingIdSenior = zoomSenior.id.toString();
        } catch (err) { console.error("Failed to create missing Senior meeting during reschedule:", err); }
      } else {
        try {
          await axios.patch(`https://api.zoom.us/v2/meetings/${session.zoomMeetingIdSenior}`, {
            start_time: start.toISOString(),
            duration: durationMinutes
          }, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
          });
        } catch (err) { console.error("Failed to update Senior zoom meeting:", err); }
      }
    }

    const updated = await this.sessionDAO.update(id, updateData);
    if (!updated) {
       throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update session");
    }
    return updated;
  }

  public async deleteSession(id: string): Promise<ISession> {
    const session = await this.sessionDAO.findById(id);
    if (!session) {
       throw new HttpException(HttpStatusCodes.NOT_FOUND, "Session not found");
    }

    // Delete Zoom Meetings
    const meetingIds = [
      session.zoomMeetingId,
      session.zoomMeetingIdJunior,
      session.zoomMeetingIdSenior
    ].filter(Boolean);

    if (meetingIds.length > 0) {
      try {
        const token = await this.getZoomAccessToken();
        await Promise.allSettled(meetingIds.map(mid => 
          axios.delete(`https://api.zoom.us/v2/meetings/${mid}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ));
      } catch (zoomErr) {
        console.error("Failed to delete Zoom meetings:", zoomErr);
      }
    }

    const deleted = await this.sessionDAO.delete(id);
    if (!deleted) {
       throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete session");
    }
    return deleted;
  }
}
