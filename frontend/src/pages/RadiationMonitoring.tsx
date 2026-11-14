import React, { useState, useEffect } from 'react';
import {
  Zap,
  Shield,
  Sun,
  Flame,
  Radio,
  AlertTriangle,
  Plus,
  RefreshCw,
  ShieldAlert,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../api';
import { SpacecraftShieldingDiagram } from '../components/SpacecraftShieldingDiagram';
import { LogMeasurementModal } from '../components/LogMeasurementModal';
import { SimulatedSolarStormAlert } from '../components/SimulatedSolarStormAlert';

export const RadiationMonitoring: React.FC = () => {
  const [radData, setRadData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isStormAlertOpen, setIsStormAlertOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getRadiationData();
      setRadData(res);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch radiation dosimetry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl border-2 border-amber-400 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-amber-400 animate-pulse">
          INTERROGATING ACTIVE DOSIMETER SENSORS & SOLAR OBSERVATORY...
        </p>
      </div>
    );
  }

  if (error || !radData) {
    return (
      <div className="p-8 text-center bg-[#10243D] border border-rose-500/30 rounded-2xl max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Dosimeter Link Down</h3>
        <p className="text-xs text-[#8FA8C3] font-mono mt-1 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400"
        >
          Retry Telemetry
        </button>
      </div>
    );
  }

  const {
    current_cumulative_mgy,
    current_daily_mgy,
    current_dose_rate_microgy_hr,
    projected_total_dose_mgy,
    max_allowable_exploration_limit_mgy,
    solar_weather,
    history_chart,
    records
  } = radData;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              MODULE 03
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              DEEP SPACE DOSIMETRY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Space Radiation & <span className="text-amber-400">Solar Particle Environment</span>
          </h1>
          <p className="text-xs text-[#8FA8C3] font-mono mt-1">
            Real-time GCR ionizing dosimetry • SPE storm shelter management • Projected mission burden
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsStormAlertOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-xs font-mono transition-all"
          >
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Simulate SPE Alert</span>
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all shadow-glowCyan"
          >
            <Plus className="w-4 h-4" />
            <span>Log Dosimeter Reading</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-[#10243D] hover:bg-[#142B46] text-[#8FA8C3] hover:text-white border border-[#1E3A5F] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative Dose */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Cumulative Mission Dose</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1 flex items-baseline gap-1.5">
            <span>{current_cumulative_mgy}</span>
            <span className="text-xs text-[#8FA8C3]">mGy</span>
          </div>
          <div className="w-full bg-[#071426] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${(current_cumulative_mgy / max_allowable_exploration_limit_mgy) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Limit: {max_allowable_exploration_limit_mgy} mGy (17.0% utilized)
          </div>
        </div>

        {/* Daily Exposure Rate */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Daily Exposure Influx</div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono mt-1 flex items-baseline gap-1.5">
            <span>{current_daily_mgy}</span>
            <span className="text-xs text-[#8FA8C3]">mGy / day</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">
            Steady background GCR flux rate
          </div>
        </div>

        {/* Ambient Dose Rate */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Real-Time Ambient Dose Rate</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1 flex items-baseline gap-1.5">
            <span>{current_dose_rate_microgy_hr}</span>
            <span className="text-xs text-[#8FA8C3]">µGy / hour</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Sensor: Active TRD (Columbus Lab)
          </div>
        </div>

        {/* Projected Day 180 Total */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Projected Mission Total</div>
          <div className="text-2xl font-extrabold text-purple-300 font-mono mt-1 flex items-baseline gap-1.5">
            <span>~{projected_total_dose_mgy}</span>
            <span className="text-xs text-[#8FA8C3]">mGy (Day 180)</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono">
            Well below permissible lifetime limits
          </div>
        </div>
      </div>

      {/* SOLAR WEATHER STATUS BANNER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#10243D] to-[#142B46] border border-cyan-500/30 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: '60s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {solar_weather.status}
                </span>
                <span className="text-xs text-[#8FA8C3] font-mono">{solar_weather.cycle}</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                Solar Environment & Coronal Mass Ejection Status
              </h3>
              <p className="text-xs text-[#8FA8C3] font-mono mt-0.5">
                NOAA SWPC / NASA SRAG Telemetry Handshake
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2 rounded-lg bg-[#071426] border border-[#1E3A5F]">
              <div className="text-[10px] text-gray-400">Flare Index</div>
              <div className="text-cyan-400 font-bold">{solar_weather.solar_flare_index}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#071426] border border-[#1E3A5F]">
              <div className="text-[10px] text-gray-400">Geomagnetic Kp</div>
              <div className="text-emerald-400 font-bold">{solar_weather.geomagnetic_kp} (Quiet)</div>
            </div>
            <div className="p-2 rounded-lg bg-[#071426] border border-[#1E3A5F] col-span-2 sm:col-span-1">
              <div className="text-[10px] text-gray-400">Storm Shelter</div>
              <div className="text-emerald-400 font-bold">READY (Water Walls Full)</div>
            </div>
          </div>
        </div>
      </div>

      {/* RADIATION ACCUMULATION CHART */}
      <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Cumulative & Daily Radiation Exposure Timeline</span>
            </h3>
            <p className="text-[11px] text-[#8FA8C3] font-mono">
              Mission Days 1 to 76 • Correlated with solar flare event markers
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            SIMULATED MISSION TELEMETRY
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history_chart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="cumRadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB547" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FFB547" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" opacity={0.6} />
              <XAxis dataKey="day" stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
              <YAxis stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1C32',
                  borderColor: '#1E3A5F',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
                formatter={(val: any, name: any) => [
                  `${val} ${String(name || '').includes('Rate') ? 'µGy/h' : 'mGy'}`,
                  String(name || '')
                ] as any}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulative Dose (mGy)"
                stroke="#FFB547"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cumRadGrad)"
              />
              <Line
                type="monotone"
                dataKey="daily"
                name="Daily Influx (mGy)"
                stroke="#27D9E8"
                strokeWidth={2}
                dot={{ r: 3, fill: '#27D9E8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SPACECRAFT SHIELDING ARCHITECTURE DIAGRAM */}
      <SpacecraftShieldingDiagram />

      {/* RADIATION SAFETY PROTOCOLS PANEL */}
      <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Radiation Safety Countermeasures & Flight Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0B1C32] border border-[#1E3A5F]">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1.5">
              <span>1. Storm Shelter Protocol</span>
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              Upon automated detection of SPE proton flux exceeding 10 MeV / cm²·s·sr, crew must immediately suspend regular module duties and relocate to the central Storm Shelter module within 15 minutes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1C32] border border-[#1E3A5F]">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1.5">
              <span>2. Hydrogen Shielding Verification</span>
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              Water walls surround crew sleeping quarters. Verify potable water recycling tanks maintain minimum 85% liquid fill capacity to maximize hydrogen nuclear scattering efficiency.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1C32] border border-[#1E3A5F]">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1.5">
              <span>3. Ground Escalation Directive</span>
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              Any sustained dosimeter reading &gt; 50 µGy/h requires immediate audio contact with NASA Space Radiation Analysis Group (SRAG) and Flight Surgeon via SATCOM CH-04.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LogMeasurementModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchData}
        defaultTab="radiation"
      />

      <SimulatedSolarStormAlert
        isOpen={isStormAlertOpen}
        onClose={() => setIsStormAlertOpen(false)}
        onLoggedSpike={fetchData}
      />
    </div>
  );
};
