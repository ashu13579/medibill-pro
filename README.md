# MediBill Pro - Medical Billing & Inventory Management

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ashu13579/medibill-pro)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ashu13579/medibill-pro)

## 🚀 Quick Deploy - Make it LIVE in 30 seconds!

**Fastest Way:** [**Click here to deploy to Netlify**](https://app.netlify.com/start/deploy?repository=https://github.com/ashu13579/medibill-pro) 🚀

Or follow the [**Complete Deployment Guide**](MAKE_IT_LIVE.md) for other options!

---

## Complete Mobile Application for Pharmacies & Clinics

### 🎯 Features

#### 1. Inventory Management
- Add, edit, delete medicines
- Batch-wise stock tracking
- Expiry date management
- Low stock alerts
- Category-based organization
- Supplier management

#### 2. Billing System
- Professional invoice generation
- Real-time medicine search
- Automatic stock deduction
- Multiple payment modes (Cash/Credit/UPI/Card)
- Batch and expiry validation
- Discount and round-off calculations

#### 3. PDF Invoice Generation
- A4-size professional invoices
- Traditional pharmacy bill format
- Download and print functionality
- Amount in words conversion

#### 4. Reports & Analytics
- Daily sales reports
- Monthly sales summary
- Stock reports
- Expiry alerts (30/60/90 days)
- Low stock notifications
- Export to CSV

#### 5. Offline-First Architecture
- All data stored locally (IndexedDB)
- No internet required
- Fast and reliable
- Data backup/export options

### 🛠️ Technical Stack
- React 18
- IndexedDB for local storage
- jsPDF for invoice generation
- Lucide React for icons
- Responsive mobile-first design

### 📱 Installation

1. **Clone the repository**
```bash
git clone https://github.com/ashu13579/medibill-pro.git
cd medibill-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Build for production**
```bash
npm run build
```

### 🚀 Getting Started

1. The app initializes automatically
2. Go to Settings to configure pharmacy details
3. Add medicines in Inventory
4. Create invoices in Billing
5. View reports and analytics

### 📊 Data Structure

**Medicine Fields:**
- Name, Packing, Batch, Expiry
- MRP, Purchase Rate, Sale Rate
- Stock Quantity, Discount %
- Category, Supplier

**Invoice Fields:**
- Customer details
- Item list with batch/expiry
- Payment mode
- Calculations (Total, Discount, Round-off, Net Amount)

### 🎓 Documentation

- 📘 [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- 📗 [Features Documentation](FEATURES.md) - Complete feature list
- 📙 [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- 🚀 [Make it LIVE Guide](MAKE_IT_LIVE.md) - Go live in 2 minutes
- 📕 [Contributing Guide](CONTRIBUTING.md) - Contribute to the project
- 📋 [Changelog](CHANGELOG.md) - Version history

### ✅ Production Ready
- Proper validation
- Error handling
- Stock management
- Expiry prevention
- Professional UI/UX

### 📞 Support

For issues, feature requests, or questions:
- 🐛 [GitHub Issues](https://github.com/ashu13579/medibill-pro/issues)
- 💬 [GitHub Discussions](https://github.com/ashu13579/medibill-pro/discussions)

### 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Version**: 1.0.0  
**Type**: Offline-First Mobile Application  
**Storage**: Local IndexedDB

**Made with ❤️ for Pharmacies and Clinics**