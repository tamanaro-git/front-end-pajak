// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/learning/SubchapterPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import subchapterService from "../../../services/subchapterService";
import chapterService from "../../../services/chapterService";

const SubchapterPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  
  const [chapter, setChapter] = useState(null);
  const [subchapters, setSubchapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Modal states for delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubchapter, setSelectedSubchapter] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Fetch chapter and subchapters
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch chapter details
      const chapterResponse = await chapterService.getChapterById(chapterId);
      if (chapterResponse.status === 'success') {
        setChapter(chapterResponse.data);
      }

      // Fetch subchapters
      const subchaptersResponse = await subchapterService.getSubchaptersByChapter(chapterId);
      if (subchaptersResponse.status === 'success') {
        setSubchapters(subchaptersResponse.data.subchapters || []);
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId) {
      fetchData();
    }
  }, [chapterId]);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Handle delete
  const handleDelete = (subchapter) => {
    setSelectedSubchapter(subchapter);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await subchapterService.deleteSubchapter(selectedSubchapter.id);
      if (response.status === 'success') {
        showNotification("success", "Subchapter berhasil dihapus!");
        fetchData();
      }
      
      setShowDeleteModal(false);
    } catch (error) {
      showNotification("error", error.message || "Gagal menghapus subchapter!");
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === index) return;

    const newSubchapters = [...subchapters];
    const draggedSubchapter = newSubchapters[draggedItem];
    
    newSubchapters.splice(draggedItem, 1);
    newSubchapters.splice(index, 0, draggedSubchapter);
    
    setSubchapters(newSubchapters);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    const reorderedSubchapters = subchapters.map((subchapter, index) => ({
      id: subchapter.id,
      orderIndex: index + 1
    }));

    try {
      const response = await subchapterService.reorderSubchapters(reorderedSubchapters);
      if (response.status === 'success') {
        showNotification("success", "Urutan subchapter berhasil diupdate!");
        fetchData();
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal mengupdate urutan!");
      fetchData();
    }

    setDraggedItem(null);
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

      {/* Back Button & Page Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/admin/chapters/${chapter?.bookId}`)}
          className="p-2 hover:bg-neutral-light rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">Subchapters Management</h1>
          <p className="text-secondary mt-1">Kelola subchapter untuk chapter ini</p>
        </div>
        <button 
          onClick={() => navigate(`/admin/subchapters/${chapterId}/add`)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Subchapter</span>
        </button>
      </div>

      {/* Chapter Info Card */}
      {chapter && (
        <div className="bg-primary rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold shrink-0">
              {chapter.orderIndex}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{chapter.title}</h2>
              {chapter.content && (
                <p className="text-white/90 text-sm line-clamp-2">{chapter.content}</p>
              )}
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-semibold">{subchapters.length} Subchapters</span>
                </div>
                {chapter.book && (
                  <>
                    <span>•</span>
                    <span>Book: {chapter.book.title}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Info */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-purple-800 mb-1">Drag & Drop untuk Mengatur Urutan</h4>
            <p className="text-sm text-purple-700">
              Klik dan tahan card subchapter, lalu drag ke posisi yang diinginkan. Urutan akan otomatis tersimpan.
            </p>
          </div>
        </div>
      </div>

      {/* Subchapters List */}
      <div className="space-y-4">
        {loading && subchapters.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : subchapters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Belum ada subchapter</p>
            <p className="text-gray-400 text-sm mb-4">Mulai dengan menambahkan subchapter pertama</p>
            <button
              onClick={() => navigate(`/admin/subchapters/${chapterId}/add`)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Subchapter</span>
            </button>
          </div>
        ) : (
          subchapters.map((subchapter, index) => (
            <div
              key={subchapter.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-xl shadow-md p-6 cursor-move transition-all hover:shadow-lg ${
                draggedItem === index ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Drag Handle */}
                <div className="text-gray-400 hover:text-primary transition-colors pt-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>

                {/* Order Number Badge */}
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {subchapter.orderIndex}
                </div>

                {/* Subchapter Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-primary mb-2">{subchapter.title}</h3>
                  {subchapter.resume && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3 rounded">
                      <p className="text-sm text-yellow-800"><strong>Resume:</strong> {subchapter.resume}</p>
                    </div>
                  )}
                  {subchapter.content && (
                    <div 
                      className="text-secondary text-sm line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: subchapter.content }}
                    />
                  )}
                  <div className="flex items-center space-x-4 text-sm text-secondary mt-3">
                    <span>{new Date(subchapter.createdAt).toLocaleDateString('id-ID')}</span>
                    {subchapter.updatedAt !== subchapter.createdAt && (
                      <>
                        <span>•</span>
                        <span>Updated: {new Date(subchapter.updatedAt).toLocaleDateString('id-ID')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => navigate(`/admin/subchapters/${chapterId}/edit/${subchapter.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Subchapter"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(subchapter)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Subchapter"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-primary mb-2">Hapus Subchapter?</h3>
              <p className="text-center text-secondary mb-6">
                Apakah Anda yakin ingin menghapus subchapter <strong>{selectedSubchapter?.title}</strong>? 
                Aksi ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SubchapterPage;