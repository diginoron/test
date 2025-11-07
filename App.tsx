import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Message } from './types';
import { createChat } from './services/geminiService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize the chat session when the component mounts
    try {
      chatRef.current = createChat();
      setMessages([{ role: 'model', text: 'Hello! How can I assist you today?' }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during initialization.';
      setError(errorMessage);
    }
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!chatRef.current) {
        setError("Chat is not initialized. Please configure your API key and refresh the page.");
        return;
    }
    
    setError(null);
    const newUserMessage: Message = { role: 'user', text: userInput };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
        const stream = await chatRef.current.sendMessageStream({ message: userInput });
        
        let modelResponse = '';
        let firstChunk = true;

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            if (firstChunk) {
                setIsLoading(false); 
                setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
                firstChunk = false;
            } else {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        }
        
        if (firstChunk) {
            setIsLoading(false);
        }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      const displayError = `Sorry, something went wrong: ${errorMessage}`;
      setError(displayError); // Set error state instead of just a message
      setMessages(prevMessages => [...prevMessages, { role: 'model', text: displayError }]);
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
          {error && (
            <div className="bg-red-900/50 text-red-300 p-4 my-4 rounded-lg shadow-md">
              <h2 className="font-bold text-lg mb-2">An error occurred:</h2>
              <p className="font-mono bg-gray-800 p-2 rounded">{error}</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={!!error} />
    </div>
  );
};

export default App;
