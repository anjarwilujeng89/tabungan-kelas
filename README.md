# Tabungan Kelas - Class Savings Management Application

A modern, production-ready web application for managing class/cooperative savings with a clean, responsive interface.

## 🚀 Features

- **Authentication**: Demo login system (username: `admin`, password: `admin123`)
- **Member Management**: Add, edit, delete members with unique book numbers
- **Transaction Management**: Record savings deposits and withdrawals
- **Financial Reports**: View transaction summaries and daily recaps
- **Cash Position**: Track physical cash against system balance
- **Backup & Restore**: Export/import data as JSON files
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Updates**: Uses React Query for efficient data management

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (auth) + React Query (data)
- **Form Validation**: React Hook Form + Zod
- **Routing**: React Router DOM
- **UI Components**: Custom shadcn/ui-like components
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Export**: PapaParse (CSV)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Sidebar, MainLayout)
│   ├── ui/              # Reusable UI components (Button, Card, Input, etc)
│   ├── forms/           # Form components
│   ├── tables/          # Table components
│   └── charts/          # Chart components
├── context/
│   └── authStore.ts     # Zustand auth store
├── hooks/
│   ├── useAuth.ts       # Auth hook
│   ├── useMemberQueries.ts          # Member queries
│   ├── useTransactionQueries.ts     # Transaction queries
│   ├── useCashPositionQueries.ts    # Cash position queries
│   └── useReportQueries.ts          # Report queries
├── lib/
│   ├── api/
│   │   ├── authApi.ts           # Auth API
│   │   ├── memberApi.ts         # Member API
│   │   ├── transactionApi.ts    # Transaction API
│   │   ├── cashPositionApi.ts   # Cash position API
│   │   ├── reportApi.ts         # Report API
│   │   └── backupApi.ts         # Backup/restore API
│   └── queryClient.ts           # React Query setup
├── pages/
│   ├── LoginPage.tsx            # Login page
│   ├── DashboardPage.tsx        # Dashboard/home page
│   ├── MembersPage.tsx          # Members list
│   ├── MemberDetailPage.tsx     # Member details
│   ├── TransactionPage.tsx      # Transactions
│   ├── ReportPage.tsx           # Transaction reports
│   ├── RekapPage.tsx            # Daily recap
│   ├── CashPositionPage.tsx     # Cash position
│   ├── BackupPage.tsx           # Backup data
│   └── RestorePage.tsx          # Restore data
├── routes/
│   └── ProtectedRoute.tsx       # Protected route component
├── types/
│   └── models.ts                # TypeScript models
├── utils/
│   ├── format.ts                # Formatting utilities
│   ├── csvExport.ts             # CSV export utilities
│   ├── helpers.ts               # Helper functions
│   └── validationSchemas.ts     # Zod validation schemas
├── App.tsx                      # App routing
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd tabungan-kelas
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔐 Authentication

**Demo Credentials:**

- Username: `admin`
- Password: `admin123`

The authentication uses Zustand for state management with mock API calls simulating real authentication.

## 📱 Routes

### Public Routes

- `/login` - Login page

### Protected Routes

- `/dashboard` - Dashboard with statistics
- `/members` - Members list
- `/members/:id` - Member details and transaction history
- `/tabungan` - Transaction management
- `/laporan` - Transaction reports
- `/rekap` - Daily transaction recap
- `/posisi-kas` - Cash position tracking
- `/backup` - Backup data export
- `/restore` - Restore data import

## 🎨 Design Features

- **Modern Dashboard**: Cards with statistics and charts
- **Responsive Tables**: Scrollable tables with hover effects
- **Modal Dialogs**: Forms in modals for CRUD operations
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error messages
- **Toast Notifications**: Real-time feedback for user actions
- **Empty States**: Helpful messages when no data available
- **Dark Mode**: Full dark mode support with toggle

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Type check TypeScript files

## 📦 Dependencies

### Core

- react@^18.2.0
- react-dom@^18.2.0
- react-router-dom@^6.20.0

### Data Management

- @tanstack/react-query@^5.28.0
- zustand@^4.4.5

### Forms & Validation

- react-hook-form@^7.48.0
- @hookform/resolvers@^3.3.4
- zod@^3.22.4

### UI & Styling

- tailwindcss@^3.3.6
- lucide-react@^0.292.0
- clsx@^2.0.0
- tailwind-merge@^2.2.1

### Utils

- date-fns@^2.30.0
- papaparse@^5.4.1

## 🎯 Features Implementation Details

### Authentication

- Session-based authentication using Zustand
- Protected routes with redirect to login
- Persistent session in localStorage
- Logout functionality

### Member Management

- Create new members with validation
- Edit member information
- Delete members with confirmation
- Search and filter functionality
- Member detail page with transaction history

### Transaction Management

- Record deposits (tabungan) and withdrawals (pengambilan)
- Filter transactions by date range
- Display transaction summary
- CSV export functionality
- Delete transactions with confirmation

### Reports

- Dashboard with key metrics
- Transaction summary reports
- Daily recap with aggregated data
- Member-specific reports

### Cash Position

- Manage multiple cash categories
- Track total cash vs system balance
- Visual alerts for discrepancies
- CRUD operations for categories

### Backup & Restore

- Export all data to JSON
- Import/restore from backup files
- Data validation before restore
- Comprehensive error handling

## 🎨 UI Components

Custom components included:

- Button (variants: default, outline, ghost, destructive)
- Card (with Header, Content, Footer)
- Input (with label, error, helper text)
- Select (dropdown)
- Alert (variants: default, destructive, success, warning)
- Modal (with responsive sizing)
- Badge (with color variants)
- Toast (notification system)
- Tabs (tabbed interface)
- Pagination (for large datasets)
- Skeleton (loading placeholders)

## 🌓 Dark Mode

- Automatic theme detection based on system preference
- Manual toggle in navbar
- Persistent theme selection in localStorage
- Full dark mode styling for all components

## 📊 Data Models

All TypeScript models defined in `src/types/models.ts`:

- UserSession
- Member
- Transaction
- DailyRecap
- CashCategory
- CashPositionSummary
- DashboardSummary
- BackupData

## 🔍 Validation

Form validation using Zod schemas for:

- Login credentials
- Member creation/update
- Transaction creation/update
- Cash category creation/update
- Date range filtering

## 📝 API Layer

Mock API implementations with simulated delays:

- authApi.ts - Authentication
- memberApi.ts - Member CRUD
- transactionApi.ts - Transaction CRUD
- cashPositionApi.ts - Cash position CRUD
- reportApi.ts - Report generation
- backupApi.ts - Backup/restore

## 🚀 Performance Optimizations

- React Query for efficient caching and data management
- Memoization of components
- Code splitting via React Router
- Lazy loading of routes
- Optimistic UI updates

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is for portfolio purposes.

## 👨‍💻 Development Notes

- TypeScript strict mode enabled
- Clean code architecture with separation of concerns
- Reusable components and hooks
- Consistent naming conventions
- Comprehensive error handling
- Responsive design principles

---

**Built with ❤️ for classroom savings management**
