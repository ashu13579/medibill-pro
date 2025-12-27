# MediBill Pro - Medical Billing & Inventory Management

## Complete Mobile Application for Pharmacies & Clinics

### 🎯 Features

#### 1. Inventory Management (Medicine Master)
- Add, edit, and delete medicines with all mandatory fields
- Medicine Name, Packing, Batch Number, Expiry Date (MM/YYYY)
- MRP, Purchase Rate, Sale Rate, Stock Quantity
- Discount %, Category (Tablet, Syrup, Injection, etc.)
- Supplier Name
- Batch-wise stock handling
- Low stock alerts
- Expiry alerts (30/60/90 days)

#### 2. Professional Billing System
- Pharmacy-style invoice generation
- Real-time medicine search while billing
- Automatic stock deduction after billing
- Batch and expiry validation
- Prevents selling expired medicines
- Prevents overselling (stock validation)
- Multiple payment modes (Cash/Credit/UPI/Card)
- Customer details management

#### 3. PDF Invoice Generation
- A4-size professional invoices
- Traditional pharmacy bill format
- All columns: Description, Packing, Batch, Expiry, Quantity, Qty Disc, Rate, Amount, MRP, Remarks
- Calculations: Total, Less Discount, Add C.C on Free, Round Off, Net Amount
- Amount in words (Indian numbering system)
- Download & Print functionality
- Invoice once saved cannot be edited

#### 4. Reports & Analytics
- Daily sales report
- Monthly sales summary
- Stock report
- Expired and near-expiry medicines report
- Low stock alerts
- Export to CSV

#### 5. Offline-First Architecture
- All data stored locally (IndexedDB)
- No cloud dependency
- Works without internet
- Fast and reliable
- Data backup/export options

### 🛠️ Technical Stack

- **Frontend**: React 18
- **Storage**: IndexedDB (offline-first)
- **PDF Generation**: jsPDF with autoTable
- **Icons**: Lucide React
- **Styling**: Custom CSS (mobile-first)

### 📱 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/ashu13579/medibill-pro.git
cd medibill-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Build for production**
```bash
npm run build
```

### 🚀 Getting Started

1. **Configure Settings**: Go to Settings tab and enter your pharmacy details (name, address, phone, PAN, drug license, etc.)
2. **Add Medicines**: Navigate to Inventory and add your medicine stock with all details
3. **Create Invoices**: Use the Billing tab to search medicines and generate professional invoices
4. **View Reports**: Check Dashboard and Reports for analytics and insights

### 📊 Data Structure

**Medicine Fields:**
- Medicine Name (e.g., MYTICEF 200 TAB)
- Packing (e.g., 10x10, 60ml, 1 PH)
- Batch Number
- Expiry Date (MM/YYYY format)
- MRP
- Purchase Rate
- Sale Rate
- Stock Quantity
- Discount % (optional)
- Category (Tablet, Syrup, Injection, etc.)
- Supplier Name
- Minimum Stock Level

**Invoice Fields:**
- Invoice Number (auto-generated, sequential)
- Transaction Date and Time
- Customer/Clinic Name
- Address, Phone Number, PAN
- Mode of Payment (Cash/Credit/UPI/Card)
- Item list with batch/expiry details
- Calculations (Total, Discount, Round-off, Net Amount)
- Amount in words
- Remarks

### ✅ Key Validations

- ✅ Expiry date must be in MM/YYYY format
- ✅ Cannot sell expired medicines
- ✅ Cannot sell more than available stock
- ✅ Batch and expiry mandatory for all sales
- ✅ Automatic stock deduction after billing
- ✅ Round-off calculations
- ✅ Amount to words conversion (Indian system)
- ✅ Sequential invoice numbering

### 🎨 UI/UX Features

- Clean, simple, pharmacy-friendly interface
- Fast medicine search while billing
- Numeric keypad for quantity entry
- Print-ready invoice preview screen
- Mobile-first responsive design
- Bottom navigation for easy access
- Touch-friendly interface

### 🔒 Data & Security

- All data stored locally on device
- No cloud dependency initially
- Export/backup option (PDF/CSV)
- Basic app lock using PIN or biometric (can be added)

### 📦 Production Ready

- Proper validation and error handling
- Stock management automation
- Expiry prevention logic
- Professional invoice layout
- Accurate calculations
- Rounding consistency

### 🌟 Future Enhancements

- Cloud sync option
- Multi-user support
- Barcode scanning
- SMS/Email invoice delivery
- Advanced analytics
- GST compliance
- Prescription management

### 📄 License

This project is open source and available for use.

### 👨‍💻 Developer

Built for pharmacies and clinics to streamline their billing and inventory management.

---

**Version**: 1.0.0  
**Type**: Offline-First Mobile Application  
**Storage**: Local IndexedDB  
**Platform**: Web (Android-first, scalable to iOS)