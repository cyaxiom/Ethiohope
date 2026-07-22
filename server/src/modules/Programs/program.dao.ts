import { ProgramModel, IProgram } from "./program.model";
import { Types } from "mongoose";

export class ProgramsDao {
  /**
   * Find a program by its ID
   */
  public async findById(programId: string): Promise<IProgram | null> {
    const program = await ProgramModel.findById(programId).lean();
    return program as IProgram | null;
  }

  /**
   * Create a new program
   */
  public async createProgram(data: Partial<IProgram>): Promise<IProgram> {
    const program = await ProgramModel.create(data);
    return program.toObject() as IProgram;
  }

  /**
   * Update program details
   */
  public async update(programId: Types.ObjectId, data: Partial<IProgram>): Promise<IProgram | null> {
    const updatedProgram = await ProgramModel.findByIdAndUpdate(programId, { $set: data }, { new: true }).lean();
    return updatedProgram as IProgram | null;
  }

  /**
   * Helper to build search query
   */
  private buildQuery(search?: string): any {
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    return query;
  }

  /**
   * List all programs with pagination
   */
  public async findAllPrograms(skip: number, limit: number, search?: string): Promise<IProgram[]> {
    const query = this.buildQuery(search);
    return await ProgramModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ orderIndex: 1, createdAt: -1 })
      .lean() as unknown as IProgram[];
  }

  /**
   * Count all programs for pagination
   */
  /**
   * Count all programs for pagination
   */
  public async countPrograms(search?: string): Promise<number> {
    const query = this.buildQuery(search);
    return await ProgramModel.countDocuments(query);
  }

  /**
   * Delete a program
   */
  public async delete(programId: Types.ObjectId): Promise<IProgram | null> {
    const deletedProgram = await ProgramModel.findByIdAndDelete(programId).lean();
    return deletedProgram as IProgram | null;
  }
}
