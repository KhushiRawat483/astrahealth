import {
  Astronaut,
  DashboardSummary,
  BoneMeasurement,
  MuscleMeasurement,
  RadiationReading,
  HealthAlert,
  Recommendation,
  DailyChecklistItem,
  InsightResponse
} from './types';

const API_BASE = '/api';

export const api = {
  // Astronaut
  getAstronaut: async (): Promise<Astronaut> => {
    const res = await fetch(`${API_BASE}/astronaut`);
    if (!res.ok) throw new Error('Failed to fetch astronaut profile');
    return res.json();
  },

  // Dashboard
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Bone Health
  getBoneHealth: async (): Promise<{
    records: BoneMeasurement[];
    femur_series: any[];
    spine_series: any[];
    heel_series: any[];
    spinal_elongation_cm: number;
    overall_bone_loss_rate_pct_month: number;
    heel_speed_of_sound_ms: number;
    tibial_cortical_density: number;
    t_score_femoral: number;
    t_score_spine: number;
    qct_scan_records: any[];
  }> => {
    const res = await fetch(`${API_BASE}/bone-health`);
    if (!res.ok) throw new Error('Failed to fetch bone health data');
    return res.json();
  },

  logBoneMeasurement: async (data: Partial<BoneMeasurement>): Promise<BoneMeasurement> => {
    const res = await fetch(`${API_BASE}/bone-health`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log bone measurement');
    return res.json();
  },

  // Muscle Health
  getMuscleHealth: async (): Promise<{
    records: MuscleMeasurement[];
    squat_progression: any[];
    deadlift_progression: any[];
    overall_strength_index: number;
    muscle_atrophy_risk: string;
    ared_compliance_pct: number;
    weekly_work_done_kj: number;
    total_resistance_volume_kg: number;
  }> => {
    const res = await fetch(`${API_BASE}/muscle-health`);
    if (!res.ok) throw new Error('Failed to fetch muscle health data');
    return res.json();
  },

  logMuscleMeasurement: async (data: Partial<MuscleMeasurement>): Promise<MuscleMeasurement> => {
    const res = await fetch(`${API_BASE}/muscle-health`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log muscle measurement');
    return res.json();
  },

  // Radiation
  getRadiationData: async (): Promise<{
    records: RadiationReading[];
    history_chart: any[];
    current_cumulative_mgy: number;
    current_daily_mgy: number;
    current_dose_rate_microgy_hr: number;
    projected_total_dose_mgy: number;
    max_allowable_exploration_limit_mgy: number;
    solar_weather: any;
    shielding_specs: any[];
  }> => {
    const res = await fetch(`${API_BASE}/radiation`);
    if (!res.ok) throw new Error('Failed to fetch radiation data');
    return res.json();
  },

  logRadiationReading: async (data: Partial<RadiationReading>): Promise<RadiationReading> => {
    const res = await fetch(`${API_BASE}/radiation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to log radiation reading');
    return res.json();
  },

  // Alerts
  getAlerts: async (): Promise<HealthAlert[]> => {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  createAlert: async (data: Partial<HealthAlert>): Promise<HealthAlert> => {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  updateAlertStatus: async (alertId: number, status: string): Promise<HealthAlert> => {
    const res = await fetch(`${API_BASE}/alerts/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return res.json();
  },

  // AI Health Insights
  getInsights: async (): Promise<InsightResponse> => {
    const res = await fetch(`${API_BASE}/insights`);
    if (!res.ok) throw new Error('Failed to fetch AI insights');
    return res.json();
  },

  // Recommendations
  getRecommendations: async (category?: string): Promise<Recommendation[]> => {
    const url = category ? `${API_BASE}/recommendations?category=${encodeURIComponent(category)}` : `${API_BASE}/recommendations`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  toggleRecommendation: async (recId: number, completed: boolean): Promise<Recommendation> => {
    const res = await fetch(`${API_BASE}/recommendations/${recId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to toggle recommendation');
    return res.json();
  },

  // Checklist
  getChecklist: async (): Promise<DailyChecklistItem[]> => {
    const res = await fetch(`${API_BASE}/checklist`);
    if (!res.ok) throw new Error('Failed to fetch checklist');
    return res.json();
  },

  toggleChecklistItem: async (itemId: number, completed: boolean): Promise<DailyChecklistItem> => {
    const res = await fetch(`${API_BASE}/checklist/${itemId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error('Failed to toggle checklist item');
    return res.json();
  },

  // Reports
  getReportsSummary: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports summary');
    return res.json();
  },

  getPdfReportUrl: (): string => {
    return `${API_BASE}/reports/pdf`;
  }
};
