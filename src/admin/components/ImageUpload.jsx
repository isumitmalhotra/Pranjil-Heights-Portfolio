import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadAPI } from '../services/adminApi';
import toast from 'react-hot-toast';

/**
 * Reusable Image Upload component.
 * Supports both file upload (Multer) and manual URL entry.
 *
 * Props:
 *  - value: current URL string
 *  - onChange: (url: string) => void
 *  - uploadFn: optional custom upload function (file) => Promise<{data:{url}}>
 *  - folder: 'products' | 'categories' | 'testimonials' | 'general'
 *  - label: string
 *  - required: boolean
 *  - accept: string (e.g. 'image/*')
 *  - className: extra wrapper class
 *  - previewSize: 'sm' | 'md' | 'lg'
 */
const ImageUpload = ({
  value = '',
  onChange,
  uploadFn,
  folder = 'general',
  label = 'Image',
  required = false,
  accept = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
  className = '',
  previewSize = 'md',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: 'h-24',
    md: 'h-36',
    lg: 'h-48',
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = accept.split(',').map(t => t.trim());
    if (!validTypes.some(t => {
      if (t === 'image/*') return file.type.startsWith('image/');
      return file.type === t;
    })) {
      toast.error('Invalid file type');
      return;
    }

    // Validate file size (5MB max for images)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      let response;

      if (uploadFn) {
        response = await uploadFn(file);
      } else {
        // Use default upload based on folder
        switch (folder) {
          case 'products':
            response = await uploadAPI.uploadProductImage(file, label);
            break;
          case 'categories':
            response = await uploadAPI.uploadCategoryImage(file, label);
            break;
          case 'testimonials':
            response = await uploadAPI.uploadTestimonialImage(file, label);
            break;
          default:
            response = await uploadAPI.upload(file, folder, label);
        }
      }

      const url = response?.data?.url || response?.url;
      if (url) {
        onChange(url);
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed — no URL returned');
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showUrlInput ? 'Upload file' : 'Paste URL'}
        </button>
      </div>

      {showUrlInput ? (
        /* URL input mode */
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          {value && (
            <div className="relative">
              <img
                src={value}
                alt="Preview"
                className={`w-full ${sizeClasses[previewSize]} object-cover rounded-lg border`}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* File upload mode */
        <>
          {value ? (
            /* Has image — show preview */
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className={`w-full ${sizeClasses[previewSize]} object-cover rounded-lg border`}
                onError={(e) => {
                  e.target.src = '';
                  e.target.alt = 'Failed to load';
                  e.target.className = `w-full ${sizeClasses[previewSize]} bg-gray-100 rounded-lg border flex items-center justify-center`;
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100"
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Replace'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* No image — show drop zone */
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                ${sizeClasses[previewSize]} w-full border-2 border-dashed rounded-lg cursor-pointer
                flex flex-col items-center justify-center gap-2 transition-colors
                ${dragOver
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
                }
                ${isUploading ? 'pointer-events-none opacity-60' : ''}
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                  <span className="text-xs text-gray-500">Uploading…</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload <span className="text-gray-400">or drag & drop</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
                  </div>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = '';
            }}
          />
        </>
      )}
    </div>
  );
};

export default ImageUpload;
