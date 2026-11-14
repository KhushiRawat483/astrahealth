import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AboutProjectModal } from './components/AboutProjectModal';
import { SimulatedSolarStormAlert } from './components/SimulatedSolarStormAlert';
import { Dashboard } from './pages/Dashboard';
import { BoneMuscleHealth } from './pages/BoneMuscleHealth';
import { RadiationMonitoring } from './pages/RadiationMonitoring';
import { AIHealthInsights } from './pages/AIHealthInsights';
import { PreventiveCare } from './pages/PreventiveCare';
import { HealthReports } from './pages/HealthReports';
import { AstronautProfile } from './pages/AstronautProfile';
import { HealthAlert } from './types';
import { api } from './api';

// Main Application Layout (Direct Access — No Login or Authentication Required)
const MainLayout: React.FC<{
  children: React.ReactNode;
  onOpenAbout: () => void;
  onTriggerSolarStorm: () => void;
}> = ({ children, onOpenAbout, onTriggerSolarStorm }) => {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);

  const fetchAlerts = async () => {
    try {
      const res = await api.getAlerts();
      setAlerts(res);
    } catch (err) {
      console.error('Failed to fetch alerts for navbar', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-[#071426] text-[#F2F7FF] flex">
      {/* Sidebar */}
      <Sidebar
        onOpenAbout={onOpenAbout}
        isOpenMobile={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar
          onToggleSidebar={() => setSidebarOpenMobile(!sidebarOpenMobile)}
          alerts={alerts}
          onAlertUpdated={fetchAlerts}
          onTriggerSolarStorm={onTriggerSolarStorm}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[#1E3A5F]/70 py-4 px-6 text-center text-xs font-mono text-[#8FA8C3] bg-[#071426]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>ASTRAHEALTH • NASA Space Apps Challenge 2026 Prototype</span>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAbout}
                className="text-cyan-400 hover:underline"
              >
                Team: Mai & Cosmo | Loaf | Moo
              </button>
              <span>•</span>
              <span className="text-gray-500">SIMULATED MISSION TELEMETRY</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStormAlertOpen, setIsStormAlertOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Direct access to all pages without authentication */}
        <Route
          path="/"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <Dashboard onTriggerSolarStorm={() => setIsStormAlertOpen(true)} />
            </MainLayout>
          }
        />

        <Route
          path="/bone-muscle"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <BoneMuscleHealth />
            </MainLayout>
          }
        />

        <Route
          path="/radiation"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <RadiationMonitoring />
            </MainLayout>
          }
        />

        <Route
          path="/ai-insights"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <AIHealthInsights />
            </MainLayout>
          }
        />

        <Route
          path="/preventive-care"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <PreventiveCare />
            </MainLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <HealthReports />
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout
              onOpenAbout={() => setIsAboutOpen(true)}
              onTriggerSolarStorm={() => setIsStormAlertOpen(true)}
            >
              <AstronautProfile />
            </MainLayout>
          }
        />

        {/* Redirect any legacy /login or unknown routes directly to dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals */}
      <AboutProjectModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <SimulatedSolarStormAlert
        isOpen={isStormAlertOpen}
        onClose={() => setIsStormAlertOpen(false)}
        onLoggedSpike={() => {
          setIsStormAlertOpen(false);
          window.location.reload();
        }}
      />
    </BrowserRouter>
  );
};

export default App;
