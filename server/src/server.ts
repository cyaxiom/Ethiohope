import App from './app';
import { UserRoute } from '@modules/User/user.route';
import { AuthRoute } from '@modules/Authentication/auth.route';
import { AccessRoute } from '@modules/AccessControl/access.route';
import { ChildRoute } from '@modules/Child/child.route';
import { dbConnection } from '@database/database';
import { logger } from '@utils/logger';
import validateEnv from '@utils/validateEnv';
import { connect, connection } from 'mongoose';
import * as http from 'http';
import { ParentRoute } from '@modules/Parent/parent.route';
import { DashboardRoute, InstructorDashboardRoute } from '@modules/Dashboard/dashboard.routes';
import { ProgramRoute } from '@modules/Programs/program.route';
import { PhaseRoute } from '@modules/Phases/phase.route';
import { PackageRoute } from '@modules/Package/package.route';
import { BatchRoute } from '@modules/Batches/batch.route';
import { ScheduleRoute } from '@modules/Schedule/schedule.route';
import { UploadRoute } from '@modules/Uploads/upload.route';
import { PublicProgramRoute } from '@modules/Programs/public-program.route';
import { EnrollmentRoute, ParentEnrollmentRoute } from '@modules/Enrollments/enrollment.route';
import { PaymentRoute } from '@modules/Payments/payment.route';
import { CourseRoute } from '@modules/Courses/course.route';
import { StudentCourseRoute } from '@modules/Courses/student-course.route';
import { ProgressRoute } from '@modules/Progress/progress.route';
import { SessionRoute } from '@modules/Session/session.route';
import { ChatRoute } from '@modules/Chat/chat.route';
import { ChatCommonRoute } from '@modules/Chat/chat-common.route';
import { MaintenanceRoute } from '@modules/Maintenance/maintenance.route';
import { GeneralRoute } from '@modules/General/general.route';
import { initializeChatSocket } from '@modules/Chat/chat.socket';

// validate environment variables
validateEnv();

try {
  const app = new App([
    new AuthRoute(),
    new UserRoute(),
    new ParentRoute(),
    new AccessRoute(),
    new ChildRoute(),
    new DashboardRoute(),
    new InstructorDashboardRoute(),
    new ProgramRoute(),
    new PublicProgramRoute(),
    new PhaseRoute(),
    new PackageRoute(),
    new BatchRoute(),
    new ScheduleRoute(),
    new UploadRoute(),
    new EnrollmentRoute(),
    new ParentEnrollmentRoute(),
    new PaymentRoute(),
    new CourseRoute(),
    new StudentCourseRoute(),
    new ProgressRoute(),
    new SessionRoute(),
    new ChatRoute(),
    new ChatCommonRoute(),
    new MaintenanceRoute(),
    new GeneralRoute(),
  ]);

  (async function connectToDatabase() {
    try {
      await connect(dbConnection.url, dbConnection.options);

      // Drop obsolete indexes that no longer match schemas (e.g. legacy batch phase/groupType)
      const { BatchModel } = await import('@modules/Batches/batch.model');
      try {
        await BatchModel.syncIndexes();
        logger.info('Batch indexes synchronized');
      } catch (err) {
        logger.error(`Failed to sync Batch indexes: ${err}`);
      }
      
      // Execute default seeds on init (for sprint 1 permissions and roles)
      const { runSeed } = await import('@modules/AccessControl/access.seeder');
      await runSeed();

      const server = http.createServer(app.app);

      // Add error listener to server
      server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`Port ${app.port} is already in use. Please use another port or kill the process using it.`);
        } else {
          logger.error(`Server error: ${error}`);
        }
        process.exit(1);
      });

      // Start Express server using http.createServer
      server.listen(app.port, () => {
        logger.info(`=========================================`);
        logger.info(`======= ENV: ${app.env} =======`);
        logger.info(`🚀 App listening on http://localhost:${app.port}`);
        logger.info(`📃 API docs: http://localhost:${app.port}/docs`);
        logger.info(`=========================================`);

        // Initialize Socket.io for real-time chat
        initializeChatSocket(server, app.allowedOrigins);
      });
    } catch (err) {
      logger.error(`Connection to database failed or server start error: ${err}`);
      process.exit(1);
    }

    connection.on('connecting', () => logger.info('database connecting'));
    connection.on('connected', () => logger.info('database connected'));
    connection.on('disconnecting', () => logger.info('database disconnecting'))
    connection.on('disconnected', () => logger.info('database disconnected'))
    connection.on('error', err => logger.error(`database error: ${err}`));
  })();
} catch (err) {
  console.log(err);
}
// server restarted logic v2
 
