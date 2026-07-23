import { ScheduleModel, ISchedule } from "./schedule.model";
import { Types } from "mongoose";

export class ScheduleDao {
  /**
   * Find schedules, optionally filtered by program and/or batch
   */
  public async findSchedules(params: { batchId?: string; programId?: string }): Promise<ISchedule[]> {
    const query: any = {};
    if (params.programId && Types.ObjectId.isValid(params.programId)) {
      query.program = new Types.ObjectId(params.programId);
    }
    if (params.batchId && Types.ObjectId.isValid(params.batchId)) {
      query.batch = new Types.ObjectId(params.batchId);
    }

    const schedules = await ScheduleModel.find(query)
      .populate('program', 'title ageRange')
      .populate({
        path: 'batch',
        populate: [
          { path: 'program', select: 'title' }
        ]
      })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();

    return schedules as unknown as ISchedule[];
  }

  /**
   * Create a new schedule
   */
  public async create(data: Partial<ISchedule>): Promise<ISchedule> {
    const schedule = await ScheduleModel.create(data);
    return schedule.toObject() as ISchedule;
  }

  /**
   * Find schedule by ID
   */
  public async findById(id: string): Promise<ISchedule | null> {
    const schedule = await ScheduleModel.findById(id)
      .populate('program', 'title ageRange')
      .populate({
        path: 'batch',
        populate: [
          { path: 'program', select: 'title' }
        ]
      })
      .lean();
    return schedule as unknown as ISchedule | null;
  }

  /**
   * Update schedule
   */
  public async update(id: string, data: Partial<ISchedule>): Promise<ISchedule | null> {
    const updatedSchedule = await ScheduleModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate('program', 'title')
      .populate('batch')
      .lean();
    return updatedSchedule as unknown as ISchedule | null;
  }

  /**
   * Delete schedule
   */
  public async delete(id: string): Promise<ISchedule | null> {
    const deletedSchedule = await ScheduleModel.findByIdAndDelete(id).lean();
    return deletedSchedule as unknown as ISchedule | null;
  }
}
