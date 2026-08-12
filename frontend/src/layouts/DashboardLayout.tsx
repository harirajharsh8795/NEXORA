import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, BarChart3, Sparkles, ShieldCheck, FileSearch,
  Users, Bot, Layers, TrendingUp, Download, Settings, Menu, X,
  ChevronLeft, Search, Bell, Sun, Moon,
} from 'lucide-react';
import Logo from '../components/layout/Logo';
import SearchCommand from '../components/common/SearchCommand';
import { useTheme } from '../context/ThemeContext';

const sidebarLinks = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Data Quality', href: '/dashboard/data-quality', icon: BarChart3 },
  { label: 'Enrichment', href: '/dashboard/enrichment', icon: Sparkles },
  { label: 'Validation', href: '/dashboard/validation', icon: ShieldCheck },
  { label: 'Evidence', href: '/evidence', icon: FileSearch },
  { label: 'Categories', href: '/taxonomy', icon: Layers },
  { label: 'Human Review', href: '/review', icon: Users },
  { label: 'Agents', href: '/agents', icon: Bot },
  { label: 'Analytics', href: '/analytics', icon: TrendingUp },
  { label: 'Exports', href: '/exports', icon: Download },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  const SidebarNavContent = () => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              active
                ? 'bg-electric-500/10 text-electric-400 border border-electric-500/20 font-semibold'
                : 'text-nexora-400 hover:text-white hover:bg-white/[0.04]'
            }`}
            title={collapsed ? link.label : undefined}
          >
            <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-electric-400' : 'text-nexora-500 group-hover:text-nexora-300'}`} />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-nexora-950 text-white relative">
      {/* Fixed Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-30 bg-nexora-900 border-r border-white/[0.06] transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-white/[0.06] ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {collapsed ? <Logo variant="icon" /> : <Logo variant="compact" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-md text-nexora-500 hover:text-white hover:bg-white/[0.06] transition-colors ${collapsed ? 'hidden' : ''}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <SidebarNavContent />
        {!collapsed && (
          <div className="p-4 border-t border-white/[0.06]">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs text-nexora-500 hover:text-nexora-300 transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-nexora-900 border-r border-white/[0.06] flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06]">
                <Logo variant="compact" />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-nexora-400 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarNavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Viewport (Padded for Desktop Sidebar) */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${collapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-nexora-950/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-nexora-400 hover:text-white hover:bg-white/[0.06]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="hidden lg:flex p-2 rounded-lg text-nexora-400 hover:text-white hover:bg-white/[0.06]"
                aria-label="Expand sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexora-900 border border-white/[0.06] text-nexora-500 text-sm cursor-pointer hover:border-nexora-500 transition-colors w-64">
              <Search className="w-4 h-4" />
              <span>Search products...</span>
              <kbd className="ml-auto text-xs text-nexora-600 bg-nexora-800 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-nexora-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle light/dark theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button className="relative p-2 rounded-lg text-nexora-400 hover:text-white hover:bg-white/[0.06] transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-electric-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              D
            </div>
          </div>
        </header>

        {/* Inner Main Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </main>
        <SearchCommand />
      </div>
    </div>
  );
}
