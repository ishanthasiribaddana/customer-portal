import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Loader2, AlertCircle, GraduationCap, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import axios from 'axios'

interface Student {
  index: number
  nic: string
  fullName: string
  email: string | null
  mobileNo: string | null
  scholarship: number | null
  paymentOption: string | null
  courseDue: number | null
  diplomaDue: number | null
  diplomaCurrency: string | null
  higherDiplomaDue: number | null
  higherDiplomaCurrency: string | null
  universityDue: number | null
  universityCurrency: string | null
  serviceChargesPercentage: number | null
  totalDue: number | null
  intakeName: string | null
  branchName: string | null
  transferDate: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface StudentsResponse {
  success: boolean
  data: Student[]
  pagination: Pagination
}

function formatCurrency(amount: number | null, currency?: string | null): string {
  if (amount === null || amount === undefined) return '-'
  const cur = currency || 'LKR'
  return `${cur} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const PAGE_SIZE_OPTIONS = [25, 50, 100]

export default function StudentLookup() {
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 25, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [error, setError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  // Reset to page 1 when search changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [debouncedSearch])

  const fetchStudents = useCallback(async (page: number, limit: number, searchTerm: string) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      })
      if (searchTerm) params.set('search', searchTerm)

      const res = await axios.get<StudentsResponse>(`/api/students?${params}`)
      setStudents(res.data.data)
      setPagination(res.data.pagination)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || 'Failed to load students')
      } else {
        setError('Failed to connect to server. Please try again.')
      }
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [])

  // Fetch on page/limit/search change
  useEffect(() => {
    fetchStudents(pagination.page, pagination.limit, debouncedSearch)
  }, [pagination.page, pagination.limit, debouncedSearch, fetchStudents])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  const changePageSize = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  // Generate visible page numbers
  const getPageNumbers = () => {
    const { page, totalPages } = pagination
    const pages: number[] = []
    const maxVisible = 7
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      let start = Math.max(2, page - 2)
      let end = Math.min(totalPages - 1, page + 2)
      if (page <= 3) { start = 2; end = 5 }
      if (page >= totalPages - 2) { start = totalPages - 4; end = totalPages - 1 }
      if (start > 2) pages.push(-1) // ellipsis
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages - 1) pages.push(-2) // ellipsis
      pages.push(totalPages)
    }
    return pages
  }

  const startRow = (pagination.page - 1) * pagination.limit + 1
  const endRow = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-temco-blue" />
          Student Loan Eligibility
        </h1>
        <p className="text-gray-500 mt-1 text-sm">All students with profile and loan eligibility details</p>
      </div>

      {/* Search + Page Size Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by NIC, name, or email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-temco-blue focus:border-temco-blue outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Rows per page:</span>
            <select
              value={pagination.limit}
              onChange={(e) => changePageSize(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-temco-blue outline-none"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {!initialLoad && (
              <span className="text-gray-500">
                {pagination.total > 0 ? `${startRow}–${endRow} of ${pagination.total.toLocaleString()}` : 'No results'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10">#</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap sticky left-8 bg-gray-50 z-10">NIC</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Full Name</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Mobile</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Scholarship %</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Payment Option</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Course Due</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Diploma Due</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Higher Diploma Due</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">University Due</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Service %</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap bg-yellow-50">Total Due</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Intake</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Branch</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Transfer Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan={16} className="px-4 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-temco-blue mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Loading students...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={16} className="px-4 py-12 text-center text-gray-500 text-sm">
                    {debouncedSearch ? `No students found matching "${debouncedSearch}"` : 'No students found'}
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.nic} className={`hover:bg-blue-50 transition-colors ${loading ? 'opacity-50' : ''}`}>
                    <td className="px-3 py-2 text-gray-400 whitespace-nowrap sticky left-0 bg-white z-10">{s.index}</td>
                    <td className="px-3 py-2 text-gray-900 font-mono font-medium whitespace-nowrap sticky left-8 bg-white z-10">{s.nic}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium whitespace-nowrap">{s.fullName || '-'}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{s.email || '-'}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{s.mobileNo || '-'}</td>
                    <td className="px-3 py-2 text-gray-900 text-right whitespace-nowrap">{s.scholarship ?? '-'}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{s.paymentOption || '-'}</td>
                    <td className="px-3 py-2 text-gray-900 text-right whitespace-nowrap">{formatCurrency(s.courseDue)}</td>
                    <td className="px-3 py-2 text-gray-900 text-right whitespace-nowrap">{formatCurrency(s.diplomaDue, s.diplomaCurrency)}</td>
                    <td className="px-3 py-2 text-gray-900 text-right whitespace-nowrap">{formatCurrency(s.higherDiplomaDue, s.higherDiplomaCurrency)}</td>
                    <td className="px-3 py-2 text-gray-900 text-right whitespace-nowrap">{formatCurrency(s.universityDue, s.universityCurrency)}</td>
                    <td className="px-3 py-2 text-gray-900 text-right whitespace-nowrap">{s.serviceChargesPercentage ?? '-'}</td>
                    <td className="px-3 py-2 text-gray-900 font-bold text-right whitespace-nowrap bg-yellow-50">{formatCurrency(s.totalDue)}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap max-w-[200px] truncate" title={s.intakeName || ''}>{s.intakeName || '-'}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{s.branchName || '-'}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{s.transferDate ? new Date(s.transferDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Showing {startRow}–{endRow} of {pagination.total.toLocaleString()} students
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={pagination.page === 1 || loading}
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {getPageNumbers().map((p, i) =>
                p < 0 ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    disabled={loading}
                    className={`min-w-[32px] h-8 rounded text-xs font-medium transition-colors ${
                      p === pagination.page
                        ? 'bg-temco-blue text-white'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => goToPage(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages || loading}
                className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
