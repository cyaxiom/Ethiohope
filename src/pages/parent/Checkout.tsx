import React, { useEffect, useState } from 'react';
import { useGetMyPendingEnrollmentsQuery } from '../../features/enrollments/enrollmentApi';
import { useCreateCheckoutSessionMutation } from '../../features/payments/paymentApi';
import { CreditCard, AlertCircle, Loader2, CheckCircle, ShieldCheck, Phone, MessageCircle, Wallet } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const initialIds = location.state?.enrollmentIds || [];
  const { data: enrollmentsData, isLoading, error } = useGetMyPendingEnrollmentsQuery();
  const [createCheckoutSession, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'zelle'>('stripe');
  const [showZelleConfirmation, setShowZelleConfirmation] = useState(false);

  const enrollments = enrollmentsData?.data || [];

  // Initialize selection
  useEffect(() => {
    if (enrollments.length > 0) {
      if (initialIds.length > 0) {
        setSelectedIds(initialIds);
      } else if (selectedIds.length === 0) {
        // Only auto-select if we came from a specific enrollment flow
        // Otherwise, let the user select manually to avoid accidental payments
        setSelectedIds([]);
      }
    }
  }, [enrollments, initialIds]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedEnrollments = enrollments.filter((e: any) => selectedIds.includes(e._id));
  const totalPrice = selectedEnrollments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Checkout Details</h1>
          <p className="text-lg text-gray-600">Review your enrollments and proceed to secure payment.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Enrollment Summary
            </h2>

            {enrollments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium text-lg">No pending enrollments found.</p>
                <p className="text-gray-500 mt-1">Please register your child first.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment: any) => {
                  const isSelected = selectedIds.includes(enrollment._id);
                  return (
                    <div 
                      key={enrollment._id} 
                      onClick={() => toggleSelection(enrollment._id)}
                      className={`flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                        }`}>
                          {isSelected && <span className="text-white text-sm font-bold">✓</span>}
                        </div>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-lg text-gray-900">
                          {enrollment.child?.firstname || enrollment.child?.firstName || 'Student'} {enrollment.child?.lastname || enrollment.child?.lastName || ''}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm mt-1">{enrollment.program?.title}</p>
                        <p className="text-gray-500 text-sm mt-1 flex items-center justify-center sm:justify-start">
                          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold mr-2">Phase</span>
                          {enrollment.phase?.title}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <span className={`text-2xl font-black ${isSelected ? 'text-blue-700' : 'text-gray-400'}`}>
                          ${enrollment.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-blue-600 uppercase">
                      <span>Selected Items: {selectedIds.length}</span>
                      <span>Subtotal: ${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 uppercase">
                      <span>Tax (15%)</span>
                      <span>${(totalPrice * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-3 border-t border-blue-100 flex justify-between items-center">
                      <p className="text-xl font-black text-gray-800">Total Amount</p>
                      <span className="text-3xl font-black text-blue-700">${(totalPrice * 1.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            {enrollments.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Choose Payment Method</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div 
                    onClick={() => { setPaymentMethod('stripe'); setShowZelleConfirmation(false); }}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'stripe' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Credit/Debit Card</p>
                      <p className="text-xs text-gray-500 font-medium">Secure payment via Stripe</p>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                  </div>

                  <div 
                    onClick={() => { setPaymentMethod('zelle'); setShowZelleConfirmation(false); }}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'zelle' ? 'border-purple-600 bg-purple-50/50' : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      paymentMethod === 'zelle' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Zelle Transfer</p>
                      <p className="text-xs text-gray-500 font-medium">Pay directly via Zelle</p>
                    </div>
                    {paymentMethod === 'zelle' && (
                      <div className="ml-auto w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                  </div>
                </div>

                {paymentMethod === 'stripe' ? (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleCheckout}
                      disabled={isCreatingSession || selectedIds.length === 0}
                      className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-blue-100 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                      {isCreatingSession ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-6 h-6 mr-3" />
                          Pay with Stripe
                        </>
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                      <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                      Payments are securely processed by Stripe
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50 rounded-2xl border border-purple-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      Zelle Payment Instructions
                    </h4>
                    
                    {!showZelleConfirmation ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                              <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-0.5">Zelle Account</p>
                              <p className="text-base font-bold text-gray-900">ethiohope50@gmail.com</p>
                              <p className="text-xs text-gray-500">Recipient: Ethio Hope Academy</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <Phone className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Call Us</p>
                              <p className="text-base font-bold text-gray-900">+1 (945) 385-0556</p>
                              <p className="text-xs text-gray-500">Available Mon-Fri, 9AM-5PM</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-purple-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-0.5">WhatsApp Receipt</p>
                              <p className="text-base font-bold text-gray-900">+1 (945) 385-0556</p>
                              <p className="text-xs text-gray-500">Send us a screenshot of your transfer</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                          <p className="font-bold flex items-center mb-1">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Important Note
                          </p>
                          <p>Please include your child's full name in the Zelle memo field. Once you've sent the payment, send the receipt via WhatsApp so we can manually approve your enrollment.</p>
                        </div>

                        <button
                          onClick={() => setShowZelleConfirmation(true)}
                          className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg shadow-purple-100 text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-all active:scale-[0.98]"
                        >
                          <CheckCircle className="w-6 h-6 mr-3" />
                          I've Sent the Payment
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-50">
                          <CheckCircle className="w-10 h-10" />
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h5>
                        <p className="text-gray-600 mb-6">We've received your notice. Please make sure to send the screenshot to our WhatsApp <span className="font-bold text-purple-700">+1 (945) 385-0556</span> if you haven't already.</p>
                        <button
                          onClick={() => setShowZelleConfirmation(false)}
                          className="text-sm font-bold text-purple-600 hover:text-purple-700 underline"
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
