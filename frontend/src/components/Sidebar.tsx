import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Bone,
  Zap,
  Cpu,
  ShieldCheck,
  FileText,
  User,
  Info,
  Radio,
  Orbit
} from 'lucide-react';

interface SidebarProps {
  onOpenAbout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAbout, isOpenMobile, onCloseMobile }) => {
  const navItems = [
    { to: '/', label: 'Mission Overview', icon: Activity },
    { to: '/bone-muscle', label: 'Bone & Muscle Health', icon: Bone },
    { to: '/radiation', label: 'Space Radiation', icon: Zap },
    { to: '/ai-insights', label: 'AI Health Insights', icon: Cpu, badge: 'PROTOTYPE' },
    { to: '/preventive-care', label: 'Preventive Care', icon: ShieldCheck },
    { to: '/reports', label: 'Health Reports & PDF', icon: FileText },
    { to: '/profile', label: 'Astronaut Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B1C32] border-r border-[#1E3A5F] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="p-5 border-b border-[#1E3A5F]/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-glowCyan">
                <Orbit className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '18s' }} />
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
                  ASTRA<span className="text-cyan-400">HEALTH</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-[#8FA8C3] font-mono">
                  CREW BIO-INTEL v2.4
                </p>
              </div>
            </div>
          </div>

          {/* Mission Tag */}
          <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-[#10243D]/90 border border-cyan-500/20">
            <div className="flex items-center justify-between text-xs font-mono text-[#8FA8C3]">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Radio className="w-3 h-3 animate-pulse" /> AURORA-1
              </span>
              <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                TELEMETRY LIVE
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400">Mission Progress:</span>
              <span className="font-bold text-white font-mono">Day 76 / 180</span>
            </div>
            <div className="w-full bg-[#071426] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                style={{ width: `${(76 / 180) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border-l-4 border-cyan-400 font-semibold shadow-inner'
                        : 'text-[#8FA8C3] hover:text-white hover:bg-[#10243D]/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1E3A5F]/80 space-y-2">
          {/* About Project Button */}
          <button
            onClick={onOpenAbout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono rounded-lg bg-[#142B46] hover:bg-[#1A3759] text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>NASA Space Apps 2026</span>
          </button>

          <div className="pt-2 text-center text-[10px] text-gray-500 font-mono">
            CONFIDENTIAL • NASA DEMO ONLY
          </div>
        </div>
      </aside>
    </>
  );
};
