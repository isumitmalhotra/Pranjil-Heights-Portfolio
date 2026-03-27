import React, { useEffect, useState } from 'react';
import { Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsAPI, uploadAPI } from '../services/adminApi';

const defaultHeroContent = {
  badgeText: "India's Leading PVC Panel Manufacturer",
  titleLine1: "India's No.1 Manufacturer of PVC Wall Panels,",
  titleLine2: 'Fluted Panels & ACP/HPL Sheets',
  subtitle: 'Delivering timeless designs, unmatched durability and premium wall solutions trusted by dealers across India.',
  featurePills: ['Termite & Water Resistant', 'Fire Retardant', 'Easy Installation'],
  cta: {
    primaryText: 'Explore Product Range',
    secondaryText: 'Download Catalogue',
    tertiaryText: 'Become a Dealer',
  },
  trustBadges: [
    { label: 'Manufacturing', value: 'Since 2017' },
    { label: 'Across India', value: '5000+' },
    { label: 'Projects', value: '10,000+' },
    { label: 'Certified', value: 'ISO 9001' },
  ],
  visualStack: {
    label: 'Product Visual Stack',
    title: 'Explore Core Panel Categories',
    description: 'Premium finishes crafted for dealer display, residential interiors, and commercial projects.',
  },
  swatches: [
    { id: 'pvc-wall-panel', title: 'PVC Wall Panel', subtitle: 'Matte Grain', imageUrl: '/hero-panels/pvc-wall-panel.jpg' },
    { id: 'fluted-panel', title: 'Fluted Panel', subtitle: 'Vertical Groove', imageUrl: '/hero-panels/fluted-panel.webp' },
    { id: 'acp-hpl-sheet', title: 'ACP/HPL Sheet', subtitle: 'Metallic Finish', imageUrl: '/hero-panels/acp-hpl-sheet.webp' },
    { id: 'uv-marble-sheet', title: 'UV Marble Sheet', subtitle: 'High Gloss', imageUrl: '/hero-panels/uv-marble-sheet.jpg' },
  ],
};

const HomeHero = () => {
  const [content, setContent] = useState(defaultHeroContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await settingsAPI.getPublicHomeHero();
        setContent(response?.data || defaultHeroContent);
      } catch (error) {
        toast.error(error.message || 'Failed to load current hero content');
        setContent(defaultHeroContent);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateField = (key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateFeaturePill = (index, value) => {
    setContent((prev) => {
      const next = [...prev.featurePills];
      next[index] = value;
      return { ...prev, featurePills: next };
    });
  };

  const updateCta = (key, value) => {
    setContent((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        [key]: value,
      },
    }));
  };

  const updateTrustBadge = (index, key, value) => {
    setContent((prev) => {
      const next = [...prev.trustBadges];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, trustBadges: next };
    });
  };

  const updateVisualStack = (key, value) => {
    setContent((prev) => ({
      ...prev,
      visualStack: {
        ...prev.visualStack,
        [key]: value,
      },
    }));
  };

  const updateSwatch = (index, key, value) => {
    setContent((prev) => {
      const next = [...prev.swatches];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, swatches: next };
    });
  };

  const uploadSwatchImage = async (index, file) => {
    if (!file) return;
    const uploadKey = `swatch-${index}`;
    setUploadingKey(uploadKey);
    try {
      const response = await uploadAPI.upload(file, 'general', `Hero swatch ${index + 1}`);
      const url = response?.data?.url || response?.url;
      if (!url) throw new Error('Upload did not return a valid URL');
      updateSwatch(index, 'imageUrl', url);
      toast.success('Swatch image uploaded');
    } catch (error) {
      toast.error(error.message || 'Failed to upload swatch image');
    } finally {
      setUploadingKey('');
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      await settingsAPI.update('home_hero_content', {
        value: content,
        type: 'json',
        group: 'homepage',
      });
      toast.success('Home hero content updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save hero content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Hero Content</h1>
          <p className="text-gray-500">Edit all hero text and right-side product visual stack shown on homepage.</p>
        </div>
        <button
          onClick={saveContent}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Hero Text Content</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Top Badge Text</label>
          <input
            value={content.badgeText}
            onChange={(e) => updateField('badgeText', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Heading Line 1</label>
            <input
              value={content.titleLine1}
              onChange={(e) => updateField('titleLine1', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Heading Line 2</label>
            <input
              value={content.titleLine2}
              onChange={(e) => updateField('titleLine2', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Subtitle</label>
          <textarea
            rows={3}
            value={content.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {content.featurePills.map((pill, index) => (
            <div key={`pill-${index}`}>
              <label className="block text-sm text-gray-600 mb-1">Feature Pill {index + 1}</label>
              <input
                value={pill}
                onChange={(e) => updateFeaturePill(index, e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Primary Button Text</label>
            <input
              value={content.cta.primaryText}
              onChange={(e) => updateCta('primaryText', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Secondary Button Text</label>
            <input
              value={content.cta.secondaryText}
              onChange={(e) => updateCta('secondaryText', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tertiary Button Text</label>
            <input
              value={content.cta.tertiaryText}
              onChange={(e) => updateCta('tertiaryText', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.trustBadges.map((badge, index) => (
            <div key={`badge-${index}`} className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 mb-2">Trust Badge {index + 1}</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={badge.label}
                  onChange={(e) => updateTrustBadge(index, 'label', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Label"
                />
                <input
                  value={badge.value}
                  onChange={(e) => updateTrustBadge(index, 'value', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Value"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Right Card: Product Visual Stack</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Card Label</label>
            <input
              value={content.visualStack.label}
              onChange={(e) => updateVisualStack('label', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Card Title</label>
            <input
              value={content.visualStack.title}
              onChange={(e) => updateVisualStack('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Card Description</label>
          <textarea
            rows={2}
            value={content.visualStack.description}
            onChange={(e) => updateVisualStack('description', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.swatches.map((swatch, index) => (
            <div key={swatch.id || `swatch-${index}`} className="rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="text-sm font-medium text-gray-800">Swatch {index + 1}</p>
              <input
                value={swatch.title}
                onChange={(e) => updateSwatch(index, 'title', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Swatch title"
              />
              <input
                value={swatch.subtitle}
                onChange={(e) => updateSwatch(index, 'subtitle', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Swatch subtitle"
              />
              <input
                value={swatch.imageUrl}
                onChange={(e) => updateSwatch(index, 'imageUrl', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Image URL"
              />

              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                {uploadingKey === `swatch-${index}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Swatch Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadSwatchImage(index, e.target.files?.[0])}
                  disabled={uploadingKey === `swatch-${index}`}
                />
              </label>

              {swatch.imageUrl ? (
                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-24 flex items-center justify-center">
                  <img src={swatch.imageUrl} alt={swatch.title || 'Swatch'} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 h-24 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
