# Contributing to MediBill Pro

Thank you for your interest in contributing to MediBill Pro! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features

1. **Open a feature request** issue
2. **Describe the feature** clearly
3. **Explain the use case**
4. **Provide examples** if possible

### Code Contributions

#### Getting Started

1. **Fork the repository**
```bash
git clone https://github.com/ashu13579/medibill-pro.git
cd medibill-pro
```

2. **Create a branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

3. **Install dependencies**
```bash
npm install
```

4. **Start development server**
```bash
npm start
```

#### Development Guidelines

**Code Style**
- Use functional React components
- Follow existing code structure
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**File Organization**
```
src/
├── components/     # React components
├── utils/          # Utility functions
│   ├── database.js # IndexedDB operations
│   ├── helpers.js  # Helper functions
│   └── pdfGenerator.js # PDF generation
├── App.js          # Main app component
├── App.css         # Global styles
└── index.js        # Entry point
```

**Component Structure**
```javascript
import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { utilFunction } from '../utils/helpers';

const ComponentName = () => {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

**Database Operations**
- Always use try-catch blocks
- Handle errors gracefully
- Log errors for debugging
- Validate data before saving

**Styling**
- Use inline styles for component-specific styles
- Use App.css for global styles
- Follow mobile-first approach
- Ensure responsive design

#### Testing

Before submitting:
1. Test all features manually
2. Check responsive design
3. Test in multiple browsers
4. Verify offline functionality
5. Check PDF generation
6. Test data persistence

#### Commit Guidelines

**Commit Message Format**
```
type: subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: Add barcode scanning support"
git commit -m "fix: Resolve stock calculation issue"
git commit -m "docs: Update installation instructions"
```

#### Pull Request Process

1. **Update your branch**
```bash
git fetch origin
git rebase origin/main
```

2. **Push your changes**
```bash
git push origin feature/your-feature-name
```

3. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the template:
     - Description of changes
     - Related issues
     - Testing done
     - Screenshots (if UI changes)

4. **PR Review**
   - Address review comments
   - Make requested changes
   - Push updates to same branch

5. **Merge**
   - Once approved, PR will be merged
   - Delete your branch after merge

## 📋 Development Priorities

### High Priority
- [ ] Barcode scanning integration
- [ ] Cloud sync option
- [ ] Multi-user support
- [ ] GST compliance

### Medium Priority
- [ ] SMS/Email invoices
- [ ] Advanced analytics
- [ ] Prescription management
- [ ] Supplier management

### Low Priority
- [ ] Dark mode
- [ ] Custom themes
- [ ] Export to Excel
- [ ] Automated backups

## 🐛 Known Issues

Check the [Issues](https://github.com/ashu13579/medibill-pro/issues) page for current bugs and feature requests.

## 💡 Feature Requests

We welcome feature requests! Please:
1. Check existing requests first
2. Provide detailed use cases
3. Explain expected behavior
4. Add mockups if possible

## 📞 Getting Help

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Email**: support@medibillpro.com (if applicable)

## 🎯 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing private information
- Unprofessional conduct

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📚 Resources

- [React Documentation](https://react.dev)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Lucide Icons](https://lucide.dev)

## 🚀 Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to production
5. Announce release

---

Thank you for contributing to MediBill Pro! 🎉

**Questions?** Open an issue or start a discussion!