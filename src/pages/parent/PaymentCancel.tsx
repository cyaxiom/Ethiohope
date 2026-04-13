import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-50">
          <XCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Cancelled</h2>
        <p className="text-gray-500 mb-8">
          You have cancelled the checkout process. Your enrollments are still pending, and you can try again anytime from your dashboard.
        </p>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Return to Checkout
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
