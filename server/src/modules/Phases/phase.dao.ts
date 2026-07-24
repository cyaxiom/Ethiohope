import { PhaseModel, IPhase } from "./phase.model";
import { Types } from "mongoose";

export class PhaseDao {
  /**
   * Find a phase by program and orderIndex
   */
  public async findByOrderIndex(programId: string, orderIndex: number): Promise<IPhase | null> {
    const phase = await PhaseModel.findOne({ program: new Types.ObjectId(programId), orderIndex }).lean();
    return phase as IPhase | null;
  }

  /**
   * Create a new phase
   */
  public async createPhase(data: Partial<IPhase>): Promise<IPhase> {
    const phase = await PhaseModel.create(data);
    return phase.toObject() as IPhase;
  }

  /**
   * Find all phases for a specific program
   */
  public async findByProgramId(programId: string): Promise<IPhase[]> {
    const phases = await PhaseModel.find({ program: new Types.ObjectId(programId) })
      .sort({ orderIndex: 1 })
      .lean();
    return phases as unknown as IPhase[];
  }

  /**
   * Find phase by ID
   */
  public async findById(phaseId: string): Promise<IPhase | null> {
    const phase = await PhaseModel.findById(phaseId).lean();
    return phase as IPhase | null;
  }

  /**
   * Update phase details
   */
  public async update(phaseId: Types.ObjectId, data: Partial<IPhase>): Promise<IPhase | null> {
    const updatedPhase = await PhaseModel.findByIdAndUpdate(phaseId, { $set: data }, { new: true }).lean();
    return updatedPhase as IPhase | null;
  }

  /**
   * Delete a phase
   */
  public async delete(phaseId: string): Promise<IPhase | null> {
    const deletedPhase = await PhaseModel.findByIdAndDelete(phaseId).lean();
    return deletedPhase as IPhase | null;
  }
}
