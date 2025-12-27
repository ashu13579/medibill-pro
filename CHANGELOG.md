# Changelog

All notable changes to MediBill Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-27

### 🎉 Initial Release

#### Added

**Inventory Management**
- Add, edit, and delete medicines with complete details
- Medicine fields: Name, Packing, Batch, Expiry, MRP, Purchase Rate, Sale Rate, Stock, Discount, Category, Supplier
- Batch-wise stock tracking
- Expiry date management (MM/YYYY format)
- Category-based organization (Tablet, Syrup, Injection, Capsule, Ointment, Drops, Other)
- Real-time search by name, batch, or category
- Stock status indicators (In Stock, Low Stock, Expiring Soon, Expired)
- Low stock alerts (configurable minimum level)
- Expiry alerts (30/60/90 days before expiry)

**Billing System**
- Professional invoice generation
- Auto-generated sequential invoice numbers (6-digit format)
- Customer details management (Name, Address, Phone, PAN)
- Multiple payment modes (Cash, Credit, UPI, Card)
- Real-time medicine search while billing
- Add/edit/remove invoice items
- Inline quantity and rate editing
- Quantity discount support (for free/scheme items)
- Item-level remarks (Free, Scheme, etc.)
- Automatic calculations:
  - Total amount
  - Less discount
  - Add C.C on Free
  - Round off (automatic)
  - Net amount
  - Amount in words (Indian numbering system)

**Validations**
- Cannot sell expired medicines
- Cannot sell more than available stock
- Batch and expiry mandatory for all sales
- Customer name required
- At least one item required per invoice
- Expiry date format validation (MM/YYYY)
- Stock availability checks

**Stock Management**
- Automatic stock deduction after invoice save
- Batch-wise inventory tracking
- Stock transaction logging
- Real-time stock updates

**PDF Invoice Generation**
- A4-size professional invoices
- Traditional pharmacy bill format
- Complete invoice layout:
  - Pharmacy header (name, address, phone, PAN, DDA)
  - Customer details section
  - Invoice details (number, date, payment mode)
  - Items table with all columns (Description, Packing, Batch, Expiry, Quantity, Qty Disc, Rate, Amount, MRP, Remarks)
  - Totals section (Total, Discount, C.C on Free, Round Off, Net Amount)
  - Amount in words
  - Footer (remarks, signatures, print date)
- Download as PDF
- Direct print functionality
- Filename format: Invoice_[InvoiceNo].pdf

**Reports & Analytics**
- Daily sales report
- Monthly sales summary
- Custom date range reports
- Stock report (all medicines with values)
- Expiry report (medicines expiring within 90 days)
- Summary statistics:
  - Total sales
  - Total invoices
  - Total items sold
  - Average invoice value
- Export to CSV functionality
- Excel-compatible format

**Dashboard**
- Real-time statistics cards:
  - Total medicines count
  - Low stock count
  - Expired medicines count
  - Near expiry count (90 days)
  - Today's sales revenue
  - Month's sales revenue
- Alerts & notifications panel:
  - Expired medicine alerts (red)
  - Expiring soon warnings (yellow, 30 days)
  - Low stock warnings (yellow)
  - Top 10 most critical alerts
- Auto-refresh on data changes

**Settings**
- Pharmacy configuration:
  - Pharmacy Name (required)
  - Address (required)
  - Phone Number (required)
  - Email (optional)
  - PAN Number (optional)
  - DDA Number (optional)
  - Drug License Number (optional)
- Settings used in PDF invoices
- Editable anytime
- Persistent storage

**Offline-First Architecture**
- IndexedDB for local storage
- Four data stores:
  - Medicines store
  - Invoices store
  - Settings store
  - Stock transactions store
- No internet required
- Fast performance
- Data privacy
- Complete offline functionality

**Mobile-First Design**
- Responsive layout for all screen sizes
- Touch-friendly interface
- Bottom navigation bar
- Optimized for mobile use
- Large tap targets
- Smooth animations
- Fast loading
- Minimal battery usage

**User Interface**
- Clean, professional design
- Blue gradient theme
- Card-based layout
- Modal dialogs for forms
- Inline editing for tables
- Search with live results
- Loading states
- Error messages
- Success notifications
- Confirmation dialogs

**Data Management**
- CRUD operations for all entities
- Data validation
- Error handling
- Transaction logging
- Data integrity checks
- Export/backup options

### Technical Details

**Dependencies**
- React 18.2.0
- jsPDF 2.5.1
- jsPDF-autoTable 3.8.2
- Lucide React 0.263.1

**Browser Support**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Storage**
- IndexedDB (unlimited storage)
- No external database required
- Client-side only

**Performance**
- Fast initial load
- Efficient rendering
- Optimized calculations
- Smooth animations
- Minimal re-renders

### Documentation

- Comprehensive README.md
- Deployment guide (DEPLOYMENT.md)
- Features documentation (FEATURES.md)
- Contributing guidelines (CONTRIBUTING.md)
- MIT License
- This changelog

### Known Limitations

- Single-user only (multi-user planned for v2.0)
- No cloud sync (planned for v1.1)
- No barcode scanning (planned for v1.2)
- No GST compliance (planned for v2.0)
- No SMS/Email invoices (planned for v1.3)

## [Unreleased]

### Planned for v1.1
- Cloud sync option
- Data backup automation
- Enhanced search filters
- Bulk operations

### Planned for v1.2
- Barcode scanning
- QR code generation
- Mobile apps (Android/iOS)
- Dark mode

### Planned for v2.0
- Multi-user support
- User authentication
- Role-based access control
- GST compliance
- Advanced analytics
- Prescription management
- Supplier management
- Purchase orders

---

## Version History

- **v1.0.0** (2025-12-27) - Initial release

## Support

For issues, feature requests, or questions:
- GitHub Issues: https://github.com/ashu13579/medibill-pro/issues
- GitHub Discussions: https://github.com/ashu13579/medibill-pro/discussions

## Contributors

- ASHUTOSH YADAV (@ashu13579) - Creator & Lead Developer

---

**Note**: This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality (backwards compatible)
- PATCH version for backwards compatible bug fixes