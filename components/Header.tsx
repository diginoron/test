import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md p-4 w-full z-10">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Z" />
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
            <path d="m13.5 13.5 4 4" />
        </svg>
        <h1 className="text-xl font-bold text-white">AI Chat Assistant</h1>
      </div>
    </header>
  );
};

export default Header;