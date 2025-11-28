import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import opinionService from "../../../services/opinionService";

const OpinionPage = () => {
  const navigate = useNavigate();
  
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  
  // User data from localStorage or context
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(null);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    status: "",
    kategori: "",
    search: ""
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch opinions
  const fetchOpinions = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      let response;
      
      // Check if user is super-admin or regular user
      if (currentUser?.role === 'super-admin') {
        // Super-admin sees all opinions
        response = await opinionService.getAllOpinions(params);
      } else {
        // Regular user sees only their own opinions
        const userId = currentUser?.id;
        if (!userId) {
          throw new Error('User ID not found');
        }
        response = await opinionService.getOpinionsByUser(userId, params);
      }
      
      if (response.status === 'success') {
        setOpinions(response.data.opinions);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        }));
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal memuat data opini");
    } finally {
      setLoading(false);
    }
  };

  // Get current user from localStorage on component mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      // Redirect to login if no valid user data
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Only fetch opinions when currentUser is available
    if (currentUser) {
      fetchOpinions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filters, currentUser]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchOpinions();
    }
  };

  // Open modal for delete
  const handleDelete = (opinionItem) => {
    setSelectedOpinion(opinionItem);
    setShowModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await opinionService.deleteOpinion(selectedOpinion.id);
      if (response.status === 'success') {
        showNotification("success", "Opini berhasil dihapus!");
        fetchOpinions();
        setShowModal(false);
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal menghapus opini");
    }
  };

  // Handle submit to review (draft -> pending)
  const handleSubmitToReview = async (opinionId, opinionTitle) => {
    try {
      const response = await opinionService.updateOpinionStatus(opinionId, 'pending');
      if (response.status === 'success') {
        showNotification("success", `Opini "${opinionTitle}" berhasil dikirim untuk review!`);
        fetchOpinions(); // Refresh data
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal mengirim opini untuk review");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {currentUser?.role === 'super-admin' ? 'Manajemen Opini' : 'Opini Saya'}
          </h1>
          <p className="text-secondary mt-1">
            {currentUser?.role === 'super-admin' 
              ? 'Kelola semua artikel opini dan perspektif' 
              : 'Kelola artikel opini dan perspektif Anda'}
          </p>
          {currentUser?.role !== 'super-admin' && (
            <p className="text-xs text-gray-500 mt-1">
              👤 {currentUser?.fullName || 'User'} | 🎭 {currentUser?.role || 'user'}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/admin/opinions/add')}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Opini</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary mb-2">
              Cari Opini
            </label>
            <input
              type="text"
              placeholder="Cari judul atau konten..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyDown={handleSearch}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Kategori
            </label>
            <input
              type="text"
              placeholder="Filter kategori..."
              value={filters.kategori}
              onChange={(e) => handleFilterChange('kategori', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Opinions List */}
      <div className="bg-white rounded-xl shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : opinions.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Tidak ada opini</h3>
            <p className="text-gray-500">Belum ada opini yang dibuat</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {opinions.map((opinion) => (
              <div key={opinion.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Opinion Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-primary truncate">
                        {opinion.judul}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(opinion.status)}`}>
                        {opinion.status}
                      </span>
                    </div>
                    
                    {opinion.kategori && (
                      <p className="text-sm text-blue-600 font-semibold mb-2">
                        📁 {opinion.kategori}
                      </p>
                    )}
                    
                    {opinion.isiOpini && (
                      <p className="text-secondary text-sm mb-3 line-clamp-2">
                        {opinion.isiOpini.substring(0, 150)}...
                      </p>
                    )}
                    
                    {/* Tags */}
                    {opinion.tags && opinion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {opinion.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{opinion.author?.fullName || 'Unknown'}</span>
                        {currentUser?.role === 'super-admin' && opinion.author?.role && (
                          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {opinion.author.role}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{opinion.views || 0} views</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{opinion.likes || 0} likes</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>{opinion.shares || 0} shares</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(opinion.createdAt)}</span>
                      {opinion.publishedAt && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">📅 Published: {formatDate(opinion.publishedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {/* Submit to Review Button (only for draft status and own content) */}
                    {opinion.status === 'draft' && (currentUser?.role === 'super-admin' || opinion.authorId === currentUser?.id) && (
                      <button
                        onClick={() => handleSubmitToReview(opinion.id, opinion.judul)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Submit untuk Review"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    )}
                    
                    {/* Edit Button (only for own content or super-admin) */}
                    {(currentUser?.role === 'super-admin' || opinion.authorId === currentUser?.id) && (
                      <button
                        onClick={() => navigate(`/admin/opinions/edit/${opinion.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Opinion"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    
                    {/* Delete Button (only for own content or super-admin) */}
                    {(currentUser?.role === 'super-admin' || opinion.authorId === currentUser?.id) && (
                      <button
                        onClick={() => handleDelete(opinion)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Opinion"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}

                    {/* View Only indicator for super-admin viewing others' content */}
                    {currentUser?.role === 'super-admin' && opinion.authorId !== currentUser?.id && (
                      <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                        👁️ View Only
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && opinions.length > 0 && (
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

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-primary mb-2">Hapus Opini</h3>
              <p className="text-center text-secondary mb-6">
                Apakah Anda yakin ingin menghapus opini <span className="font-bold">{selectedOpinion?.judul}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Hapus
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
      `}</style>
    </div>
  );
};

export default OpinionPage;