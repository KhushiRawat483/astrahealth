import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Bone,
  Dumbbell,
  Zap,
  Heart,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../api';
import { Recommendation } from '../types';

export const PreventiveCare: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.getRecommendations();
      setRecommendations(res);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleToggle = async (recId: number, currentStatus: boolean) => {
    try {
      const updated = await api.toggleRecommendation(recId, !currentStatus);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, completed: updated.completed } : r))
      );
    } catch (err) {
      console.error('Failed to toggle recommendation', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl border-2 border-emerald-400 border-t-transparent animate-spin"></div>
        <p className="text-xs font-mono text-emerald-400 animate-pulse">
          SYNCHRONIZING MISSION COUNTERMEASURE PROTOCOLS...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-[#10243D] border border-rose-500/30 rounded-2xl max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Countermeasure Sync Failed</h3>
        <p className="text-xs text-[#8FA8C3] font-mono mt-1 mb-4">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-mono font-bold hover:bg-cyan-400"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  const filtered = recommendations.filter((r) => {
    if (activeCategory === 'ALL') return true;
    return r.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const completedCount = recommendations.filter((r) => r.completed).length;
  const completionPct = Math.round((completedCount / (recommendations.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
              MODULE 05
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              NASA-STD-3001 ADVISORY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Preventive Care & <span className="text-emerald-400">Mission Countermeasure Directives</span>
          </h1>
          <p className="text-xs text-[#8FA8C3] font-mono mt-1">
            Personalized medical protocols • Priority-ranked actions • Interactive compliance tracking
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="p-3.5 rounded-xl bg-[#10243D] border border-[#1E3A5F] min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-gray-400">Protocol Compliance:</span>
            <span className="font-bold text-emerald-400">{completedCount} / {recommendations.length}</span>
          </div>
          <div className="w-full bg-[#071426] h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] text-right text-cyan-300 font-mono">
            {completionPct}% Protocols Executed
          </div>
        </div>
      </div>

      {/* Educational Guidance Disclaimer */}
      <div className="p-4 rounded-xl bg-[#10243D] border border-cyan-500/30 text-xs text-gray-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong className="text-white block mb-0.5">Clinical Protocol Notice:</strong>
          All nutritional, resistance training, and radiation shielding recommendations are presented as general educational spaceflight guidance. Final clinical countermeasure authorizations remain subject to approved NASA exploration health protocols and supervising Flight Surgeon review.
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap font-mono text-xs">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3.5 py-2 rounded-xl border transition-colors ${
            activeCategory === 'ALL'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          All Directives ({recommendations.length})
        </button>
        <button
          onClick={() => setActiveCategory('Bone')}
          className={`px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
            activeCategory === 'Bone'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          <Bone className="w-3.5 h-3.5" />
          <span>1. Bone Health</span>
        </button>
        <button
          onClick={() => setActiveCategory('Muscle')}
          className={`px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
            activeCategory === 'Muscle'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>2. Muscle Health</span>
        </button>
        <button
          onClick={() => setActiveCategory('Radiation')}
          className={`px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
            activeCategory === 'Radiation'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>3. Radiation Protection</span>
        </button>
        <button
          onClick={() => setActiveCategory('Wellness')}
          className={`px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
            activeCategory === 'Wellness'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
              : 'bg-[#10243D] text-gray-400 border-[#1E3A5F]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>4. Daily Wellness</span>
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggle(item.id, item.completed)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
              item.completed
                ? 'bg-[#0B1C32]/60 border-emerald-500/30 opacity-75'
                : 'bg-[#10243D] border-[#1E3A5F] hover:border-cyan-500/40 hover:bg-[#142B46]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                {item.category} • {item.frequency}
              </span>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    item.priority === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : item.priority === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {item.priority.toUpperCase()} PRIORITY
                </span>

                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-[#1E3A5F] bg-[#071426] group-hover:border-cyan-400'
                  }`}
                >
                  {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>

            <h3
              className={`text-sm font-bold transition-colors ${
                item.completed ? 'line-through text-gray-400' : 'text-white'
              }`}
            >
              {item.title}
            </h3>

            <p className="text-xs text-[#8FA8C3] mt-2 leading-relaxed">{item.description}</p>

            <div className="mt-3 pt-3 border-t border-[#1E3A5F]/70 flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span>Standard: {item.protocol_ref}</span>
              <span className={item.completed ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {item.completed ? 'Status: COMPLIED' : 'Click to Mark Complete'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
