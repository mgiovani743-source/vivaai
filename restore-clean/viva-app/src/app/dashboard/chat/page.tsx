'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, SendHorizonal } from 'lucide-react';
import { mockChatMessages, mockAIResponses, chatSuggestions } from '@/data/mock';
import type { ChatMessage } from '@/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('look') || lower.includes('roupa') || lower.includes('vestir')) {
      return mockAIResponses['look'];
    }
    if (lower.includes('evento') || lower.includes('show') || lower.includes('festa')) {
      return mockAIResponses['evento'];
    }
    if (lower.includes('promoção') || lower.includes('desconto') || lower.includes('achadinho') || lower.includes('preço')) {
      return mockAIResponses['promoção'];
    }
    if (lower.includes('humor') || lower.includes('triste') || lower.includes('ansiosa') || lower.includes('desabaf')) {
      return mockAIResponses['humor'];
    }
    if (lower.includes('motiv') || lower.includes('força') || lower.includes('inspiração')) {
      return mockAIResponses['motivação'];
    }
    return mockAIResponses['default'];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const messageIndex = messages.length + 1;

    const userMsg: ChatMessage = {
      id: `cm-user-${messageIndex}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `cm-ai-${messageIndex}`,
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-3xl mx-auto p-2 md:p-4">
      {/* Chat Container */}
      <div className="flex flex-col flex-1 bg-white rounded-3xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="gradient-bg px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Viva AI</h1>
            <p className="text-white/80 text-xs">
              Sua assistente pessoal de evolução
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/70 text-xs">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[85%] md:max-w-[75%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 flex-shrink-0 gradient-bg rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-viva-purple text-white rounded-br-md'
                        : 'bg-viva-light text-viva-graphite rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 flex-shrink-0 gradient-bg rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-viva-light px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-viva-gray/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-viva-gray/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-viva-gray/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 md:px-6 pb-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {chatSuggestions.map((suggestion, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestion(suggestion)}
                className="flex-shrink-0 text-xs font-medium px-3 py-1.5 bg-viva-purple/5 text-viva-purple rounded-full hover:bg-viva-purple/10 transition-colors cursor-pointer whitespace-nowrap border border-viva-purple/10"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-4 md:px-6 pb-4 pt-2 border-t border-viva-border/30"
        >
          <div className="flex items-center gap-2 bg-viva-light rounded-2xl pl-4 pr-2 py-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva sua mensagem..."
              className="flex-1 bg-transparent text-sm text-viva-graphite placeholder-viva-gray/50 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                input.trim() && !isTyping
                  ? 'gradient-bg text-white shadow-glow'
                  : 'bg-viva-border/30 text-viva-gray/40'
              }`}
            >
              <SendHorizonal className="w-5 h-5" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
