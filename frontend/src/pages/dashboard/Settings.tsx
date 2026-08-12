import { useState } from 'react';
import { User, Building, Key, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-nexora-400 mt-1">Manage organization preferences, API keys, and validation thresholds</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="glass-card p-3 space-y-1">
          {[
            { id: 'profile', label: 'User Profile', icon: User },
            { id: 'organization', label: 'Organization', icon: Building },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'validation', label: 'Validation Rules', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id ? 'bg-electric-500/10 text-electric-400 border border-electric-500/20' : 'text-nexora-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 glass-card p-6 space-y-6">
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">User Profile</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-nexora-400 block mb-1">Full Name</label>
                  <input type="text" defaultValue="UniHack Reviewer" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg p-2.5 text-sm text-white" />
                </div>
                <div>
                  <label className="text-xs text-nexora-400 block mb-1">Email Address</label>
                  <input type="email" defaultValue="demo@nexora.ai" className="w-full bg-nexora-900 border border-nexora-700 rounded-lg p-2.5 text-sm text-white" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api-keys' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">API Credentials</h3>
              <div className="p-4 bg-nexora-900 rounded-xl border border-white/[0.04] space-y-2">
                <span className="text-xs text-nexora-500 block">Live Production Key</span>
                <code className="text-sm font-mono text-electric-400">nex_live_99f8a7d6e5c4b3a210987654321</code>
              </div>
            </div>
          )}

          {activeSection !== 'profile' && activeSection !== 'api-keys' && (
            <div className="text-sm text-nexora-400">Configuration options for {activeSection} environment settings.</div>
          )}
        </div>
      </div>
    </div>
  );
}
