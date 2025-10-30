/**
 * @file BundlesPage.jsx
 * @path /frontend/src/pages/BundlesPage.jsx
 * @description Manage bundles (folders) of movies and TV shows:
 *  - List user's bundles
 *  - Create, rename, delete bundles
 *  - View bundle items and remove items
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';
import { bundleAPI } from '../services/apiClient';

function BundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBundleName, setNewBundleName] = useState('');
  const [newBundleDesc, setNewBundleDesc] = useState('');
  const [editingBundleId, setEditingBundleId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const loadBundles = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await bundleAPI.list();
      setBundles(resp.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBundles();
  }, []);

  const createBundle = async (e) => {
    e.preventDefault();
    if (!newBundleName.trim()) return;
    try {
      await bundleAPI.create({ name: newBundleName.trim(), description: newBundleDesc.trim() });
      setNewBundleName('');
      setNewBundleDesc('');
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to create bundle');
    }
  };

  const startRename = (bundle) => {
    setEditingBundleId(bundle._id);
    setEditingName(bundle.name);
  };

  const saveRename = async (bundleId) => {
    if (!editingName.trim()) return;
    try {
      await bundleAPI.update(bundleId, { name: editingName.trim() });
      setEditingBundleId(null);
      setEditingName('');
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to rename bundle');
    }
  };

  const deleteBundle = async (bundleId) => {
    try {
      await bundleAPI.remove(bundleId);
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to delete bundle');
    }
  };

  const removeItem = async (bundleId, item) => {
    try {
      await bundleAPI.removeItem(bundleId, item.mediaId, item.mediaType);
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to remove item');
    }
  };

  const getImageUrl = (path, size = 'w342') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-50/60 via-orange-50/40 to-transparent pointer-events-none"></div>
      <Header />

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bundles</h1>
          </div>

          <form onSubmit={createBundle} className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Favorites, MCU Marathon"
                  value={newBundleName}
                  onChange={(e) => setNewBundleName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Short description"
                  value={newBundleDesc}
                  onChange={(e) => setNewBundleDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="h-11 md:h-12 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 rounded-xl transition-colors">Create Bundle</button>
            </div>
          </form>

          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
          )}

          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
            </div>
          ) : bundles.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No bundles yet</h3>
              <p className="text-gray-600">Create your first bundle to organize movies and shows</p>
            </div>
          ) : (
            <div className="space-y-8">
              {bundles.map((bundle) => (
                <div key={bundle._id} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    {editingBundleId === bundle._id ? (
                      <div className="flex items-center gap-3">
                        <input
                          className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                        />
                        <button onClick={() => saveRename(bundle._id)} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl">Save</button>
                        <button onClick={() => { setEditingBundleId(null); setEditingName(''); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-xl">Cancel</button>
                      </div>
                    ) : (
                      <h2 className="text-xl font-bold text-gray-900">{bundle.name}</h2>
                    )}
                    <div className="flex items-center gap-2">
                      <button onClick={() => startRename(bundle)} className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700">Rename</button>
                      <button onClick={() => deleteBundle(bundle._id)} className="px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                  {bundle.description && (
                    <p className="text-sm text-gray-600 mb-4">{bundle.description}</p>
                  )}

                  {bundle.items.length === 0 ? (
                    <p className="text-sm text-gray-500">Empty bundle</p>
                  ) : (
                    <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                      {bundle.items.map((item) => {
                        const id = item.mediaId;
                        const type = item.mediaType;
                        const title = item.title || item.name;
                        const poster = item.posterPath || item.poster_path;
                        const backdrop = item.backdropPath || item.backdrop_path;
                        const img = backdrop || poster;
                        return (
                          <div key={`${bundle._id}-${type}-${id}`} className="group flex-shrink-0 w-56 snap-start">
                            <Link to={`/${type}/${id}`} className="block">
                              <div className="relative rounded-3xl overflow-hidden mb-3 shadow-sm hover:shadow-xl hover:shadow-red-100/30 transition-all duration-300 group-hover:-translate-y-2">
                                <div className="aspect-video bg-gray-100">
                                  {img ? (
                                    <img src={getImageUrl(img, 'w500')} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{title}</h3>
                                <p className="text-xs text-gray-500 capitalize">{type}</p>
                              </div>
                              <button onClick={() => removeItem(bundle._id, item)} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">Remove</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default BundlesPage;


