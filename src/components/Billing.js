import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Printer, Save, Search } from 'lucide-react';
import { getAllRecords, addRecord, updateRecord } from '../utils/database';
import { generateInvoiceNumber, numberToWords, calculateRoundOff, isExpired } from '../utils/helpers';
import { downloadInvoicePDF, printInvoice } from '../utils/pdfGenerator';

const Billing = () => {
  const [medicines, setMedicines] = useState([]);
  const [settings, setSettings] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  
  const [invoice, setInvoice] = useState({
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerPan: '',
    paymentMode: 'CASH',
    items: [],
    remarks: '',
    total: 0,
    discount: 0,
    ccOnFree: 0,
    roundOff: 0,
    netAmount: 0,
    amountInWords: '',
    miti: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.discount, invoice.ccOnFree]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = medicines.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !isExpired(med.expiry) &&
        med.stock > 0
      ).slice(0, 10);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery, medicines]);

  const loadData = async () => {
    try {
      const meds = await getAllRecords('medicines');
      setMedicines(meds);

      const settingsData = await getAllRecords('settings');
      const settingsObj = {};
      settingsData.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);

      const invoices = await getAllRecords('invoices');
      const lastInvoice = invoices[invoices.length - 1];
      const newInvoiceNo = generateInvoiceNumber(lastInvoice?.invoiceNo);
      
      setInvoice(prev => ({ ...prev, invoiceNo: newInvoiceNo }));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addItemToInvoice = (medicine) => {
    const existingItem = invoice.items.find(item => item.medicineId === medicine.id);
    
    if (existingItem) {
      alert('Medicine already added. Please update quantity.');
      return;
    }

    const newItem = {
      medicineId: medicine.id,
      description: medicine.name,
      packing: medicine.packing,
      batch: medicine.batch,
      expiry: medicine.expiry,
      quantity: 1,
      qtyDiscount: 0,
      rate: medicine.saleRate,
      amount: medicine.saleRate,
      mrp: medicine.mrp,
      remarks: '',
      availableStock: medicine.stock
    };

    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    
    setSearchQuery('');
    setShowSearch(false);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...invoice.items];
    const item = updatedItems[index];
    
    if (field === 'quantity') {
      const qty = parseFloat(value) || 0;
      if (qty > item.availableStock) {
        alert(`Only ${item.availableStock} units available in stock`);
        return;
      }
      item.quantity = qty;
    } else if (field === 'qtyDiscount') {
      item.qtyDiscount = parseFloat(value) || 0;
    } else if (field === 'rate') {
      item.rate = parseFloat(value) || 0;
    } else if (field === 'remarks') {
      item.remarks = value;
    }
    
    item.amount = (item.quantity - item.qtyDiscount) * item.rate;
    
    setInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const afterDiscount = total - invoice.discount + invoice.ccOnFree;
    const roundOff = parseFloat(calculateRoundOff(afterDiscount));
    const netAmount = Math.round(afterDiscount);
    const amountInWords = numberToWords(netAmount);

    setInvoice(prev => ({
      ...prev,
      total,
      roundOff,
      netAmount,
      amountInWords
    }));
  };

  const saveInvoice = async () => {
    if (invoice.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    if (!invoice.customerName) {
      alert('Please enter customer name');
      return;
    }

    try {
      const invoiceData = {
        ...invoice,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      await addRecord('invoices', invoiceData);

      for (const item of invoice.items) {
        const medicine = medicines.find(m => m.id === item.medicineId);
        if (medicine) {
          const updatedStock = medicine.stock - (item.quantity - item.qtyDiscount);
          await updateRecord('medicines', {
            ...medicine,
            stock: updatedStock,
            updatedAt: new Date().toISOString()
          });

          await addRecord('stockTransactions', {
            medicineId: item.medicineId,
            type: 'sale',
            quantity: -(item.quantity - item.qtyDiscount),
            invoiceNo: invoice.invoiceNo,
            date: new Date().toISOString()
          });
        }
      }

      alert('Invoice saved successfully!');
      resetInvoice();
      loadData();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    }
  };

  const resetInvoice = () => {
    getAllRecords('invoices').then(invs => {
      const lastInvoice = invs[invs.length - 1];
      const newInvoiceNo = generateInvoiceNumber(lastInvoice?.invoiceNo);
      
      setInvoice({
        invoiceNo: newInvoiceNo,
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerPan: '',
        paymentMode: 'CASH',
        items: [],
        remarks: '',
        total: 0,
        discount: 0,
        ccOnFree: 0,
        roundOff: 0,
        netAmount: 0,
        amountInWords: '',
        miti: ''
      });
    });
  };

  const handleDownloadPDF = () => {
    if (invoice.items.length === 0) {
      alert('Please add items to generate invoice');
      return;
    }
    downloadInvoicePDF(invoice, settings);
  };

  const handlePrint = () => {
    if (invoice.items.length === 0) {
      alert('Please add items to print invoice');
      return;
    }
    printInvoice(invoice, settings);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title">Create Invoice</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleDownloadPDF}>
            <Download size={18} />
            PDF
          </button>
          <button className="btn btn-success" onClick={saveInvoice}>
            <Save size={20} />
            Save Invoice
          </button>
        </div>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Invoice No</label>
            <input
              type="text"
              className="form-input"
              value={invoice.invoiceNo}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={invoice.date}
              onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Mode</label>
            <select
              className="form-select"
              value={invoice.paymentMode}
              onChange={(e) => setInvoice({ ...invoice, paymentMode: e.target.value })}
            >
              <option value="CASH">Cash</option>
              <option value="CREDIT">Credit</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              className="form-input"
              value={invoice.customerName}
              onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={invoice.customerPhone}
              onChange={(e) => setInvoice({ ...invoice, customerPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={invoice.customerAddress}
              onChange={(e) => setInvoice({ ...invoice, customerAddress: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">PAN</label>
            <input
              type="text"
              className="form-input"
              value={invoice.customerPan}
              onChange={(e) => setInvoice({ ...invoice, customerPan: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Add Items</h3>
        </div>
        
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
            <Search size={20} />
            <input
              type="text"
              className="form-input"
              placeholder="Search medicine by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none' }}
            />
          </div>
          
          {showSearch && searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '0.5rem' }}>
              {searchResults.map(med => (
                <div
                  key={med.id}
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}
                  onClick={() => addItemToInvoice(med)}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{med.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>
                      {med.packing} | Batch: {med.batch} | Stock: {med.stock}
                    </span>
                  </div>
                  <span style={{ fontWeight: '600', color: '#2563eb' }}>₹{med.saleRate.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {invoice.items.length > 0 && (
          <div className="table-container">
            <table style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Description</th>
                  <th>Packing</th>
                  <th>Batch</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Qty Disc</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>MRP</th>
                  <th>Remarks</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.packing}</td>
                    <td>{item.batch}</td>
                    <td>{item.expiry}</td>
                    <td>
                      <input
                        type="number"
                        style={{ width: '70px', padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        min="0"
                        max={item.availableStock}
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        style={{ width: '70px', padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        value={item.qtyDiscount}
                        onChange={(e) => updateItem(index, 'qtyDiscount', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        style={{ width: '70px', padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>₹{item.amount.toFixed(2)}</td>
                    <td>₹{item.mrp.toFixed(2)}</td>
                    <td>
                      <input
                        type="text"
                        style={{ width: '70px', padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        value={item.remarks}
                        onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                        placeholder="Free/Scheme"
                      />
                    </td>
                    <td>
                      <button
                        className="btn-icon btn-icon-danger"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Remarks</label>
          <input
            type="text"
            className="form-input"
            value={invoice.remarks}
            onChange={(e) => setInvoice({ ...invoice, remarks: e.target.value })}
          />
        </div>

        <div style={{ maxWidth: '400px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>TOTAL:</span>
            <span style={{ fontWeight: '600', color: '#111827' }}>₹{invoice.total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Less Discount:</span>
            <input
              type="number"
              style={{ width: '120px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', textAlign: 'right', fontWeight: '600' }}
              value={invoice.discount}
              onChange={(e) => setInvoice({ ...invoice, discount: parseFloat(e.target.value) || 0 })}
              step="0.01"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Add C C on Free:</span>
            <input
              type="number"
              style={{ width: '120px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', textAlign: 'right', fontWeight: '600' }}
              value={invoice.ccOnFree}
              onChange={(e) => setInvoice({ ...invoice, ccOnFree: parseFloat(e.target.value) || 0 })}
              step="0.01"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: '500', color: '#374151' }}>Round Off:</span>
            <span style={{ fontWeight: '600', color: '#111827' }}>₹{invoice.roundOff}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #111827', borderBottom: '2px solid #111827', padding: '0.75rem 0', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2563eb' }}>NET AMOUNT:</span>
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2563eb' }}>₹{invoice.netAmount.toFixed(2)}</span>
          </div>
          <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>
            In Words: {invoice.amountInWords}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;