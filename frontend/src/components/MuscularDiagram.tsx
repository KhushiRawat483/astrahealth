import React, { useState } from 'react';
import { Activity, Dumbbell, ShieldCheck, Flame } from 'lucide-react';

interface MuscularDiagramProps {
  overallStrengthIndex?: number;
}

export const MuscularDiagram: React.FC<MuscularDiagramProps> = ({
  overallStrengthIndex = 92.2
}) => {
  const [selectedMuscle, setSelectedMuscle] = useState<'quads' | 'hamstrings' | 'calves' | 'back'>('quads');

  const muscleDetails = {
    quads: {
      name: 'Quadriceps Femoris (Rectus Femoris & Vasti)',
      exercise: 'ARED Bilateral Squat',
      peakForce: '2.26 kN',
      resistanceLoad: '140 kg',
      strengthIndex: '92.2%',
      atrophyRisk: 'Low (Well-Preserved)',
      riskColor: 'text-emerald-400',
      description: 'Extensor muscles of the knee bear the majority of gravitational postural loading. ARED heavy squats effectively maintain motor unit recruitment and cross-sectional area.',
      prescribedProtocol: '4 sets x 10 reps @ 140kg with 3-second eccentric tempo.'
    },
    hamstrings: {
      name: 'Hamstrings & Gluteal Complex',
      exercise: 'ARED Romanian Deadlift',
      peakForce: '1.99 kN',
      resistanceLoad: '134 kg',
      strengthIndex: '92.6%',
      atrophyRisk: 'Low (Nominal)',
      riskColor: 'text-emerald-400',
      description: 'Posterior chain stability is vital for zero-gravity EVA ergonomics and counteracting pelvic anteversion.',
      prescribedProtocol: '3 sets x 8 reps @ 135kg with dynamic hinge activation.'
    },
    calves: {
      name: 'Gastrocnemius & Soleus (Plantarflexors)',
      exercise: 'ARED Heel Raise',
      peakForce: '1.49 kN',
      resistanceLoad: '106 kg',
      strengthIndex: '90.3%',
      atrophyRisk: 'Moderate Attention',
      riskColor: 'text-amber-400',
      description: 'The soleus contains a high proportion of slow-twitch Type I fibers which atrophies more rapidly in weightlessness due to lack of tonic calf contractions.',
      prescribedProtocol: '3 sets x 15 explosive calf hops + 10 eccentric drops.'
    },
    back: {
      name: 'Erector Spinae & Latissimus Dorsi',
      exercise: 'ARED Prone Bench Pull',
      peakForce: '1.79 kN',
      resistanceLoad: '93 kg',
      strengthIndex: '96.8%',
      atrophyRisk: 'Minimal (Optimal)',
      riskColor: 'text-cyan-400',
      description: 'Upper back and spinal erectors maintain thoracic stabilization and resist microgravity kyphosis.',
      prescribedProtocol: '4 sets x 12 reps @ 95kg with 2-second isometric peak squeeze.'
    }
  };

  const active = muscleDetails[selectedMuscle];

  return (
    <div className="bg-[#10243D] border border-[#1E3A5F] rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Muscular System & ARED Telemetry (Antigravity Tone)</span>
          </h3>
          <p className="text-[11px] text-[#8FA8C3] font-mono">
            Biomechanical force output & neuromuscular retention mapping
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
          ARED LOAD SENSORS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Muscular SVG Graphic */}
        <div className="md:col-span-5 flex justify-center relative py-2 bg-[#071426]/70 rounded-xl border border-[#1E3A5F]/70 p-4">
          <svg
            viewBox="0 0 200 420"
            className="w-44 h-80 drop-shadow-[0_0_15px_rgba(57,135,255,0.15)]"
          >
            {/* Background Grid */}
            <defs>
              <pattern id="muscGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(57,135,255,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="200" height="420" fill="url(#muscGrid)" />

            {/* Head Silhouette */}
            <path
              d="M 100 25 C 84 25 74 38 74 54 C 74 68 84 78 100 78 C 116 78 126 68 126 54 C 126 38 116 25 100 25 Z"
              fill="#10243D"
              stroke="#3987FF"
              strokeWidth="1.5"
            />

            {/* Trapezius & Neck */}
            <path d="M 85 75 L 60 95 L 75 105 L 100 80 L 125 105 L 140 95 Z" fill="#142B46" stroke="#274872" strokeWidth="1" />

            {/* Deltoids & Shoulders */}
            <ellipse cx="56" cy="115" rx="14" ry="16" fill="#1A3759" stroke="#3987FF" strokeWidth="1.5" />
            <ellipse cx="144" cy="115" rx="14" ry="16" fill="#1A3759" stroke="#3987FF" strokeWidth="1.5" />

            {/* Chest (Pectorals) */}
            <path
              d="M 68 115 Q 100 135 100 148 Q 68 142 68 115 Z"
              fill="#142B46"
              stroke="#274872"
              strokeWidth="1.5"
            />
            <path
              d="M 132 115 Q 100 135 100 148 Q 132 142 132 115 Z"
              fill="#142B46"
              stroke="#274872"
              strokeWidth="1.5"
            />

            {/* Back / Erector Spinae (Interactive) */}
            <g
              onClick={() => setSelectedMuscle('back')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <path
                d="M 82 140 Q 100 160 100 195 Q 100 160 118 140 Q 100 135 82 140 Z"
                fill={selectedMuscle === 'back' ? 'rgba(39, 217, 232, 0.4)' : '#1A3759'}
                stroke={selectedMuscle === 'back' ? '#27D9E8' : '#3987FF'}
                strokeWidth={selectedMuscle === 'back' ? '2.5' : '1.5'}
                className="transition-all"
              />
              <line x1="100" y1="140" x2="100" y2="195" stroke="#27D9E8" strokeWidth="2" strokeDasharray="3,3" />
            </g>

            {/* Arms (Biceps & Forearms) */}
            <path d="M 44 130 C 40 150 42 170 48 185" stroke="#274872" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 48 185 C 44 205 40 220 38 230" stroke="#274872" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 156 130 C 160 150 158 170 152 185" stroke="#274872" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 152 185 C 156 205 160 220 162 230" stroke="#274872" strokeWidth="4.5" strokeLinecap="round" fill="none" />

            {/* Abdominals & Core */}
            <rect x="88" y="152" width="24" height="42" rx="4" fill="#0B1C32" stroke="#274872" strokeWidth="1" />
            <line x1="88" y1="166" x2="112" y2="166" stroke="#274872" strokeWidth="1" />
            <line x1="88" y1="180" x2="112" y2="180" stroke="#274872" strokeWidth="1" />

            {/* Hamstrings & Gluteal (Interactive) */}
            <g
              onClick={() => setSelectedMuscle('hamstrings')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <path
                d="M 72 205 Q 100 225 128 205 Q 120 235 100 238 Q 80 235 72 205 Z"
                fill={selectedMuscle === 'hamstrings' ? 'rgba(57, 135, 255, 0.4)' : '#10243D'}
                stroke={selectedMuscle === 'hamstrings' ? '#3987FF' : '#274872'}
                strokeWidth={selectedMuscle === 'hamstrings' ? '2.5' : '1.5'}
                className="transition-all"
              />
              <circle cx="100" cy="220" r="3" fill="#3987FF" className="animate-ping" opacity="0.6" />
            </g>

            {/* Quadriceps (Thighs - Front & Lateral - Interactive) */}
            <g
              onClick={() => setSelectedMuscle('quads')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {/* Left Quad */}
              <ellipse
                cx="74"
                cy="260"
                rx="14"
                ry="34"
                fill={selectedMuscle === 'quads' ? 'rgba(39, 217, 232, 0.35)' : '#142B46'}
                stroke={selectedMuscle === 'quads' ? '#27D9E8' : '#3987FF'}
                strokeWidth={selectedMuscle === 'quads' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Right Quad */}
              <ellipse
                cx="126"
                cy="260"
                rx="14"
                ry="34"
                fill={selectedMuscle === 'quads' ? 'rgba(39, 217, 232, 0.35)' : '#142B46'}
                stroke={selectedMuscle === 'quads' ? '#27D9E8' : '#3987FF'}
                strokeWidth={selectedMuscle === 'quads' ? '3' : '1.5'}
                className="transition-all"
              />
              <circle cx="74" cy="260" r="5" fill="#27D9E8" className="animate-pulse" />
              <circle cx="126" cy="260" r="5" fill="#27D9E8" className="animate-pulse" />
            </g>

            {/* Knees */}
            <circle cx="72" cy="300" r="4" fill="#0B1C32" stroke="#274872" strokeWidth="1" />
            <circle cx="128" cy="300" r="4" fill="#0B1C32" stroke="#274872" strokeWidth="1" />

            {/* Calves: Gastrocnemius & Soleus (Interactive) */}
            <g
              onClick={() => setSelectedMuscle('calves')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {/* Left Calf */}
              <path
                d="M 64 308 C 58 325 60 355 68 375 L 76 375 C 80 355 82 325 78 308 Z"
                fill={selectedMuscle === 'calves' ? 'rgba(255, 181, 71, 0.35)' : '#142B46'}
                stroke={selectedMuscle === 'calves' ? '#FFB547' : '#3987FF'}
                strokeWidth={selectedMuscle === 'calves' ? '3' : '1.5'}
                className="transition-all"
              />
              {/* Right Calf */}
              <path
                d="M 122 308 C 118 325 120 355 124 375 L 132 375 C 140 355 142 325 136 308 Z"
                fill={selectedMuscle === 'calves' ? 'rgba(255, 181, 71, 0.35)' : '#142B46'}
                stroke={selectedMuscle === 'calves' ? '#FFB547' : '#3987FF'}
                strokeWidth={selectedMuscle === 'calves' ? '3' : '1.5'}
                className="transition-all"
              />
              <circle cx="68" cy="335" r="4" fill="#FFB547" className="animate-pulse" />
              <circle cx="132" cy="335" r="4" fill="#FFB547" className="animate-pulse" />
            </g>
          </svg>

          {/* Muscle Selector Chips */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedMuscle('quads')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedMuscle === 'quads'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Quads
            </button>
            <button
              onClick={() => setSelectedMuscle('hamstrings')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedMuscle === 'hamstrings'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Hamstrings
            </button>
            <button
              onClick={() => setSelectedMuscle('calves')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedMuscle === 'calves'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Calves (Soleus)
            </button>
            <button
              onClick={() => setSelectedMuscle('back')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedMuscle === 'back'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Spinal Erector
            </button>
          </div>
        </div>

        {/* Selected Muscle Telemetry Card */}
        <div className="md:col-span-7 space-y-3">
          <div className="p-4 rounded-xl bg-[#0B1C32] border border-[#1E3A5F]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#8FA8C3] tracking-wider">
                Exercise: {active.exercise}
              </span>
              <span className={`text-xs font-mono font-bold ${active.riskColor}`}>
                {active.atrophyRisk}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">{active.name}</h4>

            <div className="grid grid-cols-3 gap-2.5 my-3">
              <div className="p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F]">
                <div className="text-[10px] text-gray-400 font-mono">Peak Force</div>
                <div className="text-sm font-bold text-cyan-400 font-mono">{active.peakForce}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F]">
                <div className="text-[10px] text-gray-400 font-mono">Resistance Load</div>
                <div className="text-sm font-bold text-white font-mono">{active.resistanceLoad}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F]">
                <div className="text-[10px] text-gray-400 font-mono">Strength Retained</div>
                <div className="text-sm font-bold text-emerald-400 font-mono">{active.strengthIndex}</div>
              </div>
            </div>

            <p className="text-xs text-[#8FA8C3] leading-relaxed">{active.description}</p>

            <div className="mt-3 p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 font-mono">
              <span className="text-white font-bold block mb-1 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-blue-400" /> Prescribed ARED Protocol:
              </span>
              {active.prescribedProtocol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
