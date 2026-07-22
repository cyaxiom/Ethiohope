import { NextFunction, Request, Response } from "express";
import { SessionService } from "./session.service";
import { CreateSessionDTO, UpdateSessionDTO, CreateSessionFromScheduleDTO } from "./session.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { RequestWithTokenPayload } from "@modules/Authentication/auth.interface";

export class SessionController {
  private sessionService = new SessionService();

  public createSession = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const sessionData: CreateSessionDTO = req.body;
      const userId = req.tokenPayload._id.toString();
      const createdSession = await this.sessionService.createSession(sessionData, userId);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Session created successfully",
        data: createdSession,
      });
    } catch (error) {
      next(error);
    }
  };

  public createSessionFromSchedule = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const scheduleId = req.params.scheduleId;
      const data: CreateSessionFromScheduleDTO = req.body;
      const userId = req.tokenPayload._id.toString();

      const createdSession = await this.sessionService.createSessionFromSchedule(scheduleId, data, userId);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Session created from schedule successfully",
        data: createdSession,
      });
    } catch (error) {
      next(error);
    }
  };

  public getStudentSessions = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const userId = req.tokenPayload._id.toString();
      const sessions = await this.sessionService.getStudentSessions(userId);

      // Sanitize sessions for students: hide all zoom fields
      const sanitizedSessions = sessions.map((s: any) => {
        const { 
          join_url, zoomLink, zoomMeetingId,
          zoomLinkJunior, joinUrlJunior, zoomMeetingIdJunior,
          zoomLinkSenior, joinUrlSenior, zoomMeetingIdSenior,
          ...rest 
        } = s.toObject();
        return rest;
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Student sessions retrieved successfully",
        data: sanitizedSessions,
      });
    } catch (error) {
      next(error);
    }
  };

  public getSessions = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const sessions = await this.sessionService.getSessions(filter);
      const isAdult = req.tokenPayload.type === 'adult';

      if (!isAdult) {
        const sanitizedSessions = sessions.map((s: any) => {
          const { 
            join_url, zoomLink, zoomMeetingId,
            zoomLinkJunior, joinUrlJunior, zoomMeetingIdJunior,
            zoomLinkSenior, joinUrlSenior, zoomMeetingIdSenior,
            ...rest 
          } = s.toObject();
          return rest;
        });
        return res.status(HttpStatusCodes.OK).json({
          success: true,
          message: "Sessions retrieved successfully",
          data: sanitizedSessions,
        });
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Sessions retrieved successfully",
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };

  public getSessionJoinUrl = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.params.id;
      const userId = req.tokenPayload._id.toString();
      const role = req.tokenPayload.type === 'adult' ? 'admin' : 'student';
      
      const url = await this.sessionService.getSessionJoinUrl(sessionId, userId, role);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Join URL retrieved successfully",
        data: { url },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const sessionData: UpdateSessionDTO = req.body;
      const updatedSession = await this.sessionService.updateSession(id, sessionData);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Session updated successfully",
        data: updatedSession,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.sessionService.deleteSession(id);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Session deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
