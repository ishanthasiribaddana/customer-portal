import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MyLoans from './pages/MyLoans'
import LoanDetails from './pages/LoanDetails'
import ApplyLoan from './pages/ApplyLoan'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Settings from './pages/Settings'
import Support from './pages/Support'
import StudentLookup from './pages/StudentLookup'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="loans" element={<MyLoans />} />
        <Route path="loans/:id" element={<LoanDetails />} />
        <Route path="apply" element={<ApplyLoan />} />
        <Route path="payments" element={<Payments />} />
        <Route path="documents" element={<Documents />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="student-lookup" element={<StudentLookup />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
