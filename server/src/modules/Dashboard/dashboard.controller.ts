import { NextFunction, Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { GaAnalyticsService } from './gaAnalytics.service';

import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { logger } from "@utils/logger";

export class DashboardController {
  private dashboardService = new DashboardService();
  private gaAnalyticsService = new GaAnalyticsService();


  public getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("API: Processing request for dashboard statistics");
      const stats = await this.dashboardService.getStats();
      
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Dashboard stats fetched successfully",
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getInstructorStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("API: Processing request for instructor dashboard statistics");
      const stats = await this.dashboardService.getStats(); // Currently same as admin stats
      
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Instructor Dashboard stats fetched successfully",
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };


  public getAnalyticsSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, source } = req.query;
      const data = await this.gaAnalyticsService.getSummary(startDate as string, endDate as string, source as string);
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error: any) {
      logger.error('Analytics Summary Error:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };

  public getAnalyticsTimeline = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, source } = req.query;
      const data = await this.gaAnalyticsService.getTimeline(startDate as string, endDate as string, source as string);
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error: any) {
      logger.error('Analytics Timeline Error:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };

  public getAnalyticsSources = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await this.gaAnalyticsService.getTrafficSources(startDate as string, endDate as string);
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error: any) {
      logger.error('Analytics Sources Error:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };

  public getAnalyticsTopPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, source } = req.query;
      const data = await this.gaAnalyticsService.getTopPages(startDate as string, endDate as string, source as string);
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error: any) {
      logger.error('Analytics Top Pages Error:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };

  public getAnalyticsCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, source } = req.query;
      const data = await this.gaAnalyticsService.getCountryDistribution(startDate as string, endDate as string, source as string);
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error: any) {
      logger.error('Analytics Countries Error:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };

  public getAnalyticsRealtime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.gaAnalyticsService.getRealtimeData();
      res.status(HttpStatusCodes.OK).json({ success: true, data });
    } catch (error: any) {
      logger.error('Analytics Realtime Error:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  };

  public getParentsWithChildren = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("API: Processing request for parents and children details");
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const data = await this.dashboardService.getParentsWithChildren(search);
      
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Parents and children fetched successfully",
        data
      });
    } catch (error) {
      next(error);
    }
  };

  public getTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("API: Processing request for teacher details");
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const data = await this.dashboardService.getInstructors(search);
      
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Teachers fetched successfully",
        data
      });
    } catch (error) {
      next(error);
    }
  };

  public getChildrenDirectory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const data = await this.dashboardService.getChildrenDirectory(search);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Children directory fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAdultStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const data = await this.dashboardService.getAdultStudents(search);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Adult students fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getPersonEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = typeof req.query.parentId === 'string' ? req.query.parentId : undefined;
      const childId = typeof req.query.childId === 'string' ? req.query.childId : undefined;
      const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const data = await this.dashboardService.getPersonEnrollments({ parentId, childId, userId });
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Enrollments fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
