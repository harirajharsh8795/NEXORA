import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/layout/Logo';
import { ArrowRight } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-nexora-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-md w-full p-8 border-electric-500/20">
        <div className="flex flex-col items-center mb-8">
          <Logo variant="full" />
          <h1 className="text-xl font-bold text-white mt-6">Create an Account</h1>
          <p className="text-xs text-nexora-400 mt-1">Get started with NEXORA Product Intelligence</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4">
          <div>
            <label className="text-xs text-nexora-400 font-medium block mb-1">Full Name</label>
            <input type="text" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none" required placeholder="John Smith" />
          </div>
          <div>
            <label className="text-xs text-nexora-400 font-medium block mb-1">Work Email</label>
            <input type="email" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none" required placeholder="john@company.com" />
          </div>
          <div>
            <label className="text-xs text-nexora-400 font-medium block mb-1">Password</label>
            <input type="password" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-electric-500 focus:outline-none" required placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-electric-500 to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 transition-all flex items-center justify-center gap-2 mt-2">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-nexora-400">
          Already have an account? <Link to="/login" className="text-electric-400 hover:underline font-medium">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
