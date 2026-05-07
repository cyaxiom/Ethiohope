
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer2, 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Filter,
  Calendar,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
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
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { getAnalyticsSummary, getAnalyticsTimeline, getTopPages, getTrafficSources } from '../../api/analytics';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Tracks = () => {
  const [filter, setFilter] = useState('week');
  const [platform, setPlatform] = useState('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [filter, platform]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, timelineRes, pagesRes, sourcesRes] = await Promise.all([
        getAnalyticsSummary(filter, platform),
        getAnalyticsTimeline(filter),
        getTopPages(),
        getTrafficSources(filter)
      ]);
      setData(summaryRes);
      setTimeline(timelineRes);
      setTopPages(pagesRes);
      setSources(sourcesRes);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const FilterButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-primary text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Website performance overview and traffic analysis</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {['today', 'week', 'month', 'year'].map((f) => (
              <FilterButton 
                key={f} 
                active={filter === f} 
                onClick={() => setFilter(f)} 
                label={f.charAt(0).toUpperCase() + f.slice(1)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
          <Globe size={16} /> Platform:
        </span>
        {['all', 'TikTok', 'Telegram', 'Facebook', 'Instagram', 'LinkedIn'].map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              platform === p 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-500'
            }`}
          >
            {p === 'all' ? 'All Traffic' : p}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <SummaryCard 
          title="Total Visits" 
          value={data?.totalVisits.toLocaleString() || '0'} 
          icon={<Eye className="text-blue-500" />} 
          trend="+12.5%" 
          isUp={true}
        />
        <SummaryCard 
          title="Active Users" 
          value={data?.activeUsers.toLocaleString() || '0'} 
          icon={<Users className="text-green-500" />} 
          trend="+5.2%" 
          isUp={true}
        />
        <SummaryCard 
          title="Page Views" 
          value={data?.pageViews.toLocaleString() || '0'} 
          icon={<BarChart3 className="text-purple-500" />} 
          trend="-2.1%" 
          isUp={false}
        />
        <SummaryCard 
          title="Bounce Rate" 
          value={data?.bounceRate || '0%'} 
          icon={<MousePointer2 className="text-orange-500" />} 
          trend="-0.5%" 
          isUp={true} // Lower bounce rate is good
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Chart */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <LineChartIcon size={20} className="text-primary" />
              Traffic Over Time
            </h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-full"></div> Visits</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Users</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Traffic Sources Pie Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <PieChartIcon size={20} className="text-primary" />
            Traffic Sources
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.trafficSources.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {sources.slice(0, 4).map((source, i) => (
              <div key={source.source} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  {source.source}
                </span>
                <span className="font-semibold">{source.percentage}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Table/Bar Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-primary" />
            Most Visited Pages
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-3 font-semibold">Page URL</th>
                  <th className="pb-3 font-semibold">Views</th>
                  <th className="pb-3 font-semibold">Bounce Rate</th>
                  <th className="pb-3 font-semibold text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {topPages.map((page, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300">{page.page}</td>
                    <td className="py-4 text-sm font-semibold">{page.views.toLocaleString()}</td>
                    <td className="py-4 text-sm text-gray-500">{page.bounce}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-emerald-500">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold">Live</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Globe size={20} className="text-primary" />
            Platform Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="visits" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, trend, isUp }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group transition-all"
  >
    <div className="flex items-start justify-between">
      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
        isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
      }`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h4>
      <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
    </div>
  </motion.div>
);

export default Tracks;
