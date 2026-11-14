import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_health_report_pdf(astronaut, bone_records, muscle_records, radiation_records, alerts) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles matching our dark futuristic & clean medical document theme
    primary_blue = colors.HexColor("#0B1C32")
    accent_cyan = colors.HexColor("#27D9E8")
    accent_blue = colors.HexColor("#3987FF")
    text_dark = colors.HexColor("#1A2B42")
    border_color = colors.HexColor("#CBD5E1")
    header_bg = colors.HexColor("#10243D")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_blue,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=primary_blue,
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=text_dark
    )

    elements = []

    # Header
    elements.append(Paragraph("ASTRAHEALTH — Space Crew Health Intelligence System", title_style))
    elements.append(Paragraph(
        f"OFFICIAL MISSION MEDICAL REPORT | MISSION AURORA-1 | GENERATED: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}<br/>"
        "<b>CLASSIFICATION:</b> CREW HEALTH / FLIGHT SURGEON EYES ONLY — SIMULATED DEMO DATA",
        subtitle_style
    ))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=accent_cyan, spaceBefore=2, spaceAfter=10))

    # Astronaut Info Box
    current_day = astronaut.current_mission_day if astronaut else 76
    astronaut_info_data = [
        [
            Paragraph(f"<b>Astronaut Name:</b> {astronaut.name if astronaut else 'Commander Alex Morgan'}", body_style),
            Paragraph(f"<b>Astronaut ID:</b> {astronaut.astronaut_id if astronaut else 'AST-2026-X88'}", body_style),
            Paragraph(f"<b>Blood Type:</b> {astronaut.blood_group if astronaut else 'O-Positive'}", body_style)
        ],
        [
            Paragraph(f"<b>Mission:</b> {astronaut.mission_name if astronaut else 'AURORA-1'}", body_style),
            Paragraph(f"<b>Mission Day:</b> {current_day} / {astronaut.mission_duration if astronaut else 180}", body_style),
            Paragraph(f"<b>Flight Surgeon:</b> {astronaut.lead_flight_surgeon if astronaut else 'Dr. Sarah Vance, MD'}", body_style)
        ]
    ]
    info_table = Table(astronaut_info_data, colWidths=[200, 160, 180])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ('BOX', (0, 0), (-1, -1), 1, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 10))

    # Executive Vitals Snapshot
    latest_rad = radiation_records[-1].cumulative_dose_mgy if radiation_records else 42.6
    elements.append(Paragraph("1. Executive Physiological Status", section_heading))
    vitals_data = [
        ["Health Metric", "Current Measurement", "Mission Baseline", "Status", "Risk Assessment"],
        ["Bone Mineral Density (Femur)", "-1.8%", "0.0% (T-Score +0.2)", "Attention", "Expected microgravity bone resorption"],
        ["Muscle Strength Index", "92.4%", "100.0%", "Optimal", "High ARED resistance compliance"],
        ["Cumulative Radiation Dose", f"{latest_rad:.1f} mGy", "0.0 mGy", "Normal", "Safe margin (Projected Day 180: ~104 mGy)"],
        ["Resting Heart Rate", "54 bpm", "54 bpm", "Optimal", "Cardiovascular tone preserved"],
        ["VO2 Max (Aerobic)", "50.8 ml/kg/min", "52.4 ml/kg/min", "Optimal", "T-VIS treadmill training nominal"]
    ]
    vitals_table = Table(vitals_data, colWidths=[140, 100, 100, 70, 130])
    vitals_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8.5),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
    ]))
    elements.append(vitals_table)
    elements.append(Spacer(1, 10))

    # Bone Health Readings Table
    elements.append(Paragraph("2. Bone Mineral Density & Ultrasound History", section_heading))
    bone_headers = [["Anatomical Site", "Type", "Date", "Day", "Value", "Change %", "Status"]]
    for b in bone_records[-5:]:
        bone_headers.append([
            b.site,
            b.measurement_type,
            b.date,
            f"Day {b.mission_day}",
            f"{b.value} {b.unit}",
            f"{b.change_pct:+.1f}%",
            b.status
        ])
    b_table = Table(bone_headers, colWidths=[110, 80, 70, 50, 90, 60, 80])
    b_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    elements.append(b_table)
    elements.append(Spacer(1, 10))

    # Muscle Strength & ARED Telemetry Table
    elements.append(Paragraph("3. Muscle Performance & ARED Telemetry", section_heading))
    muscle_headers = [["Muscle Group", "Exercise Type", "Date", "Day", "Peak Force", "Load", "Strength Index", "Status"]]
    for m in muscle_records[-5:]:
        muscle_headers.append([
            m.muscle_group,
            m.exercise_type,
            m.date,
            f"Day {m.mission_day}",
            f"{m.peak_force_kn:.2f} kN",
            f"{m.load_kg:.0f} kg",
            f"{m.strength_index:.1f}%",
            m.status
        ])
    m_table = Table(muscle_headers, colWidths=[90, 80, 65, 45, 70, 55, 75, 60])
    m_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    elements.append(m_table)
    elements.append(Spacer(1, 10))

    # Space Radiation & Dosimetry
    elements.append(Paragraph("4. Radiation Dosimetry & Space Weather Status", section_heading))
    rad_headers = [["Date", "Day", "Dosimeter", "Daily Dose", "Cumulative", "Dose Rate", "Solar Event"]]
    for r in radiation_records[-5:]:
        rad_headers.append([
            r.date,
            f"Day {r.mission_day}",
            r.dosimeter_type.split("(")[0].strip()[:18],
            f"{r.daily_dose_mgy:.2f} mGy",
            f"{r.cumulative_dose_mgy:.1f} mGy",
            f"{r.dose_rate_microgy_hr:.1f} µGy/h",
            r.solar_event_level[:18]
        ])
    r_table = Table(rad_headers, colWidths=[70, 45, 110, 75, 75, 75, 90])
    r_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    elements.append(r_table)
    elements.append(Spacer(1, 10))

    # Active Alerts & Escalation Procedures
    elements.append(Paragraph("5. Active Medical Alerts & Directives", section_heading))
    alert_headers = [["Severity", "Alert Title", "Category", "Recommended Clinical Countermeasure"]]
    for a in alerts[:4]:
        alert_headers.append([
            a.severity,
            a.title,
            a.category,
            a.recommended_action[:65] + ("..." if len(a.recommended_action) > 65 else "")
        ])
    a_table = Table(alert_headers, colWidths=[65, 130, 95, 250])
    a_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_bg),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    elements.append(a_table)
    elements.append(Spacer(1, 15))

    # Flight Surgeon Sign-off Section
    sign_data = [
        [
            Paragraph("<b>Flight Surgeon Sign-off:</b><br/>Dr. Sarah Vance, MD<br/>NASA Johnson Space Center - Flight Medicine Clinic", body_style),
            Paragraph("<b>Crew Medical Officer (CMO):</b><br/>Dr. Elena Rostov, MD<br/>AURORA-1 Mission Onboard Health Station", body_style),
            Paragraph("<b>NASA Space Apps Challenge 2026:</b><br/>Team: Mai & Cosmo | Loaf | Moo<br/>ASTRAHEALTH Prototype Evaluation", body_style)
        ]
    ]
    sign_table = Table(sign_data, colWidths=[180, 180, 180])
    sign_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
    ]))
    elements.append(sign_table)

    doc.build(elements)
    buffer.seek(0)
    return buffer
