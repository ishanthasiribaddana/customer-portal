import { ArrowLeft, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LoanDetails() {
  return (
    <div className="space-y-6">
      <Link to="/loans" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to loans
      </Link>
      <div className="bg-white rounded-xl p-12 text-center border">
        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Loan services are being upgraded</h3>
        <p className="text-gray-500 mt-2">
          Loan details are temporarily unavailable. Please contact support for inquiries.
        </p>
        <Link to="/support" className="inline-block mt-4 text-primary-600 hover:underline">
          Contact Support
        </Link>
      </div>
    </div>
  )
}
