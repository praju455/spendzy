const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

  // True Generative LLM Context Resolver
  socket.on('ai_query', async (text) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY NOT SET');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are Spendzy, an intelligent, helpful, and concise family finance assistant chatbot.
        You have direct access to the household's live financial data.
        Analyze this exact real-time state database to answer the user's query playfully but accurately.
        If they ask for something not present, tell them you don't know based on current data.
        Keep your response brief, friendly, and formatted nicely.
        
        Live Family JSON Database:
        ${JSON.stringify(familyData)}

        User's Query: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      socket.emit('ai_response', { sender: 'bot', text: reply });
      
    } catch (error) {
      console.error(error);
      const fallbackMsg = error.message.includes('GEMINI_API_KEY') 
        ? "Please set your GEMINI_API_KEY in the /server/.env file so I can access my true LLM brain!" 
        : "Sorry, I encountered an error connecting to the AI brain.";
      socket.emit('ai_response', { sender: 'bot', text: fallbackMsg });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
