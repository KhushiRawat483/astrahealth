#!/usr/bin/env python3
"""
ASTRAHEALTH — Space Crew Health Intelligence System
Unified Full-Stack Application Launcher
NASA Space Apps Challenge 2026
"""

import os
import sys
import subprocess
import webbrowser
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

def print_banner():
    banner = r"""
       ___   ________________  ___   __  ________  ______  __  __
      /   | / ___/_  __/ __  /   | / / / / ____/   | / / / / / /
     / /| | \__ \ / / / /_/ / /| |/ /_/ / __/ / /| | / /_/ /_/ / 
    / ___ |___/ // / / _, _/ ___ / __  / /___/ ___ |/ __  /_  /  
   /_/  |_/____//_/ /_/ |_/_/  |_/_/ /_/_____/_/  |_/_/ /_/ /_/   
   ================================================================
   Space Crew Health Intelligence & Physiological Monitoring Platform
   NASA Space Apps Challenge 2026 • Expedition AURORA-1
   ================================================================
    """
    print(banner)

def main():
    print_banner()
    print("[*] Project root:", BASE_DIR)
    print("[*] Launching AstraHealth Unified Command Center on http://localhost:8000 ...")

    # Change to backend directory so SQLite and assets resolve properly
    os.chdir(BACKEND_DIR)

    import uvicorn
    # Open browser after a short delay
    def open_browser():
        time.sleep(1.5)
        print("[*] Opening AstraHealth interface in your default browser: http://localhost:8000")
        try:
            webbrowser.open("http://localhost:8000")
        except Exception as e:
            print("[!] Could not open browser automatically:", e)

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Run FastAPI with uvicorn (which serves both the REST API and the built React frontend)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
