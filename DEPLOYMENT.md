# Deployment Guide - MediBill Pro

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

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

The app will open at `http://localhost:3000`

4. **Build for production**
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📱 First-Time Setup

### Step 1: Configure Pharmacy Settings
1. Click on the **Settings** tab in the bottom navigation
2. Fill in your pharmacy details:
   - Pharmacy Name (required)
   - Address (required)
   - Phone Number (required)
   - Email (optional)
   - PAN Number (optional)
   - DDA Number (optional)
   - Drug License Number (optional)
3. Click **Save Settings**

### Step 2: Add Medicines to Inventory
1. Go to the **Inventory** tab
2. Click **Add Medicine** button
3. Fill in all required fields:
   - Medicine Name (e.g., MYTICEF 200 TAB)
   - Packing (e.g., 10x10, 60ml)
   - Batch Number
   - Expiry Date (MM/YYYY format)
   - MRP
   - Purchase Rate
   - Sale Rate
   - Stock Quantity
   - Category (Tablet, Syrup, etc.)
   - Supplier Name
4. Click **Add Medicine**

### Step 3: Create Your First Invoice
1. Navigate to the **Billing** tab
2. Enter customer details
3. Search and add medicines
4. Adjust quantities and rates as needed
5. Click **Save Invoice**
6. Download PDF or Print

## 🌐 Deployment Options

### Option 1: Deploy to Netlify (Recommended)

1. **Push to GitHub** (already done!)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select `medibill-pro` repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

3. **Your app is live!**
   - Netlify will provide a URL like `https://medibill-pro.netlify.app`
   - You can customize the domain in settings

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow prompts**
   - Link to existing project or create new
   - Vercel will auto-detect React and deploy

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**
```json
{
  "homepage": "https://ashu13579.github.io/medibill-pro",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. **Deploy**
```bash
npm run deploy
```

### Option 4: Self-Hosted (Apache/Nginx)

1. **Build the app**
```bash
npm run build
```

2. **Copy build folder to server**
```bash
scp -r build/* user@server:/var/www/html/medibill-pro/
```

3. **Configure web server**

**Apache (.htaccess)**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📱 Mobile App Deployment

### Convert to Android App (PWA)

1. **Add manifest.json** (already included)

2. **Use TWA (Trusted Web Activity)**
   - Install Android Studio
   - Use Bubblewrap CLI:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-domain.com/manifest.json
bubblewrap build
```

3. **Publish to Play Store**
   - Sign the APK
   - Upload to Google Play Console

### Convert to iOS App

1. **Use Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap open ios
```

2. **Build in Xcode**
   - Open project in Xcode
   - Configure signing
   - Build and archive
   - Upload to App Store Connect

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
REACT_APP_VERSION=1.0.0
REACT_APP_NAME=MediBill Pro
```

### Custom Domain Setup

1. **Netlify**
   - Go to Domain settings
   - Add custom domain
   - Configure DNS records

2. **Vercel**
   - Go to Project settings
   - Add domain
   - Update DNS

## 🔒 Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Data Backup**: Implement regular IndexedDB backup
3. **Access Control**: Add authentication if needed
4. **Input Validation**: Already implemented
5. **XSS Protection**: React handles this by default

## 📊 Performance Optimization

Already implemented:
- Code splitting
- Lazy loading
- Optimized images
- Minified CSS/JS
- Service worker for offline support

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Issues
- Clear browser data
- Check IndexedDB in DevTools
- Reimport data if needed

### PDF Generation Issues
- Ensure jsPDF is properly installed
- Check browser console for errors
- Test in different browsers

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/ashu13579/medibill-pro/issues
- Email: support@medibillpro.com (if applicable)

## 🎉 Success!

Your MediBill Pro application is now deployed and ready to use!

**Next Steps:**
1. Configure pharmacy settings
2. Add medicine inventory
3. Start creating invoices
4. Generate reports

---

**Version**: 1.0.0  
**Last Updated**: December 2025