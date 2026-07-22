import { BatchModel, IBatch } from "./batch.model";
import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";
import { Types } from "mongoose";

export class BatchDao {
  /**
   * Find all batches with pagination and search (populating program)
   */
  public async findBatches(params: { page: number; limit: number; search?: string }): Promise<{ batches: any[]; total: number }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query.batchName = { $regex: search, $options: 'i' };
    }

    const [batches, total] = await Promise.all([
      BatchModel.find(query)
        .populate('program', 'title')
        .populate('instructor', 'firstname lastname')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      BatchModel.countDocuments(query),
    ]);

    // Fetch active enrollment count for each batch
    const batchesWithCounts = await Promise.all(batches.map(async (batch: any) => {
      const activeEnrollments = await EnrollmentModel.countDocuments({
        batch: batch._id,
        status: 'ACTIVE'
      });
      return { ...batch, activeEnrollments };
    }));

    return { batches: batchesWithCounts, total };
  }

  /**
   * Create a new batch
   */
  public async create(data: Partial<IBatch>): Promise<IBatch> {
    const batch = await BatchModel.create(data);
    return batch.toObject() as IBatch;
  }

  /**
   * Find batch by ID
   */
  public async findById(id: string): Promise<any | null> {
    const batch = await BatchModel.findById(id)
      .populate('program', 'title')
      .populate('instructor', 'firstname lastname')
      .lean();
    
    if (!batch) return null;

    const activeEnrollments = await EnrollmentModel.countDocuments({
      batch: batch._id,
      status: 'ACTIVE'
    });

    return { ...batch, activeEnrollments };
  }

  /**
   * Update batch
   */
  public async update(id: string, data: Partial<IBatch>): Promise<any | null> {
    const updatedBatch = await BatchModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate('program', 'title')
      .lean();

    if (!updatedBatch) return null;

    const activeEnrollments = await EnrollmentModel.countDocuments({
      batch: updatedBatch._id,
      status: 'ACTIVE'
    });

    return { ...updatedBatch, activeEnrollments };
  }

  /**
   * Delete batch
   */
  public async delete(id: string): Promise<IBatch | null> {
    const deletedBatch = await BatchModel.findByIdAndDelete(id).lean();
    return deletedBatch as unknown as IBatch | null;
  }
}
