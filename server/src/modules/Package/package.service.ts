import { PackageModel } from './package.model';
import { CreatePackageDTO, UpdatePackageDTO, PACKAGE_DAYS_LABELS } from './package.dto';
import { ProgramModel } from '@modules/Programs/program.model';
import { HttpException } from '@common/errors/HttpException';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';

export class PackageService {
  public async createPackage(data: CreatePackageDTO) {
    const program = await ProgramModel.findById(data.program);
    if (!program) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Program not found');
    }
    if (program.programType !== 'ACADEMIC_TUTORIAL') {
      throw new HttpException(
        HttpStatusCodes.BAD_REQUEST,
        'Packages can only be added to Academic Tutorial programs'
      );
    }

    const daysPerWeek = Number(data.daysPerWeek) as 1 | 2 | 3 | 4 | 5;
    if (![1, 2, 3, 4, 5].includes(daysPerWeek)) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'daysPerWeek must be 1–5');
    }

    const existing = await PackageModel.findOne({ program: data.program, daysPerWeek });
    if (existing) {
      throw new HttpException(
        HttpStatusCodes.CONFLICT,
        `A package for ${PACKAGE_DAYS_LABELS[daysPerWeek]} already exists on this program`
      );
    }

    // 3×/week is the recommended popular tier by default
    const isPopular = data.isPopular ?? daysPerWeek === 3;
    if (isPopular) {
      await PackageModel.updateMany({ program: data.program }, { $set: { isPopular: false } });
    }

    return PackageModel.create({
      program: data.program,
      name: data.name || PACKAGE_DAYS_LABELS[daysPerWeek],
      price: data.price,
      daysPerWeek,
      description: data.description,
      isPopular,
      isActive: data.isActive ?? true,
      orderIndex: data.orderIndex ?? daysPerWeek,
      stripePriceId: data.stripePriceId,
    });
  }

  public async getPackagesByProgram(programId: string, activeOnly = false) {
    const query: any = { program: programId };
    if (activeOnly) query.isActive = true;
    return PackageModel.find(query).sort({ daysPerWeek: 1, orderIndex: 1 }).lean();
  }

  public async updatePackage(id: string, data: UpdatePackageDTO) {
    const pkg = await PackageModel.findById(id);
    if (!pkg) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Package not found');

    if (data.daysPerWeek !== undefined && data.daysPerWeek !== pkg.daysPerWeek) {
      const conflict = await PackageModel.findOne({
        program: pkg.program,
        daysPerWeek: data.daysPerWeek,
        _id: { $ne: pkg._id },
      });
      if (conflict) {
        throw new HttpException(
          HttpStatusCodes.CONFLICT,
          `A package for ${PACKAGE_DAYS_LABELS[data.daysPerWeek]} already exists`
        );
      }
      pkg.daysPerWeek = data.daysPerWeek as 1 | 2 | 3 | 4 | 5;
    }

    if (data.name !== undefined) pkg.name = data.name;
    if (data.price !== undefined) pkg.price = data.price;
    if (data.description !== undefined) pkg.description = data.description;
    if (data.isPopular !== undefined) {
      if (data.isPopular) {
        await PackageModel.updateMany(
          { program: pkg.program, _id: { $ne: pkg._id } },
          { $set: { isPopular: false } }
        );
      }
      pkg.isPopular = data.isPopular;
    }
    if (data.isActive !== undefined) pkg.isActive = data.isActive;
    if (data.orderIndex !== undefined) pkg.orderIndex = data.orderIndex;
    if (data.stripePriceId !== undefined) pkg.stripePriceId = data.stripePriceId;

    await pkg.save();
    return pkg;
  }

  public async deletePackage(id: string) {
    const pkg = await PackageModel.findByIdAndDelete(id);
    if (!pkg) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Package not found');
  }
}
