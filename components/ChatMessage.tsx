
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            AI
         </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {isUser && (
         <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            U
         </div>
      )}
    </div>
  );
};

export default ChatMessage;
