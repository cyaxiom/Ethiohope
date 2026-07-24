import mongoose from 'mongoose';
import { EnrollmentModel } from './src/modules/Enrollments/enrollment.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.development' });

const cleanOldEnrollments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to DB');

    const result = await EnrollmentModel.updateMany(
      { status: 'PENDING' },
      { $set: { status: 'CANCELLED' } }
    );

    console.log(`Updated ${result.modifiedCount} pending enrollments to CANCELLED.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanOldEnrollments();
