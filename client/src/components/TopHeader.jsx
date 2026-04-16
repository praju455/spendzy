import React from 'react';
import { Search, Mic, Moon, Sun, Settings } from 'lucide-react';

const TopHeader = ({ theme, toggleTheme }) => {
  return (
    <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '0.75rem 1.5rem', borderRadius: '2rem', width: '400px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Explore your wealth..." 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%' }}
        />
      </div>
      <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
        <div className="action-btn" title="Speak an Expense">
          <Mic size={18} />
        </div>
        <div className="action-btn" title="Toggle Theme" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </div>
        <div className="action-btn" title="Settings">
          <Settings size={18} />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
