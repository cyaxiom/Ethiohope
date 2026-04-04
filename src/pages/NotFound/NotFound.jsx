import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="text-9xl font-extrabold text-blue-600 animate-bounce">
                404
            </h1>
            <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute mb-20 text-white font-semibold">
                Page Not Found
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-8 mb-4">
                Oops! Looks like you're lost.
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-10 text-lg">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, even the best explorers get lost sometimes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                    to="/"
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl hover:scale-105"
                >
                    Back to Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFound;
