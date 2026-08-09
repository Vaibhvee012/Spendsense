import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import {
  RiWallet3Line,
  RiPieChartLine,
  RiFlagLine,
  RiSafe2Line,
  RiArrowRightLine,
  RiAddLine,
  RiSubtractLine,
  RiHomeLine,
  RiSparklingLine,
  RiSettings3Line,
  RiQuestionLine,
} from 'react-icons/ri';

const features = [
  { icon: RiWallet3Line, title: 'Track Expenses', desc: 'Record and categorize every transaction.' },
  { icon: RiPieChartLine, title: 'Smart Analytics', desc: 'See exactly where your money goes.' },
  { icon: RiFlagLine, title: 'Set Budgets', desc: 'Create limits and stay on track.' },
  { icon: RiSafe2Line, title: 'Savings Goals', desc: 'Set goals and watch your progress grow.' },
];

const steps = [
  { num: '01', title: 'Add your income & expenses', desc: 'Keep all your transactions organized.' },
  { num: '02', title: 'Set your budgets', desc: 'Create spending limits for different categories.' },
  { num: '03', title: 'Track your progress', desc: 'Understand your habits through simple analytics.' },
  { num: '04', title: 'Save smarter', desc: 'Use insights to make better financial decisions.' },
];

const faqs = [
  { q: 'What is SpendSense?', a: 'A simple platform to track, manage, and understand your finances.' },
  { q: 'Can I track my expenses?', a: 'Yes, you can add and categorize your daily transactions.' },
  { q: 'Can I create budgets?', a: 'Yes, you can set budgets for different spending categories.' },
  { q: 'Can I track savings goals?', a: 'Yes, create goals and monitor your progress over time.' },
  { q: 'Is my financial data secure?', a: 'Your account is protected with secure authentication and user-specific data access.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FaqItem = ({ q, a, open, onClick }) => (
  <div className="border-b border-border py-5">
    <button onClick={onClick} className="w-full flex justify-between items-center text-left">
      <span className="font-display font-medium text-text">{q}</span>
      {open ? <RiSubtractLine className="text-accent flex-shrink-0" /> : <RiAddLine className="text-text-muted flex-shrink-0" />}
    </button>
    {open && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.25 }}
        className="text-text-muted text-sm mt-3 max-w-2xl overflow-hidden"
      >
        {a}
      </motion.p>
    )}
  </div>
);

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
        <img src={logo} alt="SpendSense" className="w-8 h-8 rounded-lg object-cover" />          <span className="font-display font-semibold">SpendSense</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <a href="#home" className="flex items-center gap-1.5 hover:text-text transition">
            <RiHomeLine size={14} /> Home
          </a>
          <a href="#features" className="hover:text-text transition">Features</a>
          <a href="#how" className="hover:text-text transition">How it works</a>
          <a href="#faq" className="hover:text-text transition">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-text-muted hover:text-text transition">Log in</Link>
          <Link
            to="/signup"
            className="border border-accent text-accent text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent hover:text-bg transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Home / Hero */}
      <div id="home" className="relative max-w-6xl mx-auto px-8 pt-12 pb-28 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-100px', left: '30%' }}
        />

        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="font-display text-4xl md:text-[3.2rem] font-semibold leading-[1.1] mb-5">
            Take control of<br />your <span className="text-accent">money</span>.
          </h1>

          <p className="text-text-muted text-base mb-8 max-w-sm">
            Track expenses, manage budgets, and understand your spending — all in one simple dashboard.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-accent hover:brightness-110 text-bg font-semibold px-6 py-3 rounded-lg transition"
          >
            Start Managing <RiArrowRightLine />
          </Link>
        </motion.div>

        <motion.div
          className="relative h-[400px] hidden md:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="absolute top-2 left-0 w-52 bg-accent-2/90 rounded-2xl p-5 shadow-2xl animate-float">
            <p className="text-bg/70 text-xs mb-1">Total Expenses</p>
            <p className="font-mono text-2xl font-bold text-bg">₹12,200</p>
            <p className="text-bg/70 text-xs mt-1">This month</p>
          </div>

          <div className="absolute top-40 left-16 w-56 bg-accent/90 rounded-2xl p-5 shadow-2xl animate-float-delayed">
            <p className="text-bg/70 text-xs mb-1">Total Revenue</p>
            <p className="font-mono text-2xl font-bold text-bg">₹68,675</p>
            <p className="text-bg/70 text-xs mt-1">This month</p>
          </div>

          <div className="absolute top-4 right-0 w-64 bg-surface border border-border rounded-2xl p-5 shadow-2xl animate-float">
            <p className="text-text text-sm font-medium mb-3">Analytics</p>
            <div className="flex items-end gap-2 h-20">
              {[40, 65, 30, 80, 50, 90, 45].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-accent/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 right-4 w-64 bg-surface border border-border rounded-2xl p-5 shadow-2xl animate-float-delayed">
            <p className="text-text text-sm font-medium mb-3">Latest Transactions</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-xs">Salary · Oct</span>
              <span className="text-accent text-xs font-mono">+₹9,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs">Electric Bill</span>
              <span className="text-text text-xs font-mono">−₹1,420</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-8 py-20 border-t border-border">
        <div className="flex items-center gap-2 mb-10">
          <RiSparklingLine className="text-accent" size={20} />
          <h2 className="font-display text-2xl font-semibold">Everything you need to manage your money.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/40 hover:-translate-y-1 transition"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <f.icon size={22} className="text-accent mb-4" />
              <h3 className="font-display font-medium text-text mb-1.5">{f.title}</h3>
              <p className="text-text-muted text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how" className="max-w-6xl mx-auto px-8 py-20 border-t border-border">
        <div className="flex items-center gap-2 mb-10">
          <RiSettings3Line className="text-accent" size={20} />
          <h2 className="font-display text-2xl font-semibold">Simple. Smart. SpendSense.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <p className="font-mono text-accent/40 text-3xl font-bold mb-3">{s.num}</p>
              <h3 className="font-display font-medium text-text mb-1.5">{s.title}</h3>
              <p className="text-text-muted text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" className="max-w-3xl mx-auto px-8 py-20 border-t border-border">
        <div className="flex items-center gap-2 mb-6">
          <RiQuestionLine className="text-accent" size={20} />
          <h2 className="font-display text-2xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <div>
          {faqs.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <div className="relative bg-surface border border-border rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute w-80 h-80 bg-accent/15 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <h2 className="font-display text-2xl font-semibold mb-3 relative">Start managing, for free.</h2>
          <p className="text-text-muted mb-6 relative">No credit card. Just you and your money, finally making sense.</p>
          <Link
            to="/signup"
            className="relative inline-flex items-center gap-2 bg-accent hover:brightness-110 text-bg font-semibold px-6 py-3 rounded-lg transition"
          >
            Start Managing <RiArrowRightLine />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;