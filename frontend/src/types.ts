export interface Astronaut {
  id: number;
  astronaut_id: string;
  name: string;
  mission_name: string;
  mission_type: string;
  mission_duration: number;
  current_mission_day: number;
  age: number;
  height_cm: number;
  weight_kg: number;
  blood_group: string;
  baseline_bmd_t_score: number;
  resting_heart_rate: number;
  vo2_max: number;
  lead_flight_surgeon: string;
  flight_surgeon_contact: string;
  onboard_medical_officer: string;
  status: string;
}

export interface BoneMeasurement {
  id: number;
  astronaut_id: string;
  site: string;
  measurement_type: string;
  date: string;
  mission_day: number;
  value: number;
  unit: string;
  previous_value?: number;
  change_pct: number;
  t_score?: number;
  status: 'Optimal' | 'Attention' | 'Alert';
  notes: string;
}

export interface MuscleMeasurement {
  id: number;
  astronaut_id: string;
  muscle_group: string;
  exercise_type: string;
  date: string;
  mission_day: number;
  peak_force_kn: number;
  reps: number;
  load_kg: number;
  strength_index: number;
  trend: number;
  status: 'Optimal' | 'Attention' | 'Alert';
  notes: string;
}

export interface RadiationReading {
  id: number;
  astronaut_id: string;
  dosimeter_type: string;
  date: string;
  mission_day: number;
  daily_dose_mgy: number;
  cumulative_dose_mgy: number;
  dose_rate_microgy_hr: number;
  location: string;
  solar_event_level: string;
  status: 'Normal' | 'Warning' | 'Critical';
  notes: string;
}

export interface HealthAlert {
  id: number;
  astronaut_id: string;
  title: string;
  category: string;
  severity: 'GREEN' | 'YELLOW' | 'RED';
  description: string;
  recommended_action: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  mission_day: number;
  timestamp: string;
}

export interface Recommendation {
  id: number;
  astronaut_id: string;
  category: 'Bone Health' | 'Muscle Health' | 'Radiation Protection' | 'Daily Wellness';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Routine';
  frequency: string;
  completed: boolean;
  protocol_ref: string;
}

export interface DailyChecklistItem {
  id: number;
  astronaut_id: string;
  title: string;
  category: string;
  completed: boolean;
  scheduled_time: string;
  mission_day: number;
}

export interface DashboardSummary {
  astronaut: Astronaut;
  bone_health_score: number;
  bone_health_status: string;
  bone_density_change_pct: number;
  muscle_health_score: number;
  muscle_health_status: string;
  muscle_strength_index: number;
  radiation_cumulative_mgy: number;
  radiation_daily_mgy: number;
  radiation_status: string;
  overall_health_risk: string;
  overall_health_score: number;
  exercise_completion_pct: number;
  exercise_time_minutes: number;
  exercise_target_minutes: number;
  active_alerts_count: number;
  weekly_trend: Array<{
    day: string;
    boneScore: number;
    muscleScore: number;
    radiation: number;
    readiness: number;
  }>;
  bone_density_trend: Array<{
    missionDay: string;
    changePct: number;
    targetLimit: number;
  }>;
  radiation_trend: Array<{
    missionDay: string;
    cumulativeDose: number;
    dailyDose: number;
    solarLevel: string;
  }>;
  recent_alerts: HealthAlert[];
  daily_checklist: DailyChecklistItem[];
}

export interface InsightItem {
  id: string;
  category: string;
  risk_level: 'Normal' | 'Attention' | 'Critical';
  title: string;
  observation: string;
  recommendation: string;
  scientific_context: string;
  metric_impacted: string;
  confidence_level: string;
}

export interface InsightResponse {
  disclaimer: string;
  engine_name: string;
  generated_at: string;
  insights: InsightItem[];
  overall_assessment: string;
}
