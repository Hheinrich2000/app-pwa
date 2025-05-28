import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 font-medium">Loading...</p>
    </div>
  );
};

export default LoadingScreen;