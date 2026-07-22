import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

import { useDispatch } from 'react-redux';
import { paymentApi, useConfirmPaymentSessionMutation } from '../../features/payments/paymentApi';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [confirmPayment] = useConfirmPaymentSessionMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionId) {
      // Manually confirm the session status via backend
      confirmPayment(sessionId);
    }
    // Invalidate the payments cache when landing on success page
    dispatch(paymentApi.util.invalidateTags(['Users']));
  }, [dispatch, sessionId, confirmPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-50">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-8">
          The payment is done, you will get the notification through email message.
        </p>
        


        <button
          onClick={() => navigate('/parent/payments')}
          className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          View Payments History
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
