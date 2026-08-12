import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  {
    label: 'Platform',
    href: '/platform',
    children: [
      { label: 'Product Intelligence', href: '/product-intelligence', desc: 'AI-powered product understanding' },
      { label: 'Data Quality', href: '/data-quality', desc: 'Quality scoring & monitoring' },
      { label: 'AI Enrichment', href: '/enrichment', desc: 'Automated attribute enrichment' },
      { label: 'Integrations', href: '/integrations', desc: 'Connect your systems' },
    ],
  },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/resources',
    children: [
      { label: 'Blog', href: '/blog', desc: 'Latest insights & articles' },
      { label: 'Case Studies', href: '/case-studies', desc: 'Success stories' },
      { label: 'FAQ', href: '/faq', desc: 'Common questions' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-nexora-900/90 backdrop-blur-xl border-b border-white/[0.06] shadow-md'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="app-container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Logo variant="full" />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === link.href || location.pathname.startsWith(link.href + '/')
                        ? 'text-white'
                        : 'text-nexora-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-64 py-2 rounded-xl bg-nexora-850 border border-white/[0.08] shadow-2xl shadow-black/40"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="flex flex-col px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                          >
                            <span className="text-sm font-medium text-white">{child.label}</span>
                            <span className="text-xs text-nexora-400 mt-0.5">{child.desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-nexora-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Toggle light/dark theme"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
              </button>
              <Link
                to="/login"
                className="text-sm font-medium text-nexora-300 hover:text-white transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/demo"
                className="text-sm font-medium text-nexora-200 hover:text-white border border-nexora-600 hover:border-nexora-400 rounded-lg px-4 py-2 transition-all"
              >
                Request Demo
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-white bg-gradient-to-r from-electric-500 to-violet-500 hover:from-electric-400 hover:to-violet-400 rounded-lg px-4 py-2 transition-all shadow-lg shadow-electric-500/20 hover:shadow-electric-500/30 flex items-center gap-1.5"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-nexora-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-nexora-900 border-l border-white/[0.06] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <Logo variant="compact" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-nexora-400 hover:text-white hover:bg-white/[0.06]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      to={link.href}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-nexora-200 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-3 py-2 text-sm text-nexora-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/[0.06] space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center text-sm font-medium text-nexora-200 border border-nexora-600 rounded-lg px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="block w-full text-center text-sm font-medium text-white bg-gradient-to-r from-electric-500 to-violet-500 rounded-lg px-4 py-2.5"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
