import React from 'react';
import { Wifi, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import ExpenseChart from '../components/ExpenseChart';
import HistoricalAnalytics from '../components/HistoricalAnalytics';

const Dashboard = ({ familyData }) => {
  const income = familyData.income || 150000;
  const rent = familyData.rent || 25000;
  
  const expenses = familyData.expenses || [];
  const approvedExpenses = expenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, rent);
  const pendingCount = expenses.filter(e => e.status === 'Pending').length;
  const balance = income - approvedExpenses;

  const stats = [
    { label: 'Wallet & Bank Balance', value: `₹ ${balance.toLocaleString('en-IN')}`, border: 'border-primary' },
    { label: 'Pending Approvals', value: pendingCount, border: 'border-warning' },
    { label: 'Monthly Income', value: `₹ ${income.toLocaleString('en-IN')}`, border: 'border-success' },
    { label: 'Monthly Expenses', value: `₹ ${approvedExpenses.toLocaleString('en-IN')}`, border: 'border-danger' },
  ];

  return (
    <motion.section 
      id="dashboard" 
      className="view-section active-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Family Dashboard</h1>
          <p className="subtitle">Real-time financial synchronization.</p>
        </div>
        <div className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', padding: '0.5rem 1rem' }}>
          <Wifi size={14} style={{ marginRight: '0.5rem' }} /> Socket.io Live
        </div>
      </div>

      <div className="grid-layout cols-4 mb-2">
        {stats.map((stat, i) => (
          <GlassCard key={i} className={`mini-stat ${stat.border}`}>
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
          </GlassCard>
        ))}
      </div>

      <div className="grid-layout mt-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <GlassCard>
          <ExpenseChart expenses={expenses} />
        </GlassCard>
        <GlassCard className="border-success" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)' }}>
          <h3 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} /> Super Saver of the Month
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <img 
              src="https://ui-avatars.com/api/?name=Son&background=10b981&color=fff" 
              className="avatar" 
              style={{ width: '60px', height: '60px', borderColor: 'var(--success)' }} 
              alt="Saver"
            />
            <div>
              <h4 style={{ margin: 0 }}>Son (Viewer)</h4>
              <p className="microcopy">Cut junk food expenses by 40%</p>
              <div className="badge success" style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem' }}>+ ₹ 1,200 Saved</div>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <HistoricalAnalytics familyData={familyData} />
    </motion.section>
  );
};

export default Dashboard;
