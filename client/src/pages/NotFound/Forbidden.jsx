import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold text-red-500">403</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
