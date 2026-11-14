from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Astronaut(Base):
    __tablename__ = "astronauts"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, unique=True, index=True, default="AST-2026-X88")
    name = Column(String, nullable=False, default="Commander Alex Morgan")
    mission_name = Column(String, default="AURORA-1")
    mission_type = Column(String, default="Deep Space Long-Duration Exploration")
    mission_duration = Column(Integer, default=180)  # total days
    current_mission_day = Column(Integer, default=76)
    age = Column(Integer, default=38)
    height_cm = Column(Float, default=182.0)
    weight_kg = Column(Float, default=78.4)
    blood_group = Column(String, default="O-Positive")
    baseline_bmd_t_score = Column(Float, default=0.2)
    resting_heart_rate = Column(Integer, default=54)
    vo2_max = Column(Float, default=52.4)
    lead_flight_surgeon = Column(String, default="Dr. Sarah Vance, MD (Flight Surgeon, NASA JSC)")
    flight_surgeon_contact = Column(String, default="SATCOM CH-04 / Ground Med-Ops Houston")
    onboard_medical_officer = Column(String, default="Dr. Elena Rostov, MD (AURORA-1 CMO)")
    status = Column(String, default="ACTIVE_ON_DUTY")
    created_at = Column(DateTime, default=datetime.utcnow)

class BoneMeasurement(Base):
    __tablename__ = "bone_measurements"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, default="AST-2026-X88", index=True)
    site = Column(String, nullable=False)  # e.g., "Femoral Neck", "Lumbar Spine L1-L4", "Calcaneus (Heel)", "Tibia Cortical"
    measurement_type = Column(String, default="DEXA BMD")  # "DEXA BMD", "Ultrasound SOS", "qCT Volumetric"
    date = Column(String, nullable=False)
    mission_day = Column(Integer, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String, default="g/cm²")
    previous_value = Column(Float, nullable=True)
    change_pct = Column(Float, default=0.0)
    t_score = Column(Float, nullable=True)
    status = Column(String, default="Optimal")  # "Optimal", "Attention", "Alert"
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class MuscleMeasurement(Base):
    __tablename__ = "muscle_measurements"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, default="AST-2026-X88", index=True)
    muscle_group = Column(String, nullable=False)  # "Quadriceps", "Hamstrings", "Erector Spinae", "Gastrocnemius/Soleus", "Upper Body"
    exercise_type = Column(String, nullable=False)  # "ARED Squat", "ARED Deadlift", "ARED Heel Raise", "ARED Bench Pull"
    date = Column(String, nullable=False)
    mission_day = Column(Integer, nullable=False)
    peak_force_kn = Column(Float, nullable=False)
    reps = Column(Integer, default=10)
    load_kg = Column(Float, default=120.0)
    strength_index = Column(Float, default=95.0)  # % of pre-flight baseline
    trend = Column(Float, default=0.0)
    status = Column(String, default="Optimal")  # "Optimal", "Attention", "Alert"
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class RadiationReading(Base):
    __tablename__ = "radiation_readings"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, default="AST-2026-X88", index=True)
    dosimeter_type = Column(String, default="Crew Personal Dosimeter (CPD)")
    date = Column(String, nullable=False)
    mission_day = Column(Integer, nullable=False)
    daily_dose_mgy = Column(Float, nullable=False)
    cumulative_dose_mgy = Column(Float, nullable=False)
    dose_rate_microgy_hr = Column(Float, nullable=False)
    location = Column(String, default="Deep Space Habitat - Core")
    solar_event_level = Column(String, default="Nominal (G0)")  # "Nominal (G0)", "Minor Solar Flare (C-Class)", "M-Class Flare Alert", "Solar Particle Event (SPE)"
    status = Column(String, default="Normal")  # "Normal", "Warning", "Critical"
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class HealthAlert(Base):
    __tablename__ = "health_alerts"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, default="AST-2026-X88", index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # "Bone Health", "Muscle Atrophy", "Radiation Exposure", "Biometrics", "Exercise Compliance"
    severity = Column(String, default="YELLOW")  # "GREEN", "YELLOW", "RED"
    description = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String, default="Active")  # "Active", "Acknowledged", "Resolved"
    mission_day = Column(Integer, default=76)
    timestamp = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, default="AST-2026-X88", index=True)
    category = Column(String, nullable=False)  # "Bone Health", "Muscle Health", "Radiation Protection", "Daily Wellness"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String, default="Medium")  # "High", "Medium", "Routine"
    frequency = Column(String, default="Daily")  # "Daily", "Weekly", "Bi-weekly", "As-needed"
    completed = Column(Boolean, default=False)
    protocol_ref = Column(String, default="NASA-STD-3001-VOL1")
    created_at = Column(DateTime, default=datetime.utcnow)

class DailyChecklist(Base):
    __tablename__ = "daily_checklist"

    id = Column(Integer, primary_key=True, index=True)
    astronaut_id = Column(String, default="AST-2026-X88", index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="Routine")
    completed = Column(Boolean, default=False)
    scheduled_time = Column(String, default="08:00 UTC")
    mission_day = Column(Integer, default=76)
