import { EnrollmentModel, IEnrollment } from "./enrollment.model";

export class EnrollmentDao {
  public async create(data: Partial<IEnrollment>): Promise<IEnrollment> {
    const enrollment = await EnrollmentModel.create(data);
    return enrollment;
  }

  public async findByChildAndPhase(childId: string, phaseId: string): Promise<IEnrollment | null> {
    return await EnrollmentModel.findOne({ child: childId, phase: phaseId });
  }
}
