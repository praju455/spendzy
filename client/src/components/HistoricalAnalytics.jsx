import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const HistoricalAnalytics = ({ familyData }) => {
  const expenses = familyData?.expenses || [];

  // 1. Calculate Per-Member Expenditure
  const memberExpensesMap = expenses.reduce((acc, curr) => {
    if (curr.status !== 'Approved') return acc;
    acc[curr.sender] = (acc[curr.sender] || 0) + curr.amount;
    return acc;
  }, {});

  const memberData = Object.keys(memberExpensesMap).map(name => ({
    name,
    amount: memberExpensesMap[name]
  })).sort((a,b) => b.amount - a.amount);

  // 2. Mock Historical Monthly Data (Current Month + Previous Months)
  // In a real app this would map from actual historical timestamps in the DB
  const currentMonthTotal = expenses.reduce((acc, curr) => curr.status === 'Approved' ? acc + curr.amount : acc, 0);
  
  const historicalData = [
    { name: 'Jan', spend: 85000 },
    { name: 'Feb', spend: 92000 },
    { name: 'Mar', spend: 78000 },
    { name: 'Apr (Current)', spend: currentMonthTotal > 0 ? currentMonthTotal : 45000 }
  ];

  return (
    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Historical Monthly Comparison */}
      <GlassCard className="border-primary">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Historical Monthly Comparison</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `₹${value/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <RechartsTooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--primary)' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Expenditure']}
              />
              <Area type="monotone" dataKey="spend" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Per-Member Expenditure Analysis */}
      <GlassCard className="border-warning">
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--warning)' }}>Expenditure by Family Member</h3>
        {memberData.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>No approved expenditures yet.</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `₹${value/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                />
                <Bar dataKey="amount" fill="var(--warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

    </div>
  );
};

export default HistoricalAnalytics;
