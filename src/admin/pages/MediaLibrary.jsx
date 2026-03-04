import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, Search, Trash2, Loader2, X, Image as ImageIcon,
  FileText, Film, File, HardDrive, FolderOpen,
  ChevronLeft, ChevronRight, Eye, Copy, Check, Grid, List
} from 'lucide-react';
import { uploadAPI } from '../services/adminApi';
import toast from 'react-hot-toast';

const FOLDERS = [
  { value: '', label: 'All Files' },
  { value: 'products', label: 'Products' },
  { value: 'categories', label: 'Categories' },
  { value: 'catalogues', label: 'Catalogues' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'general', label: 'General' },
];

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFolder, setFilterFolder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [stats, setStats] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [copiedId, setCopiedId] = useState(null);

  const fileInputRef = useRef(null);
  const itemsPerPage = 24;

  useEffect(() => {
    fetchMedia();
  }, [currentPage, filterFolder, searchQuery]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filterFolder) params.folder = filterFolder;
      if (searchQuery) params.search = searchQuery;

      const response = await uploadAPI.getMedia(params);
      const data = response?.data || response;
      setMedia(data.media || []);
      setPagination(data.pagination || { total: 0, pages: 1 });
    } catch (error) {
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await uploadAPI.getStats();
      setStats(response?.data || response);
    } catch {
      // Stats are non-critical
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      if (files.length === 1) {
        await uploadAPI.upload(files[0], filterFolder || 'general');
        successCount = 1;
      } else {
        await uploadAPI.uploadMultiple(files, filterFolder || 'general');
        successCount = files.length;
      }

      toast.success(`${successCount} file(s) uploaded`);
      fetchMedia();
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item) => {
    try {
      await uploadAPI.delete(item.id);
      toast.success('File deleted');
      setDeleteConfirm(null);
      setPreviewItem(null);
      fetchMedia();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(url);
      toast.success('URL copied');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (mimeType?.startsWith('video/')) return <Film className="w-5 h-5 text-purple-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const isImage = (mimeType) => mimeType?.startsWith('image/');

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500">Browse and manage all uploaded files</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            Upload Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                <p className="text-xs text-gray-500">Total Files</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.diskUsageFormatted}</p>
                <p className="text-xs text-gray-500">Disk Used</p>
              </div>
            </div>
          </div>
          {stats.folders?.slice(0, 2).map((folder) => (
            <div key={folder.name} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{folder.files}</p>
                  <p className="text-xs text-gray-500 capitalize">{folder.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterFolder}
          onChange={(e) => { setFilterFolder(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
        >
          {FOLDERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'hover:bg-gray-50'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'hover:bg-gray-50'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No files found</h3>
          <p className="text-gray-500 mb-4">Upload images or PDFs to get started</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Upload Files
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ============================================ */
        /* GRID VIEW */
        /* ============================================ */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
              onClick={() => setPreviewItem(item)}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {isImage(item.mimeType) ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center ${isImage(item.mimeType) ? 'hidden' : ''}`}
                >
                  {getFileIcon(item.mimeType)}
                </div>
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                    title="Copy URL"
                  >
                    {copiedId === item.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-700" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(item); }}
                    className="p-2 bg-white rounded-lg hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400 capitalize">{item.folder}</span>
                  <span className="text-[10px] text-gray-400">{formatBytes(item.size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ============================================ */
        /* LIST VIEW */
        /* ============================================ */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">File</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Folder</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {media.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {isImage(item.mimeType) ? (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getFileIcon(item.mimeType)
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={item.originalName}>
                        {item.originalName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">{item.folder}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-500">{item.mimeType?.split('/')[1]?.toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-500">{formatBytes(item.size)}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyUrl(item.url)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        {copiedId === item.url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
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

      {/* ============================================ */}
      {/* FILE PREVIEW MODAL */}
      {/* ============================================ */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold truncate">{previewItem.originalName}</h2>
              <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Preview */}
              {isImage(previewItem.mimeType) ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.alt || previewItem.originalName}
                  className="w-full max-h-80 object-contain bg-gray-50 rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  {getFileIcon(previewItem.mimeType)}
                </div>
              )}

              {/* Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Filename</span>
                    <p className="font-medium text-gray-900 truncate">{previewItem.filename}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Size</span>
                    <p className="font-medium text-gray-900">{formatBytes(previewItem.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type</span>
                    <p className="font-medium text-gray-900">{previewItem.mimeType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Folder</span>
                    <p className="font-medium text-gray-900 capitalize">{previewItem.folder}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Uploaded</span>
                    <p className="font-medium text-gray-900">{formatDate(previewItem.createdAt)}</p>
                  </div>
                </div>

                {/* URL */}
                <div>
                  <span className="text-sm text-gray-500">URL</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={previewItem.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm text-gray-700"
                    />
                    <button
                      onClick={() => copyUrl(previewItem.url)}
                      className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                      {copiedId === previewItem.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t">
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Open
                </a>
                <button
                  onClick={() => { setPreviewItem(null); setDeleteConfirm(previewItem); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* DELETE CONFIRMATION */}
      {/* ============================================ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete File</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete &ldquo;{deleteConfirm.originalName}&rdquo;?
            </p>
            <p className="text-amber-600 text-sm mb-4">
              This will permanently remove the file from the server.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
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

export default MediaLibrary;
