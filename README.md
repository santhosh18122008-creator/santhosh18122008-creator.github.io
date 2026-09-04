# MarqDesk - Free Online Calculator Tools

[![Build Status](https://img.shields.io/github/actions/workflow/status/santhosh18122008-creator.github.io/build.yml)](https://github.com/santhosh18122008-creator.github.io/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-7.2-orange)](https://astro.build/)

**MarqDesk** is a comprehensive collection of free online calculators and conversion tools built with Astro and React. Access over 60+ calculators across various categories including finance, health, education, physics, and everyday utilities.

![MarqDesk Screenshot](./docs/images/og-image.png)

## 🚀 Features

### Calculator Categories
- **Finance**: EMI, SIP, Compound Interest, GST, Income Tax, Budget Tracker, and more
- **Health & Fitness**: BMI, BMR, Body Fat, Ideal Weight, Heart Rate Zones, Water Intake
- **Education**: GPA, SGPA, CGPA, Grade Calculator, Percentage, Attendance
- **Physics**: Kinetic Energy, Potential Energy, Work & Power, Projectile Motion
- **Everyday Utilities**: Unit Converter, Currency Converter, QR Code Generator, Password Generator
- **Programming**: Case Converter, Text Counter, Color Converter

### Key Features
- ✅ 100% Free to use
- ✅ No registration required
- ✅ Mobile-friendly responsive design
- ✅ Dark mode support
- ✅ Fast and lightweight
- ✅ Privacy-focused (client-side calculations)
- ✅ Accessible (WCAG 2.1 compliant)

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) 7.2
- **UI Components**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **TypeScript**: 5.3
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/santhosh18122008-creator.github.io.git
cd santhosh18122008-creator.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:4321`

## 🧞 Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at localhost:4321 |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run typecheck` | Run TypeScript type checking |

## 🏗️ Project Structure

```
/workspace/
├── public/              # Static assets
├── src/
│   ├── components/      # React & Astro components
│   │   ├── islands/     # Interactive React calculators
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   └── ui/          # Reusable UI components
│   ├── config/          # Site configuration
│   ├── content/         # Content collections
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions
│   │   ├── calculations/ # Calculator logic
│   │   ├── formatting/   # Number/date formatting
│   │   ├── utilities/    # General utilities
│   │   └── validation/   # Input validation
│   ├── pages/           # Astro pages
│   └── styles/          # Global styles
├── tests/               # Test files
└── package.json
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [MarqDesk](https://santhosh18122008-creator.github.io)
- **Documentation**: [Guides](https://santhosh18122008-creator.github.io/guides/)
- **Issues**: [GitHub Issues](https://github.com/santhosh18122008-creator.github.io/issues)

## 🙏 Acknowledgments

Built with ❤️ using Astro and React

---

© 2024 MarqDesk. All rights reserved.
