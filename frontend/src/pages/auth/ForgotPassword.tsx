import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/layout/Logo';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-nexora-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-md w-full p-8 border-electric-500/20">
        <div className="flex flex-col items-center mb-6">
          <Logo variant="full" />
          <h1 className="text-xl font-bold text-white mt-6">Reset Password</h1>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-sm text-nexora-300">If an account exists with that email, we've sent reset instructions.</p>
            <Link to="/login" className="inline-block text-xs text-electric-400 hover:underline font-medium">Return to Login</Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <p className="text-xs text-nexora-400">Enter your email and we'll send a link to reset your password.</p>
            <div>
              <label className="text-xs text-nexora-400 font-medium block mb-1">Email Address</label>
              <input type="email" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none" required placeholder="demo@nexora.ai" />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all flex items-center justify-center gap-2">
              Send Reset Link <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center text-xs">
              <Link to="/login" className="text-nexora-400 hover:text-white">Back to Login</Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
