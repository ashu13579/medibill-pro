import React, { useState, useEffect } from 'react';
import { Save, Building2 } from 'lucide-react';
import { getAllRecords, addRecord, updateRecord } from '../utils/database';

const Settings = () => {
  const [settings, setSettings] = useState({
    pharmacyName: '',
    address: '',
    phone: '',
    pan: '',
    dda: '',
    drugLicense: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await getAllRecords('settings');
      const settingsObj = {};
      settingsData.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings({
        pharmacyName: settingsObj.pharmacyName || '',
        address: settingsObj.address || '',
        phone: settingsObj.phone || '',
        pan: settingsObj.pan || '',
        dda: settingsObj.dda || '',
        drugLicense: settingsObj.drugLicense || '',
        email: settingsObj.email || ''
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      for (const [key, value] of Object.entries(settings)) {
        const existing = await getAllRecords('settings');
        const existingSetting = existing.find(s => s.key === key);
        
        if (existingSetting) {
          await updateRecord('settings', { key, value });
        } else {
          await addRecord('settings', { key, value });
        }
      }
      
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="page-title">Settings</h2>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '1rem' }}>
            <Building2 size={24} />
          </div>
          <h3 className="card-title">Pharmacy Information</h3>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Pharmacy Name *</label>
            <input
              type="text"
              className="form-input"
              value={settings.pharmacyName}
              onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea
              className="form-input"
              rows="3"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-input"
                value={settings.pan}
                onChange={(e) => setSettings({ ...settings, pan: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">DDA Number</label>
              <input
                type="text"
                className="form-input"
                value={settings.dda}
                onChange={(e) => setSettings({ ...settings, dda: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Drug License Number</label>
            <input
              type="text"
              className="form-input"
              value={settings.drugLicense}
              onChange={(e) => setSettings({ ...settings, drugLicense: e.target.value })}
            />
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={20} />
              Save Settings
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">About MediBill Pro</h3>
        <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#374151' }}>Version:</strong> 1.0.0</p>
          <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#374151' }}>Type:</strong> Offline-First Mobile Application</p>
          <p style={{ marginBottom: '0.75rem' }}><strong style={{ color: '#374151' }}>Storage:</strong> Local IndexedDB</p>
          <p style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            MediBill Pro is a complete medical billing and inventory management system designed for pharmacies and clinics. 
            All data is stored locally on your device for offline access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;