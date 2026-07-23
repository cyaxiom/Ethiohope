import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  CreditCard,
  CheckCircle,
  User,
  BookOpen,
  Calendar,
  ShieldCheck,
  Mail,
  Phone,
  Activity,
  Users,
  Baby,
  DollarSign,
  Clock,
  Ban,
  Wallet,
} from 'lucide-react';
import { useGetAllPaymentsQuery, useUpdatePaymentStatusMutation } from '../../features/payments/paymentApi';
import { useGetProgramsQuery } from '../../features/programs/programApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';

const AdminPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [enrolleeFilter, setEnrolleeFilter] = useState('');

  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'payment.read');
  const canUpdate = hasPermission(permissions, 'payment.update');

  const { data: programsData } = useGetProgramsQuery({ limit: 100 }, { skip: !canRead });
  const programs = programsData?.data || [];

  const { data: paymentsData, isLoading, isFetching } = useGetAllPaymentsQuery(
    {
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      programId: programFilter || undefined,
      enrolleeType: enrolleeFilter || undefined,
    },
    { skip: !canRead }
  );

  const [updateStatus, { isLoading: isUpdating }] = useUpdatePaymentStatusMutation();

  const applications = paymentsData?.data || [];
  const summary = paymentsData?.summary;

  const handleStatusUpdate = async (enrollmentId: string, newStatus: string) => {
    try {
      await updateStatus({ enrollmentId, status: newStatus }).unwrap();
      sonnerToast.success(
        newStatus === 'ACTIVE' ? 'Marked as paid and activated' : `Application ${newStatus.toLowerCase()}`
      );
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to update application');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setProgramFilter('');
    setEnrolleeFilter('');
  };

  const hasFilters = searchTerm || statusFilter || programFilter || enrolleeFilter;

  const getApplicant = (app: any) => {
    const isSelf = app.enrolleeType === 'SELF' || (!app.child && app.user);
    if (isSelf) {
      return {
        type: 'SELF' as const,
        name: [app.user?.firstname, app.user?.lastname].filter(Boolean).join(' ') || 'Self enrollee',
        email: app.user?.email || app.parent?.email,
        phone: app.user?.phone || app.parent?.phone,
      };
    }
    return {
      type: 'CHILD' as const,
      name: [app.child?.firstname, app.child?.lastname].filter(Boolean).join(' ') || app.child?.username || 'Child',
      email: app.parent?.email,
      phone: app.parent?.phone,
      parentName: [app.parent?.firstname, app.parent?.lastname].filter(Boolean).join(' '),
    };
  };

  const enrollmentBadge = (status: string) => {
    if (status === 'ACTIVE') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'PENDING') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status === 'CANCELLED') return 'bg-red-50 text-red-700 border-red-200';
    if (status === 'COMPLETED') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const paymentBadge = (paymentStatus: string) => {
    if (paymentStatus === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-orange-50 text-orange-700 border-orange-200';
  };

  const stats = useMemo(
    () => [
      { label: 'Total applications', value: summary?.total ?? 0, icon: Users, tone: 'text-slate-700 bg-slate-100' },
      { label: 'Pending', value: summary?.pending ?? 0, icon: Clock, tone: 'text-amber-700 bg-amber-100' },
      { label: 'Zelle review', value: summary?.zellePending ?? 0, icon: Wallet, tone: 'text-violet-700 bg-violet-100' },
      { label: 'Paid', value: summary?.paid ?? 0, icon: CheckCircle, tone: 'text-emerald-700 bg-emerald-100' },
      { label: 'Revenue', value: `$${(summary?.revenue ?? 0).toLocaleString()}`, icon: DollarSign, tone: 'text-indigo-700 bg-indigo-100' },
    ],
    [summary]
  );

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldCheck className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view applications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Applications & Payments</h1>
        <p className="text-gray-500 text-sm mt-1">
          See who applied to which program, payment status, and activate or cancel applications.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${stat.tone}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicant, parent, email, program, batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="w-full lg:w-44 relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ZELLE">Zelle awaiting review</option>
              <option value="ACTIVE">Active</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="w-full lg:w-52">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All programs</option>
              {programs.map((p: any) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-40">
            <select
              value={enrolleeFilter}
              onChange={(e) => setEnrolleeFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All applicants</option>
              <option value="SELF">Adult (self)</option>
              <option value="CHILD">Child</option>
            </select>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>
        {(summary?.self != null || summary?.child != null) && (
          <p className="text-xs text-gray-500">
            Showing {summary?.self ?? 0} self · {summary?.child ?? 0} child applications
            {summary?.cancelled ? ` · ${summary.cancelled} cancelled` : ''}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {isLoading || isFetching ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
            <p className="text-gray-500 font-medium">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No applications match your filters.</p>
          </div>
        ) : (
          applications.map((app: any) => {
            const applicant = getApplicant(app);
            const amount = app.amount ?? app.phase?.price ?? 0;

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                          applicant.type === 'SELF' ? 'bg-indigo-50 text-indigo-600' : 'bg-sky-50 text-sky-600'
                        }`}
                      >
                        {applicant.type === 'SELF' ? <User className="w-5 h-5" /> : <Baby className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 truncate">{applicant.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {applicant.type === 'SELF' ? 'Adult' : 'Child'}
                          </span>
                        </div>
                        {applicant.type === 'CHILD' && applicant.parentName && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            Parent: <span className="font-medium">{applicant.parentName}</span>
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                          {applicant.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> {applicant.email}
                            </span>
                          )}
                          {applicant.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" /> {applicant.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 xl:border-l xl:border-r border-gray-100 xl:px-5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {app.program?.title || 'Program'}
                        </span>
                        {app.program?.isForChildren && (
                          <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                            Kids
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        {app.phase?.title && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {app.phase.title}
                          </span>
                        )}
                        {app.batch?.batchName && <span>Batch: {app.batch.batchName}</span>}
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Applied {app.createdAt ? new Date(app.createdAt).toLocaleString() : '—'}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end gap-3 xl:min-w-[160px]">
                      <div className="text-left xl:text-right">
                        <p className="text-xl font-bold text-gray-900">${amount}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2 xl:justify-end">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${enrollmentBadge(app.status)}`}>
                            {app.status}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${paymentBadge(app.paymentStatus)}`}
                          >
                            {app.paymentStatus || 'UNPAID'}
                          </span>
                          {app.paymentMethod === 'ZELLE' && app.zelleSubmittedAt && app.paymentStatus !== 'PAID' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-violet-50 text-violet-700 border-violet-200">
                              Zelle submitted
                            </span>
                          )}
                        </div>
                        {app.paymentMethod === 'ZELLE' && app.zelleSubmittedAt && app.paymentStatus !== 'PAID' && (
                          <p className="text-[11px] text-violet-600 mt-1">
                            Reported {new Date(app.zelleSubmittedAt).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {canUpdate && app.status === 'PENDING' && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(app._id, 'ACTIVE')}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Mark paid
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(app._id, 'CANCELLED')}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      )}
                      {canUpdate && app.status === 'ACTIVE' && app.paymentStatus !== 'PAID' && (
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(app._id, 'ACTIVE')}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
