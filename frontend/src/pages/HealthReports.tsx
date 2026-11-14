import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Bone,
  Dumbbell,
  Zap,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../api';

export const HealthReports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReportSummary = async () => {
      try {
        const res = await api.getReportsSummary();
        setReportData(res);
      } catch (err) {
        console.error('Failed to load report summary', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportSummary();
  }, []);

  const handleDownloadPdf = () => {
    setDownloading(true);
    const pdfUrl = api.getPdfReportUrl();
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `ASTRAHEALTH_Mission_Report_Day76.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              MODULE 06
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
              CLINICAL DOSSIER
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Mission Health Reports & <span className="text-cyan-400">PDF Documentation</span>
          </h1>
          <p className="text-xs text-[#8FA8C3] font-mono mt-1">
            Official mission medical archives • Multi-point temporal comparison • Exportable PDF record
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all shadow-glowCyan disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling Vector PDF...' : 'Download Official PDF Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-[#10243D] hover:bg-[#142B46] text-[#8FA8C3] hover:text-white border border-[#1E3A5F] transition-colors"
            title="Print dossier summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Report Dossier ID</div>
          <div className="text-sm font-bold text-white font-mono mt-1">
            {reportData ? reportData.report_id : 'REP-AURORA1-D76'}
          </div>
          <div className="mt-2 text-[10px] text-cyan-400 font-mono">
            Mission Day 76 Checkpoint
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Evaluations Conducted</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {reportData ? reportData.total_bone_evaluations + reportData.total_muscle_sessions : 40}
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            DEXA, QUS & ARED Sessions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Dosimeter Tally Count</div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {reportData ? reportData.total_radiation_logs : 11} Logs
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            CPD & TRD Synchronizations
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#10243D] border border-[#1E3A5F]">
          <div className="text-[10px] uppercase font-mono text-[#8FA8C3]">Mission Progress</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {reportData ? `${reportData.mission_progress_pct}%` : '42.2%'}
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            76 of 180 Planned Days
          </div>
        </div>
      </div>

      {/* PDF Document Preview Box */}
      <div className="p-6 rounded-2xl bg-[#0B1C32] border border-[#1E3A5F] shadow-card">
        <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Executive Space Medical Summary (Day 76 Document)
              </h3>
              <p className="text-xs text-[#8FA8C3] font-mono">
                Official Clinical Clearance • Lead Flight Surgeon: Dr. Sarah Vance, MD (NASA JSC)
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-3 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
            CONFIDENTIAL • CREW HEALTH EYES ONLY
          </span>
        </div>

        {/* Paper-styled report container */}
        <div className="p-6 rounded-xl bg-[#10243D] border border-[#1E3A5F] space-y-6 font-mono text-xs">
          {/* Header Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-[#071426] border border-[#1E3A5F]">
            <div>
              <span className="text-gray-400 text-[10px] block">ASTRONAUT NAME:</span>
              <span className="text-white font-bold text-sm">Cmdr. Alex Morgan</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block">MISSION IDENTIFIER:</span>
              <span className="text-cyan-400 font-bold text-sm">AURORA-1 (Deep Space Transit)</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block">BLOOD TYPE & VITALS:</span>
              <span className="text-white font-bold text-sm">O-Positive • RHR 54 bpm</span>
            </div>
          </div>

          {/* Section 1: Executive Status Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> 1. Physiological Vitals Executive Summary
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#1E3A5F]">
                <thead className="bg-[#071426] text-gray-400 border-b border-[#1E3A5F]">
                  <tr>
                    <th className="p-2.5">Indicator</th>
                    <th className="p-2.5">Day 76 Measurement</th>
                    <th className="p-2.5">Baseline Ref</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Countermeasure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Femoral Neck BMD</td>
                    <td className="p-2.5 text-amber-300">1.031 g/cm² (-1.81%)</td>
                    <td className="p-2.5 text-gray-400">1.050 g/cm²</td>
                    <td className="p-2.5 text-amber-400">Attention</td>
                    <td className="p-2.5 text-gray-300">ARED Squats +8kg, Vit D3 800 IU</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Lumbar Spine BMD</td>
                    <td className="p-2.5 text-emerald-300">1.162 g/cm² (-1.53%)</td>
                    <td className="p-2.5 text-gray-400">1.180 g/cm²</td>
                    <td className="p-2.5 text-emerald-400">Optimal</td>
                    <td className="p-2.5 text-gray-300">Evening Lumbar Flexion routine</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Muscle Strength Index</td>
                    <td className="p-2.5 text-emerald-300">92.2% Retained</td>
                    <td className="p-2.5 text-gray-400">100.0%</td>
                    <td className="p-2.5 text-emerald-400">Optimal</td>
                    <td className="p-2.5 text-gray-300">2.5 hr/day physical training block</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Cumulative Radiation</td>
                    <td className="p-2.5 text-amber-300">42.60 mGy</td>
                    <td className="p-2.5 text-gray-400">0.00 mGy</td>
                    <td className="p-2.5 text-emerald-400">Normal</td>
                    <td className="p-2.5 text-gray-300">Storm Shelter readiness verified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Flight Surgeon Sign-off Box */}
          <div className="p-4 rounded-lg bg-[#071426] border border-[#1E3A5F] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">
                LEAD FLIGHT SURGEON AUTHORIZATION:
              </span>
              <div className="text-white font-bold">Dr. Sarah Vance, MD</div>
              <div className="text-[11px] text-[#8FA8C3]">
                NASA Johnson Space Center • Flight Medicine Clinic
              </div>
              <div className="mt-2 text-[10px] text-emerald-400">
                STATUS: SIGNED & TRANSMITTED (SATCOM CH-04)
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-400 block mb-1">
                CREW MEDICAL OFFICER (CMO) ENDORSEMENT:
              </span>
              <div className="text-white font-bold">Dr. Elena Rostov, MD</div>
              <div className="text-[11px] text-[#8FA8C3]">
                AURORA-1 Mission Onboard Health Station
              </div>
              <div className="mt-2 text-[10px] text-cyan-400">
                STATUS: ONBOARD VERIFIED
              </div>
            </div>
          </div>
        </div>

        {/* Download Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all shadow-glowCyan"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Official PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
