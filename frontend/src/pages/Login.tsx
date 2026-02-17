import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../lib/api'
import AccountUnlock from '../components/AccountUnlock'

const TemcoLogo = () => (
  <div className="flex flex-col items-center">
    <img
      src="/images/logo.jpg"
      alt="TEMCO Bank — අපිට අපේම බැංකුවක්"
      className="h-24 w-auto object-contain"
    />
  </div>
)

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const loginSSO = useAuthStore((state) => state.loginSSO)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showUnlock, setShowUnlock] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // SSO Login via temco-api
      const response = await authApi.login({ username, password })
      if (response.data.success) {
        loginSSO(response.data.token, response.data.user)
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        setError('Login failed')
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } }
      setError(axiosError.response?.data?.error || 'Invalid username or password')
    } finally {
      setIsLoading(false)
    }
  }

  // Show unlock component if requested
  if (showUnlock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-temco-blue/10 via-temco-pink/5 to-temco-yellow/10 p-4">
        <AccountUnlock 
          onBack={() => setShowUnlock(false)} 
          onSuccess={() => setShowUnlock(false)} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-temco-blue/10 via-temco-pink/5 to-temco-yellow/10 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-temco-blue">
        <div className="text-center mb-6">
          <TemcoLogo />
          <h2 className="text-xl font-semibold text-secondary-800 mt-4">Welcome Back</h2>
          <p className="text-secondary-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Username / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-temco-blue/30 focus:border-temco-blue outline-none transition-colors"
                placeholder="••••••••"
                required
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
              <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={() => setShowUnlock(true)}
            className="text-sm text-temco-pink hover:underline"
          >
            Account locked? Unlock via WhatsApp
          </button>
        </div>

        <p className="text-center text-sm text-secondary-500 mt-4">
          Don't have an account? <Link to="/signup" className="text-temco-blue font-medium hover:underline">Sign up</Link>
        </p>

        <p className="text-xs text-secondary-400 text-center mt-6">© 2026 Temco Bank. All rights reserved.</p>
      </div>
    </div>
  )
}
