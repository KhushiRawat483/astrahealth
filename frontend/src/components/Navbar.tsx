import React, { useState } from 'react';
import {
  Bell,
  Menu,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  User,
  X,
  ExternalLink,
  Flame
} from 'lucide-react';
import { HealthAlert } from '../types';
import { api } from '../api';

interface NavbarProps {
  onToggleSidebar: () => void;
  alerts: HealthAlert[];
  onAlertUpdated: () => void;
  onTriggerSolarStorm?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  alerts,
  onAlertUpdated,
  onTriggerSolarStorm
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFlightSurgeonModal, setShowFlightSurgeonModal] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const criticalCount = alerts.filter((a) => a.severity === 'RED' && a.status === 'Active').length;

  const handleUpdateStatus = async (alertId: number, newStatus: string) => {
    try {
      await api.updateAlertStatus(alertId, newStatus);
      onAlertUpdated();
    } catch (err) {
      console.error('Failed to update alert', err);
    }
  };

  const getSeverityBadge = (severity: 'GREEN' | 'YELLOW' | 'RED') => {
    switch (severity) {
      case 'RED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <ShieldAlert className="w-3 h-3" /> CRITICAL
          </span>
        );
      case 'YELLOW':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" /> ATTENTION
          </span>
        );
      case 'GREEN':
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> NORMAL
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#0B1C32]/90 backdrop-blur-md border-b border-[#1E3A5F] px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile trigger & Welcome badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-[#10243D] text-[#8FA8C3] hover:text-white lg:hidden border border-[#1E3A5F]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-white tracking-wide">
              AURORA-1 <span className="text-cyan-400 font-mono">MISSION CONTROL</span>
            </h2>
            <p className="text-[11px] text-[#8FA8C3] font-mono">
              STATION: DEEP SPACE TRANSIT • ORBIT REF: L2-LUNAR
            </p>
          </div>
        </div>

        {/* Center / Right: Flight Surgeon hotline & Notification bell & Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Solar Storm Simulation Button */}
          {onTriggerSolarStorm && (
            <button
              onClick={onTriggerSolarStorm}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              title="Trigger a simulated SPE solar particle flare alert for demonstration"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Simulate Solar Flare</span>
            </button>
          )}

          {/* Flight Surgeon Hotline Button */}
          <button
            onClick={() => setShowFlightSurgeonModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#10243D] border border-cyan-500/30 text-cyan-300 hover:bg-[#142B46] transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Flight Surgeon Med-Ops</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg bg-[#10243D] border transition-all ${
                criticalCount > 0
                  ? 'border-rose-500/60 text-rose-400 shadow-glowCritical animate-pulse'
                  : activeAlerts.length > 0
                  ? 'border-amber-500/40 text-amber-300'
                  : 'border-[#1E3A5F] text-[#8FA8C3] hover:text-white'
              }`}
            >
              <Bell className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold text-white ${
                    criticalCount > 0 ? 'bg-rose-600' : 'bg-amber-600'
                  }`}
                >
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl bg-[#0B1C32] border border-[#1E3A5F] shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                <div className="p-3.5 border-b border-[#1E3A5F] flex items-center justify-between bg-[#10243D]">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">
                      Mission Medical Alerts ({activeAlerts.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-[#1E3A5F]/60">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#8FA8C3] font-mono">
                      No active medical telemetry alerts. All bio-indicators optimal.
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3.5 transition-colors ${
                          alert.status === 'Resolved'
                            ? 'bg-[#0B1C32]/50 opacity-60'
                            : alert.severity === 'RED'
                            ? 'bg-rose-950/20 border-l-4 border-rose-500'
                            : alert.severity === 'YELLOW'
                            ? 'bg-amber-950/20 border-l-4 border-amber-500'
                            : 'bg-[#10243D]/40 border-l-4 border-emerald-500'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] text-[#8FA8C3] font-mono">
                            {alert.category} • {alert.timestamp}
                          </span>
                          {getSeverityBadge(alert.severity)}
                        </div>

                        <h4 className="font-semibold text-xs text-white mt-1.5">{alert.title}</h4>
                        <p className="text-[11px] text-[#8FA8C3] mt-1 leading-relaxed">
                          {alert.description}
                        </p>

                        <div className="mt-2 p-2 rounded bg-[#071426] border border-[#1E3A5F]/80 text-[10px] text-cyan-300 font-mono">
                          <span className="text-gray-400 font-bold">Action Directive:</span>{' '}
                          {alert.recommended_action}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-gray-400">
                            Status: <strong className="text-white">{alert.status}</strong>
                          </span>
                          <div className="flex gap-1.5">
                            {alert.status === 'Active' && (
                              <button
                                onClick={() => handleUpdateStatus(alert.id, 'Acknowledged')}
                                className="px-2 py-1 text-[10px] font-mono rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30"
                              >
                                Acknowledge
                              </button>
                            )}
                            {alert.status !== 'Resolved' && (
                              <button
                                onClick={() => handleUpdateStatus(alert.id, 'Resolved')}
                                className="px-2 py-1 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-[#071426] border-t border-[#1E3A5F] text-center">
                  <span className="text-[10px] text-gray-400 font-mono">
                    NASA-STD-3001 Bio-Monitoring Protocol
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Commander Avatar badge */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-[#1E3A5F]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-glowCyan">
              AM
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white">Cmdr. Alex Morgan</div>
              <div className="text-[10px] font-mono text-cyan-400">AST-2026-X88</div>
            </div>
          </div>
        </div>
      </header>

      {/* Flight Surgeon Contact Modal */}
      {showFlightSurgeonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B1C32] border border-cyan-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowFlightSurgeonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ground Flight Surgeon Med-Ops</h3>
                <p className="text-xs text-[#8FA8C3] font-mono">NASA JSC Houston • Flight Medicine Clinic</p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#10243D] border border-[#1E3A5F] flex justify-between">
                <span className="text-gray-400">Lead Flight Surgeon:</span>
                <span className="text-white font-semibold">Dr. Sarah Vance, MD</span>
              </div>
              <div className="p-3 rounded-lg bg-[#10243D] border border-[#1E3A5F] flex justify-between">
                <span className="text-gray-400">Onboard Medical Officer:</span>
                <span className="text-white font-semibold">Dr. Elena Rostov, MD (AURORA-1 CMO)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#10243D] border border-[#1E3A5F] flex justify-between">
                <span className="text-gray-400">Primary Channel:</span>
                <span className="text-cyan-400 font-semibold">SATCOM CH-04 Encrypted Med-Net</span>
              </div>
              <div className="p-3 rounded-lg bg-[#10243D] border border-[#1E3A5F] flex justify-between">
                <span className="text-gray-400">Telemetry Delay:</span>
                <span className="text-emerald-400 font-semibold">1.24s (Lunar Distance)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed">
              <strong>Medical Disclaimer:</strong> AstraHealth is a NASA Space Apps Challenge prototype platform. Escalation procedures connect to simulated mission control medical officers for demonstration.
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  alert('Initiating simulated private medical teleconference (PMC) on SATCOM CH-04...');
                  setShowFlightSurgeonModal(false);
                }}
                className="flex-1 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-colors text-center shadow-glowCyan"
              >
                Establish Voice Med-Link
              </button>
              <button
                onClick={() => setShowFlightSurgeonModal(false)}
                className="px-4 py-2.5 rounded-lg bg-[#142B46] text-white text-xs font-mono hover:bg-[#1A3759]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
