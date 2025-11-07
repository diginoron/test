
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Message } from './types';
import { createChat } from './services/geminiService';
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
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize the chat session when the component mounts
    chatRef.current = createChat();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!chatRef.current) {
        setError("Chat is not initialized. Please refresh the page.");
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
                // On first chunk, hide the main spinner and add the new model message to the list
                setIsLoading(false); 
                setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);
                firstChunk = false;
            } else {
                // For subsequent chunks, update the text of the last message
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        }
        
        // If the stream was empty (e.g., safety block), ensure loading is turned off.
        if (firstChunk) {
            setIsLoading(false);
        }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      const displayError = `Sorry, something went wrong: ${errorMessage}`;
      setError(`Failed to get response: ${errorMessage}`);
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
          {error && <div className="text-red-500 text-center my-4">{error}</div>}
          <div ref={chatEndRef} />
        </div>
      </main>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
