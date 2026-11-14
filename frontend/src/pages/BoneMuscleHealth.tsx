import React, { useState, useEffect } from 'react';
import {
  Bone,
  Dumbbell,
  Activity,
  Plus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  Search,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { BoneMeasurement, MuscleMeasurement } from '../types';
import { SkeletonDiagram } from '../components/SkeletonDiagram';
import { MuscularDiagram } from '../components/MuscularDiagram';
import { LogMeasurementModal } from '../components/LogMeasurementModal';

export const BoneMuscleHealth: React.FC = () => {
  const [boneData, setBoneData] = useState<any>(null);
  const [muscleData, setMuscleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalTab, setLogModalTab] = useState<'bone' | 'muscle'>('bone');
  const [activeTab, setActiveTab] = useState<'both' | 'bone' | 'muscle'>('both');
  const [searchQuery, setSearchQuery] = useState('');
  const [siteFilter, setSiteFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bRes, mRes] = await Promise.all([
        api.getBoneHealth(),
        api.getMuscleHealth()
      ]);
      setBoneData(bRes);
      setMuscleData(mRes);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch musculoskeletal telemetry');
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
        <div className="w-12 h-12 rounded-xl border-2 border-cyan-400 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 animate-pulse">
          ACQUIRING BONE DENSITY & ARED BIOMECHANICAL SENSORS...
        </p>
      </div>
    );
  }

  if (error || !boneData || !muscleData) {
    return (
      <div className="p-8 text-center bg-[#10243D] border border-rose-500/30 rounded-2xl max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Data Stream Unavailable</h3>
        <p className="text-xs text-[#8FA8C3] font-mono mt-1 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400"
        >
          Re-synchronize
        </button>
      </div>
    );
  }

  // Filter combined measurement history table
  const allBoneRecords = (boneData.records || []).map((r: BoneMeasurement) => ({
    ...r,
    categoryType: 'BONE',
    title: r.site,
    subDetail: r.measurement_type,
    displayValue: `${r.value} ${r.unit}`,
    trendPct: r.change_pct
  }));

  const allMuscleRecords = (muscleData.records || []).map((m: MuscleMeasurement) => ({
    ...m,
    categoryType: 'MUSCLE',
    title: m.muscle_group,
    subDetail: `${m.exercise_type} (${m.load_kg}kg)`,
    displayValue: `${m.peak_force_kn} kN (${m.reps} reps)`,
    trendPct: m.trend
  }));

  const combinedRecords = [...allBoneRecords, ...allMuscleRecords].sort((a, b) => b.mission_day - a.mission_day);

  const filteredRecords = combinedRecords.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.subDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSite =
      siteFilter === 'ALL' ||
      (siteFilter === 'BONE' && rec.categoryType === 'BONE') ||
      (siteFilter === 'MUSCLE' && rec.categoryType === 'MUSCLE');

    return matchesSearch && matchesSite;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              MODULE 02
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
              OSTEOMUSCULAR TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Bone Mineral Density & <span className="text-cyan-400">Muscle Atrophy Monitoring</span>
          </h1>
          <p className="text-xs text-[#8FA8C3] font-mono mt-1">
            Axial compressive skeletal load tracking • ARED force sensors • Quantitative ultrasound
          </p>
        </div>

        {/* Action Button: Log New Measurement */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setLogModalTab('bone');
              setIsLogModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all shadow-glowCyan"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Measurement</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-[#10243D] hover:bg-[#142B46] text-[#8FA8C3] hover:text-white border border-[#1E3A5F] transition-colors"
            title="Refresh musculoskeletal data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bone Resorption Rate */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Monthly Bone Resorption</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1 flex items-baseline gap-2">
            <span>{boneData.overall_bone_loss_rate_pct_month}%</span>
            <span className="text-xs text-amber-400 font-mono">/ 30 Days</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Nominal microgravity expectation: ~0.8-1.0%/mo
          </div>
        </div>

        {/* Spinal Elongation */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Spinal Axial Lengthening</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1 flex items-baseline gap-2">
            <span>+{boneData.spinal_elongation_cm} cm</span>
            <span className="text-xs text-[#8FA8C3] font-mono">elongation</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Intervertebral disc decompression active
          </div>
        </div>

        {/* Heel Ultrasound SOS */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Calcaneus Heel Ultrasound (SOS)</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 flex items-baseline gap-2">
            <span>{boneData.heel_speed_of_sound_ms}</span>
            <span className="text-xs text-[#8FA8C3] font-mono">m/s</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Acoustic velocity within expected margin
          </div>
        </div>

        {/* ARED Weekly Work Volume */}
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">ARED Resistance Adherence</div>
          <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1 flex items-baseline gap-2">
            <span>{muscleData.ared_compliance_pct}%</span>
            <span className="text-xs text-emerald-400 font-mono">High Adherence</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Total Volume: {muscleData.total_resistance_volume_kg.toLocaleString()} kg moved
          </div>
        </div>
      </div>

      {/* ANATOMICAL VISUALIZATIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonDiagram
          femoralChange={-1.81}
          spinalChange={-1.53}
          heelSos={boneData.heel_speed_of_sound_ms}
          tibiaDensity={boneData.tibial_cortical_density}
        />
        <MuscularDiagram overallStrengthIndex={muscleData.overall_strength_index} />
      </div>

      {/* TREND CHARTS: Bone BMD Progression & ARED Peak Force */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bone Density Progression Chart */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bone className="w-4 h-4 text-cyan-400" />
                <span>Bone Mineral Density (BMD) Progression Curve</span>
              </h3>
              <p className="text-[11px] text-[#8FA8C3] font-mono">
                Femoral Neck & Lumbar Spine % Change from Day 0 Baseline
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              DEXA CHECKS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={boneData.femur_series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" opacity={0.6} />
                <XAxis dataKey="day" stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
                <YAxis stroke="#8FA8C3" domain={[-3.0, 0.5]} fontSize={10} fontVariant="mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1C32',
                    borderColor: '#1E3A5F',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  formatter={(val: any) => [`${val}%`, 'BMD Change']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="change"
                  name="Femoral Neck BMD %"
                  stroke="#FFB547"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#FFB547' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-[#071426] border border-[#1E3A5F] text-[11px] text-gray-300 font-mono flex items-center justify-between">
            <span>Critical Microgravity Loss Boundary: -3.0%</span>
            <span className="text-emerald-400">Current Margin: Safe (+1.19% buffer)</span>
          </div>
        </div>

        {/* Muscle ARED Squat Force Progression */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-blue-400" />
                <span>ARED Squat Peak Concentric Force (kN)</span>
              </h3>
              <p className="text-[11px] text-[#8FA8C3] font-mono">
                Lower extremity force generation across mission checkpoints
              </p>
            </div>
            <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
              ARED TELEMETRY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={muscleData.squat_progression} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="forceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3987FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3987FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" opacity={0.6} />
                <XAxis dataKey="day" stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
                <YAxis stroke="#8FA8C3" domain={[1.8, 2.6]} fontSize={10} fontVariant="mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1C32',
                    borderColor: '#1E3A5F',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  formatter={(val: any) => [`${val} kN`, 'Peak Concentric Force']}
                />
                <Area
                  type="monotone"
                  dataKey="force_kn"
                  name="Peak Force (kN)"
                  stroke="#3987FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#forceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-[#071426] border border-[#1E3A5F] text-[11px] text-gray-300 font-mono flex items-center justify-between">
            <span>Minimum Postural Threshold: 2.10 kN</span>
            <span className="text-emerald-400">Current Output: 2.26 kN (Exceeds Target)</span>
          </div>
        </div>
      </div>

      {/* MEASUREMENT HISTORY TABLE WITH FILTERS & SEARCH */}
      <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Historical Musculoskeletal Telemetry Records</span>
            </h3>
            <p className="text-[11px] text-[#8FA8C3] font-mono">
              Complete chronological audit trail • Click "Log New Measurement" to insert new records
            </p>
          </div>

          {/* Search & Site Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search measurement or site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#071426] border border-[#1E3A5F] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono w-48 sm:w-56"
              />
            </div>

            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-[#071426] border border-[#1E3A5F] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="ALL">All Categories</option>
              <option value="BONE">Bone Health</option>
              <option value="MUSCLE">Muscle & ARED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E3A5F] text-[#8FA8C3] bg-[#071426]/50">
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Site / Muscle Group</th>
                <th className="py-3 px-3">Type / Exercise</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Day</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3">Trend</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No matching records found for "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, i) => (
                  <tr key={i} className="hover:bg-[#142B46]/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.categoryType === 'BONE'
                            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {rec.categoryType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">{rec.title}</td>
                    <td className="py-2.5 px-3 text-[#8FA8C3]">{rec.subDetail}</td>
                    <td className="py-2.5 px-3 text-gray-400">{rec.date}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">D{rec.mission_day}</td>
                    <td className="py-2.5 px-3 text-white font-bold">{rec.displayValue}</td>
                    <td className="py-2.5 px-3">
                      {rec.trendPct !== undefined && rec.trendPct !== null ? (
                        <span
                          className={
                            rec.trendPct < 0
                              ? 'text-amber-400'
                              : rec.trendPct > 0
                              ? 'text-emerald-400'
                              : 'text-gray-400'
                          }
                        >
                          {rec.trendPct > 0 ? `+${rec.trendPct}%` : `${rec.trendPct}%`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          rec.status === 'Alert'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : rec.status === 'Attention'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Measurement Modal */}
      <LogMeasurementModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchData}
        defaultTab={logModalTab}
      />
    </div>
  );
};
