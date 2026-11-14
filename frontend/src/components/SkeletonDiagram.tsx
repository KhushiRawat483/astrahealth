import React, { useState } from 'react';
import { Bone, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface SkeletonDiagramProps {
  femoralChange?: number;
  spinalChange?: number;
  heelSos?: number;
  tibiaDensity?: number;
}

export const SkeletonDiagram: React.FC<SkeletonDiagramProps> = ({
  femoralChange = -1.81,
  spinalChange = -1.53,
  heelSos = 1538,
  tibiaDensity = 1122
}) => {
  const [selectedBone, setSelectedBone] = useState<'femur' | 'spine' | 'heel' | 'tibia'>('femur');

  const boneDetails = {
    femur: {
      name: 'Proximal Femoral Neck & Hip',
      type: 'Trabecular / Cortical Junction',
      measuredValue: '1.031 g/cm²',
      changePct: femoralChange,
      status: femoralChange <= -2.0 ? 'Alert' : 'Attention',
      statusColor: 'text-amber-400',
      description: 'The femoral neck bears high axial load on Earth. In microgravity, osteoclast resorption exceeds osteoblast formation at ~0.8-1.0%/month.',
      countermeasure: 'ARED Bilateral Squats @ 140kg (3x10 reps, 3x/week). Ensure calcium/Vitamin D intake.'
    },
    spine: {
      name: 'Lumbar Spine (L1 - L4)',
      type: 'Trabecular Vertebral Bodies',
      measuredValue: '1.162 g/cm²',
      changePct: spinalChange,
      status: 'Optimal (With Elongation)',
      statusColor: 'text-emerald-400',
      description: 'Microgravity eliminates axial spinal compression, causing intervertebral disc hyper-hydration and +4.2 cm spinal elongation.',
      countermeasure: 'Evening paraspinal flexion routine, sleeping bag axial tension harness, and ARED deadlifts.'
    },
    heel: {
      name: 'Calcaneus (Heel Bone)',
      type: 'Trabecular Acoustic Matrix',
      measuredValue: `${heelSos} m/s (SOS)`,
      changePct: -1.41,
      status: 'Optimal',
      statusColor: 'text-emerald-400',
      description: 'Quantitative ultrasound speed of sound (SOS) reflects structural elasticity and microarchitecture of the calcaneus.',
      countermeasure: 'ARED explosive calf heel-raises and high-impact treadmill vibration isolation (T-VIS).'
    },
    tibia: {
      name: 'Tibia Cortical Shaft',
      type: 'Peripheral Volumetric Density',
      measuredValue: `${tibiaDensity} mg/cm³`,
      changePct: -1.58,
      status: 'Optimal',
      statusColor: 'text-emerald-400',
      description: 'Peripheral quantitative computed tomography (qCT) evaluates cortical shell thickness and cortical mineral concentration.',
      countermeasure: 'High ground reaction force exercises on ARED platform.'
    }
  };

  const active = boneDetails[selectedBone];

  return (
    <div className="bg-[#10243D] border border-[#1E3A5F] rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Bone className="w-4 h-4 text-cyan-400" />
            <span>Skeletal Weight-Bearing Mapping (Microgravity)</span>
          </h3>
          <p className="text-[11px] text-[#8FA8C3] font-mono">
            Interactive anatomical osteo-telemetry • Select bone to inspect
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          DEXA / QUS TELEMETRY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Skeleton Diagram */}
        <div className="md:col-span-5 flex justify-center relative py-2 bg-[#071426]/70 rounded-xl border border-[#1E3A5F]/70 p-4">
          <svg
            viewBox="0 0 200 420"
            className="w-44 h-80 drop-shadow-[0_0_15px_rgba(39,217,232,0.15)]"
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="boneGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(39,217,232,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="200" height="420" fill="url(#boneGrid)" />

            {/* Cranium */}
            <path
              d="M 100 25 C 80 25 72 40 72 55 C 72 70 82 82 100 82 C 118 82 128 70 128 55 C 128 40 120 25 100 25 Z"
              fill="#1A3759"
              stroke="#3987FF"
              strokeWidth="1.5"
            />
            {/* Eye Orbits */}
            <circle cx="90" cy="52" r="5" fill="#071426" stroke="#27D9E8" strokeWidth="1" />
            <circle cx="110" cy="52" r="5" fill="#071426" stroke="#27D9E8" strokeWidth="1" />

            {/* Cervical Spine */}
            <line x1="100" y1="82" x2="100" y2="105" stroke="#8FA8C3" strokeWidth="4" strokeDasharray="2,2" />

            {/* Clavicles & Shoulders */}
            <path d="M 60 105 Q 100 115 140 105" fill="none" stroke="#3987FF" strokeWidth="3" />

            {/* Rib Cage */}
            <ellipse cx="100" cy="140" rx="36" ry="32" fill="#142B46" stroke="#274872" strokeWidth="1.5" />
            <path d="M 72 130 Q 100 142 128 130" fill="none" stroke="#3987FF" strokeWidth="1.5" opacity="0.6" />
            <path d="M 70 142 Q 100 154 130 142" fill="none" stroke="#3987FF" strokeWidth="1.5" opacity="0.6" />
            <path d="M 74 154 Q 100 166 126 154" fill="none" stroke="#3987FF" strokeWidth="1.5" opacity="0.6" />

            {/* Sternum */}
            <line x1="100" y1="108" x2="100" y2="155" stroke="#27D9E8" strokeWidth="3" />

            {/* Lumbar Spine (Interactive) */}
            <g
              onClick={() => setSelectedBone('spine')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="92"
                y="165"
                width="16"
                height="40"
                rx="3"
                fill={selectedBone === 'spine' ? 'rgba(39, 217, 232, 0.4)' : '#10243D'}
                stroke={selectedBone === 'spine' ? '#27D9E8' : '#3987FF'}
                strokeWidth={selectedBone === 'spine' ? '2.5' : '1.5'}
                className="transition-all"
              />
              <line x1="94" y1="175" x2="106" y2="175" stroke="#27D9E8" strokeWidth="2" />
              <line x1="94" y1="185" x2="106" y2="185" stroke="#27D9E8" strokeWidth="2" />
              <line x1="94" y1="195" x2="106" y2="195" stroke="#27D9E8" strokeWidth="2" />
              {/* Pulse Marker */}
              <circle cx="100" cy="185" r="4" fill="#27D9E8" className="animate-ping" opacity="0.6" />
            </g>

            {/* Pelvis / Sacrum */}
            <path
              d="M 68 205 Q 100 230 132 205 Q 120 235 100 238 Q 80 235 68 205 Z"
              fill="#1A3759"
              stroke="#3987FF"
              strokeWidth="2"
            />

            {/* Arms (Humerus, Radius, Ulna) */}
            <line x1="60" y1="108" x2="48" y2="165" stroke="#274872" strokeWidth="3" />
            <line x1="48" y1="165" x2="38" y2="215" stroke="#274872" strokeWidth="2.5" />
            <circle cx="36" cy="225" r="4" fill="#1A3759" stroke="#3987FF" strokeWidth="1" />

            <line x1="140" y1="108" x2="152" y2="165" stroke="#274872" strokeWidth="3" />
            <line x1="152" y1="165" x2="162" y2="215" stroke="#274872" strokeWidth="2.5" />
            <circle cx="164" cy="225" r="4" fill="#1A3759" stroke="#3987FF" strokeWidth="1" />

            {/* Femur (Thigh Bones - Interactive) */}
            <g
              onClick={() => setSelectedBone('femur')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              {/* Left Femur */}
              <path
                d="M 80 228 Q 74 250 72 290"
                fill="none"
                stroke={selectedBone === 'femur' ? '#FFB547' : '#3987FF'}
                strokeWidth={selectedBone === 'femur' ? '5' : '3.5'}
                className="transition-all"
              />
              {/* Right Femur */}
              <path
                d="M 120 228 Q 126 250 128 290"
                fill="none"
                stroke={selectedBone === 'femur' ? '#FFB547' : '#3987FF'}
                strokeWidth={selectedBone === 'femur' ? '5' : '3.5'}
                className="transition-all"
              />
              {/* Femoral Neck Highlight Ring */}
              <circle cx="80" cy="230" r="7" fill="none" stroke="#FFB547" strokeWidth="2" className="animate-pulse" />
              <circle cx="120" cy="230" r="7" fill="none" stroke="#FFB547" strokeWidth="2" className="animate-pulse" />
            </g>

            {/* Patellae (Knees) */}
            <circle cx="72" cy="295" r="4" fill="#1A3759" stroke="#27D9E8" strokeWidth="1.5" />
            <circle cx="128" cy="295" r="4" fill="#1A3759" stroke="#27D9E8" strokeWidth="1.5" />

            {/* Tibia & Fibula (Interactive) */}
            <g
              onClick={() => setSelectedBone('tibia')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <line
                x1="72"
                y1="300"
                x2="68"
                y2="370"
                stroke={selectedBone === 'tibia' ? '#27D9E8' : '#3987FF'}
                strokeWidth={selectedBone === 'tibia' ? '4.5' : '3'}
                className="transition-all"
              />
              <line
                x1="128"
                y1="300"
                x2="132"
                y2="370"
                stroke={selectedBone === 'tibia' ? '#27D9E8' : '#3987FF'}
                strokeWidth={selectedBone === 'tibia' ? '4.5' : '3'}
                className="transition-all"
              />
              <circle cx="70" cy="335" r="3" fill="#27D9E8" opacity="0.7" />
              <circle cx="130" cy="335" r="3" fill="#27D9E8" opacity="0.7" />
            </g>

            {/* Calcaneus / Heel & Feet (Interactive) */}
            <g
              onClick={() => setSelectedBone('heel')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <ellipse
                cx="66"
                cy="385"
                rx="9"
                ry="6"
                fill={selectedBone === 'heel' ? '#27D9E8' : '#142B46'}
                stroke={selectedBone === 'heel' ? '#27D9E8' : '#3987FF'}
                strokeWidth="2"
              />
              <ellipse
                cx="134"
                cy="385"
                rx="9"
                ry="6"
                fill={selectedBone === 'heel' ? '#27D9E8' : '#142B46'}
                stroke={selectedBone === 'heel' ? '#27D9E8' : '#3987FF'}
                strokeWidth="2"
              />
              <circle cx="66" cy="385" r="4" fill="#27D9E8" className="animate-ping" opacity="0.5" />
            </g>
          </svg>

          {/* Interactive Bone Selector Chips */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedBone('femur')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedBone === 'femur'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Femur
            </button>
            <button
              onClick={() => setSelectedBone('spine')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedBone === 'spine'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Spine
            </button>
            <button
              onClick={() => setSelectedBone('heel')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedBone === 'heel'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Heel QUS
            </button>
            <button
              onClick={() => setSelectedBone('tibia')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedBone === 'tibia'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Tibia qCT
            </button>
          </div>
        </div>

        {/* Selected Bone Telemetry Card */}
        <div className="md:col-span-7 space-y-3">
          <div className="p-4 rounded-xl bg-[#0B1C32] border border-[#1E3A5F]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#8FA8C3] tracking-wider">
                {active.type}
              </span>
              <span className={`text-xs font-mono font-bold ${active.statusColor}`}>
                {active.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">{active.name}</h4>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F]">
                <div className="text-[10px] text-gray-400 font-mono">Current Reading</div>
                <div className="text-base font-bold text-white font-mono">{active.measuredValue}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#10243D] border border-[#1E3A5F]">
                <div className="text-[10px] text-gray-400 font-mono">Mission Change</div>
                <div
                  className={`text-base font-bold font-mono ${
                    active.changePct < -1.8 ? 'text-amber-400' : 'text-cyan-400'
                  }`}
                >
                  {active.changePct > 0 ? `+${active.changePct}%` : `${active.changePct}%`}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8FA8C3] leading-relaxed">{active.description}</p>

            <div className="mt-3 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
              <span className="text-white font-bold block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Prescribed Countermeasure:
              </span>
              {active.countermeasure}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
