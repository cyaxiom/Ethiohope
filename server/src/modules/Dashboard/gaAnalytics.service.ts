import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';
import { logger } from '@utils/logger';
import { GA_PROPERTY_ID } from '@core/config/env';

/**
 * Service to interact with Google Analytics 4 Data API
 */
export class GaAnalyticsService {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    this.propertyId = GA_PROPERTY_ID || '';
    
    const credentialsPath = path.resolve(process.cwd(), 'src/core/config/oauth-credentials.json');
    const tokenPath = path.resolve(process.cwd(), 'src/core/config/token.json');
    const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
      path.resolve(process.cwd(), 'src/core/config/google-service-account.json');

    try {
      if (fs.existsSync(credentialsPath) && fs.existsSync(tokenPath)) {
        // Use OAuth 2.0
        logger.info('GA4 Service: Initializing with OAuth 2.0 (token.json)');
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        const creds = credentials.installed || credentials.web;

        this.client = new BetaAnalyticsDataClient({
          credentials: {
            client_id: creds.client_id,
            client_secret: creds.client_secret,
            refresh_token: token.refresh_token,
            type: 'authorized_user'
          },
        });
      } else {
        // Fallback to Service Account
        logger.info(`GA4 Service: Initializing with Service Account fallback.`);
        this.client = new BetaAnalyticsDataClient({
          keyFilename: fs.existsSync(keyFilePath) ? keyFilePath : undefined,
        });
      }
    } catch (error) {
      logger.error('GA4 Service: Failed to initialize. Analytics will be disabled.', error);
      this.client = new BetaAnalyticsDataClient();
    }
  }

  public async getSummary(startDate = '30daysAgo', endDate = 'today', source?: string) {
    try {
      if (!this.propertyId) throw new Error('GA_PROPERTY_ID is not configured');

      const dimensionFilter = (source && source.toLowerCase() !== 'all') ? {
        filter: {
          fieldName: 'sessionSource',
          stringFilter: {
            matchType: 'CONTAINS' as any,
            value: source.toLowerCase()
          }
        }
      } : undefined;

      logger.info(`GA4 Summary Request: source=${source}, filter=${JSON.stringify(dimensionFilter)}`);

      const reportParams: any = {
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'bounceRate' },
        ],
      };

      if (dimensionFilter) {
        reportParams.dimensionFilter = dimensionFilter;
      }

      const [response] = await this.client.runReport(reportParams);

      // Use totals if available, otherwise fallback to first row
      const metricsData = response.totals?.[0]?.metricValues || response.rows?.[0]?.metricValues || [];
      
      if (!response.rows || response.rows.length === 0) {
        logger.warn(`GA4 Service: No data rows returned for range ${startDate}-${endDate}. Thresholding might be active.`);
      }

      const result = {
        totalUsers: parseInt(metricsData[0]?.value || '0'),
        activeUsers: parseInt(metricsData[1]?.value || '0'),
        pageViews: parseInt(metricsData[2]?.value || '0'),
        sessions: parseInt(metricsData[3]?.value || '0'),
        bounceRate: `${(parseFloat(metricsData[4]?.value || '0') * 100).toFixed(1)}%`,
      };

      logger.info(`GA4 Summary Data: ${JSON.stringify(result)}`);
      return result;
    } catch (error: any) {
      logger.error('Error fetching GA4 summary:', error.message);
      return {
        totalUsers: 0,
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        bounceRate: '0%',
      };
    }
  }

  public async getTimeline(startDate = '30daysAgo', endDate = 'today', source?: string) {
    try {
      if (!this.propertyId) throw new Error('GA_PROPERTY_ID is not configured');

      const dimensionFilter = (source && source.toLowerCase() !== 'all') ? {
        filter: {
          fieldName: 'sessionSource',
          stringFilter: {
            matchType: 'CONTAINS' as any,
            value: source.toLowerCase()
          }
        }
      } : undefined;

      const reportParams: any = {
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'sessions' }, 
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      };

      if (dimensionFilter) {
        reportParams.dimensionFilter = dimensionFilter;
      }

      const [response] = await this.client.runReport(reportParams);

      return response.rows?.map((row: any) => ({
        name: this.formatDate(row.dimensionValues?.[0]?.value || ''),
        visits: parseInt(row.metricValues?.[0]?.value || '0'),
        users: parseInt(row.metricValues?.[1]?.value || '0'),
        views: parseInt(row.metricValues?.[2]?.value || '0'),
      })) || [];
    } catch (error: any) {
      logger.error('Error fetching GA4 timeline:', error.message);
      return [];
    }
  }

  /**
   * Get Country Distribution
   */
  public async getCountryDistribution(startDate = '30daysAgo', endDate = 'today', source?: string) {
    try {
      if (!this.propertyId) throw new Error('GA_PROPERTY_ID is not configured');

      const dimensionFilter = (source && source.toLowerCase() !== 'all') ? {
        filter: {
          fieldName: 'sessionSource',
          stringFilter: {
            matchType: 'CONTAINS' as any,
            value: source.toLowerCase()
          }
        }
      } : undefined;

      const reportParams: any = {
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' }
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      };

      if (dimensionFilter) {
        reportParams.dimensionFilter = dimensionFilter;
      }

      const [response] = await this.client.runReport(reportParams);

      return response.rows?.map((row: any) => ({
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions: parseInt(row.metricValues?.[0]?.value || '0'),
        users: parseInt(row.metricValues?.[1]?.value || '0'),
      })) || [];
    } catch (error: any) {
      logger.error('Error fetching GA4 country distribution:', error.message);
      return [];
    }
  }

  /**
   * Get Traffic Sources
   */
  public async getTrafficSources(startDate = '30daysAgo', endDate = 'today') {
    try {
      if (!this.propertyId) throw new Error('GA_PROPERTY_ID is not configured');

      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
      });

      const totalSessions = response.rows?.reduce((acc, row) => acc + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

      return response.rows?.map(row => {
        const visits = parseInt(row.metricValues?.[0]?.value || '0');
        return {
          source: row.dimensionValues?.[0]?.value || 'Other',
          visits,
          percentage: `${((visits / totalSessions) * 100).toFixed(1)}%`,
        };
      }) || [];
    } catch (error: any) {
      logger.error('Error fetching GA4 traffic sources:', error.message);
      return [];
    }
  }

  /**
   * Get Top Pages
   */
  public async getTopPages(startDate = '30daysAgo', endDate = 'today', source?: string) {
    try {
      if (!this.propertyId) throw new Error('GA_PROPERTY_ID is not configured');

      const dimensionFilter = (source && source.toLowerCase() !== 'all') ? {
        filter: {
          fieldName: 'sessionSource',
          stringFilter: {
            matchType: 'CONTAINS' as any,
            value: source.toLowerCase()
          }
        }
      } : undefined;

      const reportParams: any = {
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'bounceRate' }],
        limit: 10,
      };

      if (dimensionFilter) {
        reportParams.dimensionFilter = dimensionFilter;
      }

      const [response] = await this.client.runReport(reportParams);

      return response.rows?.map((row: any) => ({
        page: row.dimensionValues?.[0]?.value || '/',
        views: parseInt(row.metricValues?.[0]?.value || '0'),
        bounce: `${(parseFloat(row.metricValues?.[1]?.value || '0') * 100).toFixed(1)}%`,
      })) || [];
    } catch (error: any) {
      logger.error('Error fetching GA4 top pages:', error.message);
      return [];
    }
  }

  /**
   * Get Realtime Data
   */
  public async getRealtimeData() {
    try {
      if (!this.propertyId) throw new Error('GA_PROPERTY_ID is not configured');

      const [response] = await this.client.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      });

      return {
        activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0'),
      };
    } catch (error) {
      logger.error('Error fetching GA4 realtime data:', error);
      return { activeUsers: 0 };
    }
  }

  private formatDate(dateStr: string) {
    if (dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${month}/${day}`;
  }
}
