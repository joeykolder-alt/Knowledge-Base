# Knowledge Management Platform

A comprehensive internal knowledge management and quality assurance platform built with Next.js 16, TypeScript, and modern web technologies.

## 🎯 Overview

This platform provides a complete solution for managing employee knowledge, tracking quality metrics, conducting exams, and facilitating internal communication. It features a modern, bilingual interface (Arabic/English) with support for RTL layouts.

## ✨ Key Features

### 📚 Knowledge Base
- **Digital Library**: Organize content in shelves and books
- **Rich Text Editor**: Powered by Tiptap with support for:
  - Text formatting (bold, italic, underline, strikethrough)
  - Color and highlighting
  - Tables, images, and YouTube embeds
  - Image resizing and positioning
- **Article Management**: Create, edit, and organize articles
- **News Section**: Share company updates and announcements

### 📊 Quality Management
- **Performance Tracking**: Monitor employee quality metrics
- **Score Analysis**: Visual analytics with charts and graphs
- **Weakness Identification**: Track and analyze common performance issues
- **Historical Reports**: Review past evaluations and trends

### 🎓 Exam System
- **Exam Builder**: Create custom exams with multiple question types
- **Automated Grading**: Instant results for objective questions
- **Results Dashboard**: Track exam performance and statistics
- **Admin Panel**: Manage exams and review employee results

### 📈 KPI Management
- **Report Creation**: Generate and track KPI reports
- **Task Management**: Assign and monitor tasks
- **Performance Metrics**: Visualize key performance indicators
- **Request Tracking**: Handle and process requests

### 👥 Employee Management
- **Employee Database**: Maintain comprehensive employee records
- **Status Tracking**: Monitor employee availability and status
- **New Employee Registration**: Streamlined onboarding process

### 💬 Communication
- **Suggestions Box**: Collect employee feedback and ideas
- **Report Requests**: Submit and track internal requests

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + shadcn/ui
- **Rich Text Editor**: Tiptap with multiple extensions
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Storage**: Local Storage (can be extended to backend)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Environment

The application runs on `http://localhost:3000` by default.

## 🎨 Features in Detail

### Bilingual Support
- Full Arabic and English translations
- RTL layout support for Arabic
- Dynamic language switching

### Dark Mode
- Built-in theme switching
- Consistent styling across all pages
- Respects system preferences

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Main dashboard
│   ├── knowledge/         # Knowledge base module
│   ├── quality/           # Quality management
│   ├── exams/            # Exam system
│   ├── kpi/              # KPI management
│   ├── employees/        # Employee management
│   └── form/             # Forms (suggestions, requests)
├── components/           # Reusable components
│   ├── ui/              # UI components (shadcn)
│   ├── layout/          # Layout components
│   └── knowledge/       # Knowledge-specific components
├── lib/                 # Utility functions
└── public/             # Static assets
```

## 🔒 Security

- No sensitive data stored in code
- Environment variables for configuration
- Secure authentication ready (can be integrated)
- XSS protection built-in

## 🛠️ Development

```bash
# Run linting
npm run lint

# Type checking is automatic with TypeScript
```

## 📝 Notes

- Data is currently stored in localStorage (can be migrated to backend)
- All components are fully typed with TypeScript
- The platform is designed for internal company use

## 🤝 Contributing

This is an internal project. For questions or suggestions, please contact the development team.

## 📄 License

Private - Internal Use Only

---

Built with ❤️ for enhanced knowledge management and quality assurance
