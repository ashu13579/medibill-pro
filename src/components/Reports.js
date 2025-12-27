import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import { getAllRecords } from '../utils/database';
import { formatDate, exportToCSV } from '../utils/helpers';

const Reports = () => {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalInvoices: 0,
    totalItems: 0,
    averageInvoice: 0
  });

  useEffect(() => {
    generateReport();
  }, [reportType, startDate, endDate]);

  const generateReport = async () => {
    try {
      const invoices = await getAllRecords('invoices');
      const medicines = await getAllRecords('medicines');

      let filteredInvoices = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (reportType) {
        case 'daily':
          filteredInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            invDate.setHours(0, 0, 0, 0);
            return invDate.getTime() === today.getTime();
          });
          break;
        case 'monthly':
          const thisMonth = today.getMonth();
          const thisYear = today.getFullYear();
          filteredInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            return invDate.getMonth() === thisMonth && invDate.getFullYear() === thisYear;
          });
          break;
        case 'custom':
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filteredInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.date);
            return invDate >= start && invDate <= end;
          });
          break;
        case 'stock':
          const stockReport = medicines.map(med => ({
            name: med.name,
            packing: med.packing,
            batch: med.batch,
            expiry: med.expiry,
            stock: med.stock,
            mrp: med.mrp,
            value: med.stock * med.purchaseRate,
            category: med.category,
            supplier: med.supplier
          }));
          setReportData(stockReport);
          return;
        case 'expiry':
          const expiryReport = medicines
            .filter(med => {
              const [month, year] = med.expiry.split('/');
              const expiry = new Date(parseInt('20' + year), parseInt(month) - 1);
              const threeMonthsLater = new Date();
              threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
              return expiry <= threeMonthsLater;
            })
            .map(med => ({
              name: med.name,
              batch: med.batch,
              expiry: med.expiry,
              stock: med.stock,
              value: med.stock * med.purchaseRate,
              category: med.category
            }));
          setReportData(expiryReport);
          return;
        default:
          filteredInvoices = invoices;
      }

      const totalSales = filteredInvoices.reduce((sum, inv) => sum + inv.netAmount, 0);
      const totalItems = filteredInvoices.reduce((sum, inv) => sum + inv.items.length, 0);

      setSummary({
        totalSales,
        totalInvoices: filteredInvoices.length,
        totalItems,
        averageInvoice: filteredInvoices.length > 0 ? totalSales / filteredInvoices.length : 0
      });

      const salesReport = filteredInvoices.map(inv => ({
        invoiceNo: inv.invoiceNo,
        date: formatDate(inv.date),
        customerName: inv.customerName,
        items: inv.items.length,
        total: inv.total,
        discount: inv.discount,
        netAmount: inv.netAmount,
        paymentMode: inv.paymentMode
      }));

      setReportData(salesReport);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleExport = () => {
    if (reportData.length === 0) {
      alert('No data to export');
      return;
    }

    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(reportData, filename);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title">Reports & Analytics</h2>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Daily Sales</option>
              <option value="monthly">Monthly Sales</option>
              <option value="custom">Custom Date Range</option>
              <option value="stock">Stock Report</option>
              <option value="expiry">Expiry Report (90 days)</option>
            </select>
          </div>

          {reportType === 'custom' && (
            <>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {(reportType === 'daily' || reportType === 'monthly' || reportType === 'custom') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Sales</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2563eb' }}>₹{summary.totalSales.toFixed(2)}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Invoices</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2563eb' }}>{summary.totalInvoices}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Items Sold</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2563eb' }}>{summary.totalItems}</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Average Invoice</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2563eb' }}>₹{summary.averageInvoice.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          {reportData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(reportData[0]).map(key => (
                    <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>
                        {typeof value === 'number' && !['items', 'stock'].includes(Object.keys(row)[i])
                          ? `₹${value.toFixed(2)}`
                          : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#6b7280' }}>
              <Calendar size={48} color="#9ca3af" />
              <p style={{ marginTop: '1rem', fontSize: '1rem' }}>No data available for the selected period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;