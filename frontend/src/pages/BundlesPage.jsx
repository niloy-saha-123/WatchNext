/**
 * @file BundlesPage.jsx
 * @path /frontend/src/pages/BundlesPage.jsx
 * @description Full bundles management page with folder-style UI
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, LoadingSpinner, ErrorMessage } from '../components/common';
import { bundleAPI, mediaAPI } from '../services/apiClient';
import { useWatchData } from '../contexts/WatchDataContext';
import { getImageUrl } from '../utils/imageUtils';

function BundlesPage() {
  const { watchData } = useWatchData();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [newBundleName, setNewBundleName] = useState('');
  const [newBundleDesc, setNewBundleDesc] = useState('');
  const [editingBundleId, setEditingBundleId] = useState(null);
  const [editingName, setEditingName] = useState('');
  
  // Add item modal states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('library'); // library or search

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

  // Search for movies/shows
  useEffect(() => {
    if (searchQuery.length >= 3) {
      setSearchLoading(true);
      const timer = setTimeout(async () => {
        try {
          const data = await mediaAPI.search('multi', searchQuery);
          const results = data.results?.slice(0, 10) || [];
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const createBundle = async (e) => {
    e.preventDefault();
    if (!newBundleName.trim()) return;
    try {
      await bundleAPI.create({ name: newBundleName.trim(), description: newBundleDesc.trim() });
      setNewBundleName('');
      setNewBundleDesc('');
      setShowCreateModal(false);
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to create bundle');
    }
  };

  const startRename = (bundle) => {
    setEditingBundleId(bundle._id);
    setEditingName(bundle.name);
  };

  const cancelRename = () => {
    setEditingBundleId(null);
    setEditingName('');
  };

  const saveRename = async (bundleId) => {
    if (!editingName.trim()) return;
    try {
      await bundleAPI.update(bundleId, { name: editingName.trim() });
      cancelRename();
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to rename bundle');
    }
  };

  const deleteBundle = async (bundleId) => {
    if (!window.confirm('Are you sure you want to delete this bundle?')) return;
    try {
      await bundleAPI.remove(bundleId);
      await loadBundles();
    } catch (e) {
      setError(e.message || 'Failed to delete bundle');
    }
  };

  const openAddModal = (bundle) => {
    setSelectedBundle(bundle);
    setShowAddModal(true);
    setSearchQuery('');
    setSearchResults([]);
    setActiveTab('library');
  };

  const addItemToBundle = async (item) => {
    if (!selectedBundle) return;
    try {
      const itemData = {
        mediaId: String(item.id || item.mediaId),
        mediaType: item.media_type || item.mediaType,
        title: item.title || item.name,
        posterPath: item.poster_path || item.posterPath
      };
      await bundleAPI.addItem(selectedBundle._id, itemData);
      await loadBundles();
      setShowAddModal(false);
      setSelectedBundle(null);
    } catch (e) {
      alert(e.message || 'Failed to add item');
    }
  };

  // Get all library content (watched + watchlist)
  const getLibraryContent = () => {
    return [
      ...watchData.movies.map(item => ({ ...item, media_type: 'movie' })),
      ...watchData.shows.map(item => ({ ...item, media_type: 'tv' })),
      ...watchData.watchlist.map(item => ({ ...item, media_type: item.mediaType }))
    ];
  };

  const libraryContent = getLibraryContent();

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-50/60 via-orange-50/40 to-transparent pointer-events-none"></div>
      <Header />

      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bundles</h1>
              <p className="text-gray-600 mt-2">Organize your movies and shows</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Bundle
            </button>
          </div>

          {error && <ErrorMessage message={error} className="mb-6" />}

          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <LoadingSpinner size="large" variant="primary" text="Loading bundles..." />
            </div>
          ) : bundles.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No bundles yet</h3>
              <p className="text-gray-600 mb-6">Create your first bundle to organize your content</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Create Your First Bundle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bundles.map((bundle) => (
                <div key={bundle._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/bundles/${bundle._id}`} className="block p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {bundle.items?.length > 0 && bundle.items[0]?.posterPath ? (
                          <img
                            src={getImageUrl(bundle.items[0].posterPath, 'w200')}
                            alt=""
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {editingBundleId === bundle._id ? (
                          <input
                            className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => saveRename(bundle._id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveRename(bundle._id)}
                            autoFocus
                          />
                        ) : (
                          <h3 className="text-lg font-bold text-gray-900 truncate">{bundle.name}</h3>
                        )}
                        <p className="text-xs text-gray-500">{bundle.items?.length || 0} items</p>
                      </div>
                    </div>
                    {bundle.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{bundle.description}</p>
                    )}
                  </Link>
                  <div className="px-6 pb-4 flex items-center justify-between border-t border-gray-100">
                    <button
                      onClick={() => openAddModal(bundle)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      + Add Items
                    </button>
                    <div className="flex items-center gap-2">
                      {editingBundleId === bundle._id ? (
                        <>
                          <button
                            onClick={() => saveRename(bundle._id)}
                            className="text-sm text-green-600 hover:text-green-700"
                          >
                            ✓
                          </button>
                          <button onClick={cancelRename} className="text-sm text-gray-600 hover:text-gray-700">
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startRename(bundle)} className="text-sm text-gray-600 hover:text-gray-700">
                            Rename
                          </button>
                          <button onClick={() => deleteBundle(bundle._id)} className="text-sm text-red-600 hover:text-red-700">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Bundle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Bundle</h2>
            <form onSubmit={createBundle}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bundle Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Favorites, MCU Marathon"
                  value={newBundleName}
                  onChange={(e) => setNewBundleName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Short description"
                  value={newBundleDesc}
                  onChange={(e) => setNewBundleDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Items Modal */}
      {showAddModal && selectedBundle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add Items to "{selectedBundle.name}"</h2>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('library')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'library' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Your Library
                  </button>
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'search' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Search TMDB
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'library' ? (
                  libraryContent.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Your library is empty</p>
                      <p className="text-sm text-gray-500 mt-2">Add movies and shows to your profile first</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {libraryContent.map((item) => (
                        <div key={`${item.media_type}-${item.id || item.mediaId}`} className="group">
                          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[2/3] mb-2">
                            {getImageUrl(item.poster_path || item.posterPath, 'w300') ? (
                              <img
                                src={getImageUrl(item.poster_path || item.posterPath, 'w300')}
                                alt={item.title || item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <button
                              onClick={() => addItemToBundle(item)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <span className="text-white font-medium">+ Add</span>
                            </button>
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title || item.name}</p>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Search for movies or TV shows..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner size="medium" variant="primary" />
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-12">
                        {searchQuery.length >= 3 ? (
                          <p className="text-gray-600">No results found</p>
                        ) : (
                          <p className="text-gray-600">Search for movies and TV shows to add</p>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {searchResults.map((item) => {
                          if (!item.poster_path) return null;
                          return (
                            <div key={`${item.media_type}-${item.id}`} className="group">
                              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[2/3] mb-2">
                                <img
                                  src={getImageUrl(item.poster_path, 'w300')}
                                  alt={item.title || item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <button
                                  onClick={() => addItemToBundle(item)}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                  <span className="text-white font-medium">+ Add</span>
                                </button>
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate">{item.title || item.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BundlesPage;
