import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ToastContainer } from "@/components/ui/Toast";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

// Pages
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MembersPage } from "@/pages/MembersPage";
import { MemberDetailPage } from "@/pages/MemberDetailPage";
import { TransactionPage } from "@/pages/TransactionPage";
import { ReportPage } from "@/pages/ReportPage";
import { RekapPage } from "@/pages/RekapPage";
import { CashPositionPage } from "@/pages/CashPositionPage";
import { BackupPage } from "@/pages/BackupPage";
import { RestorePage } from "@/pages/RestorePage";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <MemberDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tabungan"
            element={
              <ProtectedRoute>
                <TransactionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/laporan"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rekap"
            element={
              <ProtectedRoute>
                <RekapPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posisi-kas"
            element={
              <ProtectedRoute>
                <CashPositionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/backup"
            element={
              <ProtectedRoute>
                <BackupPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restore"
            element={
              <ProtectedRoute>
                <RestorePage />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Toast Container */}
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
