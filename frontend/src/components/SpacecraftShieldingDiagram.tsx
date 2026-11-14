import React, { useState } from 'react';
import { Shield, Zap, AlertTriangle, Layers, Navigation } from 'lucide-react';

export const SpacecraftShieldingDiagram: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<'shelter' | 'sleep' | 'command' | 'lab' | 'cupola'>('shelter');

  const modules = {
    shelter: {
      name: 'Central Habitat Storm Shelter',
      shieldingMaterial: 'High-Density Hydrogen Water Wall Bladders + Food Ration Packaging',
      attenuation: '88% SPE Radiation Shielding',
      fluxRating: 'LOWEST FLUX (0.08 mGy/day nominal)',
      statusColor: 'text-emerald-400',
      borderColor: 'border-emerald-500',
      description: 'The core storm shelter is surrounded by potable water storage and hydrogen-rich hydrocarbon provisions. During Solar Particle Events (SPEs), high-energy solar protons lose energy via Rutherford scattering with low atomic mass hydrogen nuclei.',
      operationalProtocol: 'Mandatory crew quarters during Solar Flare / SPE alerts (>50 µGy/h). Secure sleeping restraint within water wall perimeter.'
    },
    sleep: {
      name: 'Crew Sleep Quarters (Bunks 1-4)',
      shieldingMaterial: 'Borated High-Density Polyethylene (HDPE) Composite (12 g/cm²)',
      attenuation: '68% Radiation Attenuation',
      fluxRating: 'LOW FLUX (0.22 mGy/day)',
      statusColor: 'text-cyan-400',
      borderColor: 'border-cyan-500',
      description: 'Secondary shielded zone utilized during nocturnal circadian cycles. Polyethylene provides optimal secondary neutron moderation without high bremsstrahlung radiation produced by heavy metals.',
      operationalProtocol: 'Default off-duty location. Personal dosimeter (CPD) stationed on bulkhead cradle during rest.'
    },
    command: {
      name: 'Core Command Deck & Avionics',
      shieldingMaterial: 'Aluminum-Lithium Alloy 2195 + Carbon Fiber Outer MMOD Whipple Shield',
      attenuation: '34% Attenuation',
      fluxRating: 'NOMINAL FLUX (0.52 mGy/day)',
      statusColor: 'text-blue-400',
      borderColor: 'border-blue-500',
      description: 'Primary flight operations center. Contains radiation-hardened avionics, flight control surfaces, and communication transceivers.',
      operationalProtocol: 'Standard duty occupancy (up to 8 hours daily). Real-time active TRD dosimeter active on flight console.'
    },
    lab: {
      name: 'Columbus Science & Exercise Module',
      shieldingMaterial: 'Kevlar/Nextel MMOD Blanket + Multi-layer Insulation (MLI)',
      attenuation: '45% Attenuation',
      fluxRating: 'NOMINAL FLUX (0.48 mGy/day)',
      statusColor: 'text-blue-400',
      borderColor: 'border-blue-500',
      description: 'Houses ARED resistance device, T-VIS treadmill, biological sample freezers, and diagnostic ultrasound workstation.',
      operationalProtocol: 'Daily workout countermeasure block (2.5 hours). Ventilate after heavy physical exercise.'
    },
    cupola: {
      name: 'Observation Cupola & EVA Airlock',
      shieldingMaterial: 'Multi-Pane Fused Silica / Quartz Windows (Minimal Secondary Shielding)',
      attenuation: '22% Attenuation (High Ambient Exposure)',
      fluxRating: 'HIGH FLUX ZONE (0.75 mGy/day)',
      statusColor: 'text-amber-400',
      borderColor: 'border-amber-500',
      description: 'Used for Earth/Deep Space visual navigation, robotic arm berthing, and external EVA ingress/egress. High GCR and cosmic ray visual phosphene rate.',
      operationalProtocol: 'Limit continuous crew occupancy to < 60 minutes per shift. Evacuate immediately upon solar flare notification.'
    }
  };

  const active = modules[selectedModule];

  return (
    <div className="bg-[#10243D] border border-[#1E3A5F] rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Spacecraft Radiation Shielding & Habitat Topography</span>
          </h3>
          <p className="text-[11px] text-[#8FA8C3] font-mono">
            AURORA-1 Deep Space Habitat • Hydrogen-Rich SPE Storm Haven
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          STORM SHELTER READY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Spacecraft Cross-Section */}
        <div className="md:col-span-6 flex justify-center relative py-2 bg-[#071426]/70 rounded-xl border border-[#1E3A5F]/70 p-4">
          <svg
            viewBox="0 0 360 220"
            className="w-full h-56 drop-shadow-[0_0_20px_rgba(39,217,232,0.15)]"
          >
            {/* Background Space Stars / Radiation Particles */}
            <circle cx="20" cy="30" r="1" fill="#fff" opacity="0.6" />
            <circle cx="340" cy="40" r="1" fill="#fff" opacity="0.6" />
            <circle cx="30" cy="180" r="1" fill="#fff" opacity="0.4" />
            <circle cx="330" cy="190" r="1.5" fill="#27D9E8" opacity="0.5" />

            {/* Simulated Solar Radiation Influx Wave */}
            <path
              d="M 10 10 Q 50 110 10 210"
              stroke="rgba(255, 181, 71, 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,4"
            />
            <path
              d="M 25 20 Q 65 110 25 200"
              stroke="rgba(255, 92, 108, 0.25)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3,3"
            />

            {/* Service Module Propulsion Nozzles (Right) */}
            <polygon points="320,80 350,65 350,155 320,140" fill="#142B46" stroke="#274872" strokeWidth="1.5" />
            <line x1="350" y1="90" x2="360" y2="85" stroke="#3987FF" strokeWidth="2" />
            <line x1="350" y1="130" x2="360" y2="135" stroke="#3987FF" strokeWidth="2" />

            {/* Outer Hull Contour */}
            <rect
              x="50"
              y="50"
              width="270"
              height="120"
              rx="25"
              fill="#0B1C32"
              stroke="#274872"
              strokeWidth="2"
            />

            {/* Front Nose Cone (Command Module - Left) */}
            <path
              d="M 50 50 Q 20 110 50 170 Z"
              fill="#10243D"
              stroke="#3987FF"
              strokeWidth="2"
            />

            {/* Solar Arrays Trusses (Top and Bottom) */}
            <line x1="180" y1="50" x2="180" y2="15" stroke="#8FA8C3" strokeWidth="3" />
            <rect x="130" y="5" width="100" height="15" rx="2" fill="#142B46" stroke="#27D9E8" strokeWidth="1" />
            <line x1="180" y1="170" x2="180" y2="205" stroke="#8FA8C3" strokeWidth="3" />
            <rect x="130" y="200" width="100" height="15" rx="2" fill="#142B46" stroke="#27D9E8" strokeWidth="1" />

            {/* Module 1: Command Deck (Interactive) */}
            <g
              onClick={() => setSelectedModule('command')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="55"
                y="65"
                width="50"
                height="90"
                rx="6"
                fill={selectedModule === 'command' ? 'rgba(57, 135, 255, 0.4)' : '#10243D'}
                stroke={selectedModule === 'command' ? '#3987FF' : '#1E3A5F'}
                strokeWidth="2"
              />
              <text x="63" y="112" fill="#F2F7FF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                CMD
              </text>
            </g>

            {/* Module 2: Science Lab & ARED (Interactive) */}
            <g
              onClick={() => setSelectedModule('lab')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="110"
                y="65"
                width="50"
                height="90"
                rx="6"
                fill={selectedModule === 'lab' ? 'rgba(57, 135, 255, 0.4)' : '#10243D'}
                stroke={selectedModule === 'lab' ? '#3987FF' : '#1E3A5F'}
                strokeWidth="2"
              />
              <text x="120" y="112" fill="#F2F7FF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                LAB
              </text>
            </g>

            {/* Module 4: Central Storm Shelter (Center - High Shielding - Interactive) */}
            <g
              onClick={() => setSelectedModule('shelter')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="165"
                y="65"
                width="60"
                height="90"
                rx="8"
                fill={selectedModule === 'shelter' ? 'rgba(50, 214, 154, 0.4)' : '#071426'}
                stroke={selectedModule === 'shelter' ? '#32D69A' : '#32D69A'}
                strokeWidth={selectedModule === 'shelter' ? '3' : '2'}
                strokeDasharray={selectedModule === 'shelter' ? 'none' : '4,2'}
              />
              {/* Water Wall Graphic Bars */}
              <rect x="168" y="70" width="6" height="80" rx="2" fill="#27D9E8" opacity="0.7" />
              <rect x="215" y="70" width="6" height="80" rx="2" fill="#27D9E8" opacity="0.7" />
              <text x="178" y="107" fill="#32D69A" fontSize="9" fontFamily="monospace" fontWeight="bold">
                STORM
              </text>
              <text x="176" y="119" fill="#32D69A" fontSize="8" fontFamily="monospace">
                SHELTER
              </text>
              <circle cx="195" cy="132" r="3" fill="#32D69A" className="animate-ping" />
            </g>

            {/* Module 3: Sleep Quarters (Interactive) */}
            <g
              onClick={() => setSelectedModule('sleep')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="230"
                y="65"
                width="50"
                height="90"
                rx="6"
                fill={selectedModule === 'sleep' ? 'rgba(39, 217, 232, 0.4)' : '#10243D'}
                stroke={selectedModule === 'sleep' ? '#27D9E8' : '#1E3A5F'}
                strokeWidth="2"
              />
              <text x="238" y="112" fill="#F2F7FF" fontSize="9" fontFamily="monospace" fontWeight="bold">
                BUNKS
              </text>
            </g>

            {/* Module 5: Airlock / Cupola (Right End - Low Shielding - Interactive) */}
            <g
              onClick={() => setSelectedModule('cupola')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="285"
                y="80"
                width="30"
                height="60"
                rx="4"
                fill={selectedModule === 'cupola' ? 'rgba(255, 181, 71, 0.4)' : '#142B46'}
                stroke={selectedModule === 'cupola' ? '#FFB547' : '#1E3A5F'}
                strokeWidth="2"
              />
              <text x="290" y="113" fill="#FFB547" fontSize="8" fontFamily="monospace" fontWeight="bold">
                EVA
              </text>
            </g>
          </svg>

          {/* Module Selector Chips */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedModule('shelter')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedModule === 'shelter'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Storm Shelter
            </button>
            <button
              onClick={() => setSelectedModule('sleep')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedModule === 'sleep'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Sleep Bunks
            </button>
            <button
              onClick={() => setSelectedModule('command')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedModule === 'command'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Command
            </button>
            <button
              onClick={() => setSelectedModule('lab')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedModule === 'lab'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Lab/ARED
            </button>
            <button
              onClick={() => setSelectedModule('cupola')}
              className={`text-[9px] font-mono px-2 py-1 rounded transition-colors ${
                selectedModule === 'cupola'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-[#10243D] text-gray-400 border border-[#1E3A5F]'
              }`}
            >
              Cupola/EVA
            </button>
          </div>
        </div>

        {/* Selected Module Specs Card */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-4 rounded-xl bg-[#0B1C32] border border-[#1E3A5F]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#8FA8C3] tracking-wider">
                Shielding Telemetry
              </span>
              <span className={`text-xs font-mono font-bold ${active.statusColor}`}>
                {active.attenuation}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-1">{active.name}</h4>

            <div className="p-2.5 my-3 rounded-lg bg-[#10243D] border border-[#1E3A5F] text-xs">
              <div className="text-[10px] text-gray-400 font-mono mb-1">Shielding Architecture</div>
              <div className="text-white font-mono text-[11px] leading-relaxed">
                {active.shieldingMaterial}
              </div>
            </div>

            <p className="text-xs text-[#8FA8C3] leading-relaxed">{active.description}</p>

            <div className="mt-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 font-mono">
              <span className="text-white font-bold block mb-1 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Crew Operations Directive:
              </span>
              {active.operationalProtocol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
