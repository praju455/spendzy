import React from 'react';
import { Play, Store, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const Subscriptions = ({ familyData }) => {
  const subs = familyData?.subscriptions || [];

  return (
    <motion.section 
      id="subscriptions" 
      className="view-section active-view"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '2rem' }}>
        <h1>Subscription Detector</h1>
      </div>
      <div className="grid-layout cols-3">
        {subs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No active subscriptions.</p>
        ) : (
          subs.map(sub => {
            let borderColor = 'border-success';
            let badgeColor = 'var(--success)';
            let iconColor = '#00A8E1';
            let IconComponent = sub.icon === 'Play' ? Play : sub.icon === 'Music' ? Music : Store;
            
            if(sub.status === 'Expiring Soon') {
              borderColor = 'border-warning';
              badgeColor = 'var(--warning)';
              iconColor = '#E50914';
            } else if (sub.status === 'Expired Plan') {
              borderColor = 'border-danger';
              badgeColor = 'var(--danger)';
              iconColor = '#1DB954';
            }

            return (
              <GlassCard key={sub.id} className={`finding-card ${borderColor}`} style={{ position: 'relative', opacity: sub.status === 'Expired Plan' ? 0.7 : 1 }}>
                <span className="badge" style={{ background: badgeColor, position: 'absolute', top: '1rem', right: '1rem' }}>{sub.status}</span>
                <div className="logo-circle" style={{ background: sub.color, width: '50px', height: '50px', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto', fontSize: '1.5rem' }}>
                  <IconComponent color="white" fill={sub.icon === 'Play' ? 'white' : 'none'} />
                </div>
                <h3 className="mt-2 text-center" style={{ textAlign: 'center', marginTop: '1rem' }}>{sub.name}</h3>
                <h2 className="text-center mt-2" style={{ textAlign: 'center' }}>₹ {sub.cost}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></h2>
              </GlassCard>
            );
          })
        )}
      </div>
    </motion.section>
  );
};

export default Subscriptions;
