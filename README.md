# 💠 Spendzy - Premium Real-time Family Finance

Spendzy is a modernization of a classic family finance tracker into a **real-time, full-stack production-grade platform**. Built for families who need a high-end, visual, and collaborative tool for household budgeting, debt tracking, and goal planning.

---

## ✨ Key Features

### 🏢 Real-time Family Hub
- **Instant Synchronization**: Every expense, chat message, and approval is synced across all family members instantly using **Socket.io**.
- **Smart Approvals**: Transactions over ₹10,000 or requests from secondary members trigger a real-time "Pending Approval" card for the administrator.
- **Family Chat**: A persistent interactive space with glassmorphism design for household discussions.

### 💰 Financial Intelligence
- **Savings Goals**: Track education, vacation, and car savings with real-time HUDs and progress indicators.
- **Decision Simulator**: Analyze the impact of large purchases on your monthly liquidity before you buy.
- **Debt Tracking**: Monitor household liabilities and EMIs in a specialized liabilities dashboard.
- **Historical Trends**: Visual charts Comparing monthly expenditures using **Recharts**.

### 🧠 Modern Experience
- **Premium Aesthetics**: High-end **Glassmorphism** design system with glowing accents and deep-space theme.
- **AI Financial Insights**: A context-aware chatbot powered by **Google Gemini** that analyzes your family's live data.
- **Responsive PWA**: Mobile-first design that is fully installable as a Progressive Web App.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io.
- **Deployment**: Configured for Render (API) and Vercel (Front-end).
- **AI Engine**: Gemini-1.5-Flash via `@google/genai`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Google AI Studio API Key (for the chatbot)

### 2. Installation
```bash
git clone https://github.com/praju455/spendzy.git
cd spendzy
```

### 3. Setup Environment
Create a `.env` file in the `/server` directory:
```env
PORT=5001
GEMINI_API_KEY=YOUR_AI_ZA_SY_KEY
```

### 4. Run Locally
**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` to start tracking!

---

## 🌐 Deployment

This project is pre-configured for one-click deployment:
- **Server**: Connect your repo to **Render**, set root to `server`, build command `npm install`, and start command `npm start`.
- **Client**: Connect to **Vercel**, set root to `client`, and set `VITE_SOCKET_URL` to your Render API URL.

---

## 📄 License
MIT License - Created with 💙 by Antigravity (Advanced Agentic AI).
