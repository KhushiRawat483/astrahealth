from sqlalchemy.orm import Session
from models import Astronaut, BoneMeasurement, MuscleMeasurement, RadiationReading, HealthAlert, Recommendation, DailyChecklist

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Astronaut).first():
        return

    print("Seeding AstraHealth database with realistic simulated mission data...")

    # 1. Astronaut Profile
    astronaut = Astronaut(
        astronaut_id="AST-2026-X88",
        name="Commander Alex Morgan",
        mission_name="AURORA-1",
        mission_type="Deep Space Long-Duration Exploration (Transit to Lunar Gateway & Mars Simulation)",
        mission_duration=180,
        current_mission_day=76,
        age=38,
        height_cm=182.0,
        weight_kg=78.4,
        blood_group="O-Positive",
        baseline_bmd_t_score=0.20,
        resting_heart_rate=54,
        vo2_max=52.4,
        lead_flight_surgeon="Dr. Sarah Vance, MD (Flight Surgeon, NASA JSC Houston)",
        flight_surgeon_contact="SATCOM CH-04 / Med-Ops Flight Deck JSC",
        onboard_medical_officer="Dr. Elena Rostov, MD (AURORA-1 CMO)",
        status="ACTIVE_ON_DUTY"
    )
    db.add(astronaut)
    db.commit()

    # 2. Bone Measurements (Multi-point history across mission days 0 to 75)
    bone_data = [
        # Baseline Day 0
        {"site": "Femoral Neck", "measurement_type": "DEXA BMD", "date": "2026-08-30", "mission_day": 0, "value": 1.050, "unit": "g/cm²", "previous_value": 1.050, "change_pct": 0.0, "t_score": 0.20, "status": "Optimal", "notes": "Pre-flight baseline scan. High bone density."},
        {"site": "Lumbar Spine L1-L4", "measurement_type": "DEXA BMD", "date": "2026-08-30", "mission_day": 0, "value": 1.180, "unit": "g/cm²", "previous_value": 1.180, "change_pct": 0.0, "t_score": 0.40, "status": "Optimal", "notes": "Pre-flight baseline spine scan."},
        {"site": "Calcaneus (Heel)", "measurement_type": "Ultrasound SOS", "date": "2026-08-30", "mission_day": 0, "value": 1560, "unit": "m/s", "previous_value": 1560, "change_pct": 0.0, "t_score": 0.30, "status": "Optimal", "notes": "Baseline heel quantitative ultrasound speed of sound."},
        {"site": "Tibia Cortical", "measurement_type": "qCT Volumetric", "date": "2026-08-30", "mission_day": 0, "value": 1140, "unit": "mg/cm³", "previous_value": 1140, "change_pct": 0.0, "t_score": 0.25, "status": "Optimal", "notes": "Baseline peripheral qCT volumetric cortical density."},

        # Day 15
        {"site": "Femoral Neck", "measurement_type": "DEXA BMD", "date": "2026-09-14", "mission_day": 15, "value": 1.046, "unit": "g/cm²", "previous_value": 1.050, "change_pct": -0.38, "t_score": 0.16, "status": "Optimal", "notes": "Early mission minor bone remodeling."},
        {"site": "Lumbar Spine L1-L4", "measurement_type": "DEXA BMD", "date": "2026-09-14", "mission_day": 15, "value": 1.176, "unit": "g/cm²", "previous_value": 1.180, "change_pct": -0.34, "t_score": 0.36, "status": "Optimal", "notes": "Normal spine decompression noted."},
        {"site": "Calcaneus (Heel)", "measurement_type": "Ultrasound SOS", "date": "2026-09-14", "mission_day": 15, "value": 1555, "unit": "m/s", "previous_value": 1560, "change_pct": -0.32, "t_score": 0.25, "status": "Optimal", "notes": "Ultrasonic attenuation stable."},

        # Day 30
        {"site": "Femoral Neck", "measurement_type": "DEXA BMD", "date": "2026-09-29", "mission_day": 30, "value": 1.042, "unit": "g/cm²", "previous_value": 1.046, "change_pct": -0.76, "t_score": 0.12, "status": "Optimal", "notes": "Rate conforms to expected 0.8%/month microgravity resorption."},
        {"site": "Lumbar Spine L1-L4", "measurement_type": "DEXA BMD", "date": "2026-09-29", "mission_day": 30, "value": 1.171, "unit": "g/cm²", "previous_value": 1.176, "change_pct": -0.76, "t_score": 0.31, "status": "Optimal", "notes": "Vertebral trabecular structure preserved by ARED."},
        {"site": "Calcaneus (Heel)", "measurement_type": "Ultrasound SOS", "date": "2026-09-29", "mission_day": 30, "value": 1550, "unit": "m/s", "previous_value": 1555, "change_pct": -0.64, "t_score": 0.20, "status": "Optimal", "notes": "Routine ultrasound check."},
        {"site": "Tibia Cortical", "measurement_type": "qCT Volumetric", "date": "2026-09-29", "mission_day": 30, "value": 1133, "unit": "mg/cm³", "previous_value": 1140, "change_pct": -0.61, "t_score": 0.18, "status": "Optimal", "notes": "Tibial geometry preserved."},

        # Day 45
        {"site": "Femoral Neck", "measurement_type": "DEXA BMD", "date": "2026-10-14", "mission_day": 45, "value": 1.038, "unit": "g/cm²", "previous_value": 1.042, "change_pct": -1.14, "t_score": 0.08, "status": "Optimal", "notes": "Slight acceleration in resorption noticed."},
        {"site": "Lumbar Spine L1-L4", "measurement_type": "DEXA BMD", "date": "2026-10-14", "mission_day": 45, "value": 1.168, "unit": "g/cm²", "previous_value": 1.171, "change_pct": -1.02, "t_score": 0.28, "status": "Optimal", "notes": "Spinal elongation +3.8 cm measured."},
        {"site": "Calcaneus (Heel)", "measurement_type": "Ultrasound SOS", "date": "2026-10-14", "mission_day": 45, "value": 1545, "unit": "m/s", "previous_value": 1550, "change_pct": -0.96, "t_score": 0.15, "status": "Optimal", "notes": "Heel bone acoustic velocity steady."},

        # Day 60
        {"site": "Femoral Neck", "measurement_type": "DEXA BMD", "date": "2026-10-29", "mission_day": 60, "value": 1.034, "unit": "g/cm²", "previous_value": 1.038, "change_pct": -1.52, "t_score": 0.04, "status": "Attention", "notes": "Resorption trending towards upper tolerance boundary."},
        {"site": "Lumbar Spine L1-L4", "measurement_type": "DEXA BMD", "date": "2026-10-29", "mission_day": 60, "value": 1.165, "unit": "g/cm²", "previous_value": 1.168, "change_pct": -1.27, "t_score": 0.25, "status": "Optimal", "notes": "Core axial load exercises effective."},
        {"site": "Calcaneus (Heel)", "measurement_type": "Ultrasound SOS", "date": "2026-10-29", "mission_day": 60, "value": 1541, "unit": "m/s", "previous_value": 1545, "change_pct": -1.22, "t_score": 0.11, "status": "Optimal", "notes": "Ultrasonic attenuation indicates minor mineral loss."},
        {"site": "Tibia Cortical", "measurement_type": "qCT Volumetric", "date": "2026-10-29", "mission_day": 60, "value": 1126, "unit": "mg/cm³", "previous_value": 1133, "change_pct": -1.23, "t_score": 0.11, "status": "Optimal", "notes": "qCT volumetric density consistent."},

        # Day 75 (Current Checkpoint)
        {"site": "Femoral Neck", "measurement_type": "DEXA BMD", "date": "2026-11-13", "mission_day": 75, "value": 1.031, "unit": "g/cm²", "previous_value": 1.034, "change_pct": -1.81, "t_score": -0.01, "status": "Attention", "notes": "Accumulated -1.81% bone loss. Recommend increasing ARED load by 8%."},
        {"site": "Lumbar Spine L1-L4", "measurement_type": "DEXA BMD", "date": "2026-11-13", "mission_day": 75, "value": 1.162, "unit": "g/cm²", "previous_value": 1.165, "change_pct": -1.53, "t_score": 0.22, "status": "Optimal", "notes": "Spine elongation reaches +4.2 cm. Lumbar discs hydrated."},
        {"site": "Calcaneus (Heel)", "measurement_type": "Ultrasound SOS", "date": "2026-11-13", "mission_day": 75, "value": 1538, "unit": "m/s", "previous_value": 1541, "change_pct": -1.41, "t_score": 0.08, "status": "Optimal", "notes": "Speed of sound 1538 m/s within acceptable mission limits."},
        {"site": "Tibia Cortical", "measurement_type": "qCT Volumetric", "date": "2026-11-13", "mission_day": 75, "value": 1122, "unit": "mg/cm³", "previous_value": 1126, "change_pct": -1.58, "t_score": 0.07, "status": "Optimal", "notes": "Cortical bone thickness preserved well."}
    ]
    for b in bone_data:
        db.add(BoneMeasurement(**b))

    # 3. Muscle Measurements (ARED Telemetry across mission days)
    muscle_data = [
        # Day 0 Baseline
        {"muscle_group": "Quadriceps & Gluteals", "exercise_type": "ARED Squat", "date": "2026-08-30", "mission_day": 0, "peak_force_kn": 2.45, "reps": 12, "load_kg": 150.0, "strength_index": 100.0, "trend": 0.0, "status": "Optimal", "notes": "Pre-flight ARED 1-rep max baseline calibration."},
        {"muscle_group": "Hamstrings & Lower Back", "exercise_type": "ARED Deadlift", "date": "2026-08-30", "mission_day": 0, "peak_force_kn": 2.15, "reps": 10, "load_kg": 140.0, "strength_index": 100.0, "trend": 0.0, "status": "Optimal", "notes": "Baseline posterior chain power test."},
        {"muscle_group": "Gastrocnemius & Soleus", "exercise_type": "ARED Heel Raise", "date": "2026-08-30", "mission_day": 0, "peak_force_kn": 1.65, "reps": 15, "load_kg": 115.0, "strength_index": 100.0, "trend": 0.0, "status": "Optimal", "notes": "Plantarflexion baseline strength."},
        {"muscle_group": "Upper Body & Latissimus", "exercise_type": "ARED Bench Pull", "date": "2026-08-30", "mission_day": 0, "peak_force_kn": 1.85, "reps": 12, "load_kg": 95.0, "strength_index": 100.0, "trend": 0.0, "status": "Optimal", "notes": "Upper body postural strength baseline."},

        # Day 15
        {"muscle_group": "Quadriceps & Gluteals", "exercise_type": "ARED Squat", "date": "2026-09-14", "mission_day": 15, "peak_force_kn": 2.42, "reps": 12, "load_kg": 150.0, "strength_index": 98.8, "trend": -1.2, "status": "Optimal", "notes": "Early microgravity adaptation. Full range completed."},
        {"muscle_group": "Hamstrings & Lower Back", "exercise_type": "ARED Deadlift", "date": "2026-09-14", "mission_day": 15, "peak_force_kn": 2.12, "reps": 10, "load_kg": 140.0, "strength_index": 98.6, "trend": -1.4, "status": "Optimal", "notes": "Good eccentric control observed."},

        # Day 30
        {"muscle_group": "Quadriceps & Gluteals", "exercise_type": "ARED Squat", "date": "2026-09-29", "mission_day": 30, "peak_force_kn": 2.38, "reps": 12, "load_kg": 148.0, "strength_index": 97.1, "trend": -1.7, "status": "Optimal", "notes": "Velocity-loss profiling within target 15% window."},
        {"muscle_group": "Hamstrings & Lower Back", "exercise_type": "ARED Deadlift", "date": "2026-09-29", "mission_day": 30, "peak_force_kn": 2.08, "reps": 10, "load_kg": 138.0, "strength_index": 96.7, "trend": -1.9, "status": "Optimal", "notes": "Solid lumbar bar positioning."},
        {"muscle_group": "Gastrocnemius & Soleus", "exercise_type": "ARED Heel Raise", "date": "2026-09-29", "mission_day": 30, "peak_force_kn": 1.58, "reps": 15, "load_kg": 112.0, "strength_index": 95.8, "trend": -4.2, "status": "Optimal", "notes": "Calf muscle shows early volume shrinkage."},

        # Day 45
        {"muscle_group": "Quadriceps & Gluteals", "exercise_type": "ARED Squat", "date": "2026-10-14", "mission_day": 45, "peak_force_kn": 2.33, "reps": 12, "load_kg": 145.0, "strength_index": 95.1, "trend": -2.0, "status": "Optimal", "notes": "Fatigue index normal. Hydration good."},
        {"muscle_group": "Upper Body & Latissimus", "exercise_type": "ARED Bench Pull", "date": "2026-10-14", "mission_day": 45, "peak_force_kn": 1.83, "reps": 12, "load_kg": 95.0, "strength_index": 98.9, "trend": -1.1, "status": "Optimal", "notes": "Upper body maintains higher strength retention."},

        # Day 60
        {"muscle_group": "Quadriceps & Gluteals", "exercise_type": "ARED Squat", "date": "2026-10-29", "mission_day": 60, "peak_force_kn": 2.29, "reps": 11, "load_kg": 142.0, "strength_index": 93.5, "trend": -1.6, "status": "Optimal", "notes": "Mild quad soreness reported post session."},
        {"muscle_group": "Hamstrings & Lower Back", "exercise_type": "ARED Deadlift", "date": "2026-10-29", "mission_day": 60, "peak_force_kn": 2.01, "reps": 10, "load_kg": 135.0, "strength_index": 93.5, "trend": -3.2, "status": "Optimal", "notes": "Posterior chain retention satisfactory."},
        {"muscle_group": "Gastrocnemius & Soleus", "exercise_type": "ARED Heel Raise", "date": "2026-10-29", "mission_day": 60, "peak_force_kn": 1.52, "reps": 14, "load_kg": 108.0, "strength_index": 92.1, "trend": -3.7, "status": "Attention", "notes": "Calf neuromuscular endurance dipping slightly."},

        # Day 75 (Current Checkpoint)
        {"muscle_group": "Quadriceps & Gluteals", "exercise_type": "ARED Squat", "date": "2026-11-13", "mission_day": 75, "peak_force_kn": 2.26, "reps": 12, "load_kg": 140.0, "strength_index": 92.2, "trend": -1.3, "status": "Optimal", "notes": "Current peak force 2.26 kN. High compliance."},
        {"muscle_group": "Hamstrings & Lower Back", "exercise_type": "ARED Deadlift", "date": "2026-11-13", "mission_day": 75, "peak_force_kn": 1.99, "reps": 10, "load_kg": 134.0, "strength_index": 92.6, "trend": -0.9, "status": "Optimal", "notes": "Strong form, steady ground reaction force curve."},
        {"muscle_group": "Gastrocnemius & Soleus", "exercise_type": "ARED Heel Raise", "date": "2026-11-13", "mission_day": 75, "peak_force_kn": 1.49, "reps": 15, "load_kg": 106.0, "strength_index": 90.3, "trend": -1.8, "status": "Attention", "notes": "Attention flag: Recommend adding explosive heel hops."},
        {"muscle_group": "Upper Body & Latissimus", "exercise_type": "ARED Bench Pull", "date": "2026-11-13", "mission_day": 75, "peak_force_kn": 1.79, "reps": 12, "load_kg": 93.0, "strength_index": 96.8, "trend": -2.1, "status": "Optimal", "notes": "Upper body isometric hold duration exemplary."}
    ]
    for m in muscle_data:
        db.add(MuscleMeasurement(**m))

    # 4. Radiation Exposure Readings (Simulated Dosimetry Data)
    rad_data = [
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-08-31", "mission_day": 1, "daily_dose_mgy": 0.52, "cumulative_dose_mgy": 0.52, "dose_rate_microgy_hr": 21.6, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Baseline deep space GCR flux detected."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-09-09", "mission_day": 10, "daily_dose_mgy": 0.55, "cumulative_dose_mgy": 5.34, "dose_rate_microgy_hr": 22.9, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Quiet solar magnetosphere conditions."},
        {"dosimeter_type": "Active TRD Dosimeter", "date": "2026-09-19", "mission_day": 20, "daily_dose_mgy": 0.54, "cumulative_dose_mgy": 10.78, "dose_rate_microgy_hr": 22.5, "location": "Columbus Science Lab", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Detector synchronised with ground mission control."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-09-29", "mission_day": 30, "daily_dose_mgy": 0.57, "cumulative_dose_mgy": 16.32, "dose_rate_microgy_hr": 23.8, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Month 1 cumulative dosimeter tally validated."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-10-09", "mission_day": 40, "daily_dose_mgy": 0.56, "cumulative_dose_mgy": 21.95, "dose_rate_microgy_hr": 23.3, "location": "Cupola Observation Dome", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Minor +12% dose rate bump while stationed in Cupola."},
        {"dosimeter_type": "Active TRD Dosimeter", "date": "2026-10-19", "mission_day": 50, "daily_dose_mgy": 0.58, "cumulative_dose_mgy": 27.68, "dose_rate_microgy_hr": 24.1, "location": "Deep Space Habitat - Core", "solar_event_level": "Minor Flare (B9.1)", "status": "Normal", "notes": "Minor coronal flare observed by solar telescope."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-10-29", "mission_day": 60, "daily_dose_mgy": 0.56, "cumulative_dose_mgy": 33.34, "dose_rate_microgy_hr": 23.3, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Day 60 evaluation confirms sub-linear accumulation."},
        {"dosimeter_type": "Active TRD Dosimeter", "date": "2026-11-06", "mission_day": 68, "daily_dose_mgy": 1.18, "cumulative_dose_mgy": 38.12, "dose_rate_microgy_hr": 49.2, "location": "Sleep Quarters Storm Shelter", "solar_event_level": "Solar Flare (C4.2) / SPE-1", "status": "Warning", "notes": "Solar flare particle flux spike. Crew held in Storm Shelter for 4.5 hours."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-11-12", "mission_day": 74, "daily_dose_mgy": 0.58, "cumulative_dose_mgy": 41.52, "dose_rate_microgy_hr": 24.1, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Solar wind particle flux returned to nominal baseline."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-11-13", "mission_day": 75, "daily_dose_mgy": 0.55, "cumulative_dose_mgy": 42.07, "dose_rate_microgy_hr": 22.9, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Nominal GCR background monitoring."},
        {"dosimeter_type": "Crew Personal Dosimeter (CPD)", "date": "2026-11-14", "mission_day": 76, "daily_dose_mgy": 0.53, "cumulative_dose_mgy": 42.60, "dose_rate_microgy_hr": 22.1, "location": "Deep Space Habitat - Core", "solar_event_level": "Nominal (G0)", "status": "Normal", "notes": "Current Day 76 cumulative reading: 42.60 mGy."}
    ]
    for r in rad_data:
        db.add(RadiationReading(**r))

    # 5. Health Alerts (Demonstrative 3-level alerts)
    alerts_data = [
        {
            "title": "Femoral Neck Trabecular Density Resorption Advisory",
            "category": "Bone Health",
            "severity": "YELLOW",
            "description": "Femoral neck BMD has decreased by -1.81% from pre-flight baseline at Mission Day 75 (T-score -0.01). While within allowable bounds, current velocity warrants preventive countermeasure reinforcement.",
            "recommended_action": "Increase ARED axial squat compressive loading by +8 kg during next 3 cycles. Confirm daily 800 IU Vitamin D3 & 1200 mg Calcium Citrate intake.",
            "status": "Active",
            "mission_day": 75,
            "timestamp": "2026-11-13 14:22 UTC"
        },
        {
            "title": "Solar Flare (C4.2) Proton Advisory — Storm Shelter Cleared",
            "category": "Radiation Exposure",
            "severity": "YELLOW",
            "description": "Solar coronal mass ejection event CME-2026-11-06 caused transient dose rate elevation to 49.2 µGy/h. Safe shelter protocol executed. Ambient flux has returned to nominal baseline (22.1 µGy/h).",
            "recommended_action": "Verify personal dosimeter battery level. Crew cleared to resume normal module duties. Continue automated SPE telemetry monitoring.",
            "status": "Acknowledged",
            "mission_day": 68,
            "timestamp": "2026-11-06 18:45 UTC"
        },
        {
            "title": "Spinal Axial Elongation & Lumbar Decompression Alert",
            "category": "Bone Health",
            "severity": "YELLOW",
            "description": "Spinal elongation of +4.2 cm detected via optical anthropometric grid. Astronaut reports mild morning paraspinal tightness consistent with intervertebral disc hyper-hydration.",
            "recommended_action": "Conduct 15 minutes of evening targeted lumbar core flexion exercises. Ensure sleeping bag restraint harness provides nominal axial pre-tensioning.",
            "status": "Active",
            "mission_day": 72,
            "timestamp": "2026-11-10 09:15 UTC"
        },
        {
            "title": "ARED Resistive Protocol High Adherence Commendation",
            "category": "Exercise Compliance",
            "severity": "GREEN",
            "description": "Astronaut completed 94.2% of scheduled resistance cycles across past 14 mission days. Quadriceps peak concentric force retention exceeds cohort median by +4.8%.",
            "recommended_action": "Maintain current high-intensity microgravity conditioning protocol. Flight surgeon concurs with exercise telemetry.",
            "status": "Active",
            "mission_day": 76,
            "timestamp": "2026-11-14 08:30 UTC"
        }
    ]
    for a in alerts_data:
        db.add(HealthAlert(**a))

    # 6. Recommendations
    rec_data = [
        # Bone Health
        {
            "category": "Bone Health",
            "title": "High-Load Axial Compressive ARED Protocols",
            "description": "Execute bilateral squats and Romanian deadlifts at minimum 85% 1-RM (>140 kg equivalent) to induce skeletal osteogenic mechanotransduction.",
            "priority": "High",
            "frequency": "Daily",
            "completed": False,
            "protocol_ref": "NASA-STD-3001-VOL1 (Bone Preservation)"
        },
        {
            "category": "Bone Health",
            "title": "Targeted Micronutrient & Vitamin D3 Ingestion",
            "description": "Consume 800 IU Cholecalciferol (Vitamin D3) and 1200 mg bioavailable Calcium Citrate with evening ration to counter microgravity hypercalciuria.",
            "priority": "Medium",
            "frequency": "Daily",
            "completed": True,
            "protocol_ref": "NASA Nutritional Biochemistry Lab Protocol"
        },
        {
            "category": "Bone Health",
            "title": "Calcaneus & Tibial Ultrasound Velocity Mapping",
            "description": "Perform bi-weekly quantitative ultrasound (QUS) measurement of heel speed of sound (SOS) to track trabecular elasticity changes.",
            "priority": "Medium",
            "frequency": "Bi-weekly",
            "completed": True,
            "protocol_ref": "QUS-CALC-STD-v4"
        },
        {
            "category": "Bone Health",
            "title": "Ground Medical Teleconference with Dr. Vance",
            "description": "Review Day 75 DEXA and ultrasound findings during scheduled private medical teleconference (PMC) with Flight Surgeon.",
            "priority": "Routine",
            "frequency": "Weekly",
            "completed": False,
            "protocol_ref": "PMC-MEDOPS-CH4"
        },

        # Muscle Health
        {
            "category": "Muscle Health",
            "title": "Preserve 2.5-Hour Daily Physical Countermeasure Block",
            "description": "Maintain mandatory 2.5-hour scheduled countermeasure block (ARED resistance 60 min, T-VIS treadmill 30 min, Cycle Ergometer CEVIS 30 min).",
            "priority": "High",
            "frequency": "Daily",
            "completed": True,
            "protocol_ref": "ASCR Spaceflight Conditioning Protocol"
        },
        {
            "category": "Muscle Health",
            "title": "Myofibrillar Protein Intake Optimization (>1.4 g/kg)",
            "description": "Verify high biological value protein intake (>110 g/day) split across 4 feeding windows to stimulate mTOR and counteract myofibrillar atrophy.",
            "priority": "Medium",
            "frequency": "Daily",
            "completed": True,
            "protocol_ref": "ISSN Spaceflight Nutritional Advisory"
        },
        {
            "category": "Muscle Health",
            "title": "Calf Plantarflexion Explosive Plyometrics",
            "description": "Incorporate 3 sets of 15 explosive eccentric heel drops on ARED to protect slow-twitch soleus muscle fiber cross-sectional area.",
            "priority": "High",
            "frequency": "Daily",
            "completed": False,
            "protocol_ref": "Soleus Atrophy Mitigation Protocol"
        },
        {
            "category": "Muscle Health",
            "title": "Weekly Neuromuscular Fatigue & Dynamometer Log",
            "description": "Perform handgrip dynamometer and maximal voluntary isometric contraction (MVIC) tests to measure central neuromuscular recruitment.",
            "priority": "Routine",
            "frequency": "Weekly",
            "completed": False,
            "protocol_ref": "MVIC-NEURO-76"
        },

        # Radiation Protection
        {
            "category": "Radiation Protection",
            "title": "Storm Shelter Readiness Protocol Verification",
            "description": "Ensure personal sleep quarters storm shelter water walls and hydrogen-rich polyethylene shielding are deployed and unobstructed.",
            "priority": "High",
            "frequency": "Weekly",
            "completed": True,
            "protocol_ref": "SPE Storm Shelter Operating Procedure"
        },
        {
            "category": "Radiation Protection",
            "title": "Personal Active Dosimeter (TRD) Synchronization",
            "description": "Connect Time-Resolved Dosimeter to habitat telemetry bus at 20:00 UTC for automated telemetry dump to NASA Space Radiation Analysis Group (SRAG).",
            "priority": "Routine",
            "frequency": "Daily",
            "completed": True,
            "protocol_ref": "SRAG Dosimetry Protocol v5"
        },
        {
            "category": "Radiation Protection",
            "title": "Automated Solar Weather Telemetry Monitoring",
            "description": "Review automated GOES/SOHO coronal mass ejection notifications prior to any planned robotic arm or airlock maintenance activity.",
            "priority": "High",
            "frequency": "Daily",
            "completed": False,
            "protocol_ref": "NOAA Space Weather Prediction Center Sync"
        },

        # Daily Wellness
        {
            "category": "Daily Wellness",
            "title": "Target 8-Hour Circadian Rest in Darkened Bunk",
            "description": "Maintain regular 22:00 - 06:00 UTC rest cycle in acoustic-dampened sleep compartment with circadian dynamic blue-depleted lighting.",
            "priority": "Medium",
            "frequency": "Daily",
            "completed": True,
            "protocol_ref": "Behavioral Health & Performance (BHP)"
        },
        {
            "category": "Daily Wellness",
            "title": "Electrolyte & Hydration Logging (2.8 L / Day)",
            "description": "Ensure minimum fluid intake of 2.8 liters with balanced potassium and sodium electrolytes to mitigate microgravity hypovolemia.",
            "priority": "High",
            "frequency": "Daily",
            "completed": False,
            "protocol_ref": "Fluid Shift Mitigation Standard"
        },
        {
            "category": "Daily Wellness",
            "title": "Spinal Axial Decompression Pre-Sleep Routine",
            "description": "Perform 10 minutes of gentle spinal curl and thoracic extension to alleviate paraspinal muscle hypertonicity before securing into sleep restraint.",
            "priority": "Medium",
            "frequency": "Daily",
            "completed": False,
            "protocol_ref": "Astronaut Spine Health Initiative"
        }
    ]
    for r in rec_data:
        db.add(Recommendation(**r))

    # 7. Daily Checklist
    checklist_data = [
        {"title": "07:00 UTC — Morning Vitals: Resting HR, SpO2 & Blood Pressure Check", "category": "Biometrics", "completed": True, "scheduled_time": "07:00 UTC", "mission_day": 76},
        {"title": "08:30 UTC — ARED Heavy Resistance Session: Squats & Deadlifts (140 kg)", "category": "Exercise", "completed": True, "scheduled_time": "08:30 UTC", "mission_day": 76},
        {"title": "11:00 UTC — T-VIS Treadmill High-Intensity Cardiovascular Intervals (30 min)", "category": "Exercise", "completed": True, "scheduled_time": "11:00 UTC", "mission_day": 76},
        {"title": "13:30 UTC — Mid-day Hydration (1.6 L logged) & Electrolyte Pack Ingestion", "category": "Nutrition", "completed": True, "scheduled_time": "13:30 UTC", "mission_day": 76},
        {"title": "16:00 UTC — Personal Dosimeter (CPD) Telemetry Sync & SRAG Handshake", "category": "Radiation", "completed": False, "scheduled_time": "16:00 UTC", "mission_day": 76},
        {"title": "18:30 UTC — Calcaneus Quantitative Ultrasound (QUS) Velocity Profiling", "category": "Bone Health", "completed": False, "scheduled_time": "18:30 UTC", "mission_day": 76},
        {"title": "21:00 UTC — Pre-sleep Lumbar Core Flexion & Cognitive PVT Readiness Test", "category": "Wellness", "completed": False, "scheduled_time": "21:00 UTC", "mission_day": 76}
    ]
    for c in checklist_data:
        db.add(DailyChecklist(**c))

    db.commit()
    print("Database seeding completed successfully.")
