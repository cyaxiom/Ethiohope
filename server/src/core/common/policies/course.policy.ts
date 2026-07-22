import { can } from './base.policy';

export const CoursePolicy = {
  update(user: any, course: any) {
    return can.ownOrAny(
      user,
      course.teacherId,
      'course.update.any'
    );
  }
};
