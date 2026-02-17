import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, CreditCard, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { authApi } from '../lib/api'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nic: '',
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.signup({
        nic: form.nic,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobileNo: form.mobileNo,
        password: form.password,
      })
      if (response.data.success) {
        setSuccess(true)
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err: unknown) {
      console.error('Signup error:', err)
      const axiosError = err as { response?: { status?: number; data?: { error?: string } } }
      console.error('Response status:', axiosError.response?.status)
      console.error('Response data:', axiosError.response?.data)
      setError(axiosError.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-temco-blue/10 via-temco-pink/5 to-temco-yellow/10 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-emerald-500 text-center">
          <div className="flex flex-col items-center mb-6">
            <img src="/images/logo.jpg" alt="TEMCO Bank" className="h-20 w-auto object-contain" />
          </div>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-2">Registration Successful!</h2>
          <p className="text-secondary-500 text-sm mb-6">
            Your account has been created. You can now sign in with your email and password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-temco-blue text-white font-medium rounded-lg hover:bg-temco-blue/90 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-temco-blue/10 via-temco-pink/5 to-temco-yellow/10 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-temco-blue">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center">
            <img src="/images/logo.jpg" alt="TEMCO Bank" className="h-20 w-auto object-contain" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-800 mt-4">Create an Account</h2>
          <p className="text-secondary-500 text-sm mt-1">Register for TEMCO Bank Member Portal</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIC */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">NIC Number *</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                name="nic"
                value={form.nic}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                placeholder="e.g. 200012345678 or 901234567V"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">First Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                  placeholder="First name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Last Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                  placeholder="Last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Contact Number (WhatsApp) */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Contact Number (WhatsApp) *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="tel"
                name="mobileNo"
                value={form.mobileNo}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                placeholder="e.g. 0771234567"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors text-sm"
                placeholder="Re-enter password"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-temco-blue text-white font-medium rounded-lg hover:bg-temco-blue/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-secondary-500 mt-4">
          Already have an account? <Link to="/login" className="text-temco-blue font-medium hover:underline">Sign In</Link>
        </p>

        <p className="text-xs text-secondary-400 text-center mt-6">© 2026 Temco Bank. All rights reserved.</p>
      </div>
    </div>
  )
}
