
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
  RefreshCw,
  Info,
  ExternalLink,
  Link,
  Copy,
  Check
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
  useGetAnalyticsCountriesQuery,
  useGetAnalyticsRealtimeQuery
} from '../../features/analytics/analyticsApi';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Tracks = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [platform, setPlatform] = useState('all');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('https://ethiohope.com');
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  
  const generateLink = (source: string) => {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source.toLowerCase());
    url.searchParams.set('utm_medium', 'social');
    return url.toString();
  };

  const handleCopy = (source: string) => {
    const link = generateLink(source);
    navigator.clipboard.writeText(link);
    setCopiedPlatform(source);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };
  
  // Prepare dates based on filter
  const getDates = (filter: string) => {
    switch (filter) {
      case 'yesterday': return { startDate: 'yesterday', endDate: 'yesterday' };
      case 'week': return { startDate: '7daysAgo', endDate: 'today' };
      case 'month': return { startDate: '30daysAgo', endDate: 'today' };
      case 'year': return { startDate: '365daysAgo', endDate: 'today' };
      default: return { startDate: '30daysAgo', endDate: 'today' };
    }
  };

  const dates = getDates(timeFilter);
  const queryParams = { ...dates, source: platform.toLowerCase() };

  // Queries
  const { data: summaryData, isLoading: loadingSummary, refetch: refetchSummary } = useGetAnalyticsSummaryQuery(queryParams);
  const { data: timelineData, isLoading: loadingTimeline } = useGetAnalyticsTimelineQuery(queryParams);
  const { data: sourcesData, isLoading: loadingSources } = useGetAnalyticsSourcesQuery(dates); // Sources should show all, so we keep 'dates'
  const { data: topPagesData, isLoading: loadingPages } = useGetAnalyticsTopPagesQuery(queryParams);
  const { data: countriesData, isLoading: loadingCountries } = useGetAnalyticsCountriesQuery(queryParams);
  const { data: realtimeData, refetch: refetchRealtime } = useGetAnalyticsRealtimeQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });

  const isLoading = loadingSummary || loadingTimeline || loadingSources || loadingPages;

  // Metric definitions
  const metricInfo = {
    totalUsers: {
      title: "Total Users",
      desc: "Total unique users who visited your site during the selected period. This counts anyone who loaded a page.",
      icon: <Users className="text-blue-600" />
    },
    activeUsers: {
      title: "Active Users (Engaged)",
      desc: "Users who had an engaged visit. An engaged visit is one that lasted 10 seconds or longer, had 1 or more conversion events, or had 2 or more page views.",
      icon: <Activity className="text-emerald-500" />
    },
    pageViews: {
      title: "Page Views",
      desc: "The total number of times any page on your site was loaded or reloaded. Repeated views of a single page are counted.",
      icon: <Eye className="text-purple-500" />
    },
    sessions: {
      title: "Visits",
      desc: "A visit (session) starts when a user opens your site and ends after 30 minutes of inactivity. It's a way to measure individual trips to your site.",
      icon: <MousePointer2 className="text-orange-500" />
    },
    realtime: {
      title: "Real-time Users",
      desc: "Number of unique users who have triggered an event on your site in the last 30 minutes. This shows people on the site right now.",
      icon: <Activity className="text-white" />
    }
  };


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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            <BarChart3 className="text-blue-600 flex-shrink-0" size={32} />
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
            Google Analytics 4 • <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Connected</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border-r border-gray-100 dark:border-gray-700 mr-1 flex-shrink-0">
            <Clock size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Time Period</span>
          </div>
          {['yesterday', 'week', 'month', 'year'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                timeFilter === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
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
          onMouseEnter={() => setHoveredMetric('realtime')}
          onMouseLeave={() => setHoveredMetric(null)}
          className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Activity size={100} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-100">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  <span className="text-xs font-black uppercase tracking-[0.15em]">Live on Site</span>
                </div>
                <div className="relative">
                  <Info size={14} className="text-blue-200 cursor-help opacity-60 hover:opacity-100 transition-opacity" />
                  <AnimatePresence>
                    {hoveredMetric === 'realtime' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full right-0 mb-3 w-64 p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl text-xs leading-relaxed z-50 border border-gray-100 dark:border-gray-800"
                      >
                        <p className="font-bold mb-1 text-blue-600">Real-time Users</p>
                        {metricInfo.realtime.desc}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <h2 className="text-6xl font-black mb-1 mt-4 tracking-tight">{realtimeData?.data?.activeUsers || 0}</h2>
              <p className="text-blue-100 font-bold opacity-80 uppercase text-[10px] tracking-widest">Unique Visitors</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-blue-100/60 uppercase tracking-widest">
              <span>Auto-refreshing</span>
              <button onClick={() => refetchRealtime()} className="hover:rotate-180 transition-transform duration-700 bg-white/10 p-1.5 rounded-lg">
                <RefreshCw size={12} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Platform Filter */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <Globe size={240} />
          </div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2">
            <Globe size={16} className="text-blue-500" /> Traffic Acquisition Source
          </h3>
          <div className="flex gap-2 sm:gap-3 relative z-10 overflow-x-auto pb-1 -mx-1 px-1">
            {['all', 'TikTok', 'Telegram', 'Facebook', 'Instagram', 'LinkedIn'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  platform === p 
                    ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-400'
                }`}
              >
                {p === 'all' ? 'All Channels' : p}
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
          info={metricInfo.totalUsers.desc}
          metricKey="totalUsers"
          hovered={hoveredMetric}
          setHovered={setHoveredMetric}
        />
        <SummaryCard 
          title="Active Users" 
          value={summaryData?.data?.activeUsers.toLocaleString() || '0'} 
          icon={<Activity className="text-emerald-500" />} 
          isLoading={loadingSummary}
          info={metricInfo.activeUsers.desc}
          metricKey="activeUsers"
          hovered={hoveredMetric}
          setHovered={setHoveredMetric}
        />
        <SummaryCard 
          title="Page Views" 
          value={summaryData?.data?.pageViews.toLocaleString() || '0'} 
          icon={<Eye className="text-purple-500" />} 
          isLoading={loadingSummary}
          info={metricInfo.pageViews.desc}
          metricKey="pageViews"
          hovered={hoveredMetric}
          setHovered={setHoveredMetric}
        />
        <SummaryCard 
          title="Visits" 
          value={summaryData?.data?.sessions.toLocaleString() || '0'} 
          icon={<MousePointer2 className="text-orange-500" />} 
          isLoading={loadingSummary}
          info={metricInfo.sessions.desc}
          metricKey="sessions"
          hovered={hoveredMetric}
          setHovered={setHoveredMetric}
        />
      </motion.div>

      {/* Main Chart */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-10 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">Growth & Engagement</h3>
            <p className="text-sm text-gray-500 mt-1">Daily trend for Sessions vs. Active Users</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-6 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div> 
              <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Visits</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div> 
              <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Active Users</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]"></div> 
              <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Page Views</span>
            </div>
          </div>
        </div>
        <div className="h-[260px] sm:h-[400px] w-full">
          {loadingTimeline ? (
             <div className="w-full h-full bg-gray-50 dark:bg-gray-900/50 animate-pulse rounded-3xl flex items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                 <BarChart3 className="text-gray-200 dark:text-gray-800 w-16 h-16 animate-bounce" />
                 <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Generating Trend...</span>
               </div>
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData?.data || []}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                    padding: '16px',
                    backgroundColor: '#fff',
                    color: '#000'
                  }}
                  itemStyle={{fontWeight: 800, fontSize: '12px'}}
                  labelStyle={{marginBottom: '8px', color: '#64748b', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase'}}
                />
                <Area type="monotone" dataKey="views" name="Page Views" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" dot={{r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                <Area type="monotone" dataKey="visits" name="Visits" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorVisits)" dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
                <Area type="monotone" dataKey="users" name="Active Users" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6, strokeWidth: 0}} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">Top Content</h3>
              <p className="text-sm text-gray-500">Most visited paths</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600">
              {timeFilter}
            </div>
          </div>
          <div className="space-y-3">
            {loadingPages ? [1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-50 dark:bg-gray-900/50 animate-pulse rounded-2xl"></div>
            )) : topPagesData?.data?.map((page: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 shadow-sm text-gray-400 group-hover:text-blue-600 flex items-center justify-center font-black text-xs transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:translate-x-1 transition-transform">{page.page}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Eye size={10} /> {page.views.toLocaleString()} Views
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900 dark:text-white">{page.bounce}</p>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5">Bounce</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic Sources Breakdown */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="mb-8">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">Source Distribution</h3>
            <p className="text-sm text-gray-500">How users find you</p>
          </div>
          <div className="h-[220px] sm:h-[300px] w-full">
            {loadingSources ? (
               <div className="w-full h-full bg-gray-50 dark:bg-gray-900/50 animate-pulse rounded-3xl"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourcesData?.data || []} layout="vertical" margin={{left: 20}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-gray-800" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="source" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100} 
                    tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', opacity: 0.5}}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="visits" fill="#6366f1" radius={[0, 12, 12, 0]} barSize={32}>
                    {sourcesData?.data?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {sourcesData?.data?.slice(0, 4).map((source: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate mr-2">{source.source}</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">{source.percentage}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Countries Breakdown */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">Top Countries</h3>
            <p className="text-sm text-gray-500">Visitor locations ranked by visit count</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <Globe className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingCountries ? [1,2,3,4,5,6].map(i => (
            <div key={i} className="h-20 bg-gray-50 dark:bg-gray-900/50 animate-pulse rounded-2xl"></div>
          )) : countriesData?.data?.map((item: any, i: number) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-400">0{i + 1}</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.country}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">{item.sessions}</span>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">Visits</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span>Relative Volume</span>
                  <span>{((item.sessions / (countriesData?.data?.[0]?.sessions || 1)) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.sessions / (countriesData?.data?.[0]?.sessions || 1)) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Users</span>
                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.users}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Link Generator Tool */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">Tracking Link Generator</h3>
            <p className="text-sm text-gray-500">Create special links for your social media posts to track them accurately</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <Link className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Page URL</label>
            <input 
              type="text" 
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://ethiohope.com"
              className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {['Telegram', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn'].map((p) => (
              <button
                key={p}
                onClick={() => handleCopy(p)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                  copiedPlatform === p 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                }`}
              >
                {copiedPlatform === p ? <Check size={20} className="animate-bounce" /> : <Copy size={20} className="text-gray-400 group-hover:text-blue-500" />}
                <span className="text-xs font-black uppercase tracking-widest">{p}</span>
                <span className="text-[9px] font-medium opacity-60">
                  {copiedPlatform === p ? 'Link Copied!' : 'Copy Tracking Link'}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
           <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed flex gap-3">
              <Info size={24} className="shrink-0" />
              <span>
                <strong>Important:</strong> When you share your site on Telegram or Instagram, use the link generated above. 
                This adds <code>?utm_source={'{platform}'}</code> to your URL, which forces Google Analytics to recognize the 
                traffic correctly even if the app hides its identity.
              </span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, isLoading, info, metricKey, hovered, setHovered }: any) => (
  <motion.div 
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    onMouseEnter={() => setHovered(metricKey)}
    onMouseLeave={() => setHovered(null)}
    className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 group transition-all relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4">
      <div className="relative">
        <Info size={16} className="text-gray-300 dark:text-gray-600 cursor-help group-hover:text-blue-400 transition-colors" />
        <AnimatePresence>
          {hovered === metricKey && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full right-0 mb-4 w-72 p-5 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-xs leading-relaxed z-50 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  {icon}
                </div>
                <p className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{title}</p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{info}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><ExternalLink size={10} /> Google Analytics 4 Metric</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {isLoading ? (
      <div className="animate-pulse space-y-6">
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-2xl"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-50 dark:bg-gray-900 w-1/3 rounded-full"></div>
          <div className="h-8 bg-gray-100 dark:bg-gray-900 w-2/3 rounded-xl"></div>
        </div>
      </div>
    ) : (
      <>
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 w-fit group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all duration-500 shadow-inner">
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="mt-8">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h4>
          <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {value}
          </p>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gray-50 dark:bg-gray-900/30 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
      </>
    )}
  </motion.div>
);

export default Tracks;
