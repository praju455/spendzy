import React, { useState } from 'react';
import { Target, TrendingDown, HelpCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const Goals = ({ familyData }) => {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  
  // Static mocks for Goals and Debt (in a real app, from familyData)
  const savingsGoals = [
    { name: 'Education Fund', target: 500000, current: 150000, color: 'var(--success)' },
    { name: 'Family Vacation', target: 200000, current: 80000, color: 'var(--primary)' },
    { name: 'New Car Downpayment', target: 300000, current: 40000, color: 'var(--warning)' }
  ];

  const debts = [
    { name: 'Home Loan', total: 4500000, remaining: 3200000, emi: 35000 },
    { name: 'Credit Card', total: 50000, remaining: 15000, emi: 5000 }
  ];

  const currentBalance = 145000; // Simulated liquid assets

  const calculateImpact = () => {
    if (!purchaseAmount || isNaN(purchaseAmount)) return null;
    const amount = Number(purchaseAmount);
    
    if (amount > currentBalance) {
      return { level: 'danger', message: `Warning: This exceeds your current liquid balance of ₹${currentBalance.toLocaleString('en-IN')}. You will need to take on debt.` };
    } else if (amount > currentBalance * 0.5) {
      return { level: 'warning', message: `Caution: This consumes over 50% of your liquid balance. It may severely delay your 'Family Vacation' goal.` };
    } else {
      return { level: 'success', message: `Safe: You can afford this. Your remaining balance will be ₹${(currentBalance - amount).toLocaleString('en-IN')}.` };
    }
  };

  const impact = calculateImpact();

  return (
    <motion.section 
      id="goals-view" 
      className="view-section active-view"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Target /> Goals & Debt Tracking
        </h1>
        <p className="subtitle">Track your long-term aspirations and liabilities.</p>
      </div>

      <div className="grid-layout cols-2">
        {/* Goals Section */}
        <GlassCard>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--primary)" /> Savings Goals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {savingsGoals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <div key={goal.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <strong>{goal.name}</strong>
                    <span>₹ {goal.current.toLocaleString('en-IN')} / ₹ {goal.target.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      style={{ height: '100%', background: goal.color, borderRadius: '4px' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Debt Section */}
        <GlassCard>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown size={20} color="var(--danger)" /> Debt Tracking
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {debts.map(debt => {
              const paid = debt.total - debt.remaining;
              const progress = Math.min((paid / debt.total) * 100, 100);
              return (
                <div key={debt.name} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--danger)' }}>{debt.name}</strong>
                    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>EMI: ₹ {debt.emi.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="microcopy" style={{ marginBottom: '0.5rem' }}>Remaining: ₹ {debt.remaining.toLocaleString('en-IN')}</p>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      style={{ height: '100%', background: 'var(--danger)', borderRadius: '3px', opacity: 0.8 }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Decision Simulator */}
      <GlassCard className="mt-4" style={{ border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa' }}>
          <HelpCircle size={20} /> Decision Simulator
        </h3>
        <p className="subtitle mb-4">What happens if I buy something costly right now?</p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="input-group" style={{ flex: 1, margin: 0 }}>
            <input 
              type="number" 
              placeholder="e.g. 50000 for a new laptop..." 
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              style={{ padding: '0.8rem' }}
            />
          </div>
        </div>

        {impact && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4`}
            style={{ 
              padding: '1rem', 
              borderRadius: '8px', 
              background: impact.level === 'danger' ? 'rgba(239,68,68,0.1)' : impact.level === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
              border: `1px solid var(--${impact.level})`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertTriangle size={20} color={`var(--${impact.level})`} />
            <p style={{ color: `var(--${impact.level})`, margin: 0 }}>{impact.message}</p>
          </motion.div>
        )}
      </GlassCard>

    </motion.section>
  );
};

export default Goals;
