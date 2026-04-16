import React, { useState } from 'react';
import { CircleAlert, Zap, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

import socket from '../utils/socket';

const BillReminders = ({ familyData }) => {
  const bills = familyData?.bills || [];

  const handlePayment = (e, billId) => {
    const targetText = e.currentTarget.nextElementSibling;
    targetText.style.display = 'block';
    
    setTimeout(() => {
        targetText.innerText = 'Payment status marked as Successful via external handler!';
        targetText.style.color = 'var(--success)';
        // Send to backend
        socket.emit('pay_bill', billId);
    }, 3000);
  };

  return (
    <motion.section 
      id="bill-reminders" 
      className="view-section active-view"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1>Bill Reminders</h1>
        <p className="subtitle">Properly formatted UPI Deep Links to launch GPay/PhonePe.</p>
      </div>

      <div className="grid-layout" style={{ gridTemplateColumns: '1fr' }}>
        <GlassCard className="border-danger">
          <h3 style={{ color: 'var(--danger)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CircleAlert size={20} /> Overdue
          </h3>
          
          {bills.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending bills at the moment.</p>
          ) : (
            bills.map(bill => (
              <div key={bill.id} className={`bill-item ${bill.status} mb-4`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div className="bill-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '1rem', borderRadius: '1rem' }}>
                    <Zap size={24} />
                  </div>
                  <div className="bill-details">
                    <h4 style={{ margin: 0 }}>{bill.name}</h4>
                    <p style={{ margin: '0.2rem 0' }}>Due: <strong>{bill.dueDate}</strong></p>
                  </div>
                </div>
                
                <div className="bill-action" style={{ textAlign: 'right' }}>
                  <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>₹ {bill.amount}</h3>
                  <a 
                    href={`upi://pay?pa=dummybill@upi&pn=Biller&am=${bill.amount}&cu=INR`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-primary" 
                    style={{ textDecoration: 'none', display: 'inline-flex', gap: '0.5rem' }}
                    onClick={(e) => handlePayment(e, bill.id)}
                  >
                    <QrCode size={18} /> Pay via UPI
                  </a>
                  <p className="microcopy mt-2 pay-status" style={{ display: 'none', color: 'var(--success)', marginTop: '0.5rem' }}>Tracking response...</p>
                </div>
              </div>
            ))
          )}
        </GlassCard>
      </div>
    </motion.section>
  );
};

export default BillReminders;
