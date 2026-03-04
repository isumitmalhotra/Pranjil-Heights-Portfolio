import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Trash2, Loader2, X, Users,
  ChevronLeft, ChevronRight, Mail, Phone, Calendar, 
  CheckCircle, Clock, XCircle, Building, MapPin, Globe,
  FileText, Download
} from 'lucide-react';
import { dealersAPI } from '../services/adminApi';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: FileText },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle }
];

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDealer, setViewDealer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    setIsLoading(true);
    try {
      const response = await dealersAPI.getAll();
      setDealers(response.data?.applications || response.data?.dealers || response.applications || []);
    } catch (error) {
      console.error('Error fetching dealers:', error);
      toast.error('Failed to load dealer applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdating(true);
    try {
      await dealersAPI.updateStatus(id, newStatus);
      toast.success('Status updated successfully');
      
      setDealers(prev => prev.map(d => 
        d.id === id ? { ...d, status: newStatus } : d
      ));
      
      if (viewDealer?.id === id) {
        setViewDealer(prev => ({ ...prev, status: newStatus }));
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
      await dealersAPI.delete(id);
      toast.success('Dealer application deleted successfully');
      setDeleteConfirm(null);
      setViewDealer(null);
      fetchDealers();
    } catch (error) {
      console.error('Error deleting dealer:', error);
      toast.error('Failed to delete application');
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
  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = 
      dealer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || dealer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDealers.length / itemsPerPage);
  const paginatedDealers = filteredDealers.slice(
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
        <h1 className="text-2xl font-bold text-gray-900">Dealer Applications</h1>
        <p className="text-gray-500">Manage dealer partnership applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company, contact person, or city..."
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

      {/* Dealers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact Person</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Applied On</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDealers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No dealer applications found</p>
                  </td>
                </tr>
              ) : (
                paginatedDealers.map(dealer => (
                  <tr key={dealer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{dealer.companyName}</p>
                        <p className="text-sm text-gray-500">{dealer.businessType || 'Not specified'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{dealer.contactPerson}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          {dealer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {dealer.city}{dealer.state ? `, ${dealer.state}` : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(dealer.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(dealer.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewDealer(dealer)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(dealer)}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDealers.length)} of {filteredDealers.length}
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

      {/* View Dealer Modal */}
      {viewDealer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Dealer Application Details</h2>
              <button onClick={() => setViewDealer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="text-xs text-gray-500">Company Name</label>
                    <p className="text-gray-900 font-medium">{viewDealer.companyName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Business Type</label>
                    <p className="text-gray-900">{viewDealer.businessType || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Years in Business</label>
                    <p className="text-gray-900">{viewDealer.yearsInBusiness || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">GST Number</label>
                    <p className="text-gray-900">{viewDealer.gstNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Contact Person</label>
                    <p className="text-gray-900">{viewDealer.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Designation</label>
                    <p className="text-gray-900">{viewDealer.designation || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-gray-900">{viewDealer.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="text-gray-900">{viewDealer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    {viewDealer.address && `${viewDealer.address}, `}
                    {viewDealer.city}
                    {viewDealer.state && `, ${viewDealer.state}`}
                    {viewDealer.pincode && ` - ${viewDealer.pincode}`}
                  </p>
                </div>
              </div>

              {/* Website */}
              {viewDealer.website && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </h3>
                  <a 
                    href={viewDealer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline"
                  >
                    {viewDealer.website}
                  </a>
                </div>
              )}

              {/* Products Interest */}
              {viewDealer.productsInterested && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Products Interested In</h3>
                  <p className="text-gray-900">{viewDealer.productsInterested}</p>
                </div>
              )}

              {/* Existing Brands */}
              {viewDealer.existingBrands && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Existing Brands Dealt With</h3>
                  <p className="text-gray-900">{viewDealer.existingBrands}</p>
                </div>
              )}

              {/* Coverage Area */}
              {viewDealer.coverageArea && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Coverage Area</h3>
                  <p className="text-gray-900">{viewDealer.coverageArea}</p>
                </div>
              )}

              {/* Message */}
              {viewDealer.message && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Additional Message</h3>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {viewDealer.message}
                  </p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Applied: {formatDate(viewDealer.createdAt)}</span>
              </div>

              {/* Status Update */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase block mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(viewDealer.id, status.value)}
                      disabled={isUpdating || viewDealer.status === status.value}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viewDealer.status === status.value
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
                href={`mailto:${viewDealer.email}?subject=Regarding Your Dealer Application - ${viewDealer.companyName}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
              <a
                href={`tel:${viewDealer.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
              <button
                onClick={() => {
                  setViewDealer(null);
                  setDeleteConfirm(viewDealer);
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the application from "{deleteConfirm.companyName}"? This action cannot be undone.
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

export default Dealers;
