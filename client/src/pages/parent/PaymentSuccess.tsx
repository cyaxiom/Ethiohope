import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
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
      confirmPayment(sessionId);
    }
    dispatch(paymentApi.util.invalidateTags(['Users']));
  }, [dispatch, sessionId, confirmPayment]);

  return (
    <div className="min-h-screen bg-[#070b16] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto w-full rounded-2xl border border-white/10 bg-[#0b1224] p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-400/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Payment successful</h2>
        <p className="text-slate-400 text-sm mb-7 leading-relaxed">
          Your payment is complete. You will receive a confirmation by email shortly.
        </p>

        <button
          type="button"
          onClick={() => navigate('/parent/payments')}
          className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          View payment history
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
