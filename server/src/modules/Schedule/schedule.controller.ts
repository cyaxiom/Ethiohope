import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDTO, UpdateScheduleDTO } from "./schedule.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class ScheduleController {
  private scheduleService = new ScheduleService();

  /**
   * Get all schedules
   */
  public getSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const batchId = req.query.batchId as string | undefined;
      const programId = req.query.programId as string | undefined;
      const schedules = await this.scheduleService.getSchedules(batchId, programId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Schedules fetched successfully",
        data: schedules
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new schedule
   */
  public createSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scheduleData: CreateScheduleDTO = req.body;
      const createdSchedule = await this.scheduleService.createSchedule(scheduleData);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Schedule created successfully",
        data: createdSchedule,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update schedule details
   */
  public updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const scheduleData: UpdateScheduleDTO = req.body;
      const updatedSchedule = await this.scheduleService.updateSchedule(id, scheduleData);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Schedule updated successfully",
        data: updatedSchedule,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a schedule
   */
  public deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.scheduleService.deleteSchedule(id);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Schedule deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
