import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-9xl font-bold text-gray-200">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          The page might have been moved, deleted, or never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>

        {/* Help Section */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Need Help?</span>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            If you believe this is an error, please contact our support team.
          </p>
          <button
            onClick={() => navigate('/support')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Contact Support →
          </button>
        </div>

        {/* Common Links */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-3">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/loans')}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              My Loans
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Payments
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Documents
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
