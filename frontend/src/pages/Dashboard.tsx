import React, { useState, useEffect } from 'react';
import {
  Bone,
  Dumbbell,
  Zap,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Clock,
  Plus,
  RefreshCw,
  Flame,
  Activity,
  Heart,
  Calendar
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
import { DashboardSummary } from '../types';
import { LogMeasurementModal } from '../components/LogMeasurementModal';

interface DashboardProps {
  onTriggerSolarStorm?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onTriggerSolarStorm }) => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await api.getDashboardSummary();
      setData(res);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load dashboard telemetry');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleChecklist = async (itemId: number, currentStatus: boolean) => {
    try {
      await api.toggleChecklistItem(itemId, !currentStatus);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to toggle checklist', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl border-2 border-cyan-400 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 animate-pulse">
          INITIALIZING AURORA-1 HEALTH TELEMETRY STREAM...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[#10243D] border border-rose-500/30 rounded-2xl max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Connection Error</h3>
        <p className="text-xs text-[#8FA8C3] font-mono mt-1 mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    astronaut,
    bone_health_score,
    bone_health_status,
    bone_density_change_pct,
    muscle_health_score,
    muscle_health_status,
    muscle_strength_index,
    radiation_cumulative_mgy,
    radiation_daily_mgy,
    radiation_status,
    overall_health_risk,
    overall_health_score,
    exercise_completion_pct,
    exercise_time_minutes,
    exercise_target_minutes,
    weekly_trend,
    bone_density_trend,
    radiation_trend,
    recent_alerts,
    daily_checklist
  } = data;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Mission Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              SOLAR TIME: 19:42 UTC
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              BIO-LINK ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Good evening, <span className="text-cyan-400">Commander.</span>
          </h1>
          <p className="text-xs text-[#8FA8C3] font-mono mt-1">
            {astronaut.name} • Mission: {astronaut.mission_name} • Day {astronaut.current_mission_day} of {astronaut.mission_duration}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all shadow-glowCyan"
          >
            <Plus className="w-4 h-4" />
            <span>Log Measurement</span>
          </button>

          <button
            onClick={fetchDashboard}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-[#10243D] hover:bg-[#142B46] text-[#8FA8C3] hover:text-white border border-[#1E3A5F] transition-colors"
            title="Refresh telemetry stream"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 MAJOR HEALTH CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Bone Density Card */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] hover:border-cyan-500/40 transition-all shadow-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-mono text-[#8FA8C3] tracking-wider">
              Bone Mineral Density
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Bone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {bone_density_change_pct > 0 ? `+${bone_density_change_pct}%` : `${bone_density_change_pct}%`}
            </span>
            <span className="text-xs text-amber-400 font-mono flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> vs baseline
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#8FA8C3]">Bone Health Index:</span>
            <span className="font-bold text-cyan-400 font-mono">{bone_health_score}/100</span>
          </div>
          <div className="w-full bg-[#071426] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${bone_health_score}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-amber-300">
            Status: {bone_health_status} (Femoral Neck -1.81%)
          </div>
        </div>

        {/* 2. Muscle Strength Card */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] hover:border-blue-500/40 transition-all shadow-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-mono text-[#8FA8C3] tracking-wider">
              Muscle Strength Index
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {muscle_strength_index}%
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High Retention
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#8FA8C3]">ARED Compliance:</span>
            <span className="font-bold text-blue-400 font-mono">{exercise_completion_pct}%</span>
          </div>
          <div className="w-full bg-[#071426] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${muscle_strength_index}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-emerald-300">
            ARED Squat: 2.26 kN • Peak Form Stable
          </div>
        </div>

        {/* 3. Radiation Exposure Card */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] hover:border-amber-500/40 transition-all shadow-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-mono text-[#8FA8C3] tracking-wider">
              Cumulative Radiation
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {radiation_cumulative_mgy}
            </span>
            <span className="text-xs text-[#8FA8C3] font-mono">mGy</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#8FA8C3]">Daily Influx Rate:</span>
            <span className="font-bold text-amber-300 font-mono">{radiation_daily_mgy} mGy/d</span>
          </div>
          <div className="w-full bg-[#071426] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${(radiation_cumulative_mgy / 250) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-emerald-300">
            Within 250 mGy Mission Limit (Projected: ~104 mGy)
          </div>
        </div>

        {/* 4. Overall Health Risk Card */}
        <div className="p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] hover:border-purple-500/40 transition-all shadow-card group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase font-mono text-[#8FA8C3] tracking-wider">
              Overall Health Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {overall_health_risk}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#8FA8C3]">Readiness Score:</span>
            <span className="font-bold text-purple-300 font-mono">{overall_health_score}/100</span>
          </div>
          <div className="w-full bg-[#071426] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
              style={{ width: `${overall_health_score}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-mono text-cyan-300">
            Fit for Duty • Next Flight Surgeon PMC: 24h
          </div>
        </div>
      </div>

      {/* CHARTS GRID: Weekly Trends & Bone/Radiation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Multi-Metric Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Weekly Physiological Telemetry Trend (Past 7 Days)</span>
              </h3>
              <p className="text-[11px] text-[#8FA8C3] font-mono">
                Multivariate tracking: Bone Score, Muscle Retention & Readiness
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              DAY 70 - DAY 76
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27D9E8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#27D9E8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3987FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3987FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" opacity={0.6} />
                <XAxis dataKey="day" stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
                <YAxis stroke="#8FA8C3" domain={[70, 100]} fontSize={10} fontVariant="mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1C32',
                    borderColor: '#1E3A5F',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }}
                />
                <Area
                  type="monotone"
                  dataKey="muscleScore"
                  name="Muscle Score"
                  stroke="#3987FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#muscleGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="boneScore"
                  name="Bone Score"
                  stroke="#27D9E8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#boneGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="readiness"
                  name="Overall Readiness"
                  stroke="#9B8CFF"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#9B8CFF' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radiation Exposure Timeline (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Cumulative Space Radiation Influx</span>
              </h3>
              <p className="text-[11px] text-[#8FA8C3] font-mono">
                Dose accumulation across mission days (mGy)
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              SAFE ENVELOPE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radiation_trend.slice(-6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" opacity={0.6} />
                <XAxis dataKey="missionDay" stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
                <YAxis stroke="#8FA8C3" fontSize={10} fontVariant="mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1C32',
                    borderColor: '#1E3A5F',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  formatter={(value: any) => [`${value} mGy`, 'Cumulative Dose']}
                />
                <Bar dataKey="cumulativeDose" fill="#FFB547" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: Recent Alerts & Daily Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Health Alerts (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Active Medical & Environmental Directives</span>
              </h3>
              <p className="text-[11px] text-[#8FA8C3] font-mono">
                Recent automated telemetry escalations
              </p>
            </div>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
              3-TIER ALERT NET
            </span>
          </div>

          <div className="space-y-3">
            {recent_alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-colors ${
                  alert.severity === 'RED'
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                    : alert.severity === 'YELLOW'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {alert.severity === 'RED' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    ) : alert.severity === 'YELLOW' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">{alert.description}</p>
                <div className="mt-2 text-[11px] font-mono text-cyan-300 bg-[#071426] p-2 rounded border border-[#1E3A5F]">
                  <strong className="text-gray-400">Escalation Protocol:</strong> {alert.recommended_action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Health Checklist (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#10243D] border border-[#1E3A5F] shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Commander Daily Health Protocol Checklist</span>
              </h3>
              <p className="text-[11px] text-[#8FA8C3] font-mono">
                Mission Day {astronaut.current_mission_day} • Click to toggle compliance status
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              LIVE SYNC
            </span>
          </div>

          <div className="space-y-2">
            {daily_checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id, item.completed)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-[#0B1C32]/60 border-emerald-500/30 text-gray-300'
                    : 'bg-[#142B46] border-[#1E3A5F] hover:border-cyan-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-[#1E3A5F] bg-[#071426]'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium ${
                        item.completed ? 'line-through text-gray-400' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </span>
                    <div className="text-[10px] text-[#8FA8C3] font-mono mt-0.5">
                      Category: {item.category} • Scheduled: {item.scheduled_time}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    item.completed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.completed ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Measurement Modal */}
      <LogMeasurementModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={fetchDashboard}
        defaultTab="bone"
      />
    </div>
  );
};
