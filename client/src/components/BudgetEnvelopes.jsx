import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const BudgetEnvelopes = ({ expenses }) => {
  // Pre-defined category budgets
  const budgets = {
    'Groceries': 10000,
    'Dining Out': 5000,
    'Utilities': 8000,
    'Entertainment': 4000
  };

  // Calculate current spend from expenses
  const spent = expenses.reduce((acc, curr) => {
    if(curr.status !== 'Approved') return acc;
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const envelopeKeys = Object.keys(budgets);

  return (
    <GlassCard className="mt-4">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>Interactive Envelope Budgets</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {envelopeKeys.map(cat => {
          const limit = budgets[cat];
          const current = spent[cat] || 0;
          const percentage = Math.min((current / limit) * 100, 100);
          
          let color = 'var(--primary)';
          let shadow = 'none';

          if (percentage >= 100) {
            color = 'var(--danger)';
            shadow = '0 0 10px var(--danger)';
          } else if (percentage >= 80) {
            color = 'var(--warning)';
            shadow = '0 0 8px var(--warning)';
          } else if (percentage > 0) {
             shadow = '0 0 8px var(--primary)';
          }

          return (
            <div key={cat}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <strong>{cat}</strong>
                <span>₹ {current.toLocaleString('en-IN')} / ₹ {limit.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ 
                    height: '100%', 
                    background: color, 
                    boxShadow: shadow,
                    borderRadius: '4px'
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default BudgetEnvelopes;
