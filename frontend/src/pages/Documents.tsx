import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Documents() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      <div className="bg-white rounded-xl p-12 text-center border">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Document services are being upgraded</h3>
        <p className="text-gray-500 mt-2">
          This feature is currently under maintenance. Please contact support for document inquiries.
        </p>
        <Link to="/support" className="inline-block mt-4 text-primary-600 hover:underline">
          Contact Support
        </Link>
      </div>
    </div>
  )
}
