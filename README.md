# SpendSense — Personal Finance Intelligence System

Not just an expense tracker. SpendSense tracks your income and expenses, and surfaces real insights like *"Your Food spending increased 23% compared with last month."*

## Features

- 🔐 Authentication (JWT-based signup/login)
- 💰 Income & expense tracking with custom categories
- 📊 Monthly analytics with month-over-month spending insights
- 🎯 Budgets with live progress tracking, scoped per month
- 🔁 Recurring transactions (auto-generated on schedule)
- 🏆 Savings goals with contribution tracking
- 📈 Spending trend and category breakdown charts
- 📤 CSV import & export
- 🎨 Custom dark-themed UI with animations

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS v4, Framer Motion, Recharts, React Icons, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Auth:** JWT, bcrypt

## Project Structure

```
spendsense/
├── client/     # React frontend
└── server/     # Express backend + MongoDB
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/spendsense.git
cd spendsense
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
PORT=5000
```

Run the backend:
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 3. Frontend setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 4. (Optional) Seed sample data
```bash
cd server
node seed.js
```
This creates a test account (`test@example.com` / `123456`) with sample categories and transactions.

## License

MIT