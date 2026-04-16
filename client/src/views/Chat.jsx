import React, { useState, useEffect, useRef } from 'react';
import { Send, Gavel, Check, X, Circle, Receipt } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import socket from '../utils/socket';

const Chat = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('init_data', (data) => {
      setMessages(data.messages || []);
    });

    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('new_approval_request', (approval) => {
      setPendingApprovals((prev) => [...prev, approval]);
    });

    socket.on('approval_result', ({ id, result }) => {
      setPendingApprovals((prev) => prev.filter(a => a.id !== id));
      // Optionally show a confirmation message
    });

    return () => {
      socket.off('new_message');
      socket.off('new_approval_request');
      socket.off('approval_result');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msgObj = {
      sender: userData.name,
      role: userData.role,
      text: input,
    };
    socket.emit('send_message', msgObj);
    setInput('');
  };

  const handleApproval = (id, result) => {
    socket.emit('approve_expense', { id, result });
  };

  return (
    <section id="family-chat" className="view-section active-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1>Family Group Chat</h1>
          <p className="subtitle">Broadcasts live across all active devices via WebSockets.</p>
        </div>
        <span className="badge success" style={{ height: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Circle size={8} fill="var(--success)" /> Online
        </span>
      </div>

      <div className="grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Chat Window */}
        <GlassCard className="chat-container" style={{ minHeight: '500px', padding: '1.5rem' }}>
          <div className="chat-messages" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`message ${msg.sender === userData.name ? 'user' : 'bot'}`}
                style={{ alignSelf: msg.sender === userData.name ? 'flex-end' : 'flex-start' }}
              >
                <div className="msg-avatar" style={{ background: msg.sender === userData.name ? 'var(--primary)' : '#f59e0b' }}>
                  {msg.sender === userData.name ? userData.name[0] : msg.sender[0]}
                </div>
                <div className="msg-bubble" style={{ background: msg.sender === userData.name ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                  <strong style={{ color: msg.sender === userData.name ? '#fff' : 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {msg.sender} ({msg.role})
                  </strong>
                  <p style={{ color: msg.sender === userData.name ? '#fff' : 'var(--text-main)', margin: '0.2rem 0' }}>{msg.text}</p>
                  <small style={{ color: msg.sender === userData.name ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', fontSize: '0.7rem', display: 'block', textAlign: 'right' }}>
                    {msg.time}
                  </small>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-area" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a family message..." 
              style={{ flex: 1, background: 'rgba(15,23,42,0.8)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '1rem', color: 'white' }}
            />
            <button className="btn btn-primary" onClick={sendMessage}><Send size={18} /> Send</button>
          </div>
        </GlassCard>

        {/* Expense Approvals */}
        <GlassCard className="border-warning" style={{ height: 'fit-content' }}>
          <h3 style={{ color: 'var(--warning)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gavel size={20} /> Pending Approvals
          </h3>
          <p className="microcopy mb-4">Admins manage these automatically synced requests.</p>

          <div id="approvalsContainer">
            {pendingApprovals.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No pending requests.</p>
            ) : (
              pendingApprovals.map((approval) => (
                <div className="bill-item" key={approval.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <div className="bill-icon" style={{ background: '#ec489944', color: '#f472b6' }}>
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Requested by: {approval.sender}</h4>
                      <p style={{ margin: '0.2rem 0' }}>Status: <strong className="text-danger">Pending</strong></p>
                      <h3 style={{ margin: 0 }} className="text-danger">₹ {approval.amount}</h3>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleApproval(approval.id, 'Rejected')}>
                      <X size={16} /> Reject
                    </button>
                    <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleApproval(approval.id, 'Approved')}>
                      <Check size={16} /> Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default Chat;
