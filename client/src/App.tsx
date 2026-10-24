import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout';
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
} from '@/pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
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
    </BrowserRouter>
  );
}
