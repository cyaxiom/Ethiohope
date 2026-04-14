import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Calendar, 
  User, 
  BookOpen,
  ArrowUpRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { useGetParentPaymentsQuery } from '../../features/payments/paymentApi';
import Loading from '../../ui/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../lib/utils';

export const ParentPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: response, isLoading, error, refetch } = useGetParentPaymentsQuery({
    search: debouncedSearch,
    status: statusFilter
  });

  const paymentsData = response?.data || [];

  const getStatusStyles = (paymentStatus: string, enrollmentStatus: string) => {
    if (paymentStatus === 'PAID') {
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-100',
        icon: CheckCircle2,
        label: 'Paid'
      };
    }
    if (enrollmentStatus === 'CANCELLED') {
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-100',
        icon: XCircle,
        label: 'Cancelled'
      };
    }
    return {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-100',
      icon: Clock,
      label: 'Pending'
    };
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  if (isLoading && !debouncedSearch && !statusFilter) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tight mb-3 font-sans">Payment History 💳</h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl leading-relaxed">
            Manage your subscriptions, view transaction history, and download invoices for your children's courses.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</span>
            <span className="text-xl font-black text-blue-600">
              ${paymentsData.reduce((acc, curr) => acc + (curr.paymentStatus === 'PAID' ? (curr.amount || curr.phase?.price || 0) : 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50/50 mb-10 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by student, program or phase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Status:</span>
          </div>
          
          {[
            { id: '', label: 'All' },
            { id: 'PAID', label: 'Paid' },
            { id: 'UNPAID', label: 'Pending' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setStatusFilter(cat.id)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                statusFilter === cat.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="p-12 text-center bg-red-50 rounded-[2.5rem] border border-red-100 shadow-lg shadow-red-900/5">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-red-900 mb-3 tracking-tight">Failed to load payments</h3>
          <button 
            onClick={() => refetch()}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      ) : paymentsData.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-[3rem] border border-blue-50 shadow-xl shadow-blue-900/5 flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[2rem] flex items-center justify-center mb-8 rotate-3">
             <CreditCard className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">
            {searchTerm || statusFilter ? "No matching transactions" : "No payment history found"}
          </h3>
          {(searchTerm || statusFilter) && (
            <button 
              onClick={handleClearFilters}
              className="px-8 py-4 bg-gray-800 text-white rounded-[1.5rem] font-bold shadow-xl transition-all active:scale-95"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {paymentsData.map((payment: any) => {
            const status = getStatusStyles(payment.paymentStatus, payment.status);
            return (
              <motion.div 
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                  
                  {/* Student & Course Info */}
                  <div className="flex items-center gap-6 flex-1 w-full">
                    <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                      {payment.program?.image ? (
                        <img src={getImageUrl(payment.program.image)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {payment.program?.title || 'Course'}
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {payment.phase?.title || `Phase ${payment.phase?.orderIndex || 1}`}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                        {payment.child?.firstname} {payment.child?.lastname}
                        <span className="text-sm font-bold text-gray-400">@{payment.child?.username}</span>
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-bold">{new Date(payment.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">INV-{payment._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-6 lg:pt-0 border-gray-50">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</span>
                      <div className={`px-4 py-2 rounded-2xl border ${status.bg} ${status.text} ${status.border} flex items-center gap-2 shadow-sm`}>
                        <status.icon className="w-4 h-4" />
                        <span className="text-sm font-black uppercase tracking-wider">{status.label}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Amount</span>
                      <span className="text-2xl font-black text-gray-800 font-sans">${(payment.amount || payment.phase?.price || 0).toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2">
                      {payment.paymentStatus === 'PAID' ? (
                        <button className="p-4 bg-gray-50 hover:bg-blue-600 text-gray-400 hover:text-white rounded-3xl transition-all duration-300 group/btn shadow-sm hover:shadow-lg hover:shadow-blue-200">
                          <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      ) : payment.status === 'PENDING' ? (
                        <button className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
                          Pay Now
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParentPayments;
