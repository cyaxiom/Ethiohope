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
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useGetParentPaymentsQuery } from '../../features/payments/paymentApi';
import Loading from '../../ui/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useCreateCheckoutSessionMutation } from '../../features/payments/paymentApi';
import { toast } from 'sonner';

export const ParentPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

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

  const [createCheckoutSession, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation();
  
  const paymentsData = response?.data?.payments || [];
  const totalSpent = response?.data?.totalSpent || 0;
  
  const groupedPayments = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    const individual: any[] = [];
    
    paymentsData.forEach((p: any) => {
      // Group by transactionId if it's PAID and has a transactionId
      if (p.paymentStatus === 'PAID' && p.transactionId) {
        if (!groups[p.transactionId]) groups[p.transactionId] = [];
        groups[p.transactionId].push(p);
      } else {
        individual.push(p);
      }
    });
    
    // Process groups into renderable format
    const processedGroups: any[] = [];
    Object.keys(groups).forEach(tid => {
      const items = groups[tid];
      if (items.length > 1) {
        processedGroups.push({
          _id: tid,
          isGroup: true,
          transactionId: tid,
          items: items,
          amount: items.reduce((acc, curr) => acc + (curr.amount || curr.phase?.price || 0), 0),
          createdAt: items[0].createdAt,
          paymentStatus: 'PAID',
          status: 'ACTIVE'
        });
      } else {
        individual.push(items[0]);
      }
    });
    
    return [...processedGroups, ...individual].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [paymentsData]);

  const handleDownloadInvoice = (payment: any) => {
    const invoiceId = `INV-${payment._id.slice(-8).toUpperCase()}`;
    const date = new Date(payment.createdAt).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    const total = payment.amount || payment.phase?.price || 0;
    const tax = total * 0.15;
    const subtotal = total - tax;
    
    const subtotalStr = subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const taxStr = tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const totalStr = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoiceId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
              body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 0; }
              .invoice-container { max-width: 800px; margin: 40px auto; padding: 40px; border: 1px solid #f3f4f6; }
            </style>
          </head>
          <body class="bg-gray-50">
            <div class="invoice-container bg-white shadow-2xl rounded-[2rem]">
              <!-- Header -->
              <div class="flex justify-between items-start mb-12">
                <div>
                  <div class="flex items-center gap-2 mb-4">
                    <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">E</div>
                    <span class="text-2xl font-black text-blue-900 tracking-tight">EthioHope Academy</span>
                  </div>
                  <p class="text-gray-500 text-sm font-medium">123 Tech Way, Suite 500</p>
                  <p class="text-gray-500 text-sm font-medium">Dallas, TX 75201, USA</p>
                  <p class="text-gray-500 text-sm font-medium">contact@ethiohope.com</p>
                </div>
                <div class="text-right">
                  <h1 class="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-2">Invoice</h1>
                  <p class="text-gray-400 text-xs font-black uppercase tracking-widest">Transaction ID</p>
                  <p class="text-lg font-bold text-blue-600">${invoiceId}</p>
                </div>
              </div>

              <!-- Billing Info -->
              <div class="grid grid-cols-2 gap-12 mb-12 border-y border-gray-100 py-10">
                <div>
                  <p class="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Billed To</p>
                  <h3 class="text-xl font-black text-gray-800">${user?.firstname} ${user?.lastname}</h3>
                  <p class="text-gray-500 font-medium">${user?.email}</p>
                  <p class="text-gray-500 font-medium mt-1">Parent Account</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Payment Details</p>
                  <p class="text-gray-500 font-medium">Date: <span class="text-gray-800 font-bold">${date}</span></p>
                  <p class="text-gray-500 font-medium mt-1">Status: <span class="text-green-600 font-black uppercase tracking-wider text-xs">Paid Successfully</span></p>
                  <p class="text-gray-500 font-medium mt-1">Method: <span class="text-gray-800 font-bold">Credit/Debit Card</span></p>
                </div>
              </div>

              <!-- Itemized Table -->
              <div class="mb-12">
                <table class="w-full">
                  <thead>
                    <tr class="text-left border-b-2 border-gray-100">
                      <th class="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                      <th class="pb-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                      <th class="pb-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    ${payment.isGroup 
                      ? payment.items.map((item: any) => `
                        <tr>
                          <td class="py-6">
                            <h4 class="text-base font-black text-gray-800">${item.program?.title}</h4>
                            <p class="text-xs text-gray-500 font-medium mt-1">${item.phase?.title || `Phase ${item.phase?.orderIndex}`}</p>
                          </td>
                          <td class="py-6 text-center">
                            <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-[10px]">
                              ${item.child?.firstname || item.child?.firstName || 'Student'} ${item.child?.lastname || item.child?.lastName || ''}
                            </span>
                          </td>
                          <td class="py-6 text-right">
                            <span class="text-lg font-black text-gray-800">$${(item.amount || item.phase?.price || 0).toLocaleString()}</span>
                          </td>
                        </tr>
                      `).join('')
                      : `
                        <tr>
                          <td class="py-8">
                            <h4 class="text-lg font-black text-gray-800">${payment.program?.title}</h4>
                            <p class="text-sm text-gray-500 font-medium mt-1">${payment.phase?.title || `Phase ${payment.phase?.orderIndex}`}</p>
                          </td>
                          <td class="py-8 text-center">
                            <span class="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs">
                              ${payment.child?.firstname || payment.child?.firstName || 'Student'} ${payment.child?.lastname || payment.child?.lastName || ''}
                            </span>
                          </td>
                          <td class="py-8 text-right">
                            <span class="text-xl font-black text-gray-800">$${subtotalStr}</span>
                          </td>
                        </tr>
                      `
                    }
                  </tbody>
                </table>
              </div>

              <!-- Summary Section -->
              <div class="flex justify-end">
                <div class="w-full max-w-xs space-y-4">
                  <div class="flex justify-between items-center text-gray-500 font-medium">
                    <span>Course Price</span>
                    <span class="text-gray-800 font-bold">$${subtotalStr}</span>
                  </div>
                  <div class="flex justify-between items-center text-gray-500 font-medium">
                    <span>VAT (15% Inclusive)</span>
                    <span class="text-gray-800 font-bold">$${taxStr}</span>
                  </div>
                  <div class="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                    <span class="text-lg font-black text-gray-800">Total Amount</span>
                    <span class="text-3xl font-black text-blue-600">$${totalStr}</span>
                  </div>
                </div>
              </div>

              <!-- Bank Style Verification Footer -->
              <div class="mt-20 pt-10 border-t border-gray-100 text-center">
                <div class="flex items-center justify-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Digitally Verified Transaction</span>
                </div>
                <p class="text-[10px] text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                  This is a computer-generated document and does not require a physical signature. 
                  For any billing inquiries, please contact our support team at support@ethiohope.com with your transaction ID.
                </p>
              </div>
            </div>
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

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
      console.error(err);
      toast.error(err?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoadingId(null);
    }
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
              ${totalSpent.toLocaleString()}
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
          {groupedPayments.map((payment: any) => {
            const status = getStatusStyles(payment.paymentStatus, payment.status);
            const isGroup = payment.isGroup;
            
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
                    {isGroup ? (
                      <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                        {payment.items[0]?.program?.image ? (
                          <img src={getImageUrl(payment.items[0].program.image)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ShieldCheck className="w-10 h-10 text-blue-600" />
                        )}
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                        {payment.program?.image ? (
                          <img src={getImageUrl(payment.program.image)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {isGroup ? (payment.items[0]?.program?.title || 'Course') : (payment.program?.title || 'Course')}
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {isGroup ? (payment.items[0]?.phase?.title || `Phase ${payment.items[0]?.phase?.orderIndex || 1}`) : (payment.phase?.title || `Phase ${payment.phase?.orderIndex || 1}`)}
                        </span>
                      </div>
                      
                      {isGroup ? (
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">
                          {payment.items.map((item: any, idx: number) => (
                            <React.Fragment key={item._id}>
                            {item.child?.firstname || item.child?.firstName}
                            {idx < payment.items.length - 1 ? ', ' : ''}
                          </React.Fragment>
                          ))}
                          <span className="text-sm font-bold text-gray-400 ml-2">({payment.items.length} Students)</span>
                        </h3>
                      ) : (
                        <h3 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                          {payment.child?.firstname || payment.child?.firstName || 'Student'} {payment.child?.lastname || payment.child?.lastName || ''}
                          <span className="text-sm font-bold text-gray-400">@{payment.child?.username}</span>
                        </h3>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-bold">{new Date(payment.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {isGroup ? `TX-${payment.transactionId.slice(-8).toUpperCase()}` : `INV-${payment._id.slice(-6).toUpperCase()}`}
                          </span>
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
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Amount</span>
                      <span className="text-2xl font-black text-gray-800 font-sans">${payment.amount.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-2">
                      {payment.paymentStatus === 'PAID' ? (
                        <button 
                          onClick={() => handleDownloadInvoice(payment)}
                          className="p-4 bg-gray-50 hover:bg-blue-600 text-gray-400 hover:text-white rounded-3xl transition-all duration-300 group/btn shadow-sm hover:shadow-lg hover:shadow-blue-200"
                        >
                          <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      ) : payment.status === 'PENDING' ? (
                        <button 
                          onClick={() => handlePayNow(payment._id)}
                          disabled={loadingId === payment._id}
                          className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                          {loadingId === payment._id ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Pay Now
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          )}
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
