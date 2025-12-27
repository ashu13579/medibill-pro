import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { getAllRecords, addRecord, updateRecord, deleteRecord } from '../utils/database';
import { isExpired, isNearExpiry } from '../utils/helpers';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    packing: '',
    batch: '',
    expiry: '',
    mrp: '',
    purchaseRate: '',
    saleRate: '',
    stock: '',
    discount: '0',
    category: 'Tablet',
    supplier: '',
    minStock: '10'
  });

  const categories = ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Ointment', 'Drops', 'Other'];

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = medicines.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines(medicines);
    }
  }, [searchQuery, medicines]);

  const loadMedicines = async () => {
    try {
      const data = await getAllRecords('medicines');
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const medicineData = {
        ...formData,
        mrp: parseFloat(formData.mrp),
        purchaseRate: parseFloat(formData.purchaseRate),
        saleRate: parseFloat(formData.saleRate),
        stock: parseFloat(formData.stock),
        discount: parseFloat(formData.discount),
        minStock: parseFloat(formData.minStock),
        createdAt: editingMedicine ? editingMedicine.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingMedicine) {
        await updateRecord('medicines', { ...medicineData, id: editingMedicine.id });
      } else {
        await addRecord('medicines', medicineData);
      }

      loadMedicines();
      closeModal();
    } catch (error) {
      console.error('Error saving medicine:', error);
      alert('Error saving medicine');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      packing: medicine.packing,
      batch: medicine.batch,
      expiry: medicine.expiry,
      mrp: medicine.mrp.toString(),
      purchaseRate: medicine.purchaseRate.toString(),
      saleRate: medicine.saleRate.toString(),
      stock: medicine.stock.toString(),
      discount: medicine.discount.toString(),
      category: medicine.category,
      supplier: medicine.supplier,
      minStock: medicine.minStock?.toString() || '10'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteRecord('medicines', id);
        loadMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
    setFormData({
      name: '',
      packing: '',
      batch: '',
      expiry: '',
      mrp: '',
      purchaseRate: '',
      saleRate: '',
      stock: '',
      discount: '0',
      category: 'Tablet',
      supplier: '',
      minStock: '10'
    });
  };

  const getStockStatus = (medicine) => {
    if (isExpired(medicine.expiry)) return { label: 'Expired', class: 'badge-danger' };
    if (isNearExpiry(medicine.expiry, 30)) return { label: 'Expiring Soon', class: 'badge-warning' };
    if (medicine.stock <= (medicine.minStock || 10)) return { label: 'Low Stock', class: 'badge-warning' };
    return { label: 'In Stock', class: 'badge-success' };
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="page-title">Inventory Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <Search size={20} style={{ color: '#6b7280' }} />
        <input
          type="text"
          placeholder="Search medicines by name, batch, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem' }}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Packing</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Stock</th>
              <th>MRP</th>
              <th>Sale Rate</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => {
              const status = getStockStatus(medicine);
              return (
                <tr key={medicine.id}>
                  <td>{medicine.name}</td>
                  <td>{medicine.packing}</td>
                  <td>{medicine.batch}</td>
                  <td>{medicine.expiry}</td>
                  <td>{medicine.stock}</td>
                  <td>₹{medicine.mrp.toFixed(2)}</td>
                  <td>₹{medicine.saleRate.toFixed(2)}</td>
                  <td>{medicine.category}</td>
                  <td>
                    <span className={`badge ${status.class}`}>{status.label}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-icon" onClick={() => handleEdit(medicine)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(medicine.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button className="btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Medicine Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Packing *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., 10x10, 60ml"
                      value={formData.packing}
                      onChange={(e) => setFormData({ ...formData, packing: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Batch Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry (MM/YYYY) *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YYYY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      pattern="(0[1-9]|1[0-2])/[0-9]{4}"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">MRP *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Purchase Rate *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.purchaseRate}
                      onChange={(e) => setFormData({ ...formData, purchaseRate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Sale Rate *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.saleRate}
                      onChange={(e) => setFormData({ ...formData, saleRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount %</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Stock Level</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMedicine ? 'Update' : 'Add'} Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;