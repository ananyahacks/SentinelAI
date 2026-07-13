import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UploadLogs from './pages/UploadLogs.jsx'
import RiskAnalysis from './pages/RiskAnalysis.jsx'
import InvestigateUser from './pages/InvestigateUser.jsx'
import Anomalies from './pages/Anomalies.jsx'
import Alerts from './pages/Alerts.jsx'
import Reports from './pages/Reports.jsx'
import Users from './pages/Users.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadLogs />} />
        <Route path="/risk-analysis" element={<RiskAnalysis />} />
        <Route path="/risk-analysis/:userId" element={<InvestigateUser />} />
        <Route path="/anomalies" element={<Anomalies />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
