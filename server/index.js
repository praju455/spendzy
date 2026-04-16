const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with client URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory business state (mock database)
let familyData = {
  familyCode: "SPEND123",
  familyName: "The Sharma Household",
  income: 150000,
  rent: 25000,
  members: [],
  expenses: [],
  messages: [
    { sender: "Roommate", text: "I just bought ₹2000 of groceries. Logging it in the system.", time: "11:42 AM", role: "Roommate" }
  ],
  calendarEvents: [
    { id: '1', title: 'Electricity Bill', start: new Date().toISOString().split('T')[0], color: '#ef4444' },
    { id: '2', title: 'Rent Due', start: '2026-05-01', color: '#f59e0b' },
  ],
  subscriptions: [
    { id: 's1', name: 'Netflix', cost: 499, status: 'Expiring Soon', color: '#E50914', icon: 'Play' },
    { id: 's2', name: 'Amazon Prime', cost: 299, status: 'On going', color: '#00A8E1', icon: 'Store' },
    { id: 's3', name: 'Spotify', cost: 119, status: 'Expired Plan', color: '#1DB954', icon: 'Music' }
  ],
  bills: [
    { id: 'b1', name: 'Electricity Bill', amount: 2000, dueDate: 'Tomorrow', status: 'overdue' }
  ]
};

// Real-time communication via Socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send initial data to the client
  socket.emit('init_data', familyData);

  socket.on('send_message', (msg) => {
    const messageObj = {
      ...msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    familyData.messages.push(messageObj);
    io.emit('new_message', messageObj);
  });

  socket.on('log_expense', (expense) => {
    const expenseObj = {
      ...expense,
      id: "exp_" + Date.now(),
      timestamp: new Date().toISOString()
    };
    
    if (expenseObj.amount > 10000) {
      expenseObj.status = "Pending";
      io.emit('new_approval_request', expenseObj);
    } else {
      expenseObj.status = "Approved";
      familyData.expenses.push(expenseObj);
      io.emit('expense_added', expenseObj);
    }
  });

  socket.on('update_expense_status', ({ id, status }) => {
    const expense = familyData.expenses.find(e => e.id === id);
    if (expense) {
      expense.status = status;
    }
    // Broadcast the result to update all connected clients' UIs
    io.emit('approval_result', { id, result: status });
  });

  // Pay Bill Realtime Update
  socket.on('pay_bill', (billId) => {
    familyData.bills = familyData.bills.filter(b => b.id !== billId);
    // Broadcast updated bills
    io.emit('update_bills', familyData.bills);
    io.emit('new_message', {
        sender: "System",
        role: "Bot",
        text: `A bill payment was successfully completed via UPI!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // AI Context Resolver
  socket.on('ai_query', (text) => {
    const txt = text.toLowerCase();
    let reply = "I'm not sure about that specific data query. Try asking about 'spending this month' or 'who spent the most'.";
    
    const rent = familyData.rent;
    const totalExp = familyData.expenses.reduce((acc, curr) => acc + curr.amount, rent);

    if(txt.includes('how much') || txt.includes('this month') || txt.includes('spending')) {
      reply = `Based on the real-time database, your household has spent ₹${totalExp.toLocaleString('en-IN')} so far this month mostly on Rent and Groceries.`;
    } else if (txt.includes('who spent')) {
      reply = `Admins have logged the vast majority of transactions this cycle, while 'Roommate' has zero approved transactions.`;
    }

    // Delay response slightly to simulate AI processing
    setTimeout(() => {
        socket.emit('ai_response', { sender: 'bot', text: reply });
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
