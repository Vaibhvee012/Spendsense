# SpendSense — Personal Finance Intelligence System

Not just an expense tracker. SpendSense tracks your income and expenses, and surfaces real insights like *"Your Food spending increased 23% compared with last month."*

🔗 **Live app:** [https://spendsense-zeta.vercel.app](https://spendsense-zeta.vercel.app)

### Try it out
```
Email:    user2_test@example.com
Password: 123456
```
Log in with the credentials above to explore a pre-populated dashboard, or sign up for your own account.

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request may take 30–50 seconds to wake up — subsequent requests will be fast.

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
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure

```
spendsense/
├── client/     # React frontend
└── server/     # Express backend + MongoDB
```

## Running Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### 1. Clone the repo
```bash
git clone https://github.com/vaibhvee012/spendsense.git
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
```

Create a `.env` file in `client/`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 4. (Optional) Seed sample data
```bash
cd server
node seed.js
```
This creates a test account (`test@example.com` / `123456`) with sample categories and transactions.

## Deployment

- **Frontend:** deployed on [Vercel](https://vercel.com), root directory `client`, with `VITE_API_URL` pointing to the live backend
- **Backend:** deployed on [Render](https://render.com), root directory `server`, with `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` set as environment variables
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), with network access opened to allow connections from Render

## License

MIT