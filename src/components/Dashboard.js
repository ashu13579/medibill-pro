import React, { useState, useEffect } from 'react';
import { getAllRecords } from '../utils/database';
import { Package, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { isExpired, isNearExpiry } from '../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    expired: 0,
    nearExpiry: 0,
    todaySales: 0,
    monthSales: 0
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const medicines = await getAllRecords('medicines');
      const invoices = await getAllRecords('invoices');

      const today = new Date().toDateString();
      const thisMonth = new Date().getMonth();

      const todaySales = invoices
        .filter(inv => new Date(inv.date).toDateString() === today)
        .reduce((sum, inv) => sum + inv.netAmount, 0);

      const monthSales = invoices
        .filter(inv => new Date(inv.date).getMonth() === thisMonth)
        .reduce((sum, inv) => sum + inv.netAmount, 0);

      const lowStock = medicines.filter(m => m.stock <= (m.minStock || 10)).length;
      const expired = medicines.filter(m => isExpired(m.expiry)).length;
      const nearExpiry = medicines.filter(m => isNearExpiry(m.expiry, 90)).length;

      setStats({
        totalMedicines: medicines.length,
        lowStock,
        expired,
        nearExpiry,
        todaySales,
        monthSales
      });

      // Generate alerts
      const alertList = [];
      
      medicines.forEach(med => {
        if (isExpired(med.expiry)) {
          alertList.push({
            type: 'danger',
            message: `${med.name} (Batch: ${med.batch}) has expired`,
            date: med.expiry
          });
        } else if (isNearExpiry(med.expiry, 30)) {
          alertList.push({
            type: 'warning',
            message: `${med.name} (Batch: ${med.batch}) expiring soon`,
            date: med.expiry
          });
        }
        
        if (med.stock <= (med.minStock || 10)) {
          alertList.push({
            type: 'warning',
            message: `${med.name} is low on stock (${med.stock} units)`,
            stock: med.stock
          });
        }
      });

      setAlerts(alertList.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  return (
    <div className="dashboard" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="page-title">Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe' }}>
            <Package size={24} color="#2563eb" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Medicines</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stats.totalMedicines}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef3c7' }}>
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Low Stock</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stats.lowStock}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2' }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Expired</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stats.expired}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef3c7' }}>
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Near Expiry</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stats.nearExpiry}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d1fae5' }}>
            <TrendingUp size={24} color="#10b981" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Today's Sales</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>₹{stats.todaySales.toFixed(2)}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d1fae5' }}>
            <FileText size={24} color="#10b981" />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Month Sales</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>₹{stats.monthSales.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Alerts & Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((alert, index) => (
              <div key={index} className={`alert alert-${alert.type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={16} />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;