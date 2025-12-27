import React, { useState, useEffect } from 'react';
import './App.css';
import { initDB } from './utils/database';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Billing from './components/Billing';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { Package, FileText, BarChart3, Settings as SettingsIcon, Home } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize database
    initDB().then(() => {
      setIsLoading(false);
    }).catch(err => {
      console.error('Database initialization failed:', err);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Initializing MediBill Pro...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'billing':
        return <Billing />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>MediBill Pro</h1>
        <p className="subtitle">Medical Billing & Inventory</p>
      </header>

      <main className="app-content">
        {renderContent()}
      </main>

      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={24} />
          <span>Inventory</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <FileText size={24} />
          <span>Billing</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <BarChart3 size={24} />
          <span>Reports</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={24} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;