// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/editor/journalist/index.jsx
import { useState, useEffect } from "react";
import newsService from "../../../../services/newsService";

const NewsVerificationPage = () => {
  const [activeTab, setActiveTab] = useState("pending"); // pending, published, rejected
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  
  // Modal states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: "",
    kategori: ""
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch news based on active tab
  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: activeTab,
        ...filters
      };
      
      const response = await newsService.getAllNews(params);
      
      if (response.status === 'success') {
        setNews(response.data.news);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        }));
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal memuat data news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, pagination.page, filters]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Open preview modal
  const handlePreview = (newsItem) => {
    setSelectedNews(newsItem);
    setShowPreviewModal(true);
  };

  // Open approval/rejection modal
  const handleApprovalAction = (newsItem, type) => {
    setSelectedNews(newsItem);
    setActionType(type);
    setShowApprovalModal(true);
  };

  // Confirm approve/reject
  const confirmAction = async () => {
    try {
      const newStatus = actionType === "approve" ? "published" : "rejected";
      const response = await newsService.updateNewsStatus(selectedNews.id, newStatus);
      
      if (response.status === 'success') {
        const message = actionType === "approve" 
          ? "News berhasil dipublish!" 
          : "News berhasil ditolak!";
        showNotification("success", message);
        fetchNews();
        setShowApprovalModal(false);
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal mengupdate status news");
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get tab counts (you might want to fetch this separately)
  const tabCounts = {
    pending: pagination.total,
    published: 0,
    rejected: 0
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in-right ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
          {notification.type === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Verifikasi News</h1>
        <p className="text-secondary mt-1">Review dan approve/reject artikel news</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            <button
              onClick={() => handleTabChange("pending")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "pending"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>⏳ Pending</span>
                {activeTab === "pending" && <span className="px-2 py-1 bg-white text-yellow-600 rounded-full text-xs font-bold">{tabCounts.pending}</span>}
              </div>
            </button>
            
            <button
              onClick={() => handleTabChange("published")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "published"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>✅ Published</span>
              </div>
            </button>
            
            <button
              onClick={() => handleTabChange("rejected")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "rejected"
                  ? "bg-red-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>❌ Rejected</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Cari judul atau artikel ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.kategori}
                onChange={(e) => handleFilterChange('kategori', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                <option value="Perpajakan">Perpajakan</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Perspective">Perspective</option>
              </select>
            </div>
          </div>
        </div>

        {/* News Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Tidak ada news {activeTab}</h3>
            <p className="text-gray-500">Belum ada news dengan status {activeTab}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Artikel</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-primary uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((newsItem) => (
                  <tr key={newsItem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {newsItem.image && (
                          <img
                            src={newsItem.image}
                            alt={newsItem.title}
                            className="w-20 h-14 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-primary truncate">{newsItem.title}</p>
                          <p className="text-xs text-secondary">ID: {newsItem.artikelId}</p>
                          {newsItem.content && (
                            <p className="text-xs text-secondary mt-1 line-clamp-2">{newsItem.content}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-primary">{newsItem.kategori || "-"}</p>
                        {newsItem.subKategori && (
                          <p className="text-xs text-secondary">{newsItem.subKategori}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-primary">{newsItem.author?.fullName || "Unknown"}</p>
                        <p className="text-xs text-secondary">{newsItem.author?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      <div>
                        <p className="text-xs text-gray-500">Created:</p>
                        <p>{formatDate(newsItem.createdAt)}</p>
                        {newsItem.publishedAt && (
                          <>
                            <p className="text-xs text-green-600 mt-1">Published:</p>
                            <p className="text-green-600">{formatDate(newsItem.publishedAt)}</p>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(newsItem.status)}`}>
                        {newsItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Preview Button */}
                        <button
                          onClick={() => handlePreview(newsItem)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Approve/Reject buttons (only for pending) */}
                        {activeTab === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprovalAction(newsItem, "approve")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={() => handleApprovalAction(newsItem, "reject")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Verifier info for published/rejected */}
                        {(activeTab === "published" || activeTab === "rejected") && newsItem.verifier && (
                          <div className="text-xs text-secondary">
                            <p className="font-semibold">Verified by:</p>
                            <p>{newsItem.verifier.fullName}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && news.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-secondary">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-semibold">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-primary">Preview Article</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Cover Image */}
              {selectedNews.image && (
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              {/* Article Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedNews.status)}`}>
                    {selectedNews.status}
                  </span>
                  <span className="text-xs text-secondary">ID: {selectedNews.artikelId}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-primary mb-3">{selectedNews.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{selectedNews.author?.fullName || 'Unknown'}</span>
                  </span>
                  <span>•</span>
                  <span>{formatDate(selectedNews.createdAt)}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">📁 {selectedNews.kategori || 'No category'}</span>
                  {selectedNews.subKategori && (
                    <>
                      <span>→</span>
                      <span className="text-blue-500">{selectedNews.subKategori}</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                {selectedNews.tags && selectedNews.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedNews.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              {selectedNews.content && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="text-lg font-bold text-primary mb-2">Ringkasan</h4>
                  <p className="text-secondary italic">{selectedNews.content}</p>
                </div>
              )}

              {/* Full Content */}
              {selectedNews.fullContent && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-primary mb-4">Konten Lengkap</h4>
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedNews.fullContent }}
                  />
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedNews.views || 0}</p>
                  <p className="text-sm text-secondary">Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedNews.likes || 0}</p>
                  <p className="text-sm text-secondary">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedNews.shares || 0}</p>
                  <p className="text-sm text-secondary">Shares</p>
                </div>
              </div>

              {/* Action Buttons in Preview (only for pending) */}
              {activeTab === "pending" && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      handleApprovalAction(selectedNews, "reject");
                    }}
                    className="flex-1 px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      handleApprovalAction(selectedNews, "approve");
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                  >
                    ✅ Approve & Publish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approval/Rejection Confirmation Modal */}
      {showApprovalModal && selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
                actionType === "approve" ? "bg-green-100" : "bg-red-100"
              }`}>
                {actionType === "approve" ? (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-center text-primary mb-2">
                {actionType === "approve" ? "Approve & Publish News?" : "Reject News?"}
              </h3>
              <p className="text-center text-secondary mb-4">
                {actionType === "approve" 
                  ? `Apakah Anda yakin ingin mempublikasikan artikel "${selectedNews.title}"?`
                  : `Apakah Anda yakin ingin menolak artikel "${selectedNews.title}"?`
                }
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Artikel ID:</strong> {selectedNews.artikelId}<br />
                  <strong>Author:</strong> {selectedNews.author?.fullName}<br />
                  <strong>Kategori:</strong> {selectedNews.kategori || "-"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors text-white ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionType === "approve" ? "✅ Approve" : "❌ Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* TipTap/Prose Styles for Preview */
        .prose h1 { font-size: 2rem; font-weight: bold; margin: 1rem 0; }
        .prose h2 { font-size: 1.5rem; font-weight: bold; margin: 0.75rem 0; }
        .prose h3 { font-size: 1.25rem; font-weight: bold; margin: 0.5rem 0; }
        .prose p { margin: 0.5rem 0; line-height: 1.75; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose li { margin: 0.25rem 0; }
        .prose img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
        .prose blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280; }
        .prose pre { background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; overflow-x: auto; }
        .prose code { background: #f3f4f6; color: #ef4444; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace; }
        .prose a { color: #3b82f6; text-decoration: underline; }
        .prose a:hover { color: #2563eb; }
      `}</style>
    </div>
  );
};

export default NewsVerificationPage;