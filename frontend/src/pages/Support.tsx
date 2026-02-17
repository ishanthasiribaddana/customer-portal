import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileQuestion,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'ticket'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState<SupportTicket>({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I apply for a loan?',
      answer: 'To apply for a loan, navigate to the "Apply for Loan" section from your dashboard. Fill out the application form with your personal and financial information, upload required documents, and submit your application. Our team will review it within 2-3 business days.',
      category: 'Loans'
    },
    {
      id: '2',
      question: 'What documents are required for a loan application?',
      answer: 'Required documents typically include: Valid ID (NIC or Passport), Proof of income (salary slips or bank statements), Proof of address (utility bill or rental agreement), and Employment verification letter. Additional documents may be required based on the loan type.',
      category: 'Loans'
    },
    {
      id: '3',
      question: 'How can I make a payment?',
      answer: 'You can make payments through multiple methods: 1) Online via the Payments section using credit/debit card or bank transfer, 2) Direct debit from your linked bank account, 3) At any of our branch offices, or 4) Through participating bank ATMs.',
      category: 'Payments'
    },
    {
      id: '4',
      question: 'What happens if I miss a payment?',
      answer: 'If you miss a payment, a late fee will be applied according to your loan agreement. We recommend contacting our support team immediately if you anticipate difficulty making a payment. We offer various options including payment plans and due date adjustments.',
      category: 'Payments'
    },
    {
      id: '5',
      question: 'How do I update my personal information?',
      answer: 'You can update your personal information in the Settings section of your account. Go to Profile settings to update your name, contact details, and address. For changes to your NIC or date of birth, please contact customer support with supporting documentation.',
      category: 'Account'
    },
    {
      id: '6',
      question: 'How do I reset my password?',
      answer: 'To reset your password, click "Forgot Password" on the login page and enter your registered email address. You will receive a password reset link within a few minutes. If you are already logged in, you can change your password in Settings > Security.',
      category: 'Account'
    },
    {
      id: '7',
      question: 'What are the interest rates for different loan types?',
      answer: 'Interest rates vary by loan type: Personal Loans: 12-18% p.a., Business Loans: 10-16% p.a., Vehicle Loans: 8-14% p.a., Home Loans: 7-12% p.a. Actual rates depend on your credit score, loan amount, and tenure. Contact us for a personalized quote.',
      category: 'Loans'
    },
    {
      id: '8',
      question: 'Can I prepay my loan?',
      answer: 'Yes, you can prepay your loan partially or in full. For loans older than 6 months, there is no prepayment penalty. For newer loans, a small prepayment fee may apply. Check your loan agreement or contact support for specific details about your loan.',
      category: 'Loans'
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Call Us</h3>
              <p className="text-blue-600 font-medium">011-234-5678</p>
              <p className="text-xs text-gray-500">Mon-Fri: 8AM - 6PM</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Us</h3>
              <p className="text-green-600 font-medium">support@temco.lk</p>
              <p className="text-xs text-gray-500">Response within 24hrs</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Headphones className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-purple-600 font-medium">Start a conversation</p>
              <p className="text-xs text-gray-500">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'faq'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              Contact Info
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ticket'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Submit Ticket
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileQuestion className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">{faq.question}</span>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="pl-8 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                        <div className="pl-8 mt-3">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Can't find what you're looking for?{' '}
                  <button 
                    onClick={() => setActiveTab('ticket')}
                    className="text-blue-600 hover:underline"
                  >
                    Submit a support ticket
                  </button>
                  {' '}and we'll get back to you.
                </p>
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600">Customer Support: 011-234-5678</p>
                        <p className="text-gray-600">Loan Inquiries: 011-234-5679</p>
                        <p className="text-gray-600">Emergency: 077-123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600">General: support@temco.lk</p>
                        <p className="text-gray-600">Loans: loans@temco.lk</p>
                        <p className="text-gray-600">Complaints: complaints@temco.lk</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Business Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Head Office</h2>
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-700">
                      Temco Finance Limited<br />
                      123 Galle Road<br />
                      Colombo 03<br />
                      Sri Lanka
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Branch Locator</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Find your nearest Temco branch for in-person assistance.
                    </p>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View All Branches
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Social Media</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Connect with us on social media for updates and support.
                    </p>
                    <div className="flex gap-3">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Facebook</button>
                      <button className="px-3 py-1 bg-sky-500 text-white rounded text-sm">Twitter</button>
                      <button className="px-3 py-1 bg-pink-600 text-white rounded text-sm">Instagram</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Ticket Tab */}
          {activeTab === 'ticket' && (
            <div>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Submitted Successfully!</h2>
                  <p className="text-gray-600 mb-4">
                    We've received your support request. Our team will get back to you within 24 hours.
                  </p>
                  <p className="text-sm text-gray-500">
                    Reference Number: <span className="font-mono font-medium">TKT-{Date.now().toString().slice(-8)}</span>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={ticketForm.subject}
                      onChange={handleTicketChange}
                      required
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category"
                        value={ticketForm.category}
                        onChange={handleTicketChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="loan_application">Loan Application</option>
                        <option value="payment_issue">Payment Issue</option>
                        <option value="account_access">Account Access</option>
                        <option value="document_upload">Document Upload</option>
                        <option value="general_inquiry">General Inquiry</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        name="priority"
                        value={ticketForm.priority}
                        onChange={handleTicketChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need help soon</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={ticketForm.description}
                      onChange={handleTicketChange}
                      required
                      rows={6}
                      placeholder="Please provide as much detail as possible about your issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      For urgent payment or security issues, please call us directly at 011-234-5678.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
