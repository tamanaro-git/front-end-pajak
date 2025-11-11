import { useState, useEffect } from "react";
import bookService from "../../../services/bookService";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, delete
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: ""
  });
  
  // Notification state
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Fetch books
  const fetchBooks = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks({
        page,
        limit: pagination.limit,
        search: searchQuery
      });
      
      if (response.status === 'success') {
        setBooks(response.data.books || []);
        setPagination(response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
      }
    } catch (error) {
      showNotification("error", error.message || "Gagal memuat data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
    setFormData({ title: "", description: "", author: "" });
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (book) => {
    setModalMode("edit");
    setSelectedBook(book);
    setFormData({
      title: book.title,
      description: book.description || "",
      author: book.author || ""
    });
    setShowModal(true);
  };

  // Open modal for delete
  const handleDelete = (book) => {
    setModalMode("delete");
    setSelectedBook(book);
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "create") {
        const response = await bookService.createBook(formData);
        if (response.status === 'success') {
          showNotification("success", "Buku berhasil ditambahkan!");
          fetchBooks();
        }
      } else if (modalMode === "edit") {
        const response = await bookService.updateBook(selectedBook.id, formData);
        if (response.status === 'success') {
          showNotification("success", "Buku berhasil diupdate!");
          fetchBooks();
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
      const response = await bookService.deleteBook(selectedBook.id);
      if (response.status === 'success') {
        showNotification("success", "Buku berhasil dihapus!");
        fetchBooks();
      }
      
      setShowModal(false);
    } catch (error) {
      showNotification("error", error.message || "Gagal menghapus buku!");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchBooks(1, value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Books Management</h1>
          <p className="text-secondary mt-1">Kelola semua buku pembelajaran</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Buku</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari buku berdasarkan judul, author, atau deskripsi..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 text-lg">Tidak ada buku</p>
            <p className="text-gray-400 text-sm mt-1">Mulai dengan menambahkan buku baru</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Judul</th>
                    <th className="px-6 py-4 text-left">Author</th>
                    <th className="px-6 py-4 text-left">Chapters</th>
                    <th className="px-6 py-4 text-left">Created</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-neutral-light transition-colors">
                      <td className="px-6 py-4 font-semibold">{book.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-primary">{book.title}</p>
                          {book.description && (
                            <p className="text-sm text-secondary truncate max-w-xs">{book.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-secondary">{book.author || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {book.chapters?.length || 0} chapters
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary text-sm">
                        {new Date(book.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleEdit(book)}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(book)}
                            className="text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-secondary">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchBooks(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => fetchBooks(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === i + 1
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 hover:bg-neutral-light'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => fetchBooks(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            {modalMode === "delete" ? (
              // Delete Confirmation
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-primary mb-2">Hapus Buku?</h3>
                <p className="text-center text-secondary mb-6">
                  Apakah Anda yakin ingin menghapus buku <strong>{selectedBook?.title}</strong>? 
                  Semua chapters dan subchapters akan ikut terhapus. Aksi ini tidak dapat dibatalkan.
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
                    {modalMode === "create" ? "Tambah Buku Baru" : "Edit Buku"}
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Judul Buku <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Masukkan judul buku"
                      required
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Masukkan nama author"
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Masukkan deskripsi buku"
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
      `}</style>
    </div>
  );
};

export default BookPage;