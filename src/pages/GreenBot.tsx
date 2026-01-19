import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';
import { generateBotResponse } from '../utils/mockAI';

export default function GreenBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! I'm GreenBot, your eco-friendly assistant. Ask me anything about the environment, climate change, wildlife, or how you can help protect our planet!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: generateBotResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'Why are trees important?',
    'How can I reduce plastic waste?',
    'What is climate change?',
    'How do bees help the environment?',
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">GreenBot AI</h1>
              <p className="text-green-100 dark:text-green-200 text-sm">Your environmental assistant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 animate-slide-in ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
              style={{
                animation: `slideIn 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot'
                    ? 'bg-green-600 dark:bg-green-700'
                    : 'bg-blue-600 dark:bg-blue-700'
                }`}
              >
                {message.sender === 'bot' ? (
                  <Bot className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl shadow-md ${
                  message.sender === 'bot'
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                    : 'bg-blue-600 dark:bg-blue-700 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-600 dark:bg-green-700 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Try asking:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-left text-sm p-3 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-lg hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all duration-300 text-gray-800 dark:text-gray-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about environmental topics..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <span className="font-medium">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
