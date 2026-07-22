import { ScheduleModel, ISchedule } from "./schedule.model";
import { Types } from "mongoose";

export class ScheduleDao {
  /**
   * Find all schedules (populating batch)
   */
  public async findSchedules(params: { batchId?: string }): Promise<ISchedule[]> {
    let query: any = {};
    if (params.batchId && Types.ObjectId.isValid(params.batchId)) {
      query.batch = new Types.ObjectId(params.batchId);
    }

    const schedules = await ScheduleModel.find(query)
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
