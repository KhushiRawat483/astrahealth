from pydantic import BaseModel
from typing import List, Optional

class AstronautOut(BaseModel):
    id: int
    astronaut_id: str
    name: str
    mission_name: str
    mission_type: str
    mission_duration: int
    current_mission_day: int
    age: int
    height_cm: float
    weight_kg: float
    blood_group: str
    baseline_bmd_t_score: float
    resting_heart_rate: int
    vo2_max: float
    lead_flight_surgeon: str
    flight_surgeon_contact: str
    onboard_medical_officer: str
    status: str

    class Config:
        from_attributes = True

class BoneMeasurementCreate(BaseModel):
    site: str
    measurement_type: str = "DEXA BMD"
    date: str
    mission_day: int
    value: float
    unit: str = "g/cm²"
    previous_value: Optional[float] = None
    change_pct: Optional[float] = 0.0
    t_score: Optional[float] = None
    status: str = "Optimal"
    notes: Optional[str] = ""

class BoneMeasurementOut(BoneMeasurementCreate):
    id: int
    astronaut_id: str

    class Config:
        from_attributes = True

class MuscleMeasurementCreate(BaseModel):
    muscle_group: str
    exercise_type: str
    date: str
    mission_day: int
    peak_force_kn: float
    reps: int = 10
    load_kg: float = 120.0
    strength_index: float = 95.0
    trend: Optional[float] = 0.0
    status: str = "Optimal"
    notes: Optional[str] = ""

class MuscleMeasurementOut(MuscleMeasurementCreate):
    id: int
    astronaut_id: str

    class Config:
        from_attributes = True

class RadiationReadingCreate(BaseModel):
    dosimeter_type: str = "Crew Personal Dosimeter (CPD)"
    date: str
    mission_day: int
    daily_dose_mgy: float
    cumulative_dose_mgy: Optional[float] = None
    dose_rate_microgy_hr: float
    location: str = "Deep Space Habitat - Core"
    solar_event_level: str = "Nominal (G0)"
    status: str = "Normal"
    notes: Optional[str] = ""

class RadiationReadingOut(RadiationReadingCreate):
    id: int
    astronaut_id: str
    cumulative_dose_mgy: float

    class Config:
        from_attributes = True

class HealthAlertCreate(BaseModel):
    title: str
    category: str
    severity: str = "YELLOW"
    description: str
    recommended_action: str
    status: str = "Active"
    mission_day: int = 76
    timestamp: str

class HealthAlertOut(HealthAlertCreate):
    id: int
    astronaut_id: str

    class Config:
        from_attributes = True

class HealthAlertUpdate(BaseModel):
    status: str

class RecommendationOut(BaseModel):
    id: int
    astronaut_id: str
    category: str
    title: str
    description: str
    priority: str
    frequency: str
    completed: bool
    protocol_ref: str

    class Config:
        from_attributes = True

class RecommendationToggle(BaseModel):
    completed: bool

class DailyChecklistOut(BaseModel):
    id: int
    astronaut_id: str
    title: str
    category: str
    completed: bool
    scheduled_time: str
    mission_day: int

    class Config:
        from_attributes = True

class DailyChecklistToggle(BaseModel):
    completed: bool

class MetricSummary(BaseModel):
    current_value: float
    unit: str
    status: str
    change_pct: float
    target: Optional[float] = None
    risk_level: str

class DashboardSummary(BaseModel):
    astronaut: AstronautOut
    bone_health_score: int
    bone_health_status: str
    bone_density_change_pct: float
    muscle_health_score: int
    muscle_health_status: str
    muscle_strength_index: float
    radiation_cumulative_mgy: float
    radiation_daily_mgy: float
    radiation_status: str
    overall_health_risk: str
    overall_health_score: int
    exercise_completion_pct: int
    exercise_time_minutes: int
    exercise_target_minutes: int
    active_alerts_count: int
    weekly_trend: List[dict]
    bone_density_trend: List[dict]
    radiation_trend: List[dict]
    recent_alerts: List[HealthAlertOut]
    daily_checklist: List[DailyChecklistOut]

class InsightItem(BaseModel):
    id: str
    category: str
    risk_level: str  # "Normal", "Attention", "Critical"
    title: str
    observation: str
    recommendation: str
    scientific_context: str
    metric_impacted: str
    confidence_level: str

class InsightResponse(BaseModel):
    disclaimer: str
    engine_name: str
    generated_at: str
    insights: List[InsightItem]
    overall_assessment: str
