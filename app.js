/* ==============================================================
   STATE & BROADCAST CHANNEL (Real-Time WebSocket Simulation)
   ============================================================== */
let familyState = {
  familyCode: null,
  familyName: "Household",
  adminName: "Admin",
  currentUser: "Jane",
  role: "Working",
  totalIncome: 150000,
  monthlyRent: 25000,
  theme: "dark"
};

// Creating a BroadcastChannel ensures cross-tab exact real-time messaging just like WebSockets!
const socketSimulation = new BroadcastChannel('spendzy_socket');
let calendarObject = null;

socketSimulation.onmessage = (event) => {
  const { type, payload } = event.data;
  
  if(type === 'NEW_CHAT') {
    renderChatMessage(payload);
  }
  if(type === 'EXPENSE_APPROVED') {
    handleRemoteApproval(payload);
  }
  if(type === 'NEW_EXPENSE_ALERT') {
    createApprovalCard(payload);
  }
};

/* ==============================================================
   GLOBAL INIT & ROUTING
   ============================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const viewSections = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      if (!targetId) return;

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      viewSections.forEach(view => {
        view.classList.remove('active-view');
      });

      const activeView = document.getElementById(targetId);
      if (activeView) activeView.classList.add('active-view');

      // Initialize Calendar exactly when it becomes visible to avoid render bugs
      if (targetId === 'calendar-trends') {
        if(!calendarObject) initCalendar();
        else calendarObject.render();
      }

      if(targetId === 'family-chat') {
        document.getElementById('unreadBadge').style.display = 'none';
      }
    });
  });

  // Enter Key Listeners
  document.getElementById('liveChatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendRealtimeMessage();
  });
  document.getElementById('botInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleBotQuery();
  });
});

/* ==============================================================
   AUTHENTICATION: CREATE, OTP, ROLE ASSIGNMENT
   ============================================================== */
function goToAuthStep(currentId, nextId) {
  document.getElementById(currentId).classList.remove('active-step');
  document.getElementById(currentId).classList.add('hidden-step');
  setTimeout(() => {
    document.getElementById(nextId).classList.remove('hidden-step');
    document.getElementById(nextId).classList.add('active-step');
  }, 300); 
}

function handleCreateFamily() {
  const famName = document.getElementById('createFamName').value || "Spendzy Hub";
  const income = document.getElementById('createIncome').value || 150000;
  
  const code = "SPEND" + Math.floor(100 + Math.random() * 900);
  
  localStorage.setItem('spendzy_fam_code', code);
  familyState.familyCode = code;
  familyState.familyName = famName;
  familyState.totalIncome = parseInt(income);
  familyState.role = "Admin";
  familyState.currentUser = document.getElementById('createAdminName').value || "Admin";

  document.getElementById('generatedCodeDisplay').innerText = code;
  document.getElementById('codeModal').classList.add('active'); 
}

function closeCodeModalAndPromptRent() {
  document.getElementById('codeModal').classList.remove('active');
  promptRentCapture();
}

function handleJoinFamily() {
  const codeInput = document.getElementById('joinFamCode').value;
  if (!codeInput) { document.getElementById('auth-error-box').classList.remove('hidden'); return; }

  // SIMULATING 2FA OTP REQUEST
  const btn = document.getElementById('authBtnSubmit');
  
  if (btn.innerText.includes("Request OTP")) {
    document.getElementById('otp-section').classList.remove('hidden');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Validate OTP';
    btn.classList.replace('btn-primary', 'btn-success');
    
    let t = 120;
    const timInterval = setInterval(()=>{
      t--;
      document.getElementById('otpTimer').innerText = `0${Math.floor(t/60)}:${t%60<10?'0':''}${t%60}`;
      if(t===0) clearInterval(timInterval);
    }, 1000);
  } else {
    familyState.currentUser = document.getElementById('joinUserName').value || "User";
    familyState.role = document.getElementById('joinRoleType').value;
    promptRentCapture();
  }
}

function promptRentCapture() {
  document.getElementById('auth-screen').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('rentModal').classList.add('active');
  }, 400);
}

function submitRentAndEnter() {
  const rntVal = document.getElementById('monthlyRentInput').value;
  if(rntVal) familyState.monthlyRent = parseInt(rntVal);
  
  document.getElementById('rentModal').classList.remove('active');
  document.getElementById('main-app').classList.remove('hidden');

  document.getElementById('displayUserName').innerText = familyState.currentUser;
  document.getElementById('displayFamilyName').innerText = `${familyState.familyName} (${familyState.role})`;
  document.getElementById('dashIncomeOutput').innerText = `₹ ${familyState.totalIncome.toLocaleString('en-IN')}`;
  document.getElementById('dashRentOutput').innerText = `₹ ${familyState.monthlyRent.toLocaleString('en-IN')}`;
  document.getElementById('displayAvatar').src = `https://ui-avatars.com/api/?name=${familyState.currentUser}&background=2563eb&color=fff`;
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  familyState.theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
}

/* ==============================================================
   VOICE ASSISTANT (WEB SPEECH API)
   ============================================================== */
function startVoiceRecognition() {
  const micBtn = document.getElementById('micBtn');
  if(!micBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech API not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.start();

  micBtn.style.background = 'var(--danger)';

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    let amt = transcript.replace(/[^0-9]/g, '');
    if(amt) {
      document.getElementById('expAmt').value = amt;
      document.getElementById('expName').value = "Voice Entry";
      
      const feed = document.getElementById('voiceFeedback');
      feed.innerText = `Recognized: "${transcript}"`;
      feed.style.opacity = 1;

      setTimeout(()=> { feed.style.opacity = 0; }, 4000);
    }
  };

  recognition.onspeechend = function() {
    recognition.stop();
    micBtn.style.background = 'transparent';
  };
}

/* ==============================================================
   REAL-TIME WEBSOCKET MOCK (BroadcastChannel) & APPROVAL LOGIC
   ============================================================== */
function sendRealtimeMessage() {
  const el = document.getElementById('liveChatInput');
  const txt = el.value.trim();
  if(!txt) return;

  const msgObj = {
    sender: familyState.currentUser,
    role: familyState.role,
    text: txt,
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  };

  socketSimulation.postMessage({ type: 'NEW_CHAT', payload: msgObj });
  renderChatMessage(msgObj, true);
  el.value = '';
}

function renderChatMessage(msg, isSelf = false) {
  const box = document.getElementById('live-chat-box');
  const side = isSelf ? 'user' : 'bot';
  const color = isSelf ? 'var(--primary)' : '#f59e0b';

  const html = `
    <div class="message ${side}" style="align-self:${isSelf ? 'flex-end' : 'flex-start'}; flex-direction:${isSelf ? 'row-reverse' : 'row'};">
      <div class="msg-avatar" style="background:${color}"><i class="fa-solid fa-user"></i></div>
      <div class="msg-bubble" style="background:${isSelf ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}; border:1px solid var(--glass-border); border-top-${isSelf?'right':'left'}-radius:0;">
        <strong style="color:${isSelf ? '#fff' : 'var(--text-muted)'}; font-size:0.8rem;">${msg.sender} (${msg.role})</strong>
        <p style="color:${isSelf ? '#fff' : 'var(--text-main)'};">${msg.text}</p>
        <small style="color:${isSelf ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'}; font-size:0.7rem; display:block; margin-top:5px; text-align:right;">${msg.time}</small>
      </div>
    </div>
  `;
  box.innerHTML += html;
  box.scrollTop = box.scrollHeight;
  if(!isSelf) document.getElementById('unreadBadge').style.display = 'inline-block';
}

function logExpenseToDB() {
  const amt = document.getElementById('expAmt').value;
  if(amt > 10000) {
    const id = "exp_" + Date.now();
    const payload = { id, amount: amt, sender: familyState.currentUser };
    createApprovalCard(payload);
    socketSimulation.postMessage({ type: 'NEW_EXPENSE_ALERT', payload });
    alert("Expense exceeds ₹10,000 threshold. Status set to Pending. Admin notified.");
  } else {
    alert("Expense automatically approved and logged to database.");
  }
  document.getElementById('expAmt').value = '';
}

function createApprovalCard(payload) {
  const c = document.getElementById('approvalsContainer');
  c.innerHTML += `
    <div class="bill-item" id="${payload.id}" style="flex-direction:column; align-items:flex-start; gap:1rem; padding:1rem; margin-top:1rem;">
      <div style="display:flex; gap:1rem; width:100%;">
        <div class="bill-icon" style="background:#ec489944; color:#f472b6"><i class="fa-solid fa-money-bill"></i></div>
        <div>
          <h4>Requested by: ${payload.sender}</h4>
          <p>Status: <strong class="text-danger" id="status_${payload.id}">Pending</strong></p>
          <h3 class="mt-2 text-danger">₹ ${payload.amount}</h3>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem; width:100%;" id="btnGroup_${payload.id}">
        <button class="btn btn-outline" style="flex:1;" onclick="handleApproval('${payload.id}', 'Rejected')">Reject</button>
        <button class="btn btn-success" style="flex:1;" onclick="handleApproval('${payload.id}', 'Approved')"><i class="fa-solid fa-check"></i> Approve</button>
      </div>
    </div>
  `;
}

function handleApproval(id, result) {
  handleRemoteApproval({id, result});
  socketSimulation.postMessage({ type: 'EXPENSE_APPROVED', payload: {id, result} });
}

function handleRemoteApproval(payload) {
  const statText = document.getElementById(`status_${payload.id}`);
  const btnGroup = document.getElementById(`btnGroup_${payload.id}`);
  if(statText && btnGroup) {
    statText.innerText = payload.result;
    statText.className = payload.result === 'Approved' ? 'text-success' : 'text-muted';
    btnGroup.style.display = 'none'; 
  }
}

/* ==============================================================
   DYNAMIC CALENDAR IMPLEMENTATION
   ============================================================== */
function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  calendarObject = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [
      { title: 'Electricity Bill', start: new Date().toISOString().split('T')[0], color: '#ef4444' }, // Today
      { title: 'Rent Due', start: '2026-05-01', color: '#f59e0b' },
      { title: 'Salary (Working)', start: '2026-04-20', color: '#10b981' }
    ]
  });
  calendarObject.render();
}

/* ==============================================================
   DYNAMIC CHATBOT & UPI TRACKING
   ============================================================== */
function handleBotQuery() {
  const inputEl = document.getElementById('botInput');
  const txt = inputEl.value.trim().toLowerCase();
  if(!txt) return;

  const box = document.getElementById('bot-chat-box');
  box.innerHTML += `
    <div class="message user">
      <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
      <div class="msg-bubble"><p>${txt}</p></div>
    </div>
  `;
  inputEl.value = '';
  box.scrollTop = box.scrollHeight;

  // Context-based responses avoiding static repeats
  let reply = "I'm not sure about that specific data query. Try asking about 'spending this month' or 'who spent the most'.";
  
  if(txt.includes('how much') || txt.includes('this month') || txt.includes('spending')) {
    reply = `Based on the database, you have spent ₹${familyState.monthlyRent + 1200} so far this month mostly on Rent and Groceries.`;
  } else if (txt.includes('who spent')) {
    reply = `Admin has logged 75% of transactions this cycle, while 'Roommate' has zero approved transactions.`;
  }

  setTimeout(() => {
    box.innerHTML += `
      <div class="message bot">
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble"><p>${reply}</p></div>
      </div>
    `;
    box.scrollTop = box.scrollHeight;
  }, 1000);
}

function trackPaymentSuccess(linkRef) {
  const trackingText = linkRef.nextElementSibling;
  trackingText.style.display = 'block';
  trackingText.innerText = "Tracking UPI Redirect...";
  
  setTimeout(()=> {
    trackingText.innerText = "Payment status marked as Successful via external handler!";
    trackingText.style.color = "var(--success)";
  }, 3000);
}
