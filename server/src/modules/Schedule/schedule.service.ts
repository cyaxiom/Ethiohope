import { ScheduleDao } from "./schedule.dao";
import { CreateScheduleDTO, UpdateScheduleDTO } from "./schedule.dto";
import { ISchedule } from "./schedule.model";
import { BatchModel } from "@modules/Batches/batch.model";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { logger } from "@utils/logger";
import { Types } from "mongoose";
import { ChatService } from "@modules/Chat/chat.service";

export class ScheduleService {
  private chatService = new ChatService();
  private scheduleDao = new ScheduleDao();

  /**
   * Get all schedules (optionally by program and/or batch)
   */
  public async getSchedules(batchId?: string, programId?: string): Promise<ISchedule[]> {
    // Backfill program on legacy schedules that only had batch
    if (programId || batchId) {
      await this.backfillMissingProgram(batchId, programId);
    } else {
      await this.backfillMissingProgram();
    }
    return await this.scheduleDao.findSchedules({ batchId, programId });
  }

  /**
   * Create a new schedule
   */
  public async createSchedule(scheduleData: CreateScheduleDTO): Promise<ISchedule> {
    try {
      if (isEmpty(scheduleData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Schedule data is empty");

      const batch = await BatchModel.findById(scheduleData.batch);
      if (!batch) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Batch not found");

      const programId = batch.program.toString();
      if (scheduleData.program && scheduleData.program !== programId) {
        throw new HttpException(
          HttpStatusCodes.BAD_REQUEST,
          "Selected batch does not belong to the selected program"
        );
      }

      // Validate time: startTime must be before endTime
      if (scheduleData.startTime >= scheduleData.endTime) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Start time must be before end time");
      }

      const createdSchedule = await this.scheduleDao.create({
        sessionLabel: scheduleData.sessionLabel,
        type: scheduleData.type,
        dayOfWeek: scheduleData.dayOfWeek,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        timeZone: scheduleData.timeZone || 'Africa/Addis_Ababa',
        capacity: scheduleData.capacity,
        program: new Types.ObjectId(programId),
        batch: new Types.ObjectId(scheduleData.batch),
      } as any);

      if (createdSchedule && createdSchedule.type === 'DISCUSSION') {
        try {
          await this.chatService.ensureBatchGroupExists(createdSchedule.batch.toString());
        } catch (err) {
          logger.error(`Failed to ensure chat group for newly created schedule: ${err}`);
        }
      }

      return createdSchedule;
    } catch (error) {
      logger.error(`ScheduleService Error creating schedule: ${error}`);
      throw error;
    }
  }

  /**
   * Update schedule
   */
  public async updateSchedule(id: string, scheduleData: UpdateScheduleDTO): Promise<ISchedule> {
    logger.info(`ScheduleService: Updating schedule ID: ${id}`);
    
    const existingSchedule = await this.scheduleDao.findById(id);
    if (!existingSchedule) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Schedule not found");

    const updatePayload: any = { ...scheduleData };

    if (scheduleData.batch) {
        const batch = await BatchModel.findById(scheduleData.batch);
        if (!batch) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Batch not found");

        const programId = batch.program.toString();
        if (scheduleData.program && scheduleData.program !== programId) {
          throw new HttpException(
            HttpStatusCodes.BAD_REQUEST,
            "Selected batch does not belong to the selected program"
          );
        }

        updatePayload.batch = new Types.ObjectId(scheduleData.batch);
        updatePayload.program = new Types.ObjectId(programId);
    } else if (scheduleData.program) {
      // Keep program in sync if only program sent
      updatePayload.program = new Types.ObjectId(scheduleData.program);
    } else if (!(existingSchedule as any).program && (existingSchedule as any).batch) {
      const batchId = (existingSchedule as any).batch?._id || (existingSchedule as any).batch;
      const batch = await BatchModel.findById(batchId);
      if (batch) updatePayload.program = batch.program;
    }

    // Validate time if updated
    const startTime = scheduleData.startTime || existingSchedule.startTime;
    const endTime = scheduleData.endTime || existingSchedule.endTime;
    if (startTime >= endTime) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Start time must be before end time");
    }

    const updatedSchedule = await this.scheduleDao.update(id, updatePayload);
    if (!updatedSchedule) {
      logger.error(`ScheduleService: Failed to update schedule ${id}`);
      throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update schedule");
    }

    // Cascade update to future sessions
    const timeChanged =
      (scheduleData.startTime && scheduleData.startTime !== existingSchedule.startTime) ||
      (scheduleData.endTime && scheduleData.endTime !== existingSchedule.endTime) ||
      (scheduleData.timeZone &&
        scheduleData.timeZone !== ((existingSchedule as any).timeZone || 'Africa/Addis_Ababa'));

    if (timeChanged) {
       this.syncLinkedSessions(updatedSchedule);
    }

    if (updatedSchedule && updatedSchedule.type === 'DISCUSSION') {
      try {
        await this.chatService.ensureBatchGroupExists(updatedSchedule.batch.toString());
      } catch (err) {
        logger.error(`Failed to ensure chat group after schedule update: ${err}`);
      }
    }

    return updatedSchedule;
  }

  /** Fill program from batch for legacy schedule documents. */
  private async backfillMissingProgram(batchId?: string, programId?: string): Promise<void> {
    try {
      const { ScheduleModel } = await import("./schedule.model");
      const missing = await ScheduleModel.find({
        $or: [{ program: { $exists: false } }, { program: null }],
        ...(batchId ? { batch: batchId } : {}),
      }).select('_id batch').lean();

      for (const row of missing) {
        const batch = await BatchModel.findById(row.batch).select('program').lean();
        if (!batch?.program) continue;
        if (programId && batch.program.toString() !== programId) continue;
        await ScheduleModel.updateOne({ _id: row._id }, { $set: { program: batch.program } });
      }
    } catch (err) {
      logger.error(`Failed to backfill schedule.program: ${err}`);
    }
  }

  /**
   * Sync all future sessions linked to a schedule when time changes
   */
  private async syncLinkedSessions(schedule: ISchedule) {
    try {
      const { SessionModel } = await import("@modules/Session/session.model");
      const { SessionService } = await import("@modules/Session/session.service");
      const sessionService = new SessionService();

      const futureSessions = await SessionModel.find({
        scheduleId: schedule._id,
        startTime: { $gt: new Date() }
      });

      for (const session of futureSessions) {
        const targetDate = new Date(session.startTime).toISOString().split('T')[0];
        
        // Use the same logic as rescheduling
        await sessionService.updateSession(session._id.toString(), {
          targetDate,
          scheduleId: schedule._id.toString()
        });
      }
      
      logger.info(`Cascaded update: Synced ${futureSessions.length} future sessions for schedule ${schedule._id}`);
    } catch (err) {
      logger.error(`Failed to sync linked sessions: ${err}`);
    }
  }

  /**
   * Delete schedule
   */
  public async deleteSchedule(id: string): Promise<void> {
    logger.info(`ScheduleService: Deleting schedule ID: ${id}`);
    const deletedSchedule = await this.scheduleDao.delete(id);
    if (!deletedSchedule) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Schedule not found");
  }

  /**
   * Get grouped schedules for a batch
   */
  public async getGroupedSchedules(batchId: string): Promise<any> {
    const schedules = await this.scheduleDao.findSchedules({ batchId });
    
    // Group by sessionLabel
    const grouped = schedules.reduce((acc: any, schedule: any) => {
      const label = schedule.sessionLabel;
      if (!acc[label]) {
        acc[label] = [];
      }
      acc[label].push(schedule);
      return acc;
    }, {});

    return grouped;
  }
}
