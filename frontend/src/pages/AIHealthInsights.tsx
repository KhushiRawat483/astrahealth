import React, { useState, useEffect } from 'react';
import {
  Cpu,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  Dumbbell,
  Bone,
  Zap
} from 'lucide-react';
import { api } from '../api';
import { InsightResponse, InsightItem } from '../types';

export const AIHealthInsights: React.FC = () => {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.getInsights();
      setData(res);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl border-2 border-purple-400 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-purple-400 animate-pulse">
          EVALUATING PHYSIOLOGICAL TELEMETRY VIA ASTRA-INSIGHT RULE ENGINE...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-[#10243D] border border-rose-500/30 rounded-2xl max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Rule Engine Offline</h3>
        <p className="text-xs text-[#8FA8C3] font-mono mt-1 mb-4">{error}</p>
        <button
          onClick={fetchInsights}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400"
        >
          Re-evaluate Telemetry
        </button>
      </div>
    );
  }

  const { disclaimer, engine_name, generated_at, insights, overall_assessment } = data;

  const filteredInsights = insights.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
              MODULE 04
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {engine_name}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            AI-Assisted <span className="text-purple-400">Health Intelligence & Observations</span>
          </h1>
          <p className="text-xs text-[#8FA8C3] font-mono mt-1">
            Rule-based multi-system telemetry evaluation • Anomaly detection • Countermeasure advisory
          </p>
        </div>

        <button
          onClick={fetchInsights}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10243D] hover:bg-[#142B46] text-purple-300 border border-purple-500/40 text-xs font-mono transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-run Evaluation Rules</span>
        </button>
      </div>

      {/* Demonstrative Disclaimer Box */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-white mb-0.5">
            AI-Assisted Prototype Insights Notice:
          </strong>
          <p className="leading-relaxed text-[11px] text-gray-300">
            {disclaimer} Evaluated at: <span className="font-mono text-cyan-300">{generated_at}</span>. 
            All algorithmic thresholds reflect demonstration benchmarks and are designed for clinical flight surgeon review rather than autonomous medical diagnosis.
          </p>
        </div>
      </div>

      {/* Overall Assessment Card */}
      <div className="p-5 rounded-2xl bg-[#10243D] border border-cyan-500/30 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-mono text-[#8FA8C3] tracking-wider">
            Overall Health Assessment
          </span>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            NOMINAL FLIGHT PROFILE
          </span>
        </div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>{overall_assessment}</span>
        </h3>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 flex-wrap font-mono text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          All Insights ({insights.length})
        </button>
        <button
          onClick={() => setSelectedCategory('Bone')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedCategory === 'Bone'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          Bone Density
        </button>
        <button
          onClick={() => setSelectedCategory('Muscle')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedCategory === 'Muscle'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          Neuromuscular / ARED
        </button>
        <button
          onClick={() => setSelectedCategory('Radiation')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            selectedCategory === 'Radiation'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          Radiation Dosimetry
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className={`p-5 rounded-2xl border transition-all ${
              insight.risk_level === 'Critical'
                ? 'bg-rose-950/20 border-rose-500/40 shadow-glowCritical'
                : insight.risk_level === 'Attention'
                ? 'bg-amber-950/20 border-amber-500/40 shadow-glowWarning'
                : 'bg-[#10243D] border-[#1E3A5F]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#8FA8C3]">{insight.id}</span>
                <span className="text-xs font-mono text-cyan-400 font-semibold">• {insight.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400">{insight.confidence_level}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    insight.risk_level === 'Critical'
                      ? 'bg-rose-500 text-white'
                      : insight.risk_level === 'Attention'
                      ? 'bg-amber-500 text-black'
                      : 'bg-emerald-500 text-black'
                  }`}
                >
                  {insight.risk_level.toUpperCase()}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-2">{insight.title}</h3>

            {/* Observation Text */}
            <div className="p-3 rounded-xl bg-[#071426] border border-[#1E3A5F] text-xs text-gray-300 leading-relaxed mb-3">
              <strong className="text-cyan-300 block mb-1 font-mono">Telemetry Observation:</strong>
              {insight.observation}
            </div>

            {/* Metric impacted */}
            <div className="text-xs font-mono text-gray-400 mb-3">
              Key Metric: <strong className="text-white">{insight.metric_impacted}</strong>
            </div>

            {/* Recommendation & Science Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B1C32] border border-cyan-500/20">
                <strong className="text-cyan-400 block mb-1 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Prescribed Preventive Action:
                </strong>
                <p className="text-gray-300 leading-relaxed text-[11px]">{insight.recommendation}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1C32] border border-purple-500/20">
                <strong className="text-purple-400 block mb-1 font-mono flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Space Medicine Rationale:
                </strong>
                <p className="text-gray-300 leading-relaxed text-[11px]">{insight.scientific_context}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
