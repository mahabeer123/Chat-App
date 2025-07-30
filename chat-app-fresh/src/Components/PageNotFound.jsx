import React from 'react';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full text-center">
                <div className="text-6xl mb-4">404</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The page you're looking for doesn't exist.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    🏠 Go Home
                </button>
            </div>
        </div>
    );
}

export default PageNotFound;