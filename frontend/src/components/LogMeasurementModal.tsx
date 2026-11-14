import React, { useState } from 'react';
import { X, Bone, Dumbbell, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api';

interface LogMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTab?: 'bone' | 'muscle' | 'radiation';
}

export const LogMeasurementModal: React.FC<LogMeasurementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = 'bone'
}) => {
  const [activeTab, setActiveTab] = useState<'bone' | 'muscle' | 'radiation'>(defaultTab);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Bone Form State
  const [boneSite, setBoneSite] = useState('Femoral Neck');
  const [boneType, setBoneType] = useState('DEXA BMD');
  const [boneValue, setBoneValue] = useState('1.028');
  const [boneUnit, setBoneUnit] = useState('g/cm²');
  const [bonePrev, setBonePrev] = useState('1.031');
  const [boneDay, setBoneDay] = useState('77');
  const [boneNotes, setBoneNotes] = useState('Routine mid-mission DEXA scan.');

  // Muscle Form State
  const [muscleGroup, setMuscleGroup] = useState('Quadriceps & Gluteals');
  const [exerciseType, setExerciseType] = useState('ARED Squat');
  const [peakForce, setPeakForce] = useState('2.30');
  const [resistanceLoad, setResistanceLoad] = useState('145');
  const [reps, setReps] = useState('12');
  const [strengthIndex, setStrengthIndex] = useState('93.5');
  const [muscleDay, setMuscleDay] = useState('77');
  const [muscleNotes, setMuscleNotes] = useState('ARED heavy resistance countermeasure cycle completed.');

  // Radiation Form State
  const [dosimeterType, setDosimeterType] = useState('Crew Personal Dosimeter (CPD)');
  const [dailyDose, setDailyDose] = useState('0.58');
  const [doseRate, setDoseRate] = useState('24.2');
  const [radLocation, setRadLocation] = useState('Deep Space Habitat - Core');
  const [solarEvent, setSolarEvent] = useState('Nominal (G0)');
  const [radDay, setRadDay] = useState('77');
  const [radNotes, setRadNotes] = useState('End-of-shift active dosimeter synchronization.');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const currentDateStr = new Date().toISOString().split('T')[0];

    try {
      if (activeTab === 'bone') {
        const val = parseFloat(boneValue);
        const prev = parseFloat(bonePrev);
        const day = parseInt(boneDay, 10);
        if (isNaN(val) || val <= 0) throw new Error('Please enter a valid positive measurement value');

        await api.logBoneMeasurement({
          site: boneSite,
          measurement_type: boneType,
          date: currentDateStr,
          mission_day: day,
          value: val,
          unit: boneUnit,
          previous_value: prev,
          change_pct: prev > 0 ? parseFloat((((val - prev) / prev) * 100).toFixed(2)) : 0,
          t_score: -0.05,
          notes: boneNotes
        });
      } else if (activeTab === 'muscle') {
        const force = parseFloat(peakForce);
        const load = parseFloat(resistanceLoad);
        const r = parseInt(reps, 10);
        const sIdx = parseFloat(strengthIndex);
        const day = parseInt(muscleDay, 10);
        if (isNaN(force) || isNaN(load)) throw new Error('Please enter valid numeric force and load');

        await api.logMuscleMeasurement({
          muscle_group: muscleGroup,
          exercise_type: exerciseType,
          date: currentDateStr,
          mission_day: day,
          peak_force_kn: force,
          load_kg: load,
          reps: r,
          strength_index: sIdx,
          notes: muscleNotes
        });
      } else if (activeTab === 'radiation') {
        const dose = parseFloat(dailyDose);
        const rate = parseFloat(doseRate);
        const day = parseInt(radDay, 10);
        if (isNaN(dose) || isNaN(rate)) throw new Error('Please enter valid radiation metrics');

        await api.logRadiationReading({
          dosimeter_type: dosimeterType,
          date: currentDateStr,
          mission_day: day,
          daily_dose_mgy: dose,
          dose_rate_microgy_hr: rate,
          location: radLocation,
          solar_event_level: solarEvent,
          notes: radNotes
        });
      }

      setSuccessMsg('Telemetry logged successfully to AstraHealth SQLite store!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit measurement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0B1C32] border border-cyan-500/40 rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1E3A5F] flex items-center justify-between bg-[#10243D]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              Log New Astronaut Physiological Measurement
            </h3>
            <p className="text-xs text-[#8FA8C3] font-mono">
              Live input form • Persisted in backend SQLite database
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#142B46]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#1E3A5F] bg-[#071426]">
          <button
            type="button"
            onClick={() => setActiveTab('bone')}
            className={`flex-1 py-3 text-xs font-mono font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'bone'
                ? 'border-cyan-400 text-cyan-300 bg-[#10243D]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Bone className="w-3.5 h-3.5" /> Bone Density
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('muscle')}
            className={`flex-1 py-3 text-xs font-mono font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'muscle'
                ? 'border-cyan-400 text-cyan-300 bg-[#10243D]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Muscle & ARED
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('radiation')}
            className={`flex-1 py-3 text-xs font-mono font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'radiation'
                ? 'border-cyan-400 text-cyan-300 bg-[#10243D]/60'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Dosimeter Log
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: BONE */}
          {activeTab === 'bone' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                    Anatomical Site
                  </label>
                  <select
                    value={boneSite}
                    onChange={(e) => setBoneSite(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Femoral Neck">Femoral Neck</option>
                    <option value="Lumbar Spine L1-L4">Lumbar Spine L1-L4</option>
                    <option value="Calcaneus (Heel)">Calcaneus (Heel)</option>
                    <option value="Tibia Cortical">Tibia Cortical</option>
                    <option value="Total Hip">Total Hip</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                    Scan / Measurement Type
                  </label>
                  <select
                    value={boneType}
                    onChange={(e) => setBoneType(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="DEXA BMD">DEXA BMD</option>
                    <option value="Ultrasound SOS">Ultrasound SOS (Speed of Sound)</option>
                    <option value="qCT Volumetric">qCT Volumetric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                    New Measured Value
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={boneValue}
                    onChange={(e) => setBoneValue(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Unit</label>
                  <input
                    type="text"
                    value={boneUnit}
                    onChange={(e) => setBoneUnit(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Mission Day</label>
                  <input
                    type="number"
                    value={boneDay}
                    onChange={(e) => setBoneDay(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                  Clinical / Telemetry Notes
                </label>
                <textarea
                  rows={2}
                  value={boneNotes}
                  onChange={(e) => setBoneNotes(e.target.value)}
                  className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MUSCLE */}
          {activeTab === 'muscle' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Muscle Group</label>
                  <select
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Quadriceps & Gluteals">Quadriceps & Gluteals</option>
                    <option value="Hamstrings & Lower Back">Hamstrings & Lower Back</option>
                    <option value="Gastrocnemius & Soleus">Gastrocnemius & Soleus</option>
                    <option value="Upper Body & Latissimus">Upper Body & Latissimus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">ARED Exercise</label>
                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ARED Squat">ARED Squat</option>
                    <option value="ARED Deadlift">ARED Deadlift</option>
                    <option value="ARED Heel Raise">ARED Heel Raise</option>
                    <option value="ARED Bench Pull">ARED Bench Pull</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Peak Force (kN)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={peakForce}
                    onChange={(e) => setPeakForce(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Load (kg)</label>
                  <input
                    type="number"
                    value={resistanceLoad}
                    onChange={(e) => setResistanceLoad(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Strength Idx %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={strengthIndex}
                    onChange={(e) => setStrengthIndex(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Workout Notes</label>
                <textarea
                  rows={2}
                  value={muscleNotes}
                  onChange={(e) => setMuscleNotes(e.target.value)}
                  className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* TAB 3: RADIATION */}
          {activeTab === 'radiation' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Dosimeter Type</label>
                  <select
                    value={dosimeterType}
                    onChange={(e) => setDosimeterType(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Crew Personal Dosimeter (CPD)">Crew Personal Dosimeter (CPD)</option>
                    <option value="Active TRD Dosimeter">Active TRD Dosimeter</option>
                    <option value="Storm Shelter Bio-Sensor">Storm Shelter Bio-Sensor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">Location</label>
                  <select
                    value={radLocation}
                    onChange={(e) => setRadLocation(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Deep Space Habitat - Core">Deep Space Habitat - Core</option>
                    <option value="Sleep Quarters Storm Shelter">Sleep Quarters Storm Shelter</option>
                    <option value="Columbus Science Lab">Columbus Science Lab</option>
                    <option value="Cupola Observation Dome">Cupola Observation Dome</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                    Daily Dose (mGy)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={dailyDose}
                    onChange={(e) => setDailyDose(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                    Dose Rate (µGy/h)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={doseRate}
                    onChange={(e) => setDoseRate(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                    Solar Weather Status
                  </label>
                  <select
                    value={solarEvent}
                    onChange={(e) => setSolarEvent(e.target.value)}
                    className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Nominal (G0)">Nominal (G0)</option>
                    <option value="Minor Flare (B9.1)">Minor Flare (B9.1)</option>
                    <option value="Solar Flare (C4.2)">Solar Flare (C4.2)</option>
                    <option value="Solar Particle Event (SPE)">Solar Particle Event (SPE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8FA8C3] mb-1">
                  Dosimeter Telemetry Notes
                </label>
                <textarea
                  rows={2}
                  value={radNotes}
                  onChange={(e) => setRadNotes(e.target.value)}
                  className="w-full bg-[#10243D] border border-[#1E3A5F] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#1E3A5F] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#142B46] hover:bg-[#1A3759] text-xs font-mono text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-all shadow-glowCyan disabled:opacity-50"
            >
              {submitting ? 'Transmitting Telemetry...' : 'Save & Update Charts'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
