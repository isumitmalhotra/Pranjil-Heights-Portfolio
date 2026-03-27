import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, Video, Upload, Loader2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsAPI, uploadAPI } from '../services/adminApi';

const emptyVideo = {
  id: '',
  title: '',
  videoUrl: '',
  thumbnailUrl: '',
  isActive: true,
  order: 0,
};

const toSafeArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      id: item.id || `video-${Date.now()}-${index}`,
      title: item.title || '',
      videoUrl: item.videoUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      isActive: item.isActive !== false,
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
    }));
};

const HomeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbId, setUploadingThumbId] = useState(null);
  const [uploadingVideoId, setUploadingVideoId] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const response = await settingsAPI.getByKey('home_latest_videos');
        const rawSetting = response?.data;
        const parsed = rawSetting?.value ? JSON.parse(rawSetting.value) : [];
        setVideos(toSafeArray(parsed));
      } catch (error) {
        if (error?.status === 404) {
          setVideos([]);
        } else {
          toast.error(error.message || 'Failed to load home videos');
        }
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => Number(a.order) - Number(b.order)),
    [videos]
  );

  const updateVideo = (id, patch) => {
    setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, ...patch } : video)));
  };

  const addVideo = () => {
    const id = `video-${Date.now()}`;
    setVideos((prev) => [
      ...prev,
      {
        ...emptyVideo,
        id,
        order: prev.length,
      },
    ]);
  };

  const removeVideo = (id) => {
    setVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const uploadThumbnail = async (id, file) => {
    if (!file) return;
    setUploadingThumbId(id);
    try {
      const response = await uploadAPI.upload(file, 'general', 'Home video thumbnail');
      const url = response?.data?.url || response?.url;
      if (!url) throw new Error('Thumbnail upload did not return URL');
      updateVideo(id, { thumbnailUrl: url });
      toast.success('Thumbnail uploaded');
    } catch (error) {
      toast.error(error.message || 'Thumbnail upload failed');
    } finally {
      setUploadingThumbId(null);
    }
  };

  const uploadVideoFile = async (id, file) => {
    if (!file) return;
    setUploadingVideoId(id);
    try {
      const response = await uploadAPI.upload(file, 'general', 'Home video');
      const url = response?.data?.url || response?.url;
      if (!url) throw new Error('Video upload did not return URL');
      updateVideo(id, { videoUrl: url });
      toast.success('Video uploaded');
    } catch (error) {
      toast.error(error.message || 'Video upload failed');
    } finally {
      setUploadingVideoId(null);
    }
  };

  const saveVideos = async () => {
    const cleaned = sortedVideos
      .map((video, index) => ({
        id: video.id,
        title: video.title.trim(),
        videoUrl: video.videoUrl.trim(),
        thumbnailUrl: video.thumbnailUrl.trim(),
        isActive: video.isActive !== false,
        order: Number.isFinite(Number(video.order)) ? Number(video.order) : index,
      }))
      .filter((video) => video.title && video.videoUrl);

    setSaving(true);
    try {
      await settingsAPI.update('home_latest_videos', {
        value: cleaned,
        type: 'json',
        group: 'homepage',
      });
      setVideos(cleaned);
      toast.success('Home videos updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save videos');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Latest Videos</h1>
          <p className="text-gray-500">Manage the videos displayed under "Check Our Latest Video" on homepage.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addVideo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
          <button
            onClick={saveVideos}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {sortedVideos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center bg-white">
          <Video className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">No videos configured yet.</p>
          <p className="text-sm text-gray-500">Click "Add Video" to create the first homepage video card.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedVideos.map((video) => (
            <div key={video.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">Title</label>
                  <input
                    value={video.title}
                    onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Video title"
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="block text-sm text-gray-600 mb-1">Video URL</label>
                  <input
                    value={video.videoUrl}
                    onChange={(e) => updateVideo(video.id, { videoUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://youtube.com/... or uploaded .mp4 URL"
                  />
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">Thumbnail URL</label>
                  <input
                    value={video.thumbnailUrl}
                    onChange={(e) => updateVideo(video.id, { thumbnailUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Optional thumbnail image URL"
                  />
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Order</label>
                    <input
                      type="number"
                      value={video.order}
                      onChange={(e) => updateVideo(video.id, { order: Number(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={video.isActive !== false}
                        onChange={(e) => updateVideo(video.id, { isActive: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      Active
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                  {uploadingVideoId === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload Video File
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => uploadVideoFile(video.id, e.target.files?.[0])}
                    disabled={uploadingVideoId === video.id}
                  />
                </label>

                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 cursor-pointer hover:bg-gray-50">
                  {uploadingThumbId === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload Thumbnail
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadThumbnail(video.id, e.target.files?.[0])}
                    disabled={uploadingThumbId === video.id}
                  />
                </label>

                {video.videoUrl ? (
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() => removeVideo(video.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeVideos;
