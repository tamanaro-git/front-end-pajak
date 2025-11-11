// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/learning/ChapterPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import chapterService from "../../../services/chapterService";
import bookService from "../../../services/bookService";

const ChapterPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    orderIndex: 0
  });
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Fetch book and chapters
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch book details
      const bookResponse = await bookService.getBookById(bookId);
      if (bookResponse.status === 'success') {
        setBook(bookResponse.data);
      }

      // Fetch chapters
      const chaptersResponse = await chapterService.getChaptersByBook(bookId);
      if (chaptersResponse.status === 'success') {
        setChapters(chaptersResponse.data.chapters || []);
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchData();
    }
  }, [bookId]);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Handle form change
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({ 
      title: "", 
      content: "", 
      orderIndex: chapters.length + 1 
    });
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (chapter) => {
    setModalMode("edit");
    setSelectedChapter(chapter);
    setFormData({
      title: chapter.title,
      content: chapter.content || "",
      orderIndex: chapter.orderIndex
    });
    setShowModal(true);
  };

  // Open modal for delete
  const handleDelete = (chapter) => {
    setModalMode("delete");
    setSelectedChapter(chapter);
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "create") {
        const response = await chapterService.createChapter({
          ...formData,
          bookId: parseInt(bookId)
        });
        if (response.status === 'success') {
          showNotification("success", "Chapter berhasil ditambahkan!");
          fetchData();
        }
      } else if (modalMode === "edit") {
        const response = await chapterService.updateChapter(selectedChapter.id, formData);
        if (response.status === 'success') {
          showNotification("success", "Chapter berhasil diupdate!");
          fetchData();
        }
      }
      
      setShowModal(false);
    } catch (error) {
      showNotification("error", error.message || "Operasi gagal!");
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    setLoading(true);
    
    try {
      const response = await chapterService.deleteChapter(selectedChapter.id);
      if (response.status === 'success') {
        showNotification("success", "Chapter berhasil dihapus!");
        fetchData();
      }
      
      setShowModal(false);
    } catch (error) {
      showNotification("error", error.message || "Gagal menghapus chapter!");
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

    const newChapters = [...chapters];
    const draggedChapter = newChapters[draggedItem];
    
    // Remove from old position
    newChapters.splice(draggedItem, 1);
    // Insert at new position
    newChapters.splice(index, 0, draggedChapter);
    
    setChapters(newChapters);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    // Update order indices
    const reorderedChapters = chapters.map((chapter, index) => ({
      id: chapter.id,
      orderIndex: index + 1
    }));

    try {
      const response = await chapterService.reorderChapters(reorderedChapters);
      if (response.status === 'success') {
        showNotification("success", "Urutan chapter berhasil diupdate!");
        fetchData();
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal mengupdate urutan!");
      fetchData(); // Reload original order
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
          onClick={() => navigate('/admin/books')}
          className="p-2 hover:bg-neutral-light rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">Chapters Management</h1>
          <p className="text-secondary mt-1">Kelola chapter untuk buku ini</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Chapter</span>
        </button>
      </div>

      {/* Book Info Card */}
      {book && (
        <div className="bg-primary rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
              {book.description && (
                <p className="text-white/90 text-sm">{book.description}</p>
              )}
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">{chapters.length} Chapters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Info */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-blue-800 mb-1">Drag & Drop untuk Mengatur Urutan</h4>
            <p className="text-sm text-blue-700">
              Klik dan tahan card chapter, lalu drag ke posisi yang diinginkan. Urutan akan otomatis tersimpan.
            </p>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {loading && chapters.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : chapters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Belum ada chapter</p>
            <p className="text-gray-400 text-sm mb-4">Mulai dengan menambahkan chapter pertama</p>
            <button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Chapter</span>
            </button>
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
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

                {/* Chapter Number Badge */}
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {chapter.orderIndex}
                </div>

                {/* Chapter Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-primary mb-2">{chapter.title}</h3>
                  {chapter.content && (
                    <p className="text-secondary text-sm line-clamp-2 mb-3">{chapter.content}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-secondary">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{chapter.subchapters?.length || 0} Subchapters</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(chapter.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleEdit(chapter)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Chapter"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(chapter)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Chapter"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {modalMode === "delete" ? (
              // Delete Confirmation
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-primary mb-2">Hapus Chapter?</h3>
                <p className="text-center text-secondary mb-6">
                  Apakah Anda yakin ingin menghapus chapter <strong>{selectedChapter?.title}</strong>? 
                  Semua subchapters akan ikut terhapus. Aksi ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
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
            ) : (
              // Create/Edit Form
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-primary">
                    {modalMode === "create" ? "Tambah Chapter Baru" : "Edit Chapter"}
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Judul Chapter <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Contoh: Bab 1: Pengenalan Pajak"
                      required
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Urutan Chapter <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="orderIndex"
                      value={formData.orderIndex}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="1"
                      required
                      min="1"
                    />
                    <p className="text-xs text-secondary mt-1">
                      Urutan bisa diubah dengan drag & drop setelah chapter dibuat
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Konten Chapter
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleFormChange}
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Masukkan konten lengkap chapter..."
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Menyimpan...' : modalMode === "create" ? 'Tambah' : 'Update'}
                  </button>
                </div>
              </form>
            )}
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
      `}</style>
    </div>
  );
};

export default ChapterPage;