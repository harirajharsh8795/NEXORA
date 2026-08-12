import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/layout/Logo';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@nexora.ai');
  const [password, setPassword] = useState('demo123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-nexora-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-md w-full p-8 border-electric-500/20">
        <div className="flex flex-col items-center mb-8">
          <Logo variant="full" />
          <h1 className="text-xl font-bold text-white mt-6">Welcome Back</h1>
          <p className="text-xs text-nexora-400 mt-1">Sign in to your NEXORA Product Intelligence console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-nexora-400 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-nexora-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-nexora-900 border border-nexora-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-nexora-400 font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-electric-400 hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-nexora-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-nexora-900 border border-nexora-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all flex items-center justify-center gap-2 mt-2"
          >
            Sign In to Console <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-nexora-400">
          Don't have an account? <Link to="/signup" className="text-electric-400 hover:underline font-medium">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
}
