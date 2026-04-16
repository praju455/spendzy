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
      name: name || 'General Expense',
      amount: parseFloat(amount),
      category,
      sender: userData.name
    };
    socket.emit('log_expense', expense);
    setName('');
    setAmount('');
    alert(expense.amount > 10000 ? "High expense submitted for approval." : "Expense logged successfully.");
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

      <div className="grid-layout" style={{ gridTemplateColumns: '1fr' }}>
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
              <label>Expense Name</label>
              <input 
                type="text" 
                placeholder="e.g. Reliance Fresh" 
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
                <option>🏠 Rent</option>
                <option>⚡ Utility</option>
                <option>🛍️ Shopping</option>
              </select>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ gridColumn: 'span 2', marginTop: '1rem' }}
              onClick={submitExpense}
            >
              <Check size={18} /> Submit for Approval / Add
            </button>
          </div>
          {voiceFeedback && (
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '1rem' }}>{voiceFeedback}</p>
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
