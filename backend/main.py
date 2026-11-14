import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import engine, Base, get_db
from models import (
    Astronaut, BoneMeasurement, MuscleMeasurement,
    RadiationReading, HealthAlert, Recommendation, DailyChecklist
)
from schemas import (
    AstronautOut, DashboardSummary,
    BoneMeasurementCreate, BoneMeasurementOut,
    MuscleMeasurementCreate, MuscleMeasurementOut,
    RadiationReadingCreate, RadiationReadingOut,
    HealthAlertCreate, HealthAlertOut, HealthAlertUpdate,
    RecommendationOut, RecommendationToggle,
    DailyChecklistOut, DailyChecklistToggle,
    InsightResponse
)
from rules_engine import evaluate_health_insights
from pdf_generator import generate_health_report_pdf
from seed_data import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ASTRAHEALTH API",
    description="Space Crew Health Intelligence System — Astronaut Health Monitoring Platform",
    version="2.0.0"
)

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    seed_database(db)

@app.get("/api/info")
def root():
    return {
        "system": "ASTRAHEALTH Space Crew Health Intelligence Platform",
        "mission": "AURORA-1",
        "status": "ONLINE",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "telemetry": "CONNECTED"}

# 1. Astronaut Profile
@app.get("/api/astronaut", response_model=AstronautOut)
def get_astronaut(db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    if not astronaut:
        raise HTTPException(status_code=404, detail="Astronaut profile not found")
    return astronaut

# 2. Dashboard Health Summary
@app.get("/api/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    if not astronaut:
        raise HTTPException(status_code=404, detail="Astronaut not found")

    bone_records = db.query(BoneMeasurement).order_by(BoneMeasurement.mission_day.asc()).all()
    muscle_records = db.query(MuscleMeasurement).order_by(MuscleMeasurement.mission_day.asc()).all()
    radiation_records = db.query(RadiationReading).order_by(RadiationReading.mission_day.asc()).all()
    alerts = db.query(HealthAlert).order_by(HealthAlert.id.desc()).all()
    checklist = db.query(DailyChecklist).all()

    # Bone score calculation
    latest_femur = [b for b in bone_records if "Femoral" in b.site or "Hip" in b.site]
    current_femur = latest_femur[-1] if latest_femur else (bone_records[-1] if bone_records else None)
    bone_change = current_femur.change_pct if current_femur else -1.81
    bone_score = max(50, min(100, int(100 + (bone_change * 8.5))))

    # Muscle score calculation
    latest_quads = [m for m in muscle_records if "Squat" in m.exercise_type or "Quad" in m.muscle_group]
    current_quad = latest_quads[-1] if latest_quads else (muscle_records[-1] if muscle_records else None)
    muscle_strength_idx = current_quad.strength_index if current_quad else 92.2
    muscle_score = max(50, min(100, int(muscle_strength_idx * 0.95)))

    # Radiation calculations
    latest_rad = radiation_records[-1] if radiation_records else None
    cumulative_rad = latest_rad.cumulative_dose_mgy if latest_rad else 42.60
    daily_rad = latest_rad.daily_dose_mgy if latest_rad else 0.53

    # Overall Health Risk
    active_critical = any(a.severity == "RED" and a.status == "Active" for a in alerts)
    active_warning = any(a.severity == "YELLOW" and a.status == "Active" for a in alerts)

    if active_critical:
        overall_risk = "HIGH RISK"
        overall_score = 68
    elif active_warning:
        overall_risk = "MODERATE RISK"
        overall_score = 86
    else:
        overall_risk = "LOW RISK"
        overall_score = 94

    # Weekly trend aggregated points
    weekly_trend = [
        {"day": "Day 70", "boneScore": 87, "muscleScore": 93, "radiation": 39.8, "readiness": 91},
        {"day": "Day 71", "boneScore": 87, "muscleScore": 92, "radiation": 40.4, "readiness": 90},
        {"day": "Day 72", "boneScore": 86, "muscleScore": 92, "radiation": 41.0, "readiness": 88},
        {"day": "Day 73", "boneScore": 85, "muscleScore": 93, "radiation": 41.5, "readiness": 89},
        {"day": "Day 74", "boneScore": 85, "muscleScore": 92, "radiation": 42.0, "readiness": 90},
        {"day": "Day 75", "boneScore": 84, "muscleScore": 92, "radiation": 42.4, "readiness": 87},
        {"day": "Day 76", "boneScore": 84, "muscleScore": 92, "radiation": round(cumulative_rad, 2), "readiness": 88},
    ]

    # Bone density trend by mission checkpoints
    bone_trend_map = {}
    for b in bone_records:
        if b.site == "Femoral Neck":
            bone_trend_map[b.mission_day] = b.change_pct
    bone_density_trend = [
        {"missionDay": f"Day {day}", "changePct": change, "targetLimit": -2.5}
        for day, change in sorted(bone_trend_map.items())
    ]

    # Radiation trend points
    rad_trend = [
        {"missionDay": f"Day {r.mission_day}", "cumulativeDose": r.cumulative_dose_mgy, "dailyDose": r.daily_dose_mgy, "solarLevel": r.solar_event_level}
        for r in radiation_records
    ]

    active_alerts_cnt = sum(1 for a in alerts if a.status == "Active")

    return DashboardSummary(
        astronaut=astronaut,
        bone_health_score=bone_score,
        bone_health_status="Attention Required" if bone_change <= -1.8 else "Nominal",
        bone_density_change_pct=bone_change,
        muscle_health_score=muscle_score,
        muscle_health_status="Optimal Retained" if muscle_strength_idx >= 90 else "Attention Required",
        muscle_strength_index=muscle_strength_idx,
        radiation_cumulative_mgy=cumulative_rad,
        radiation_daily_mgy=daily_rad,
        radiation_status="Normal Background Flux",
        overall_health_risk=overall_risk,
        overall_health_score=overall_score,
        exercise_completion_pct=92,
        exercise_time_minutes=135,
        exercise_target_minutes=150,
        active_alerts_count=active_alerts_cnt,
        weekly_trend=weekly_trend,
        bone_density_trend=bone_density_trend,
        radiation_trend=rad_trend,
        recent_alerts=alerts[:4],
        daily_checklist=checklist
    )

# 3. Bone Health Endpoints
@app.get("/api/bone-health")
def get_bone_health(db: Session = Depends(get_db)):
    records = db.query(BoneMeasurement).order_by(BoneMeasurement.mission_day.desc(), BoneMeasurement.id.desc()).all()
    
    # Generate trend series for chart
    femur_series = []
    spine_series = []
    heel_series = []
    for r in sorted(records, key=lambda x: x.mission_day):
        if "Femoral" in r.site:
            femur_series.append({"day": f"D{r.mission_day}", "bmd": r.value, "change": r.change_pct})
        elif "Spine" in r.site:
            spine_series.append({"day": f"D{r.mission_day}", "bmd": r.value, "change": r.change_pct})
        elif "Heel" in r.site:
            heel_series.append({"day": f"D{r.mission_day}", "sos": r.value, "change": r.change_pct})

    return {
        "records": records,
        "femur_series": femur_series,
        "spine_series": spine_series,
        "heel_series": heel_series,
        "spinal_elongation_cm": 4.2,
        "overall_bone_loss_rate_pct_month": 0.72,
        "heel_speed_of_sound_ms": 1538,
        "tibial_cortical_density": 1122,
        "t_score_femoral": -0.01,
        "t_score_spine": 0.22,
        "qct_scan_records": [
            {"date": "2026-08-30", "type": "Pre-flight Baseline qCT", "site": "Distal Tibia & Radius", "trabecular_vBMD": "210 mg/cm³", "cortical_thickness": "3.8 mm", "status": "Baseline"},
            {"date": "2026-11-13", "type": "In-flight In-Habitat CT Scan", "site": "Distal Tibia & Radius", "trabecular_vBMD": "204 mg/cm³ (-2.8%)", "cortical_thickness": "3.75 mm", "status": "Mild Attenuation"}
        ]
    }

@app.post("/api/bone-health", response_model=BoneMeasurementOut)
def create_bone_measurement(data: BoneMeasurementCreate, db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    ast_id = astronaut.astronaut_id if astronaut else "AST-2026-X88"

    # Compute change_pct if previous_value provided
    change = data.change_pct
    if data.previous_value and data.previous_value > 0:
        change = round(((data.value - data.previous_value) / data.previous_value) * 100, 2)

    status = "Optimal"
    if change <= -2.0:
        status = "Alert"
    elif change <= -1.2:
        status = "Attention"

    record = BoneMeasurement(
        astronaut_id=ast_id,
        site=data.site,
        measurement_type=data.measurement_type,
        date=data.date,
        mission_day=data.mission_day,
        value=data.value,
        unit=data.unit,
        previous_value=data.previous_value,
        change_pct=change,
        t_score=data.t_score,
        status=status,
        notes=data.notes
    )
    db.add(record)

    # If severe change, automatically generate a health alert
    if change <= -2.2:
        alert = HealthAlert(
            astronaut_id=ast_id,
            title=f"Significant Bone Resorption at {data.site}",
            category="Bone Health",
            severity="YELLOW",
            description=f"New measurement on Day {data.mission_day} showed {change}% drop in {data.site}. Value: {data.value} {data.unit}.",
            recommended_action="Increase ARED resistance load, review calcium/vit-D regimen, and notify Flight Surgeon.",
            status="Active",
            mission_day=data.mission_day,
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        )
        db.add(alert)

    db.commit()
    db.refresh(record)
    return record

# 4. Muscle Health Endpoints
@app.get("/api/muscle-health")
def get_muscle_health(db: Session = Depends(get_db)):
    records = db.query(MuscleMeasurement).order_by(MuscleMeasurement.mission_day.desc(), MuscleMeasurement.id.desc()).all()
    
    # Group by exercise for progression graphs
    squat_progression = []
    deadlift_progression = []
    for r in sorted(records, key=lambda x: x.mission_day):
        if "Squat" in r.exercise_type:
            squat_progression.append({
                "day": f"D{r.mission_day}",
                "force_kn": r.peak_force_kn,
                "load_kg": r.load_kg,
                "strength_idx": r.strength_index
            })
        elif "Deadlift" in r.exercise_type:
            deadlift_progression.append({
                "day": f"D{r.mission_day}",
                "force_kn": r.peak_force_kn,
                "load_kg": r.load_kg,
                "strength_idx": r.strength_index
            })

    return {
        "records": records,
        "squat_progression": squat_progression,
        "deadlift_progression": deadlift_progression,
        "overall_strength_index": 92.2,
        "muscle_atrophy_risk": "Low-Moderate (Controlled via ARED)",
        "ared_compliance_pct": 94.2,
        "weekly_work_done_kj": 4820,
        "total_resistance_volume_kg": 18450
    }

@app.post("/api/muscle-health", response_model=MuscleMeasurementOut)
def create_muscle_measurement(data: MuscleMeasurementCreate, db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    ast_id = astronaut.astronaut_id if astronaut else "AST-2026-X88"

    status = "Optimal"
    if data.strength_index < 88.0:
        status = "Alert"
    elif data.strength_index < 92.0:
        status = "Attention"

    record = MuscleMeasurement(
        astronaut_id=ast_id,
        muscle_group=data.muscle_group,
        exercise_type=data.exercise_type,
        date=data.date,
        mission_day=data.mission_day,
        peak_force_kn=data.peak_force_kn,
        reps=data.reps,
        load_kg=data.load_kg,
        strength_index=data.strength_index,
        trend=data.trend,
        status=status,
        notes=data.notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

# 5. Radiation Endpoints
@app.get("/api/radiation")
def get_radiation_data(db: Session = Depends(get_db)):
    records = db.query(RadiationReading).order_by(RadiationReading.mission_day.desc()).all()
    latest = records[0] if records else None

    history_chart = [
        {
            "day": f"Day {r.mission_day}",
            "cumulative": r.cumulative_dose_mgy,
            "daily": r.daily_dose_mgy,
            "rate": r.dose_rate_microgy_hr,
            "event": r.solar_event_level
        }
        for r in sorted(records, key=lambda x: x.mission_day)
    ]

    astronaut = db.query(Astronaut).first()
    curr_day = astronaut.current_mission_day if astronaut else 76
    cum_dose = latest.cumulative_dose_mgy if latest else 42.60
    projected_180 = round((cum_dose / max(curr_day, 1)) * 180, 1)

    return {
        "records": records,
        "history_chart": history_chart,
        "current_cumulative_mgy": cum_dose,
        "current_daily_mgy": latest.daily_dose_mgy if latest else 0.53,
        "current_dose_rate_microgy_hr": latest.dose_rate_microgy_hr if latest else 22.1,
        "projected_total_dose_mgy": projected_180,
        "max_allowable_exploration_limit_mgy": 250.0,
        "solar_weather": {
            "cycle": "Solar Cycle 25 (Near Maximum)",
            "status": "Nominal / Low SPE Risk",
            "solar_flare_index": "B4.1 Background",
            "geomagnetic_kp": 2.4,
            "cme_prediction": "No Earth-Gateway Direct CME Expected in Next 48h",
            "storm_shelter_status": "STANDBY — All Hydrogen Water Walls Pressurized"
        },
        "shielding_specs": [
            {"zone": "Core Command Deck", "shielding": "Aluminum-Lithium Alloy + 5g/cm² Carbon Composite", "attenuation": "34%"},
            {"zone": "Crew Sleep Quarters", "shielding": "High-Density Polyethylene + Water Wall Bladders", "attenuation": "68%"},
            {"zone": "Central Storm Shelter", "shielding": "Enclosed Hydrogen Water Tanks + Food Rations", "attenuation": "88% (SPE Storm Haven)"},
            {"zone": "Cupola Observation", "shielding": "Multi-pane Fused Silica + Fused Quartz", "attenuation": "22%"}
        ]
    }

@app.post("/api/radiation", response_model=RadiationReadingOut)
def create_radiation_reading(data: RadiationReadingCreate, db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    ast_id = astronaut.astronaut_id if astronaut else "AST-2026-X88"

    # Auto compute cumulative dose if not supplied
    last_record = db.query(RadiationReading).order_by(RadiationReading.id.desc()).first()
    last_cum = last_record.cumulative_dose_mgy if last_record else 42.0
    new_cum = data.cumulative_dose_mgy if data.cumulative_dose_mgy is not None else round(last_cum + data.daily_dose_mgy, 2)

    status = "Normal"
    if data.daily_dose_mgy > 1.5:
        status = "Critical"
    elif data.daily_dose_mgy > 0.8:
        status = "Warning"

    record = RadiationReading(
        astronaut_id=ast_id,
        dosimeter_type=data.dosimeter_type,
        date=data.date,
        mission_day=data.mission_day,
        daily_dose_mgy=data.daily_dose_mgy,
        cumulative_dose_mgy=new_cum,
        dose_rate_microgy_hr=data.dose_rate_microgy_hr,
        location=data.location,
        solar_event_level=data.solar_event_level,
        status=status,
        notes=data.notes
    )
    db.add(record)

    if status in ["Warning", "Critical"]:
        alert = HealthAlert(
            astronaut_id=ast_id,
            title=f"Radiation Spike ({data.daily_dose_mgy:.2f} mGy/day) Detected",
            category="Radiation Exposure",
            severity="RED" if status == "Critical" else "YELLOW",
            description=f"Dosimeter at {data.location} recorded daily dose of {data.daily_dose_mgy:.2f} mGy with dose rate {data.dose_rate_microgy_hr:.1f} µGy/h. Solar level: {data.solar_event_level}.",
            recommended_action="Execute Storm Shelter relocation protocol if dose rate exceeds 50 µGy/h. Notify SRAG and Flight Surgeon.",
            status="Active",
            mission_day=data.mission_day,
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        )
        db.add(alert)

    db.commit()
    db.refresh(record)
    return record

# 6. Health Alerts Endpoints
@app.get("/api/alerts", response_model=List[HealthAlertOut])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(HealthAlert).order_by(HealthAlert.id.desc()).all()

@app.post("/api/alerts", response_model=HealthAlertOut)
def create_alert(data: HealthAlertCreate, db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    ast_id = astronaut.astronaut_id if astronaut else "AST-2026-X88"

    record = HealthAlert(
        astronaut_id=ast_id,
        title=data.title,
        category=data.category,
        severity=data.severity,
        description=data.description,
        recommended_action=data.recommended_action,
        status=data.status,
        mission_day=data.mission_day,
        timestamp=data.timestamp
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.patch("/api/alerts/{alert_id}", response_model=HealthAlertOut)
def update_alert_status(alert_id: int, payload: HealthAlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(HealthAlert).filter(HealthAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = payload.status
    db.commit()
    db.refresh(alert)
    return alert

# 7. AI Health Insights
@app.get("/api/insights", response_model=InsightResponse)
def get_ai_insights(db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    bone_records = db.query(BoneMeasurement).order_by(BoneMeasurement.mission_day.asc()).all()
    muscle_records = db.query(MuscleMeasurement).order_by(MuscleMeasurement.mission_day.asc()).all()
    radiation_records = db.query(RadiationReading).order_by(RadiationReading.mission_day.asc()).all()

    result = evaluate_health_insights(astronaut, bone_records, muscle_records, radiation_records)
    return result

# 8. Preventive Care Recommendations
@app.get("/api/recommendations", response_model=List[RecommendationOut])
def get_recommendations(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Recommendation)
    if category:
        query = query.filter(Recommendation.category == category)
    return query.order_by(Recommendation.priority.desc(), Recommendation.id.asc()).all()

@app.patch("/api/recommendations/{rec_id}/toggle", response_model=RecommendationOut)
def toggle_recommendation(rec_id: int, payload: RecommendationToggle, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    rec.completed = payload.completed
    db.commit()
    db.refresh(rec)
    return rec

# 9. Daily Checklist
@app.get("/api/checklist", response_model=List[DailyChecklistOut])
def get_checklist(db: Session = Depends(get_db)):
    return db.query(DailyChecklist).order_by(DailyChecklist.id.asc()).all()

@app.patch("/api/checklist/{item_id}/toggle", response_model=DailyChecklistOut)
def toggle_checklist_item(item_id: int, payload: DailyChecklistToggle, db: Session = Depends(get_db)):
    item = db.query(DailyChecklist).filter(DailyChecklist.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    item.completed = payload.completed
    db.commit()
    db.refresh(item)
    return item

# 10. Health Reports & Downloadable PDF
@app.get("/api/reports")
def get_reports_summary(db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    bone_records = db.query(BoneMeasurement).order_by(BoneMeasurement.mission_day.desc()).all()
    muscle_records = db.query(MuscleMeasurement).order_by(MuscleMeasurement.mission_day.desc()).all()
    radiation_records = db.query(RadiationReading).order_by(RadiationReading.mission_day.desc()).all()
    alerts = db.query(HealthAlert).order_by(HealthAlert.id.desc()).all()

    return {
        "report_id": f"REP-AURORA1-D76-{datetime.utcnow().strftime('%Y%m%d')}",
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "astronaut": astronaut,
        "total_bone_evaluations": len(bone_records),
        "total_muscle_sessions": len(muscle_records),
        "total_radiation_logs": len(radiation_records),
        "total_alerts_recorded": len(alerts),
        "mission_days_covered": 76,
        "mission_progress_pct": round((76 / 180) * 100, 1)
    }

@app.get("/api/reports/pdf")
def download_pdf_report(db: Session = Depends(get_db)):
    astronaut = db.query(Astronaut).first()
    bone_records = db.query(BoneMeasurement).order_by(BoneMeasurement.mission_day.asc()).all()
    muscle_records = db.query(MuscleMeasurement).order_by(MuscleMeasurement.mission_day.asc()).all()
    radiation_records = db.query(RadiationReading).order_by(RadiationReading.mission_day.asc()).all()
    alerts = db.query(HealthAlert).order_by(HealthAlert.id.desc()).all()

    pdf_buffer = generate_health_report_pdf(astronaut, bone_records, muscle_records, radiation_records, alerts)
    filename = f"ASTRAHEALTH_Mission_Report_Day{astronaut.current_mission_day if astronaut else 76}.pdf"

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

# Static Frontend & Single-Page Application (SPA) Serving
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Don't intercept /api routes that might 404
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        target_file = os.path.join(DIST_DIR, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

