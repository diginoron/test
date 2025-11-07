
import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { continueChat } from './services/geminiService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      { role: 'model', text: 'Hello! How can I assist you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    setError(null);
    const newUserMessage: Message = { role: 'user', text: userInput };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const history = messages; // Pass the history before adding the new user message
      const modelResponse = await continueChat(history, userInput);
      const newModelMessage: Message = { role: 'model', text: modelResponse };
      setMessages([...currentMessages, newModelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      const errorModelMessage: Message = { role: 'model', text: `Sorry, something went wrong: ${errorMessage}` };
      setMessages([...currentMessages, errorModelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow overflow-y-auto p-4 container mx-auto">
        <div className="w-full">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-red-500 text-center my-4">{error}</div>}
          <div ref={chatEndRef} />
        </div>
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
