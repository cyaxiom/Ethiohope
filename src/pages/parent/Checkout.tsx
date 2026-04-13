import React, { useEffect, useState } from 'react';
import { useGetMyPendingEnrollmentsQuery } from '../../features/enrollments/enrollmentApi';
import { useCreateCheckoutSessionMutation } from '../../features/payments/paymentApi';
import { CreditCard, AlertCircle, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { data: enrollmentsData, isLoading, error } = useGetMyPendingEnrollmentsQuery();
  const [createCheckoutSession, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const enrollments = enrollmentsData?.data || [];
  const totalPrice = enrollments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
  
  const handleCheckout = async () => {
    if (enrollments.length === 0) {
      setErrorMsg('No pending enrollments to checkout');
      return;
    }
    
    try {
      setErrorMsg('');
      const enrollmentIds = enrollments.map((e: any) => e._id);
      const res = await createCheckoutSession({ enrollmentIds }).unwrap();
      
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
                {enrollments.map((enrollment: any) => (
                  <div key={enrollment._id} className="flex flex-col sm:flex-row justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="font-bold text-lg text-gray-900">
                        {enrollment.child?.firstName} {enrollment.child?.lastName}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm mt-1">{enrollment.program?.title}</p>
                      <p className="text-gray-500 text-sm mt-1 flex items-center">
                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold mr-2">Phase</span>
                        {enrollment.phase?.title}
                      </p>
                    </div>
                    <div className="flex items-center sm:items-start sm:justify-end">
                      <span className="text-2xl font-black text-gray-900">${enrollment.amount}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <span className="text-xl font-bold text-gray-800">Total Amount</span>
                    <span className="text-3xl font-black text-blue-700">${totalPrice}</span>
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
              <div className="mt-8 flex flex-col items-center">
                <button
                  onClick={handleCheckout}
                  disabled={isCreatingSession}
                  className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 mr-3" />
                      Proceed to Secure Payment
                    </>
                  )}
                </button>
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                  Payments are securely processed by Stripe
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
