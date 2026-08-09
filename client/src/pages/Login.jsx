import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiShieldCheckLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #7FA396 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          className="absolute w-[550px] h-[550px] bg-accent/15 rounded-full blur-[150px]"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '5%', left: '5%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] bg-accent-2/10 rounded-full blur-[130px]"
          animate={{ x: [0, -20, 0], y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '10%', right: '10%' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md w-full"
        >
          <Link to="/" className="flex items-center gap-2 mb-12 w-fit">
            <img src={logo} alt="SpendSense" className="w-8 h-8 rounded-lg object-cover" />            <span className="text-xl font-display font-semibold text-text">SpendSense</span>
          </Link>

          <h2 className="font-display text-[2.1rem] font-semibold text-text leading-[1.15] mb-4">
            Welcome back to<br />clarity over your <span className="text-accent">money</span>.
          </h2>
          <p className="text-text-muted mb-10">Your budgets, transactions, and insights — right where you left them.</p>

          {/* Floating mini dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-text-muted text-xs">This month</p>
              <span className="flex items-center gap-1 text-accent text-xs font-medium">
                <RiShieldCheckLine size={12} /> Secure
              </span>
            </div>
            <p className="font-mono text-2xl font-semibold text-accent mb-4">₹42,850</p>
            <div className="space-y-2.5">
              {[
                { label: 'Food', pct: 80, color: '#f97316' },
                { label: 'Rent', pct: 55, color: '#a855f7' },
                { label: 'Travel', pct: 35, color: '#3b82f6' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-text-muted">{row.label}</span>
                  <div className="flex-1 h-1.5 bg-surface-light rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: row.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${row.pct}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden w-fit">
            <img src={logo} alt="SpendSense" className="w-8 h-8 rounded-lg object-cover" />            <h1 className="text-xl font-display font-semibold text-text">SpendSense</h1>
          </Link>

          <h2 className="font-display text-[1.7rem] font-semibold text-text mb-1.5">Log in</h2>
          <p className="text-text-muted text-sm mb-8">Log in to see where your money's going.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-5"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-text-muted text-xs font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-light border border-border text-text placeholder-text-muted/60 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-text-muted text-xs font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-light border border-border text-text placeholder-text-muted/60 pl-10 pr-11 py-3 rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition"
                >
                  {showPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:brightness-110 text-bg py-3 rounded-xl font-semibold font-display transition disabled:opacity-60"
            >
              {loading ? 'Logging in...' : (
                <>Log In <RiArrowRightLine size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-text-muted text-sm text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:underline font-medium">Sign up</Link>
          </p>
          <p className="text-text-muted text-xs text-center mt-4">
            <Link to="/" className="hover:text-text transition">← Back to home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;