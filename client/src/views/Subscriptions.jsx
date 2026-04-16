import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';

const subscriptions = [
  {
    id: 's1',
    name: 'Netflix',
    cost: 649,
    status: 'Expiring Soon',
    deadline: '22 Apr 2026',
    daysLeft: 6,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    bg: '#E50914',
    description: '4K Ultra HD · 4 screens'
  },
  {
    id: 's2',
    name: 'Spotify',
    cost: 119,
    status: 'Active',
    deadline: '01 May 2026',
    daysLeft: 15,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    bg: '#1DB954',
    description: 'Premium Family · 6 accounts'
  },
  {
    id: 's3',
    name: 'JioCinema',
    cost: 29,
    status: 'Active',
    deadline: '16 May 2026',
    daysLeft: 30,
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Jio_Cinema_logo.svg/512px-Jio_Cinema_logo.svg.png',
    bg: '#003699',
    description: 'Premium · HD Streaming'
  },
  {
    id: 's4',
    name: 'Amazon Prime',
    cost: 299,
    status: 'Active',
    deadline: '10 Jun 2026',
    daysLeft: 55,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.svg',
    bg: '#00A8E1',
    description: 'Prime Video + Shipping'
  },
  {
    id: 's5',
    name: 'YouTube Premium',
    cost: 189,
    status: 'Expiring Soon',
    deadline: '20 Apr 2026',
    daysLeft: 4,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    bg: '#FF0000',
    description: 'Ad-free · Background play'
  },
  {
    id: 's6',
    name: 'Disney+ Hotstar',
    cost: 299,
    status: 'Expired',
    deadline: '10 Apr 2026',
    daysLeft: -6,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg',
    bg: '#0A1931',
    description: 'Super · Mobile HD'
  }
];

const statusColors = {
  'Active': 'var(--success)',
  'Expiring Soon': 'var(--warning)',
  'Expired': 'var(--danger)'
};

const Subscriptions = () => {
  const totalMonthly = subscriptions.filter(s => s.status !== 'Expired').reduce((acc, s) => acc + s.cost, 0);

  return (
    <motion.section
      id="subscriptions"
      className="view-section active-view"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="view-header" style={{ marginBottom: '1rem' }}>
        <h1>Subscription Tracker</h1>
        <p className="subtitle">Monitor all your active streaming & service plans</p>
      </div>

      {/* Summary Bar */}
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Monthly Spend</p>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>₹{totalMonthly.toLocaleString('en-IN')}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></h2>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Active Plans</p>
          <h2 style={{ color: 'var(--success)', margin: 0 }}>{subscriptions.filter(s => s.status === 'Active').length}</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Expiring Soon</p>
          <h2 style={{ color: 'var(--warning)', margin: 0 }}>{subscriptions.filter(s => s.status === 'Expiring Soon').length}</h2>
        </div>
      </div>

      <div className="grid-layout cols-3">
        {subscriptions.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard style={{ position: 'relative', opacity: sub.status === 'Expired' ? 0.6 : 1, height: '100%' }}>
              <span className="badge" style={{
                background: statusColors[sub.status],
                position: 'absolute', top: '1rem', right: '1rem',
                fontSize: '0.7rem', padding: '0.3rem 0.7rem'
              }}>
                {sub.status}
              </span>

              {/* Logo */}
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: sub.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden', padding: '8px' }}>
                <img src={sub.logo} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>

              <h3 style={{ textAlign: 'center', marginBottom: '0.3rem' }}>{sub.name}</h3>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '1rem' }}>{sub.description}</p>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cost</span>
                  <strong style={{ color: 'var(--primary)' }}>₹{sub.cost}/mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Renews</span>
                  <strong style={{ color: statusColors[sub.status], fontSize: '0.85rem' }}>
                    {sub.status === 'Expired' ? '❌ Expired' : `${sub.deadline} (${sub.daysLeft}d)`}
                  </strong>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Subscriptions;
