
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer2, 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  useGetAnalyticsSummaryQuery,
  useGetAnalyticsTimelineQuery,
  useGetAnalyticsSourcesQuery,
  useGetAnalyticsTopPagesQuery,
  useGetAnalyticsRealtimeQuery
} from '../../features/analytics/analyticsApi';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Tracks = () => {
  const [timeFilter, setTimeFilter] = useState('30daysAgo');
  const [platform, setPlatform] = useState('all');
  
  // Prepare dates based on filter
  const getDates = (filter: string) => {
    switch (filter) {
      case 'today': return { startDate: 'today', endDate: 'today' };
      case 'week': return { startDate: '7daysAgo', endDate: 'today' };
      case 'month': return { startDate: '30daysAgo', endDate: 'today' };
      case 'year': return { startDate: '365daysAgo', endDate: 'today' };
      default: return { startDate: '30daysAgo', endDate: 'today' };
    }
  };

  const dates = getDates(timeFilter);

  // Queries
  const { data: summaryData, isLoading: loadingSummary, refetch: refetchSummary } = useGetAnalyticsSummaryQuery(dates);
  const { data: timelineData, isLoading: loadingTimeline } = useGetAnalyticsTimelineQuery(dates);
  const { data: sourcesData, isLoading: loadingSources } = useGetAnalyticsSourcesQuery(dates);
  const { data: topPagesData, isLoading: loadingPages } = useGetAnalyticsTopPagesQuery(dates);
  const { data: realtimeData, refetch: refetchRealtime } = useGetAnalyticsRealtimeQuery(undefined, {
    pollingInterval: 15000, // Poll every 15 seconds
  });

  const isLoading = loadingSummary || loadingTimeline || loadingSources || loadingPages;

  // Platform Filter Logic
  const filteredSources = sourcesData?.data?.filter((s: any) => {
    if (platform === 'all') return true;
    const sourceName = s.source.toLowerCase();
    if (platform === 'TikTok') return sourceName.includes('tiktok');
    if (platform === 'Telegram') return sourceName.includes('t.me') || sourceName.includes('telegram');
    if (platform === 'Facebook') return sourceName.includes('facebook');
    if (platform === 'Instagram') return sourceName.includes('instagram');
    if (platform === 'LinkedIn') return sourceName.includes('linkedin');
    return true;
  }) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time website performance from GA4</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Clock size={16} className="text-gray-400 ml-2" />
          {['today', 'week', 'month', 'year'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                timeFilter === f 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Realtime Widget */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-100 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold uppercase tracking-wider">Live Now</span>
            </div>
            <h2 className="text-5xl font-black mb-2">{realtimeData?.data?.activeUsers || 0}</h2>
            <p className="text-blue-100 font-medium">Active users on site</p>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
              <span>Auto-updating...</span>
              <button onClick={() => refetchRealtime()} className="hover:rotate-180 transition-transform duration-500">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Platform Filter */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Globe size={14} /> Filter by Acquisition Platform
          </h3>
          <div className="flex flex-wrap gap-3">
            {['all', 'TikTok', 'Telegram', 'Facebook', 'Instagram', 'LinkedIn'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                  platform === p 
                    ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                }`}
              >
                {p === 'all' ? 'All Traffic' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <SummaryCard 
          title="Total Users" 
          value={summaryData?.data?.totalUsers.toLocaleString() || '0'} 
          icon={<Users className="text-blue-600" />} 
          isLoading={loadingSummary}
        />
        <SummaryCard 
          title="Active Users" 
          value={summaryData?.data?.activeUsers.toLocaleString() || '0'} 
          icon={<Activity className="text-emerald-500" />} 
          isLoading={loadingSummary}
        />
        <SummaryCard 
          title="Page Views" 
          value={summaryData?.data?.pageViews.toLocaleString() || '0'} 
          icon={<Eye className="text-purple-500" />} 
          isLoading={loadingSummary}
        />
        <SummaryCard 
          title="Sessions" 
          value={summaryData?.data?.sessions.toLocaleString() || '0'} 
          icon={<MousePointer2 className="text-orange-500" />} 
          isLoading={loadingSummary}
        />
      </motion.div>

      {/* Main Chart */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Traffic Trend</h3>
            <p className="text-sm text-gray-500">Daily sessions and active users</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div> Sessions
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Active Users
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          {loadingTimeline ? (
             <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center">
               <BarChart3 className="text-gray-200 w-12 h-12" />
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData?.data || []}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            Top Performing Pages
            <span className="text-xs font-medium text-gray-400">Past {timeFilter}</span>
          </h3>
          <div className="space-y-4">
            {loadingPages ? [1,2,3,4,5].map(i => (
              <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-xl"></div>
            )) : topPagesData?.data?.map((page: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{page.page}</p>
                    <p className="text-xs text-gray-400">Views: {page.views.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-800 dark:text-white">{page.bounce}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Bounce Rate</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Sources Breakdown */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold mb-6">Traffic Acquisition</h3>
          <div className="h-[300px] w-full">
            {loadingSources ? (
               <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredSources} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} width={100} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="visits" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {filteredSources.slice(0, 4).map((source: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">{source.source}</span>
                <span className="text-sm font-black text-blue-600">{source.percentage}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, isLoading }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 group transition-all"
  >
    {isLoading ? (
      <div className="animate-pulse space-y-4">
        <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
        <div className="h-4 bg-gray-50 w-2/3 rounded"></div>
        <div className="h-8 bg-gray-100 w-1/2 rounded"></div>
      </div>
    ) : (
      <>
        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 w-fit group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="mt-6">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h4>
          <p className="text-3xl font-black mt-1 text-gray-900 dark:text-white tracking-tight">{value}</p>
        </div>
      </>
    )}
  </motion.div>
);

export default Tracks;
