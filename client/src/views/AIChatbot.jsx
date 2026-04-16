import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

import socket from '../utils/socket';

const AIChatbot = ({ familyData }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there! 👋 I am Spendzys dynamic AI. Ask me things like "How much did we spend this month?" or "Who spent the most?"'
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('ai_response', (response) => {
      setMessages(prev => [...prev, response]);
    });

    return () => {
      socket.off('ai_response');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBotQuery = () => {
    const txt = input.trim();
    if (!txt) return;

    setMessages(prev => [...prev, { sender: 'user', text: txt }]);
    socket.emit('ai_query', txt);
    setInput('');
  };

  return (
    <motion.section 
      id="ai-bot" 
      className="view-section active-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={32} /> Context-Aware Chatbot
        </h1>
        <p className="subtitle">Uses dynamic query mapping to generate appropriate responses.</p>
      </div>

      <GlassCard className="chat-container glass-glow" style={{ padding: '1.5rem', minHeight: '500px' }}>
        <div className="chat-messages" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
              style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div 
                className="msg-avatar" 
                style={{ background: msg.sender === 'user' ? 'var(--primary)' : 'var(--secondary)', color: 'white' }}
              >
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div 
                className="msg-bubble" 
                style={{ 
                  background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--glass-border)',
                  borderTopRightRadius: msg.sender === 'user' ? 0 : '1.5rem',
                  borderTopLeftRadius: msg.sender === 'bot' ? 0 : '1.5rem',
                }}
              >
                <p style={{ margin: 0, color: msg.sender === 'user' ? '#fff' : 'var(--text-main)' }}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="chat-input-area" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBotQuery()}
            placeholder="Type a command..." 
            style={{ flex: 1, background: 'rgba(15,23,42,0.8)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '1rem', color: 'white' }}
          />
          <button className="btn btn-primary" onClick={handleBotQuery}>
            <Send size={18} /> Send Query
          </button>
        </div>
      </GlassCard>
    </motion.section>
  );
};

export default AIChatbot;
