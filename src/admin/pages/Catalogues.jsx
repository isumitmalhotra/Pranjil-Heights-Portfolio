import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, Loader2, X, FileText,
  Download, Eye, ChevronLeft, ChevronRight, Upload,
  BarChart3, Calendar, Users, TrendingUp, ExternalLink
} from 'lucide-react';
import { cataloguesAPI, uploadAPI } from '../services/adminApi';
import toast from 'react-hot-toast';

const initialFormData = {
  name: '',
  description: '',
  fileUrl: '',
  fileSize: '',
  thumbnail: '',
  category: '',
  version: '1.0',
  isActive: true,
  order: 0,
};

const CATEGORIES = [
  'PVC Wall Panel',
  'PVC Ceiling Panel',
  'WPC Louver',
  'UV Sheet',
  'Fluted Panel',
  'Metal Solid Panel',
  'UV Sticker',
  'General',
];

const Catalogues = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const pdfInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCatalogues();
  }, [currentPage, filterCategory, searchQuery]);

  const fetchCatalogues = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filterCategory) params.category = filterCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await cataloguesAPI.getAll(params);
      setCatalogues(response.data || []);
      setPagination(response.pagination || { total: 0, pages: 1 });
    } catch (error) {
      toast.error('Failed to load catalogues');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await cataloguesAPI.getStats(30);
      setStats(response.data || response);
      setShowStatsModal(true);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File must be less than 50MB');
      return;
    }

    setIsUploadingPdf(true);
    try {
      const response = await uploadAPI.uploadCatalogue(file);
      const data = response?.data || response;
      setFormData((prev) => ({
        ...prev,
        fileUrl: data.url,
        fileSize: data.size || file.size,
      }));
      toast.success('PDF uploaded');
    } catch (err) {
      toast.error(err.message || 'PDF upload failed');
    } finally {
      setIsUploadingPdf(false);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setIsUploadingThumb(true);
    try {
      const response = await uploadAPI.upload(file, 'catalogues', formData.name || 'catalogue');
      const url = response?.data?.url || response?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, thumbnail: url }));
        toast.success('Thumbnail uploaded');
      }
    } catch (err) {
      toast.error(err.message || 'Thumbnail upload failed');
    } finally {
      setIsUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = '';
    }
  };

  const openModal = (catalogue = null) => {
    if (catalogue) {
      setEditingCatalogue(catalogue);
      setFormData({
        name: catalogue.name || '',
        description: catalogue.description || '',
        fileUrl: catalogue.fileUrl || '',
        fileSize: catalogue.fileSize || '',
        thumbnail: catalogue.thumbnail || '',
        category: catalogue.category || '',
        version: catalogue.version || '1.0',
        isActive: catalogue.isActive !== false,
        order: catalogue.order || 0,
      });
    } else {
      setEditingCatalogue(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCatalogue(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fileUrl) {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : null,
        order: parseInt(formData.order) || 0,
      };

      if (editingCatalogue) {
        await cataloguesAPI.update(editingCatalogue.id, submitData);
        toast.success('Catalogue updated successfully');
      } else {
        await cataloguesAPI.create(submitData);
        toast.success('Catalogue created successfully');
      }

      closeModal();
      fetchCatalogues();
    } catch (error) {
      toast.error(error.message || 'Failed to save catalogue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await cataloguesAPI.delete(id);
      toast.success('Catalogue deleted');
      setDeleteConfirm(null);
      fetchCatalogues();
    } catch (error) {
      toast.error('Failed to delete catalogue');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (isLoading && catalogues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalogues</h1>
          <p className="text-gray-500">Manage downloadable PDF catalogues</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            <BarChart3 className="w-4 h-4" />
            Stats
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            <Plus className="w-5 h-5" />
            Add Catalogue
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalogues..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Catalogue</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Downloads</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {catalogues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No catalogues found</p>
                    <button onClick={() => openModal()} className="mt-2 text-amber-600 hover:underline text-sm">
                      Add your first catalogue
                    </button>
                  </td>
                </tr>
              ) : (
                catalogues.map((catalogue) => (
                  <tr key={catalogue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-red-50 rounded flex items-center justify-center shrink-0">
                          {catalogue.thumbnail ? (
                            <img src={catalogue.thumbnail} alt="" className="w-full h-full object-cover rounded" />
                          ) : (
                            <FileText className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{catalogue.name}</p>
                          <p className="text-xs text-gray-400">v{catalogue.version || '1.0'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{catalogue.category || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatBytes(catalogue.fileSize)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <Download className="w-3.5 h-3.5" />
                        {catalogue.downloadCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        catalogue.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {catalogue.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {catalogue.fileUrl && (
                          <a
                            href={catalogue.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                            title="View PDF"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openModal(catalogue)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(catalogue)}
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
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={currentPage === pagination.pages}
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* CREATE / EDIT MODAL */}
      {/* ============================================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingCatalogue ? 'Edit Catalogue' : 'Add New Catalogue'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., PVC Wall Panel Range 2026"
                />
              </div>

              {/* Category & Version */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="1.0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Brief description of this catalogue..."
                />
              </div>

              {/* PDF Upload */}
              <div className="bg-red-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 PDF File *
                </label>
                {formData.fileUrl ? (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-red-200">
                    <FileText className="w-8 h-8 text-red-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.fileUrl.split('/').pop()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(formData.fileSize)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={formData.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, fileUrl: '', fileSize: '' }));
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploadingPdf && pdfInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                      ${isUploadingPdf
                        ? 'border-gray-300 bg-gray-50 pointer-events-none'
                        : 'border-red-300 hover:border-red-400 hover:bg-red-50/50'
                      }
                    `}
                  >
                    {isUploadingPdf ? (
                      <Loader2 className="w-8 h-8 animate-spin text-red-400 mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Click to upload PDF</p>
                        <p className="text-xs text-gray-400 mt-1">Max 50MB</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
                {/* Manual URL fallback */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Paste PDF URL:');
                      if (url) setFormData((prev) => ({ ...prev, fileUrl: url }));
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Or paste URL manually
                  </button>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🖼️ Cover Thumbnail (optional)
                </label>
                {formData.thumbnail ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      className="w-32 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, thumbnail: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploadingThumb && thumbInputRef.current?.click()}
                    className="w-32 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50"
                  >
                    {isUploadingThumb ? (
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-400">Upload</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Active (visible)</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCatalogue ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* STATS MODAL */}
      {/* ============================================ */}
      {showStatsModal && stats && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Download Statistics</h2>
              <button onClick={() => setShowStatsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Download className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-700">{stats.totalDownloads || 0}</p>
                  <p className="text-xs text-blue-600">Total Downloads</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-700">{stats.periodDownloads || 0}</p>
                  <p className="text-xs text-green-600">Last 30 Days</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-purple-700">{stats.uniqueUsers || 0}</p>
                  <p className="text-xs text-purple-600">Unique Users</p>
                </div>
              </div>

              {/* Top Catalogues */}
              {stats.topCatalogues && stats.topCatalogues.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Downloaded</h3>
                  <div className="space-y-2">
                    {stats.topCatalogues.slice(0, 5).map((cat, i) => (
                      <div key={cat.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{cat.downloads} downloads</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export link */}
              <div className="pt-4 border-t text-center">
                <a
                  href={cataloguesAPI.exportDownloads()}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Export All Download Data (CSV) →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DELETE CONFIRMATION */}
      {/* ============================================ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Catalogue</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete &ldquo;{deleteConfirm.name}&rdquo;?
            </p>
            {(deleteConfirm.downloadCount > 0) && (
              <p className="text-amber-600 text-sm mb-4">
                ⚠️ This catalogue has {deleteConfirm.downloadCount} recorded downloads. Download history will also be removed.
              </p>
            )}
            <div className="flex items-center justify-end gap-3 mt-6">
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

export default Catalogues;
