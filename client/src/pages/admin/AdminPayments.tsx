import React, { useState } from 'react';
import { 
  Search, Filter, CreditCard, Clock, CheckCircle, 
  XCircle, AlertCircle, User, BookOpen, Calendar, 
  ChevronRight, ArrowRight, ShieldCheck, Mail, Phone, Activity
} from 'lucide-react';
import { useGetAllPaymentsQuery, useUpdatePaymentStatusMutation } from '../../features/payments/paymentApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';

const AdminPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'payment.read');
  const canUpdate = hasPermission(permissions, 'payment.update');

  const { data: paymentsData, isLoading, isFetching } = useGetAllPaymentsQuery(
    { search: searchTerm, status: statusFilter },
    { skip: !canRead }
  );

  const [updateStatus, { isLoading: isUpdating }] = useUpdatePaymentStatusMutation();

  const payments = paymentsData?.data || [];

  const handleStatusUpdate = async (enrollmentId: string, newStatus: string) => {
    try {
      await updateStatus({ enrollmentId, status: newStatus }).unwrap();
      sonnerToast.success(`Payment status updated to ${newStatus}`);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to update payment status');
    }
  };

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view payments.</p>
      </div>
    );
  }

  const getStatusStyle = (status: string, paymentStatus: string) => {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (status === 'CANCELLED') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all student enrollments and payment statuses.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by student, parent, email or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active (Paid)</option>
              <option value="PENDING">Pending (Unpaid)</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-4">
        {isLoading || isFetching ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
            <p className="text-gray-500 font-medium">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No payments found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {payments.map((payment: any) => (
              <div key={payment._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Student & Parent Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {payment.child?.firstname} {payment.child?.lastname}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="text-sm text-gray-600 flex items-center gap-1.5">
                            <span className="font-medium text-gray-400">Parent:</span> {payment.parent?.firstname} {payment.parent?.lastname}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> {payment.parent?.email}
                          </p>
                          {payment.parent?.phone && (
                            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" /> {payment.parent?.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Program Info */}
                    <div className="flex-1 border-l border-r border-gray-50 px-6">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-bold text-gray-800">{payment.program?.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">{payment.phase?.title}</span>
                      </div>
                    </div>

                    {/* Amount & Status */}
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900">${payment.amount}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(payment.status, payment.paymentStatus)}`}>
                          {payment.status}
                        </span>
                        
                        {canUpdate && payment.status === 'PENDING' && (
                          <button 
                            onClick={() => handleStatusUpdate(payment._id, 'ACTIVE')}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 text-[10px] font-black text-green-600 hover:text-green-700 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg border border-green-100 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
