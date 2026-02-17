import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import { Search, Settings, HelpCircle } from 'lucide-react'

export default function Dashboard() {
  const { member } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {member?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 mt-1">Here's your member portal</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/student-lookup"
          className="bg-primary-600 text-white rounded-xl p-6 hover:bg-primary-700 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Search className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">Student Lookup</h3>
              <p className="text-primary-100 mt-1">Search student records</p>
            </div>
          </div>
        </Link>

        <Link
          to="/settings"
          className="bg-white border rounded-xl p-6 hover:border-primary-300 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              <p className="text-gray-500 mt-1">Manage your profile and security</p>
            </div>
          </div>
        </Link>

        <Link
          to="/support"
          className="bg-white border rounded-xl p-6 hover:border-primary-300 transition-colors"
        >
          <div className="flex items-center gap-4">
            <HelpCircle className="h-8 w-8 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              <p className="text-gray-500 mt-1">Get help and contact us</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Member Info Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Member Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{member?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{member?.email || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member ID</p>
            <p className="font-medium text-gray-900">{member?.memberId || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
