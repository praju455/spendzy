import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  MessageSquare, 
  Calendar, 
  Video, 
  Bell, 
  Bot,
  Target
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, unreadCount, userData }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'goals', label: 'Goals & Simulator', icon: <Target size={20} /> },
    { id: 'expenses', label: 'Expense Tracker', icon: <Receipt size={20} /> },
    { id: 'chat', label: 'Family Chat', icon: <MessageSquare size={20} />, badge: unreadCount > 0 ? 'New' : null },
    { id: 'calendar', label: 'Calendar View', icon: <Calendar size={20} /> },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Video size={20} /> },
    { id: 'bills', label: 'Bill Reminders', icon: <Bell size={20} /> },
    { id: 'ai', label: 'AI Chatbot', icon: <Bot size={20} />, color: 'var(--secondary)' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon"><Receipt size={24} /></div>
        <h2>Spendzy</h2>
      </div>
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.id);
            }}
            style={item.id === 'ai' ? { marginTop: 'auto' } : {}}
          >
            <span style={item.color ? { color: item.color } : {}}>{item.icon}</span>
            <span style={item.color ? { color: item.color, fontWeight: 600 } : {}}>{item.label}</span>
            {item.badge && (
              <span className="badge" style={{ background: 'var(--danger)', marginLeft: 'auto', fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
      <div className="user-profile mt-4">
        <img 
          src={`https://ui-avatars.com/api/?name=${userData.name}&background=2563eb&color=fff`} 
          alt="User" 
          className="avatar" 
          width="40"
          height="40"
        />
        <div className="user-info" style={{ marginLeft: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{userData.name}</h4>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userData.family} ({userData.role})</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
