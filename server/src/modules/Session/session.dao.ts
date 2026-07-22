import { SessionModel, ISession } from "./session.model";

export class SessionDAO {
  public async create(data: Partial<ISession>): Promise<ISession> {
    return await SessionModel.create(data);
  }

  public async findAll(filters: any = {}): Promise<ISession[]> {
    return await SessionModel.find(filters).populate("programId phaseId batchId scheduleId createdBy").sort({ startTime: 1 });
  }

  public async findById(id: string): Promise<ISession | null> {
    return await SessionModel.findById(id).populate("programId phaseId batchId scheduleId createdBy");
  }

  public async update(id: string, data: Partial<ISession>): Promise<ISession | null> {
    return await SessionModel.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<ISession | null> {
    return await SessionModel.findByIdAndDelete(id);
  }
}
