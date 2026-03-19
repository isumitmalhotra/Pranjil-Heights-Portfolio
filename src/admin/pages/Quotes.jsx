import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Trash2, Loader2, X, Quote as QuoteIcon,
  ChevronLeft, ChevronRight, Mail, Phone, Calendar, 
  CheckCircle, Clock, XCircle, Building, MapPin, Package
} from 'lucide-react';
import { quotesAPI } from '../services/adminApi';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-purple-100 text-purple-700', icon: Phone },
  { value: 'QUOTED', label: 'Quoted', color: 'bg-amber-100 text-amber-700', icon: QuoteIcon },
  { value: 'CONVERTED', label: 'Converted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-700', icon: XCircle }
];

const normalizeQuote = (quote) => {
  const estimatedAreaText = quote.estimatedArea
    ? `${quote.estimatedArea}${quote.areaUnit ? ` ${quote.areaUnit}` : ''}`
    : '';

  return {
    ...quote,
    companyName: quote.companyName || quote.company || '',
    city: quote.city || quote.deliveryAddress || '',
    state: quote.state || '',
    productInterest: quote.productInterest || quote.projectType || '',
    requirements: quote.requirements || quote.projectDetails || quote.additionalNotes || '',
    quantity: quote.quantity || estimatedAreaText,
  };
};

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewQuote, setViewQuote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await quotesAPI.getAll();
      const rawQuotes = response.data?.quotes || response.quotes || [];
      setQuotes(rawQuotes.map(normalizeQuote));
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quote requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdating(true);
    try {
      await quotesAPI.updateStatus(id, newStatus);
      toast.success('Status updated successfully');
      
      setQuotes(prev => prev.map(q => 
        q.id === id ? { ...q, status: newStatus } : q
      ));
      
      if (viewQuote?.id === id) {
        setViewQuote(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await quotesAPI.delete(id);
      toast.success('Quote request deleted successfully');
      setDeleteConfirm(null);
      setViewQuote(null);
      fetchQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast.error('Failed to delete quote request');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter and paginate
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.productInterest?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || quote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        <statusInfo.icon className="w-3 h-3" />
        {statusInfo.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
        <p className="text-gray-500">Manage customer quotation requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">All Status</option>
          {statusOptions.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product Interest</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedQuotes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <QuoteIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No quote requests found</p>
                  </td>
                </tr>
              ) : (
                paginatedQuotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{quote.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          {quote.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{quote.companyName || '-'}</p>
                        {quote.city && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {quote.city}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-xs">
                        {quote.productInterest || 'Not specified'}
                      </p>
                      {quote.quantity && (
                        <p className="text-xs text-gray-500">Qty: {quote.quantity}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(quote.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewQuote(quote)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(quote)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Quote Modal */}
      {viewQuote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Quote Request Details</h2>
              <button onClick={() => setViewQuote(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <p className="text-gray-900">{viewQuote.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p className="text-gray-900">{viewQuote.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone</label>
                      <p className="text-gray-900">{viewQuote.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Company Name</label>
                      <p className="text-gray-900">{viewQuote.companyName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Location</label>
                      <p className="text-gray-900">
                        {viewQuote.city ? `${viewQuote.city}${viewQuote.state ? `, ${viewQuote.state}` : ''}` : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Interest */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Project Requirement
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-xs text-gray-500">Type</label>
                    <p className="text-gray-900">{viewQuote.productInterest || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Estimated Area / Quantity</label>
                    <p className="text-gray-900">{viewQuote.quantity || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {viewQuote.requirements && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Requirements / Message</h3>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {viewQuote.requirements}
                  </p>
                </div>
              )}

              {/* Timeline */}
              {viewQuote.timeline && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Expected Timeline</h3>
                  <p className="text-gray-900">{viewQuote.timeline}</p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Received: {formatDate(viewQuote.createdAt)}</span>
              </div>

              {/* Status Update */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(viewQuote.id, status.value)}
                      disabled={isUpdating || viewQuote.status === status.value}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewQuote.status === status.value
                          ? status.color + ' ring-2 ring-offset-2 ring-current'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 p-4 border-t bg-gray-50">
              <a
                href={`mailto:${viewQuote.email}?subject=Re: Quote Request - ${viewQuote.productInterest || 'Your Inquiry'}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
              {viewQuote.phone && (
                <a
                  href={`tel:${viewQuote.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
              <button
                onClick={() => {
                  setViewQuote(null);
                  setDeleteConfirm(viewQuote);
                }}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Quote Request</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this quote request from "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;
