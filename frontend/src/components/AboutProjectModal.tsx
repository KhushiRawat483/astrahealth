import React from 'react';
import { X, Award, Users, Rocket, Brain, Shield, Code2, Globe } from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0B1C32] border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#142B46]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-glowCyan">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                NASA SPACE APPS CHALLENGE 2026
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              ASTRA<span className="text-cyan-400">HEALTH</span>
            </h2>
            <p className="text-xs text-[#8FA8C3] font-mono">
              Space Crew Health Intelligence & Physiological Preservation System
            </p>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="space-y-5 text-xs text-gray-300 leading-relaxed">
          {/* Problem Statement */}
          <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2 text-cyan-400">
              <Globe className="w-4 h-4" /> The Deep Space Challenge
            </h3>
            <p>
              During 6-month to 3-year exploration missions to the Moon and Mars, astronauts face three continuous physiological threats: 
              <strong> microgravity-induced bone mineral loss</strong> (~1.0% of bone mass per month in weight-bearing bones), 
              <strong> selective skeletal muscle atrophy</strong>, and <strong>cumulative deep space ionizing radiation</strong> from Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). 
              Astronauts need intelligent, integrated onboard health intelligence that correlates exercise telemetry with bone density and environmental dosimetry.
            </p>
          </div>

          {/* Scientific Motivation */}
          <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2 text-cyan-400">
              <Brain className="w-4 h-4" /> Scientific Motivation & Methodology
            </h3>
            <p>
              AstraHealth implements real-time physiological modeling based on published NASA and ESA spaceflight standards (NASA-STD-3001). 
              The system simulates Advanced Resistive Exercise Device (ARED) force sensors, quantitative ultrasound (QUS) speed-of-sound attenuation, and time-resolved dosimeters. 
              Our rule-based intelligence engine analyzes trends to suggest proactive countermeasure adjustments before irreversible osteopenia or neuromuscular deconditioning occurs.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2 text-cyan-400">
              <Code2 className="w-4 h-4" /> Architecture & Technologies
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-2 text-[11px] font-mono">
              <div className="p-2.5 rounded bg-[#071426] border border-[#1E3A5F]">
                <strong className="text-cyan-300 block mb-1">Frontend Layer</strong>
                React 18 + TypeScript<br/>
                Tailwind CSS (Command Dark UI)<br/>
                Recharts Telemetry Graphs<br/>
                Framer Motion Animations<br/>
                Lucide Space Icons
              </div>
              <div className="p-2.5 rounded bg-[#071426] border border-[#1E3A5F]">
                <strong className="text-cyan-300 block mb-1">Backend & Analytics</strong>
                Python 3.13 + FastAPI<br/>
                SQLAlchemy ORM + SQLite<br/>
                ReportLab Vector PDF Engine<br/>
                Rule-Based Insight Engine<br/>
                Pydantic Telemetry Schemas
              </div>
            </div>
          </div>

          {/* Team Contribution Section (Requested specifically in Section 10) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#10243D] to-[#142B46] border border-cyan-500/30">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-3 text-cyan-400">
              <Users className="w-4 h-4" /> Team Contributions & Authors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#071426] border border-[#1E3A5F]">
                <div className="font-bold text-white text-xs">Mai & Cosmo</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Code & UI Development</div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Full-stack architecture, React dashboard, FastAPI REST endpoints, and interactive SVG diagrams.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#071426] border border-[#1E3A5F]">
                <div className="font-bold text-white text-xs">Loaf</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Design & Storytelling</div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Futuristic command center aesthetics, dark navy palette, mission UX flow, and graphic identity.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#071426] border border-[#1E3A5F]">
                <div className="font-bold text-white text-xs">Moo</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Scientific Research & Accuracy</div>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Space medicine biomechanics, ARED force calibration, radiation units (mGy), and NASA clinical protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-colors shadow-glowCyan"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
