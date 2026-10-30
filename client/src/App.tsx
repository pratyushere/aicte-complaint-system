import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { AppStoreProvider } from '@/lib/store';
import {
  DashboardPage,
  InstitutionsPage,
  InstitutionDetailPage,
  ComplaintsPage,
  ComplaintDetailPage,
  RegisterComplaintPage,
  OverlapsPage,
  CoordinationPage,
  NotificationsPage,
  ReportsPage,
  UserManagementPage,
  SettingsPage,
  LoginPage,
  CitizenHomePage,
} from '@/pages';

export default function App() {
  return (
    <BrowserRouter>
      <AppStoreProvider>
        <Routes>
          {/* Default root path shows login */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/citizen" element={<CitizenHomePage />} />
            <Route path="/institutions" element={<InstitutionsPage />} />
            <Route path="/institutions/:id" element={<InstitutionDetailPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/complaints/new" element={<RegisterComplaintPage />} />
            <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/overlaps" element={<OverlapsPage />} />
            <Route path="/coordination" element={<CoordinationPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AppStoreProvider>
    </BrowserRouter>
  );
}
