import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  Download,
  AlertCircle,
} from 'lucide-react';
import {
  useGetParentPaymentsQuery,
  useCreateCheckoutSessionMutation,
} from '../../features/payments/paymentApi';
import Loading from '../../ui/Loading';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../lib/utils';
import { toast } from 'sonner';

const getStatusStyles = (paymentStatus: string, status: string) => {
  if (status === 'CANCELLED') {
    return {
      label: 'Cancelled',
      className: 'bg-red-50 text-red-600 border-red-100',
      Icon: XCircle,
    };
  }
  if (paymentStatus === 'PAID') {
    return {
      label: 'Paid',
      className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      Icon: CheckCircle2,
    };
  }
  return {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-600 border-amber-100',
    Icon: Clock,
  };
};

/** Payment history for adult self-learners (student portal). */
const StudentPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: response, isLoading, error } = useGetParentPaymentsQuery({
    search: debouncedSearch,
    status: statusFilter,
  });
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const paymentsData = useMemo(() => {
    const all = response?.data?.payments || [];
    // Self-learner dashboard: only show enrollments for yourself
    return all.filter(
      (p: any) =>
        p.enrolleeType === 'SELF' ||
        (!!p.user && !p.child) ||
        (p.user && String(p.user?._id || p.user) === String(p.parent?._id || p.parent))
    );
  }, [response]);

  const totalSpent = useMemo(
    () =>
      paymentsData
        .filter((p: any) => p.paymentStatus === 'PAID')
        .reduce((sum: number, p: any) => sum + (p.amount || p.phase?.price || 0), 0),
    [paymentsData]
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const handlePayNow = async (enrollmentId: string) => {
    try {
      setLoadingId(enrollmentId);
      const res = await createCheckoutSession({ enrollmentIds: [enrollmentId] }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error('Failed to generate payment link');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDownloadInvoice = (payment: any) => {
    const invoiceId = `INV-${String(payment._id).slice(-8).toUpperCase()}`;
    const date = new Date(payment.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const total = payment.amount || payment.phase?.price || 0;
    const tax = total * 0.15;
    const subtotal = total - tax;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Invoice - ${invoiceId}</title>
        <script src="https://cdn.tailwindcss.com"><\/script></head>
        <body class="bg-white p-10 font-sans">
          <h1 class="text-2xl font-black mb-2">Ethiohope Invoice</h1>
          <p class="text-sm text-gray-500 mb-6">${invoiceId} · ${date}</p>
          <p class="font-bold">${payment.program?.title || 'Program'}</p>
          <p class="text-gray-600 mb-4">${payment.phase?.title || 'Phase'}</p>
          <div class="border-t pt-4 space-y-1 text-sm">
            <div class="flex justify-between"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>VAT (15%)</span><span>$${tax.toFixed(2)}</span></div>
            <div class="flex justify-between font-black text-lg pt-2"><span>Total</span><span>$${total.toFixed(2)}</span></div>
          </div>
          <script>window.print()<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading && !debouncedSearch && !statusFilter) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="font-bold text-gray-800">Could not load payment history</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight mb-3">Payment History</h1>
          <p className="text-gray-500 font-medium text-base sm:text-lg max-w-xl leading-relaxed">
            View your enrollments, complete pending payments, and download invoices.
          </p>
        </div>
        <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</span>
          <span className="text-xl font-black text-blue-600">${totalSpent.toLocaleString()}</span>
        </div>
      </header>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50/50 mb-10 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by program or phase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium"
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
              type="button"
              onClick={() => setStatusFilter(cat.id)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                statusFilter === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {paymentsData.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-[3rem] border border-blue-50 shadow-xl flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[2rem] flex items-center justify-center mb-8">
            <CreditCard className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">
            {searchTerm || statusFilter ? 'No matching transactions' : 'No payment history yet'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            When you enroll in a program, your payments will show up here.
          </p>
          {(searchTerm || statusFilter) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-8 py-4 bg-gray-800 text-white rounded-[1.5rem] font-bold"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {paymentsData.map((payment: any) => {
            const status = getStatusStyles(payment.paymentStatus, payment.status);
            const StatusIcon = status.Icon;
            const amount = payment.amount || payment.phase?.price || 0;
            const isPending = payment.status === 'PENDING' && payment.paymentStatus !== 'PAID';

            return (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col lg:flex-row items-center gap-8"
              >
                <div className="flex items-center gap-6 flex-1 w-full">
                  <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                    {payment.program?.image ? (
                      <img
                        src={getImageUrl(payment.program.image)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {payment.program?.title || 'Program'}
                      </span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {payment.phase?.title || 'Phase'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight truncate">
                      {payment.program?.title || 'Enrollment'}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                      {new Date(payment.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                  <span
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${status.className}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                  <span className="text-2xl font-black text-gray-900 text-center sm:text-left">${amount}</span>
                  {isPending ? (
                    <button
                      type="button"
                      onClick={() => handlePayNow(payment._id)}
                      disabled={loadingId === payment._id}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 disabled:opacity-60 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <CreditCard className="w-4 h-4" />
                      {loadingId === payment._id ? 'Redirecting…' : 'Pay Now'}
                    </button>
                  ) : payment.paymentStatus === 'PAID' ? (
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(payment)}
                      className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-bold border border-gray-100 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" />
                      Invoice
                    </button>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentPayments;
