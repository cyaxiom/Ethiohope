import React, { useEffect, useState } from 'react';
import { useGetMyPendingEnrollmentsQuery } from '../../features/enrollments/enrollmentApi';
import {
  useCreateCheckoutSessionMutation,
  useReportZellePaymentMutation,
} from '../../features/payments/paymentApi';
import { CreditCard, AlertCircle, Loader2, CheckCircle, ShieldCheck, Phone, MessageCircle, Wallet, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialIds = React.useMemo(() => location.state?.enrollmentIds || [], [location.state?.enrollmentIds]);
  const { data: enrollmentsData, isLoading, error } = useGetMyPendingEnrollmentsQuery();
  const [createCheckoutSession, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation();
  const [reportZellePayment, { isLoading: isReportingZelle }] = useReportZellePaymentMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'zelle'>('stripe');
  const [showZelleConfirmation, setShowZelleConfirmation] = useState(false);

  const enrollments = enrollmentsData?.data || [];

  useEffect(() => {
    if (enrollments.length > 0 && selectedIds.length === 0) {
      if (initialIds.length > 0) {
        setSelectedIds(initialIds);
      }
    }
  }, [enrollments, initialIds, selectedIds.length]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectedEnrollments = enrollments.filter((e: any) => selectedIds.includes(e._id));
  const totalPrice = selectedEnrollments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

  const formatMoney = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      setErrorMsg('Please select at least one enrollment to pay');
      return;
    }

    try {
      setErrorMsg('');
      const res = await createCheckoutSession({ enrollmentIds: selectedIds }).unwrap();

      if (res.url) {
        window.location.href = res.url;
      } else {
        setErrorMsg('Failed to process payment link');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.data?.message || 'Failed to initiate checkout. Please try again.');
    }
  };

  const handleZelleSubmitted = async () => {
    if (selectedIds.length === 0) {
      setErrorMsg('Please select at least one enrollment to pay');
      return;
    }

    try {
      setErrorMsg('');
      const res = await reportZellePayment({ enrollmentIds: selectedIds }).unwrap();
      setShowZelleConfirmation(true);
      toast.success(res.message || 'Admins have been notified about your Zelle transfer.');
    } catch (err: any) {
      console.error(err);
      const message = err?.data?.message || 'Failed to notify admins. Please try again or contact support.';
      setErrorMsg(message);
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#070b16]">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => {
            navigate('/');
            window.scrollTo(0, 0);
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Checkout</h1>
          <p className="text-slate-400 text-sm mt-1.5">Review enrollments and complete payment.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0b1224] overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Enrollment summary
            </h2>

            {enrollments.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
                <AlertCircle className="w-9 h-9 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No pending enrollments found.</p>
                <p className="text-slate-500 text-sm mt-1">Enroll in a program first to continue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment: any) => {
                  const isSelected = selectedIds.includes(enrollment._id);
                  const name =
                    enrollment.enrolleeType === 'SELF' || enrollment.user
                      ? `${enrollment.user?.firstname || ''} ${enrollment.user?.lastname || ''}`.trim() || 'You'
                      : `${enrollment.child?.firstname || enrollment.child?.firstName || 'Student'} ${enrollment.child?.lastname || enrollment.child?.lastName || ''}`.trim();

                  return (
                    <button
                      key={enrollment._id}
                      type="button"
                      onClick={() => toggleSelection(enrollment._id)}
                      className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-blue-500/50 bg-blue-500/10'
                          : 'border-white/10 bg-[#070b16] hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-white/20 bg-transparent'
                        }`}
                      >
                        {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white text-[15px] truncate">{name}</h3>
                        <p className="text-blue-300 text-sm mt-0.5 truncate">{enrollment.program?.title}</p>
                        <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-2 flex-wrap">
                          <span className="bg-white/5 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide">
                            Phase
                          </span>
                          <span className="truncate">{enrollment.phase?.title}</span>
                        </p>
                      </div>

                      <span className={`text-lg font-semibold flex-shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                        ${enrollment.amount}
                      </span>
                    </button>
                  );
                })}

                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-blue-300">
                      <span>Course price</span>
                      <span>${formatMoney(totalPrice * 0.85)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-slate-500">
                      <span>VAT (15% inclusive)</span>
                      <span>${formatMoney(totalPrice * 0.15)}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center gap-3">
                      <p className="text-sm font-medium text-slate-300">Total amount</p>
                      <span className="text-2xl font-semibold text-white">${formatMoney(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-5 p-3.5 rounded-xl border border-red-500/30 bg-red-950/40 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{errorMsg}</p>
              </div>
            )}

            {error && !errorMsg && (
              <div className="mt-5 p-3.5 rounded-xl border border-red-500/30 bg-red-950/40 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">Could not load enrollments. Please refresh and try again.</p>
              </div>
            )}

            {enrollments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h3 className="text-base font-semibold text-white mb-4">Choose payment method</h3>

                <div className="grid grid-cols-1 gap-2.5 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('stripe');
                      setShowZelleConfirmation(false);
                    }}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/10 bg-[#070b16] hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'stripe' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-[15px]">Credit / debit card</p>
                      <p className="text-xs text-slate-500 mt-0.5">Secure payment via Stripe</p>
                    </div>
                    {paymentMethod === 'stripe' && <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('zelle');
                      setShowZelleConfirmation(false);
                    }}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'zelle'
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/10 bg-[#070b16] hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'zelle' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-[15px]">Zelle transfer</p>
                      <p className="text-xs text-slate-500 mt-0.5">Pay directly via Zelle</p>
                    </div>
                    {paymentMethod === 'zelle' && <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                  </button>
                </div>

                {paymentMethod === 'stripe' ? (
                  <div>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isCreatingSession || selectedIds.length === 0}
                      className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCreatingSession ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2.5 animate-spin" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2.5" />
                          Pay with Stripe
                        </>
                      )}
                    </button>
                    {selectedIds.length === 0 && (
                      <p className="text-center text-xs text-slate-500 mt-2">Select at least one enrollment to continue.</p>
                    )}
                    <div className="mt-3.5 flex items-center justify-center text-xs text-slate-500 gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Payments are securely processed by Stripe
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-blue-400" />
                      Zelle payment instructions
                    </h4>

                    {!showZelleConfirmation ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/10 bg-[#070b16]">
                          <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-300 flex items-center justify-center flex-shrink-0">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-0.5">
                              Zelle account
                            </p>
                            <p className="text-sm font-medium text-white break-all">ethiohope50@gmail.com</p>
                            <p className="text-xs text-slate-500 mt-0.5">Recipient: Ethio Hope Academy</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/10 bg-[#070b16]">
                          <div className="w-10 h-10 rounded-full bg-white/5 text-slate-300 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.14em] mb-0.5">
                              Call us
                            </p>
                            <p className="text-sm font-medium text-white">+1 (945) 385-0556</p>
                            <p className="text-xs text-slate-500 mt-0.5">Mon–Fri, 9AM–5PM</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/10 bg-[#070b16]">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-emerald-400/90 uppercase tracking-[0.14em] mb-0.5">
                              WhatsApp receipt
                            </p>
                            <p className="text-sm font-medium text-white">+1 (945) 385-0556</p>
                            <p className="text-xs text-slate-500 mt-0.5">Send a screenshot of your transfer</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-950/30 text-sm text-amber-100/90">
                          <p className="font-medium flex items-center gap-2 mb-1 text-amber-200">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            Important
                          </p>
                          <p className="text-xs leading-relaxed text-amber-100/70">
                            Include the student&apos;s full name in the Zelle memo. After sending, share the receipt on
                            WhatsApp so we can approve the enrollment.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleZelleSubmitted}
                          disabled={isReportingZelle || selectedIds.length === 0}
                          className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                        >
                          {isReportingZelle ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2.5 animate-spin" />
                              Notifying admins…
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2.5" />
                              I&apos;ve sent the payment
                            </>
                          )}
                        </button>
                        {selectedIds.length === 0 && (
                          <p className="text-center text-xs text-slate-500 mt-2">
                            Select at least one enrollment above first.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/20">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <h5 className="text-lg font-semibold text-white mb-2">Thank you</h5>
                        <p className="text-slate-400 text-sm mb-5 leading-relaxed max-w-sm mx-auto">
                          Admins have been notified. Your enrollment stays pending until they verify the Zelle
                          receipt. Please also send the screenshot to WhatsApp{' '}
                          <span className="text-blue-300 font-medium">+1 (945) 385-0556</span> if you haven&apos;t
                          already.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowZelleConfirmation(false)}
                          className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors"
                        >
                          View instructions again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
