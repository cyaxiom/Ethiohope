import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b16] flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto w-full rounded-2xl border border-white/10 bg-[#0b1224] p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-red-500/15 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-400/20">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Payment cancelled</h2>
        <p className="text-slate-400 text-sm mb-7 leading-relaxed">
          Checkout was cancelled. Your enrollments are still pending — you can try again anytime.
        </p>

        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Return to checkout
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
