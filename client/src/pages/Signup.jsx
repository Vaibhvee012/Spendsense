import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiUserLine, RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['Track income & expenses instantly', 'Get insights, not just numbers', 'No credit card required'];

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle, #7FA396 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          className="absolute w-[550px] h-[550px] bg-accent-2/15 rounded-full blur-[150px]"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '0%', right: '0%' }}
        />
        <motion.div
          className="absolute w-[380px] h-[380px] bg-accent/10 rounded-full blur-[120px]"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '8%', left: '8%' }}
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
            Start making your<br /><span className="text-accent">money</span> make sense.
          </h2>
          <p className="text-text-muted mb-10">Free to start. Takes less than a minute to set up.</p>

          <div className="space-y-4">
            {perks.map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <RiCheckLine size={14} className="text-accent" />
                </div>
                <span className="text-text-muted text-sm">{text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-text-muted text-sm italic leading-relaxed">
              "I finally know where my money goes every month — no more guessing."
            </p>
            <p className="text-text-muted/60 text-xs mt-2">— an early SpendSense user</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden w-fit">
          <img src={logo} alt="SpendSense" className="w-8 h-8 rounded-lg object-cover" />            <h1 className="text-xl font-display font-semibold text-text">SpendSense</h1>
          </Link>

          <h2 className="font-display text-[1.7rem] font-semibold text-text mb-1.5">Create an account</h2>
          <p className="text-text-muted text-sm mb-8">Start tracking where your money goes.</p>

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
              <label className="text-text-muted text-xs font-medium mb-1.5 block">Name</label>
              <div className="relative">
                <RiUserLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-light border border-border text-text placeholder-text-muted/60 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                  required
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-light border border-border text-text placeholder-text-muted/60 pl-10 pr-11 py-3 rounded-xl outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                  minLength={6}
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
              {loading ? 'Creating account...' : (
                <>Sign Up <RiArrowRightLine size={16} /></>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-muted text-xs">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-text-muted text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">Log in</Link>
          </p>
          <p className="text-text-muted text-xs text-center mt-4">
            <Link to="/" className="hover:text-text transition">← Back to home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;