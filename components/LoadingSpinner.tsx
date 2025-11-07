
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-4 justify-start">
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            AI
        </div>
        <div className="bg-gray-700 text-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-md flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
    </div>
  );
};

export default LoadingSpinner;
