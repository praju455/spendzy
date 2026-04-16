import React, { useState } from 'react';
import { IndianRupee, Tag, CheckCircle2, Mic, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import socket from '../utils/socket';
import GlassCard from '../components/GlassCard';
import BudgetEnvelopes from '../components/BudgetEnvelopes';

const ExpenseTracker = ({ userData, familyData }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [notes, setNotes] = useState('');
  const [isRequest, setIsRequest] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const expenses = familyData?.expenses || [];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAmount('3450');
      setName('Reliance Fresh Supermarket');
      setCategory('Groceries');
      setIsScanning(false);
      setVoiceFeedback('AI Extraction Complete!');
      setTimeout(() => setVoiceFeedback(''), 3000);
    }, 2000);
  };

  const submitExpense = () => {
    if (!amount) return;
    const expense = {
      name: name || (isRequest ? 'Money Request' : 'General Expense'),
      amount: parseFloat(amount),
      category,
      notes,
      type: isRequest ? 'Request' : 'Expense',
      sender: userData.name
    };
    socket.emit('log_expense', expense);
    setName('');
    setAmount('');
    setNotes('');
    alert(isRequest || expense.amount > 10000 ? "Request submitted for parent approval." : "Expense logged successfully.");
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();

    setVoiceFeedback("Listening...");

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript.toLowerCase();
      let amt = transcript.replace(/[^0-9]/g, '');
      if(amt) {
        setAmount(amt);
        setName("Voice Entry: " + transcript);
        
        setVoiceFeedback(`Recognized: "${transcript}"`);

        setTimeout(()=> { setVoiceFeedback(''); }, 4000);
      } else {
        setVoiceFeedback("Could not find an amount in speech.");
        setTimeout(()=> { setVoiceFeedback(''); }, 3000);
      }
    };

    recognition.onspeechend = function() {
      recognition.stop();
    };
  };

  return (
    <motion.section 
      id="expense-tracker" 
      className="view-section active-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <IndianRupee /> Track & Split Expenses
        </h1>
        <p className="subtitle">Add your household expenses below.</p>
      </div>

      <div className="grid-layout cols-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <GlassCard style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3>Record Expense</h3>
            <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={startVoiceRecognition}>
              <Mic size={18} />
            </button>
          </div>
          <p className="microcopy text-muted mt-1 mb-4" style={{ display: voiceFeedback ? 'block' : 'none', color: 'var(--success)' }}>{voiceFeedback}</p>

          {/* AI Receipt Scanner Drag/Drop Mock */}
          <div 
            onClick={handleSimulateScan}
            style={{
              width: '100%',
              padding: '2rem',
              border: '2px dashed rgba(255,255,255,0.2)',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              background: isScanning ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              transition: 'var(--transition)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isScanning && (
              <motion.div
                initial={{ top: '-100%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'var(--primary)',
                  boxShadow: '0 0 10px var(--primary)'
                }}
              />
            )}
            <p style={{ color: isScanning ? 'var(--primary)' : 'var(--text-muted)' }}>
              {isScanning ? '🔍 AI Analyzing Receipt...' : '📁 Click or Drag Receipt to Auto-fill'}
            </p>
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Expense Name/Title</label>
              <input 
                type="text" 
                placeholder="e.g., School Fees, Groceries" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                placeholder="500" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select className="styled-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>🛒 Groceries</option>
                <option>🍔 Dining Out</option>
                <option>💡 Utilities</option>
                <option>🎓 Kids & Education</option>
                <option>🎬 Entertainment</option>
                <option>🛍️ Shopping</option>
              </select>
            </div>
            <div className="input-group">
              <label>Shared Notes</label>
              <input 
                type="text" 
                placeholder="Add context..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input 
                type="checkbox" 
                checked={isRequest}
                onChange={(e) => setIsRequest(e.target.checked)}
                style={{ width: 'auto', margin: 0 }}
              />
              <span style={{ fontSize: '0.9rem' }}>Send as "Request Money" to Parents</span>
            </label>

            <button 
              className="btn btn-primary" 
              onClick={submitExpense}
              style={{ gap: '0.5rem' }}
            >
              <Check size={18} /> {isRequest ? 'Request Approval' : 'Submit / Add'}
            </button>
          </div>
          {voiceFeedback && (
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '1rem' }}>{voiceFeedback}</p>
          )}
        </GlassCard>

        {/* Pending Requests & Approvals */}
        <GlassCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Pending Actions</h3>
            <span className="badge badge-warning">{expenses.filter(e => e.status === 'Pending').length} requests</span>
          </div>

          {expenses.filter(e => e.status === 'Pending').length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>No pending requests.</p>
          ) : (
            expenses.filter(e => e.status === 'Pending').map((expense, index) => (
              <div key={index} style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                borderLeft: '4px solid var(--warning)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{expense.name} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>({expense.sender})</span></strong>
                  <strong style={{ color: 'var(--warning)' }}>₹{expense.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Tag size={14} /> {expense.category}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}
                      onClick={() => socket.emit('update_expense_status', { id: expense.id, status: 'Rejected' })}>Reject</button>
                    <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}
                      onClick={() => socket.emit('update_expense_status', { id: expense.id, status: 'Approved' })}>Approve</button>
                  </div>
                </div>
                {expense.notes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: '0.8rem', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
                    Note: "{expense.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </GlassCard>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <BudgetEnvelopes expenses={expenses} />
      </div>
    </motion.section>
  );
};

export default ExpenseTracker;
