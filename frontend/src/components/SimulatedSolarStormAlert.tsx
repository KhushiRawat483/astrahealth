import React, { useState } from 'react';
import { Flame, ShieldAlert, X, AlertTriangle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { api } from '../api';

interface SimulatedSolarStormAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onLoggedSpike: () => void;
}

export const SimulatedSolarStormAlert: React.FC<SimulatedSolarStormAlertProps> = ({
  isOpen,
  onClose,
  onLoggedSpike
}) => {
  const [loggingSpike, setLoggingSpike] = useState(false);
  const [shelterMoved, setShelterMoved] = useState(false);
  const [waterWallSealed, setWaterWallSealed] = useState(false);
  const [dosimeterActive, setDosimeterActive] = useState(false);

  if (!isOpen) return null;

  const handleSimulateRadiationSpike = async () => {
    setLoggingSpike(true);
    try {
      await api.logRadiationReading({
        dosimeter_type: 'Active TRD Dosimeter',
        date: new Date().toISOString().split('T')[0],
        mission_day: 77,
        daily_dose_mgy: 1.45,
        dose_rate_microgy_hr: 62.4,
        location: 'Sleep Quarters Storm Shelter',
        solar_event_level: 'Solar Particle Event (SPE Class C4.2 / High Proton Flux)',
        notes: 'Simulated Solar Storm demo event. High-energy coronal mass ejection proton stream intercepted.'
      });
      onLoggedSpike();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingSpike(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0B1C32] border-2 border-rose-500 rounded-2xl w-full max-w-xl p-6 shadow-glowCritical relative overflow-hidden animate-pulseSlow">
        {/* Glowing emergency flare banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 animate-pulse"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Flame className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white">
                CRITICAL WARNING
              </span>
              <span className="text-xs text-rose-400 font-mono">CODE: SPE-2026-NOV</span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-0.5">
              Simulated Solar Particle Event (SPE) Active
            </h3>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-gray-300 space-y-2">
          <p className="leading-relaxed">
            Coronal Mass Ejection detected by Deep Space Solar Observatory. Proton flux exceeding <strong>100 MeV threshold</strong>. Radiation dose rate elevated to <strong>62.4 µGy/h</strong>.
          </p>
          <div className="text-[11px] text-amber-300 font-mono">
            ESTIMATED EVENT DURATION: <strong>4.8 Hours</strong> • ALL EXTERNAL EVA CANCELLED
          </div>
        </div>

        {/* Emergency Checklist */}
        <div className="my-4 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Mandatory Radiation Shelter Protocol:
          </div>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F] cursor-pointer hover:bg-[#142B46]">
            <input
              type="checkbox"
              checked={shelterMoved}
              onChange={(e) => setShelterMoved(e.target.checked)}
              className="rounded bg-[#071426] border-gray-600 text-cyan-500 focus:ring-0 w-4 h-4"
            />
            <span className="text-xs text-white">
              Relocate astronaut immediately to Central Habitat Storm Shelter
            </span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F] cursor-pointer hover:bg-[#142B46]">
            <input
              type="checkbox"
              checked={waterWallSealed}
              onChange={(e) => setWaterWallSealed(e.target.checked)}
              className="rounded bg-[#071426] border-gray-600 text-cyan-500 focus:ring-0 w-4 h-4"
            />
            <span className="text-xs text-white">
              Verify Hydrogen-rich potable water wall bladders locked around bunk
            </span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F] cursor-pointer hover:bg-[#142B46]">
            <input
              type="checkbox"
              checked={dosimeterActive}
              onChange={(e) => setDosimeterActive(e.target.checked)}
              className="rounded bg-[#071426] border-gray-600 text-cyan-500 focus:ring-0 w-4 h-4"
            />
            <span className="text-xs text-white">
              Switch Crew Personal Dosimeter (CPD) to continuous high-sampling mode
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            onClick={handleSimulateRadiationSpike}
            disabled={loggingSpike}
            className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs font-mono transition-all text-center shadow-glowCritical disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>
              {loggingSpike ? 'Logging Influx Telemetry...' : 'Inject Simulated Spike to Database'}
            </span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-lg bg-[#142B46] hover:bg-[#1A3759] text-white text-xs font-mono transition-colors text-center"
          >
            Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};
