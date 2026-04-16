import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';

const Auth = ({ onAuthComplete }) => {
  const [step, setStep] = useState('welcome'); // welcome, create, join, otp, rent
  const [famName, setFamName] = useState('');
  const [income, setIncome] = useState('');
  const [adminName, setAdminName] = useState('');
  
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinRole, setJoinRole] = useState('Working');
  
  const [rent, setRent] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);

  const [generatedCode, setGeneratedCode] = useState('');

  const handleCreate = () => {
    const code = "SPEND" + Math.floor(100 + Math.random() * 900);
    setGeneratedCode(code);
    setStep('create-success');
  };

  const handleJoin = () => {
    if (!joinCode) return;
    if (!otpSent) {
      setOtpSent(true);
      setStep('otp');
      let t = 120;
      const interval = setInterval(() => {
        t--;
        setOtpTimer(t);
        if (t <= 0) clearInterval(interval);
      }, 1000);
    }
  };

  const completeAuth = (roleType, name) => {
    onAuthComplete({
      name: name || 'User',
      family: famName || 'Spendzy Hub',
      role: roleType,
      income: parseInt(income) || 150000,
      rent: parseInt(rent) || 25000,
      theme: 'dark'
    });
  };

  return (
    <div className="auth-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, background: 'var(--bg-base)' }}>
      <GlassCard className="auth-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem' }}>Spendzy</h1>
        
        {step === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <h2>Welcome Home</h2>
            <p className="mb-4">Sync your family's financial reality.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setStep('create')}>Create New Family</button>
              <button className="btn btn-outline" onClick={() => setStep('join')}>Join Existing Family</button>
            </div>
          </div>
        )}

        {step === 'create' && (
          <div>
            <h3>Create a Household</h3>
            <div className="input-group">
              <label>Family / Household Name</label>
              <input type="text" placeholder="The Sharma Household" value={famName} onChange={e => setFamName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Your Name (Admin)</label>
              <input type="text" placeholder="John Doe" value={adminName} onChange={e => setAdminName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Total Monthly Fixed Income (₹)</label>
              <input type="number" placeholder="150000" value={income} onChange={e => setIncome(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCreate}>
              Generate Household Code
            </button>
          </div>
        )}

        {step === 'create-success' && (
          <div style={{ textAlign: 'center' }}>
            <h3>Household Created!</h3>
            <p>Share this code with your family members to join.</p>
            <h1 style={{ color: 'var(--primary)', letterSpacing: '2px', margin: '2rem 0' }}>{generatedCode}</h1>
            <button className="btn btn-success" style={{ width: '100%' }} onClick={() => setStep('rent')}>
              Continue
            </button>
          </div>
        )}

        {step === 'join' && (
          <div>
            <h3>Join a Household</h3>
            <div className="input-group">
              <label>Enter Household Code</label>
              <input type="text" placeholder="SPEND456" value={joinCode} onChange={e => setJoinCode(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Your Name</label>
              <input type="text" placeholder="Jane Doe" value={joinName} onChange={e => setJoinName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Your Role</label>
              <select className="styled-select" value={joinRole} onChange={e => setJoinRole(e.target.value)}>
                <option value="Working">Working (Contributor)</option>
                <option value="Non-Working">Non-Working / Manager</option>
                <option value="Viewer">Viewer (Kids/Dependents)</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleJoin}>
              Request OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div style={{ textAlign: 'center' }}>
            <h3>OTP Required</h3>
            <p className="mb-4">Admin approval simulation. Enter the 4-digit code.</p>
            <div className="input-group">
              <input type="number" placeholder="1 2 3 4" style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.5rem' }} />
            </div>
            <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
              Expires in {Math.floor(otpTimer/60)}:{otpTimer%60 < 10 ? '0' : ''}{otpTimer%60}
            </p>
            <button className="btn btn-success" style={{ width: '100%' }} onClick={() => setStep('rent')}>
              Validate OTP
            </button>
          </div>
        )}

        {step === 'rent' && (
          <div style={{ textAlign: 'center' }}>
            <h3>Almost Done!</h3>
            <p className="mb-4">What's your household's monthly rent or mortgage?</p>
            <div className="input-group">
              <input type="number" placeholder="e.g. 25000" value={rent} onChange={e => setRent(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => completeAuth(adminName ? 'Admin' : joinRole, adminName || joinName)}>
              Enter Spendzy
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Auth;
