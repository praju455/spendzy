import React, { useState, useEffect } from 'react';
import socket from './utils/socket';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './views/Dashboard';
import Chat from './views/Chat';
import ExpenseTracker from './views/ExpenseTracker';
import CalendarView from './views/CalendarView';
import Subscriptions from './views/Subscriptions';
import BillReminders from './views/BillReminders';
import AIChatbot from './views/AIChatbot';
import Auth from './views/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [unreadCount, setUnreadCount] = useState(0);
  const [familyData, setFamilyData] = useState({
    balance: 145000,
    pendingCount: 1,
    income: 150000,
    expensesTotal: 64000,
    messages: []
  });

  const [userData, setUserData] = useState({
    name: 'Jane Doe',
    family: 'The Sharma Household',
    role: 'Admin'
  });

  const handleAuthComplete = (data) => {
    setUserData({
      name: data.name,
      family: data.family,
      role: data.role
    });
    setFamilyData((prev) => ({
      ...prev,
      income: data.income,
      rent: data.rent
    }));
    setIsAuthenticated(true);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server!');
    });

    socket.on('init_data', (data) => {
      setFamilyData(prev => ({ ...prev, ...data }));
    });

    socket.on('new_message', (msg) => {
      if (activeTab !== 'chat') {
        setUnreadCount(prev => prev + 1);
      }
    });

    socket.on('new_approval_request', (approval) => {
       setFamilyData(prev => ({
         ...prev,
         expenses: [...(prev.expenses || []), approval]
       }));
    });

    socket.on('expense_added', (expense) => {
       setFamilyData(prev => ({
         ...prev,
         expenses: [...(prev.expenses || []), expense]
       }));
    });

    socket.on('approval_result', ({ id, result }) => {
       setFamilyData(prev => ({
         ...prev,
         expenses: prev.expenses.map(e => e.id === id ? { ...e, status: result } : e)
       }));
    });

    socket.on('update_bills', (bills) => {
       setFamilyData(prev => ({ ...prev, bills }));
    });

    return () => {
      socket.off('init_data');
      socket.off('new_message');
      socket.off('new_approval_request');
      socket.off('update_bills');
    };
  }, [activeTab]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('light-mode');
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard familyData={familyData} />;
      case 'chat':
        return <Chat userData={userData} />;
      case 'expenses':
        return <ExpenseTracker userData={userData} familyData={familyData} />;
      case 'calendar':
        return <CalendarView familyData={familyData} />;
      case 'subscriptions':
        return <Subscriptions familyData={familyData} />;
      case 'bills':
        return <BillReminders familyData={familyData} />;
      case 'ai':
        return <AIChatbot familyData={familyData} />;
      default:
        return <Dashboard familyData={familyData} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onAuthComplete={handleAuthComplete} />;
  }

  return (
    <div className={`app-container ${theme}-theme`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'chat') setUnreadCount(0);
        }} 
        unreadCount={unreadCount}
        userData={userData}
      />
      <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
        <TopHeader theme={theme} toggleTheme={toggleTheme} />
        {renderView()}
      </main>
    </div>
  );
}

export default App;
