import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Heart,
  Activity,
  PhoneCall,
  Calendar,
  Award,
  Radio,
  Clock,
  Dumbbell,
  Bone,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../api';
import { Astronaut } from '../types';

export const AstronautProfile: React.FC = () => {
  const [astronaut, setAstronaut] = useState<Astronaut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getAstronaut();
        setAstronaut(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading || !astronaut) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl border-2 border-cyan-400 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 animate-pulse">
          LOADING ASTRONAUT MEDICAL DOSSIER...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-glowCyan border-2 border-cyan-400/40">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {astronaut.astronaut_id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ACTIVE ON-DUTY
                </span>
              </div>
              <h1 className="text-2xl font-black text-white">{astronaut.name}</h1>
              <p className="text-xs text-[#8FA8C3] font-mono mt-0.5">
                Mission Commander • Deep Space Exploration Expedition {astronaut.mission_name}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
              <div className="text-[10px] text-gray-400">Current Progress</div>
              <div className="text-cyan-400 font-bold text-sm mt-0.5">
                Day {astronaut.current_mission_day} of {astronaut.mission_duration}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
              <div className="text-[10px] text-gray-400">Flight Status</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">NOMINAL (FIT)</div>
            </div>
          </div>
        </div>
      </div>

      {/* BIOMETRICS & PRE-FLIGHT BASELINE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Age / Physical Stats</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {astronaut.age} yrs • {astronaut.height_cm} cm
          </div>
          <div className="mt-1 text-[11px] text-cyan-300 font-mono">
            Weight: {astronaut.weight_kg} kg (Microgravity Calibrated)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Blood Group & Type</div>
          <div className="text-xl font-bold text-white font-mono mt-1">{astronaut.blood_group}</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Autologous sample banked JSC</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Pre-flight BMD T-Score</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
            +{astronaut.baseline_bmd_t_score} T-Score
          </div>
          <div className="mt-1 text-[11px] text-gray-400 font-mono">High initial bone density</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Cardiovascular Baseline</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {astronaut.resting_heart_rate} bpm (RHR)
          </div>
          <div className="mt-1 text-[11px] text-purple-300 font-mono">
            VO2 Max: {astronaut.vo2_max} ml/kg/min
          </div>
        </div>
      </div>

      {/* MEDICAL MONITORING & CLINICAL CONTACTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medical Contacts */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            <span>Flight Medicine Clinical Directives & Personnel</span>
          </h3>

          <div className="p-4 rounded-xl bg-[#0B1C32] border border-[#1E3A5F] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-mono">Lead Flight Surgeon:</span>
              <span className="text-white font-bold">{astronaut.lead_flight_surgeon}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-mono">Emergency Channel:</span>
              <span className="text-cyan-400 font-mono font-semibold">{astronaut.flight_surgeon_contact}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-mono">Onboard Medical Officer:</span>
              <span className="text-white font-bold">{astronaut.onboard_medical_officer}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 font-mono leading-relaxed">
            <strong>Private Medical Conference (PMC):</strong> Scheduled every 7 days via encrypted SATCOM CH-04. Astronaut retains right to request off-nominal consultation anytime.
          </div>
        </div>

        {/* Space Mission Training History */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Astronaut Flight & Medical Qualifications</span>
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#0B1C32] border border-[#1E3A5F] flex items-center justify-between">
              <div>
                <strong className="text-white block">NASA Class XXI Astronaut Candidate</strong>
                <span className="text-gray-400 text-[10px]">Johnson Space Center, Houston TX</span>
              </div>
              <span className="text-emerald-400 text-[11px] font-bold">CERTIFIED</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1C32] border border-[#1E3A5F] flex items-center justify-between">
              <div>
                <strong className="text-white block">ARED Advanced Resistive Biomechanics</strong>
                <span className="text-gray-400 text-[10px]">Neutral Buoyancy Laboratory (NBL)</span>
              </div>
              <span className="text-emerald-400 text-[11px] font-bold">PROFICIENT</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1C32] border border-[#1E3A5F] flex items-center justify-between">
              <div>
                <strong className="text-white block">Deep Space Radiation Storm Shelter Ops</strong>
                <span className="text-gray-400 text-[10px]">Space Radiation Analysis Group (SRAG)</span>
              </div>
              <span className="text-emerald-400 text-[11px] font-bold">QUALIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
