import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider }  from './context/UIContext';
import ToastContainer  from './components/ui/Toast';
import ProtectedRoute  from './components/ProtectedRoute';

import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads     from './pages/Leads';
import Tasks     from './pages/Tasks';
import Deals     from './pages/Deals';
import Settings  from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/leads"     element={<Leads />} />
              <Route path="/tasks"     element={<Tasks />} />
              <Route path="/deals"     element={<Deals />} />
              <Route path="/settings"  element={<Settings />} />
            </Route>

            <Route path="/"  element={<Navigate to="/dashboard" replace />} />
            <Route path="*"  element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Global Toast Notifications */}
          <ToastContainer />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
