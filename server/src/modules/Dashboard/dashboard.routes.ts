import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { Routes } from '@common/interfaces/route.interface';
import { authMiddleware, requirePermission } from '@middlewares/auth.middleware';

export class DashboardRoute implements Routes {
  public path = '/admin/dashboard';
  public router = Router();
  public dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/stats',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getStats
    );

    this.router.get(
      '/analytics/summary',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getAnalyticsSummary
    );

    this.router.get(
      '/analytics/timeline',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getAnalyticsTimeline
    );

    this.router.get(
      '/analytics/sources',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getAnalyticsSources
    );

    this.router.get(
      '/analytics/top-pages',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getAnalyticsTopPages
    );

    this.router.get(
      '/analytics/realtime',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getAnalyticsRealtime
    );

    this.router.get(
      '/analytics/countries',
      authMiddleware,
      requirePermission('dashboard.admin') as any,
      this.dashboardController.getAnalyticsCountries
    );

    this.router.get(
      '/parents-children',
      authMiddleware,
      requirePermission('user.detail.view') as any,
      this.dashboardController.getParentsWithChildren
    );

    this.router.get(
      '/teachers',
      authMiddleware,
      requirePermission('user.detail.view') as any,
      this.dashboardController.getTeachers
    );

    this.router.get(
      '/children',
      authMiddleware,
      requirePermission('user.detail.view') as any,
      this.dashboardController.getChildrenDirectory
    );

    this.router.get(
      '/adult-students',
      authMiddleware,
      requirePermission('user.detail.view') as any,
      this.dashboardController.getAdultStudents
    );

    this.router.get(
      '/person-enrollments',
      authMiddleware,
      requirePermission('user.detail.view') as any,
      this.dashboardController.getPersonEnrollments
    );
  }
}

export class InstructorDashboardRoute implements Routes {
  public path = '/instructor/dashboard';
  public router = Router();
  public dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/stats',
      authMiddleware,
      requirePermission('dashboard.instructor') as any,
      this.dashboardController.getInstructorStats
    );
  }
}
