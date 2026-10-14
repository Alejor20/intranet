import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardView } from './views/DashboardView';
import { SoftwareView } from './views/SoftwareView';
import { DocumentsView } from './views/DocumentsView';
import { InternalAppsView } from './views/InternalAppsView';
import { ControlEquiposApp } from './views/ControlEquiposApp';

const IntranetPortal: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'software' && <SoftwareView />}
        {activeTab === 'documents' && <DocumentsView />}
        {activeTab === 'apps' && <InternalAppsView />}
      </main>
      <Footer />
    </div>
  );
};

const RootView: React.FC = () => {
  const { currentSystem } = useApp();

  if (currentSystem === 'control_equipos') {
    return <ControlEquiposApp />;
  }

  return <IntranetPortal />;
};

export default function App() {
  return (
    <AppProvider>
      <RootView />
    </AppProvider>
  );
}
