'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadMediaAction, deleteMediaAction, updateMediaMetadata } from '@/actions/media';
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  X,
} from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  folder: string;
  createdAt: Date | string;
}

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const folders = ['all', 'general', 'brands', 'news', 'corporate'];

  const filteredItems = items.filter((item) => {
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    const matchesSearch =
      !search ||
      item.filename.toLowerCase().includes(search.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', selectedFolder === 'all' ? 'general' : selectedFolder);
    formData.append('altText', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));

    startTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (res.success && res.media) {
        setItems([res.media as any, ...items]);
        router.refresh();
      } else {
        setUploadError(res.error || 'Upload failed');
      }
    });
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;

    startTransition(async () => {
      await deleteMediaAction(id);
      setItems(items.filter((item) => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
      router.refresh();
    });
  };

  const handleSaveAlt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData(e.currentTarget);
    const altText = formData.get('altText') as string;
    const folder = formData.get('folder') as string;

    startTransition(async () => {
      const res = await updateMediaMetadata(selectedItem.id, altText, folder);
      if (res.success && res.media) {
        setItems(items.map((m) => (m.id === selectedItem.id ? (res.media as any) : m)));
        setSelectedItem(res.media as any);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#161616] border border-[#262626] p-4 rounded-xl">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename or alt text..."
              className="w-full bg-[#111] border border-[#2E2E2E] focus:border-[#B69B63] text-xs text-white rounded-lg pl-9 pr-3 py-2 outline-none"
            />
          </div>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="bg-[#111] border border-[#2E2E2E] text-xs text-neutral-300 rounded-lg px-3 py-2 outline-none"
          >
            {folders.map((f) => (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md">
            <Upload className="w-3.5 h-3.5" />
            <span>{isPending ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              className="hidden"
              onChange={handleUpload}
              disabled={isPending}
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#161616] border border-[#262626] rounded-xl p-12 text-center">
          <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <p className="text-neutral-400 text-sm">No media files found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-[#161616] border rounded-xl overflow-hidden transition-all flex flex-col ${
                selectedItem?.id === item.id ? 'border-[#B69B63] ring-1 ring-[#B69B63]' : 'border-[#262626] hover:border-[#383838]'
              }`}
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setSelectedItem(item)}
                className="aspect-square bg-[#111] overflow-hidden relative cursor-pointer flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.altText || item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-neutral-300 font-mono uppercase">
                  {item.folder}
                </span>
              </div>

              {/* Info & Actions */}
              <div className="p-2.5 flex items-center justify-between gap-1 text-[11px] bg-[#141414] border-t border-[#242424]">
                <p className="truncate text-neutral-300 font-medium flex-1">{item.filename}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.url)}
                  title="Copy URL"
                  className="p-1 rounded text-neutral-400 hover:text-[#B69B63] hover:bg-neutral-800 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  title="Delete image"
                  className="p-1 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Drawer / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2B2B2B] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="text-sm font-semibold text-white">Media Asset Details</h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-[#111] rounded-lg overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.url}
                alt={selectedItem.altText || ''}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <form onSubmit={handleSaveAlt} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Image URL</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={selectedItem.url}
                    className="w-full bg-[#111] border border-[#2E2E2E] text-neutral-300 rounded p-2 text-xs font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedItem.id, selectedItem.url)}
                    className="px-3 py-2 bg-[#262626] hover:bg-[#333] text-white rounded text-xs font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Folder Category</label>
                  <select
                    name="folder"
                    defaultValue={selectedItem.folder}
                    className="w-full bg-[#111] border border-[#2E2E2E] text-white rounded p-2"
                  >
                    <option value="general">General</option>
                    <option value="brands">Brands</option>
                    <option value="news">News</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">File Size</label>
                  <p className="bg-[#111] border border-[#2E2E2E] text-neutral-400 rounded p-2">
                    {Math.round(selectedItem.size / 1024)} KB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Alt Text (Accessibility & SEO)</label>
                <input
                  name="altText"
                  defaultValue={selectedItem.altText || ''}
                  placeholder="e.g. Sukiyaki RIN dining room interior"
                  className="w-full bg-[#111] border border-[#2E2E2E] text-white rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-[#222] hover:bg-[#2C2C2C] text-neutral-300 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B69B63] hover:bg-[#C4AA74] text-black font-semibold rounded"
                >
                  Save Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
