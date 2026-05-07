
import axios from 'axios';

// Mock data for summary
export const getAnalyticsSummary = async (filter: string = 'week', platform: string = 'all') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    totalVisits: 12540,
    activeUsers: 842,
    pageViews: 45210,
    bounceRate: "32.4%",
    trafficSources: [
      { name: 'Direct', value: 400 },
      { name: 'Social', value: 300 },
      { name: 'Organic', value: 300 },
      { name: 'Referral', value: 200 },
    ]
  };
};

// Mock data for timeline
export const getAnalyticsTimeline = async (filter: string = 'week') => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = [
    { name: 'Mon', visits: 400, users: 240 },
    { name: 'Tue', visits: 300, users: 139 },
    { name: 'Wed', visits: 200, users: 980 },
    { name: 'Thu', visits: 278, users: 390 },
    { name: 'Fri', visits: 189, users: 480 },
    { name: 'Sat', visits: 239, users: 380 },
    { name: 'Sun', visits: 349, users: 430 },
  ];
  
  return data;
};

// Mock data for top pages
export const getTopPages = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { page: '/home', views: 1200, bounce: '12%' },
    { page: '/courses', views: 800, bounce: '15%' },
    { page: '/about', views: 600, bounce: '10%' },
    { page: '/contact', views: 400, bounce: '22%' },
    { page: '/admin/dashboard', views: 200, bounce: '5%' },
  ];
};

// Mock data for traffic sources breakdown
export const getTrafficSources = async (filter: string = 'week') => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { source: 'TikTok', visits: 4500, percentage: '35%' },
    { source: 'Telegram', visits: 3200, percentage: '25%' },
    { source: 'Facebook', visits: 2100, percentage: '16%' },
    { source: 'Instagram', visits: 1500, percentage: '12%' },
    { source: 'LinkedIn', visits: 800, percentage: '6%' },
    { source: 'Other', visits: 700, percentage: '6%' },
  ];
};
