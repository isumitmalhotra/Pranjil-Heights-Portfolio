import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Eye, Loader2, X, Upload,
  Package, Filter, ChevronLeft, ChevronRight, Palette
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/adminApi';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const initialFormData = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  categoryId: '',
  price: '',
  // Technical Specifications
  thickness: '',
  width: '',
  length: '',
  material: 'PVC',
  weight: '',
  // Images (up to 6)
  image: '',
  image2: '',
  image3: '',
  image4: '',
  image5: '',
  image6: '',
  // Features and Applications
  features: '',
  applications: '',
  // Finishes - now an array of objects with name, hex, and image
  finishes: [],
  // Additional specs as text
  specifications: '',
  // Flags
  isFeatured: false,
  isActive: true,
  sortOrder: 0
};

// Default finish template - now includes array of images for each finish
const defaultFinish = { name: '', hex: '#D4B896', image: '', images: ['', '', '', '', '', ''] };
const standardSpecKeys = ['thickness', 'width', 'length', 'material', 'weight'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsAPI.getAll({ limit: 'all', order: 'desc', sortBy: 'updatedAt' });
      setProducts(response.data?.products || response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data?.categories || response.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !editingProduct ? { slug: generateSlug(value) } : {})
    }));
  };

  // Finish management handlers
  const handleAddFinish = () => {
    setFormData(prev => ({
      ...prev,
      finishes: [...(prev.finishes || []), { ...defaultFinish }]
    }));
  };

  const handleRemoveFinish = (index) => {
    setFormData(prev => ({
      ...prev,
      finishes: prev.finishes.filter((_, i) => i !== index)
    }));
  };

  const handleFinishChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      finishes: prev.finishes.map((finish, i) => 
        i === index ? { ...finish, [field]: value } : finish
      )
    }));
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      
      // Parse features and applications from JSON strings
      let featuresText = '';
      let applicationsText = '';
      let specificationsText = '';
      let thickness = '';
      let width = '';
      let length = '';
      let material = 'PVC';
      let weight = '';
      
      try {
        const features = typeof product.features === 'string' 
          ? JSON.parse(product.features) 
          : (product.features || []);
        featuresText = Array.isArray(features) ? features.join('\n') : '';
      } catch { featuresText = ''; }
      
      try {
        const applications = typeof product.applications === 'string' 
          ? JSON.parse(product.applications) 
          : (product.applications || []);
        applicationsText = Array.isArray(applications) ? applications.join('\n') : '';
      } catch { applicationsText = ''; }
      
      // Handle specifications from either array or object payload.
      try {
        if (Array.isArray(product.specifications)) {
          const customSpecs = [];
          product.specifications.forEach((spec) => {
            const rawName = spec?.name || '';
            const normalizedName = rawName.toLowerCase().trim();
            const valueWithUnit = `${spec?.value || ''}${spec?.unit ? ` ${spec.unit}` : ''}`.trim();

            if (normalizedName.includes('thickness')) thickness = spec?.value || '';
            else if (normalizedName.includes('width')) width = spec?.value || '';
            else if (normalizedName.includes('length')) length = spec?.value || '';
            else if (normalizedName.includes('material')) material = spec?.value || material;
            else if (normalizedName.includes('weight')) weight = spec?.value || '';
            else if (rawName) customSpecs.push(`${rawName}: ${valueWithUnit}`);
          });
          specificationsText = customSpecs.join('\n');
        } else if (typeof product.specifications === 'object' && product.specifications) {
          const customSpecs = [];
          Object.entries(product.specifications).forEach(([key, val]) => {
            const normalizedKey = key.toLowerCase().trim();
            const value = `${val || ''}`.trim();

            if (normalizedKey === 'thickness') thickness = value;
            else if (normalizedKey === 'width') width = value;
            else if (normalizedKey === 'length') length = value;
            else if (normalizedKey === 'material') material = value || material;
            else if (normalizedKey === 'weight') weight = value;
            else customSpecs.push(`${key}: ${value}`);
          });
          specificationsText = customSpecs.join('\n');
        }
      } catch { specificationsText = ''; }
      
      // Handle images - array of objects {url, alt}
      const imageUrls = Array.isArray(product.images) 
        ? product.images.map(img => typeof img === 'string' ? img : img.url).filter(Boolean)
        : [];
      
      // Parse finishes if stored - now as array of objects with name, hex, image, and images array
      let finishesArray = [];
      try {
        const finishes = typeof product.finishes === 'string' 
          ? JSON.parse(product.finishes) 
          : (product.finishes || []);
        if (Array.isArray(finishes)) {
          finishesArray = finishes.map(f => ({
            name: f.name || (typeof f === 'string' ? f : ''),
            hex: f.hex || '#D4B896',
            image: f.image || '',
            images: Array.isArray(f.images) ? [...f.images, '', '', '', '', '', ''].slice(0, 6) : ['', '', '', '', '', '']
          }));
        }
      } catch { finishesArray = []; }
      
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        categoryId: product.categoryId ? String(product.categoryId) : '',
        price: product.price || '',
        thickness,
        width,
        length,
        material,
        weight,
        image: imageUrls[0] || '',
        image2: imageUrls[1] || '',
        image3: imageUrls[2] || '',
        image4: imageUrls[3] || '',
        image5: imageUrls[4] || '',
        image6: imageUrls[5] || '',
        features: featuresText,
        specifications: specificationsText,
        applications: applicationsText,
        finishes: finishesArray,
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== false,
        sortOrder: product.sortOrder || 0
      });
    } else {
      setEditingProduct(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedCategoryId = Number.parseInt(formData.categoryId, 10);
      if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
        toast.error('Please select a valid category');
        return;
      }

      // Build specifications array from structured fields + custom specs
      let specifications = [];
      
      // Add structured specification fields
      if (formData.thickness) specifications.push({ name: 'Thickness', value: formData.thickness, unit: 'mm' });
      if (formData.width) specifications.push({ name: 'Width', value: formData.width, unit: 'mm' });
      if (formData.length) specifications.push({ name: 'Length', value: formData.length, unit: 'mm' });
      if (formData.material) specifications.push({ name: 'Material', value: formData.material, unit: '' });
      if (formData.weight) specifications.push({ name: 'Weight', value: formData.weight, unit: 'kg/sqm' });
      
      // Add custom specifications from text area
      if (formData.specifications && formData.specifications.trim()) {
        const customSpecs = formData.specifications.split('\n')
          .filter(Boolean)
          .map(line => {
            const [name, ...rest] = line.split(':');
            const specName = name?.trim() || '';
            return {
              name: specName,
              value: rest.join(':').trim() || line.trim(),
              unit: ''
            };
          })
          .filter(spec => {
            const normalized = spec.name.toLowerCase();
            return spec.name && !standardSpecKeys.includes(normalized);
          });
        specifications.push(...customSpecs);
      }

      const seenSpecs = new Set();
      specifications = specifications.filter((spec) => {
        const key = `${spec.name.toLowerCase()}::${spec.value}`;
        if (seenSpecs.has(key)) return false;
        seenSpecs.add(key);
        return true;
      });

      // Collect all image URLs
      const allImageUrls = [
        formData.image,
        formData.image2,
        formData.image3,
        formData.image4,
        formData.image5,
        formData.image6
      ].filter(url => url && url.trim());
      
      const images = allImageUrls.length > 0 
        ? allImageUrls.map(url => ({ url: url.trim(), alt: formData.name }))
        : null;

      // Finishes is already an array of objects with name, hex, image
      const finishes = Array.isArray(formData.finishes) 
        ? formData.finishes
            .filter(f => f.name && f.name.trim())
            .map(f => ({
              name: f.name.trim(),
              hex: f.hex || '#D4B896',
              image: f.image || '',
              images: Array.isArray(f.images) ? f.images.filter(url => url && url.trim()) : []
            }))
        : [];

      const submitData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryId: parsedCategoryId,
        price: formData.price ? parseFloat(formData.price) : null,
        sortOrder: parseInt(formData.sortOrder) || 0,
        features: formData.features ? formData.features.split('\n').filter(Boolean) : [],
        applications: formData.applications ? formData.applications.split('\n').filter(Boolean) : [],
        specifications: specifications.length > 0 ? specifications : null,
        images,
        finishes: finishes.length > 0 ? finishes : null,
        isFeatured: formData.isFeatured || false,
        isActive: formData.isActive !== false
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, submitData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(submitData);
        toast.success('Product created successfully');
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Filter and paginate
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.categoryId === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {categories.find(c => c.id === product.categoryId)?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {product.price ? `₹${product.price}` : 'On Request'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.isFeatured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g., Premium PVC Foam Board"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="auto-generated-from-name"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Leave empty for 'On Request'"
                      />
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        name="sortOrder"
                        value={formData.sortOrder}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="0"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        maxLength={200}
                        placeholder="Brief description shown in product cards"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Detailed product description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    📏 Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thickness (mm)</label>
                      <input
                        type="text"
                        name="thickness"
                        value={formData.thickness}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g., 3, 5, 8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
                      <input
                        type="text"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g., 1220"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length (mm)</label>
                      <input
                        type="text"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g., 2440"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="PVC">PVC</option>
                        <option value="WPC">WPC</option>
                        <option value="HDPE">HDPE</option>
                        <option value="ABS">ABS</option>
                        <option value="Composite">Composite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg/m²)</label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="e.g., 0.55"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Specifications</label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                      placeholder="Density: 0.5 g/cm³&#10;Color Stability: UV Resistant"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: Name: Value (one per line)</p>
                  </div>
                </div>

                {/* Product Images Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    🖼️ Product Images
                    <span className="text-xs font-normal text-gray-500">(Image 1 is required, upload up to 6 images)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                      folder="products"
                      label="Image 1 (Main)"
                      required
                      previewSize="sm"
                    />
                    <ImageUpload
                      value={formData.image2}
                      onChange={(url) => setFormData(prev => ({ ...prev, image2: url }))}
                      folder="products"
                      label="Image 2"
                      previewSize="sm"
                    />
                    <ImageUpload
                      value={formData.image3}
                      onChange={(url) => setFormData(prev => ({ ...prev, image3: url }))}
                      folder="products"
                      label="Image 3"
                      previewSize="sm"
                    />
                    <ImageUpload
                      value={formData.image4}
                      onChange={(url) => setFormData(prev => ({ ...prev, image4: url }))}
                      folder="products"
                      label="Image 4"
                      previewSize="sm"
                    />
                    <ImageUpload
                      value={formData.image5}
                      onChange={(url) => setFormData(prev => ({ ...prev, image5: url }))}
                      folder="products"
                      label="Image 5"
                      previewSize="sm"
                    />
                    <ImageUpload
                      value={formData.image6}
                      onChange={(url) => setFormData(prev => ({ ...prev, image6: url }))}
                      folder="products"
                      label="Image 6"
                      previewSize="sm"
                    />
                  </div>
                </div>

                {/* Features & Applications Section */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    ✨ Features & Applications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                      <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Water Resistant&#10;UV Stabilized&#10;Fire Retardant&#10;Easy to Install"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Applications / Use Cases (one per line)</label>
                      <textarea
                        name="applications"
                        value={formData.applications}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Commercial Interiors&#10;Healthcare Facilities&#10;Educational Institutions&#10;Residential Projects"
                      />
                    </div>
                  </div>
                </div>

                {/* Finishes Section - Color Picker with Images */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Available Finishes / Colors
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddFinish}
                      className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Finish
                    </button>
                  </div>
                  
                  {(!formData.finishes || formData.finishes.length === 0) ? (
                    <div className="text-center py-8 border-2 border-dashed border-amber-200 rounded-lg">
                      <Palette className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                      <p className="text-sm text-gray-500">No finishes added yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Add Finish" to define available colors/finishes</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.finishes.map((finish, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
                          {/* Header Row */}
                          <div className="flex items-start gap-3 mb-3">
                            {/* Color Preview */}
                            <div className="shrink-0">
                              <div 
                                className="w-14 h-14 rounded-lg shadow-inner border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                                style={{ backgroundColor: finish.hex }}
                                title="Click color picker to change"
                              >
                                {finish.image && (
                                  <img src={finish.image} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                )}
                              </div>
                              <input
                                type="color"
                                value={finish.hex}
                                onChange={(e) => handleFinishChange(index, 'hex', e.target.value)}
                                className="w-14 h-6 mt-1 cursor-pointer rounded border-0"
                                title="Pick color"
                              />
                            </div>
                            
                            {/* Finish Name & Hex */}
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={finish.name}
                                  onChange={(e) => handleFinishChange(index, 'name', e.target.value)}
                                  placeholder="Finish name (e.g., Natural Oak)"
                                  className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                                <input
                                  type="text"
                                  value={finish.hex}
                                  onChange={(e) => handleFinishChange(index, 'hex', e.target.value)}
                                  placeholder="#D4B896"
                                  className="w-24 px-2 py-1.5 text-sm font-mono border rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                              <input
                                type="url"
                                value={finish.image}
                                onChange={(e) => handleFinishChange(index, 'image', e.target.value)}
                                placeholder="Swatch texture URL (optional) - shown on color picker"
                                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveFinish(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove finish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Finish-specific Images (6 slots) */}
                          <div className="border-t pt-3 mt-3">
                            <p className="text-xs font-medium text-gray-600 mb-2">
                              📷 Product Images for "{finish.name || 'this finish'}" (shown when finish is selected)
                            </p>
                            <div className="grid grid-cols-6 gap-2">
                              {(finish.images || ['', '', '', '', '', '']).slice(0, 6).map((imgUrl, imgIndex) => (
                                <div key={imgIndex} className="relative">
                                  <input
                                    type="url"
                                    value={imgUrl}
                                    onChange={(e) => {
                                      const newImages = [...(finish.images || ['', '', '', '', '', ''])];
                                      newImages[imgIndex] = e.target.value;
                                      handleFinishChange(index, 'images', newImages);
                                    }}
                                    placeholder={`Image ${imgIndex + 1}`}
                                    className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-amber-500"
                                  />
                                  {imgUrl && (
                                    <img 
                                      src={imgUrl} 
                                      alt={`${finish.name} ${imgIndex + 1}`}
                                      className="mt-1 w-full h-12 object-cover rounded border"
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    Each finish can have its own set of product images. When user selects a finish on the product page, the images and title will update accordingly.
                  </p>
                </div>

                {/* Status Toggles */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Status</h3>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Active (visible on website)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Featured on Homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
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
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
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

export default Products;
