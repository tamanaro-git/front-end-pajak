
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";
import NavbarHome from "../../components/home/NavbarHome";

const LearningPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks({
        page,
        limit: 9,
        search: search || searchQuery
      });
      
      if (response.status === 'success') {
        setBooks(response.data.books || []);
        setPagination(response.data.pagination || { total: 0, page: 1, limit: 9, totalPages: 0 });
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(1, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchBooks(1, "");
  };

  const handleBookClick = (bookId) => {
    navigate(`/learning/${bookId}`);
  };

  return (
    <>
    <NavbarHome />
    <div className="min-h-screen mt-10 bg-white">{/* ...existing code... */}
      {/* Hero Section */}
      <section className="relative bg-primary-dark text-white py-20 overflow-hidden">
        {/* Background Decorative Icons */}
        <div className="absolute inset-0 opacity-10">
          {/* Top Left */}
          <svg className="absolute top-10 left-10 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>

          {/* Top Right */}
          <svg className="absolute top-20 right-20 w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>

          {/* Bottom Left */}
          <svg className="absolute bottom-10 left-20 w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>

          {/* Right Side */}
          <svg className="absolute bottom-32 right-10 w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>

          {/* Center Decorations */}
          <svg className="absolute top-40 left-1/4 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>

          <svg className="absolute bottom-20 right-1/3 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>

          {/* Additional Learning Icons */}
          <svg className="absolute top-1/2 left-10 w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Taxmin <span className="text-yellow-400">Learning</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Platform edukasi dan pelatihan pajak terlengkap untuk meningkatkan 
            pengetahuan dan keterampilan perpajakan Anda
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari buku pembelajaran (contoh: Pajak Penghasilan, PPh, PPN...)"
                  className="w-full px-6 py-4 pr-32 text-primary-dark bg-white placeholder-primary-dark/70 rounded-full border-2  focus:border-yellow-300 focus:outline-none shadow-lg text-base font-semibold"
                />
                <div className="absolute right-2 flex items-center space-x-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-2 text-primary-dark hover:text-red-600 transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-primary-dark hover:bg-primary text-white px-6 py-2 rounded-full font-bold transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Cari</span>
                  </button>
                </div>
              </div>
            </form>
            
            {/* Search Tips */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Cari berdasarkan judul atau kata kunci</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="#FFFFFF" 
              d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,56C1120,48,1280,32,1360,24L1440,16L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Additional Sections Can Go Here */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Koleksi Buku Pembelajaran'}
          </h2>
          <p className="text-secondary">
            {searchQuery 
              ? `Menampilkan ${pagination.total} buku yang cocok dengan pencarian Anda` 
              : 'Pilih buku yang ingin Anda pelajari dan tingkatkan pengetahuan perpajakan Anda'
            }
          </p>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="mt-3 text-primary hover:text-primary-dark font-semibold text-sm flex items-center space-x-1 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Hapus Pencarian</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'Tidak Ada Hasil' : 'Belum Ada Buku'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `Tidak ditemukan buku dengan kata kunci "${searchQuery}"` 
                : 'Buku pembelajaran akan segera tersedia'
              }
            </p>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Lihat Semua Buku
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, index) => {
                const bgColors = ['bg-blue-50', 'bg-gray-900', 'bg-purple-50'];
                const bgColor = bgColors[index % bgColors.length];
                const isLight = bgColor !== 'bg-gray-900';
                
                return (
                  <div 
                    key={book.id}
                    className="relative cursor-pointer"
                    onClick={() => handleBookClick(book.id)}
                  >
                    {/* Main Card */}
                    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      {/* Image/Header Section */}
                      <div className={`${bgColor} ${isLight ? 'text-primary' : 'text-white'} p-6 h-64 flex flex-col justify-between relative overflow-hidden`}>
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <svg className="absolute top-4 right-4 w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-current transform -rotate-12"></div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isLight 
                                ? 'bg-primary text-white' 
                                : 'bg-blue-500 text-white'
                            }`}>
                              BUKU PEMBELAJARAN
                            </span>
                            {book.chapters && book.chapters.length > 0 && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isLight ? 'bg-green-100 text-green-700' : 'bg-green-500 text-white'
                              }`}>
                                {book.chapters.length} BAB
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold leading-tight line-clamp-3">
                            {book.title}
                          </h3>
                        </div>

                        {/* Author Info at bottom */}
                        <div className="relative z-10">
                          <div className="flex items-center space-x-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                              isLight ? 'bg-primary text-white' : 'bg-white/20'
                            }`}>
                              {book.author ? book.author.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{book.author || 'Anonymous'}</p>
                              <p className="text-xs opacity-75">Penulis</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-primary mb-3 line-clamp-2">
                          {book.title}
                        </h4>

                        {/* Description */}
                        {book.description && (
                          <p className="text-secondary text-sm mb-4 line-clamp-3">
                            {book.description}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center text-secondary text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{book.chapters?.length || 0} Chapters</span>
                          </div>
                          <div className="flex items-center text-green-600 font-semibold text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Gratis
                          </div>
                        </div>

                        {/* Read Button */}
                        <button 
                          onClick={() => handleBookClick(book.id)}
                          className="w-full mt-4 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Baca Sekarang</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
                {/* Page Info for Mobile */}
                <div className="text-sm text-secondary sm:hidden">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => fetchBooks(pagination.page - 1, searchQuery)}
                    disabled={pagination.page === 1}
                    className="flex items-center space-x-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1 sm:space-x-2">
                    {/* First Page */}
                    {pagination.page > 3 && (
                      <>
                        <button
                          onClick={() => fetchBooks(1, searchQuery)}
                          className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 hover:bg-neutral-light transition-colors"
                        >
                          1
                        </button>
                        {pagination.page > 4 && (
                          <span className="px-2 py-2 text-gray-400">...</span>
                        )}
                      </>
                    )}

                    {/* Pages around current */}
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const showPage = 
                        pageNum === pagination.page ||
                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1) ||
                        (pagination.page <= 2 && pageNum <= 3) ||
                        (pagination.page >= pagination.totalPages - 1 && pageNum >= pagination.totalPages - 2);

                      if (!showPage) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchBooks(pageNum, searchQuery)}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors ${
                            pagination.page === pageNum
                              ? 'bg-primary text-white shadow-md'
                              : 'border border-gray-300 hover:bg-neutral-light'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Last Page */}
                    {pagination.page < pagination.totalPages - 2 && (
                      <>
                        {pagination.page < pagination.totalPages - 3 && (
                          <span className="px-2 py-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => fetchBooks(pagination.totalPages, searchQuery)}
                          className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 hover:bg-neutral-light transition-colors"
                        >
                          {pagination.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => fetchBooks(pagination.page + 1, searchQuery)}
                    disabled={pagination.page === pagination.totalPages}
                    className="flex items-center space-x-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Page Info for Desktop */}
                <div className="hidden sm:block text-sm text-secondary">
                  Menampilkan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} buku
                </div>
              </div>
            )}
          </>
        )}

        <style>{`
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
      </section>
    </div>
    </>
  );
};

export default LearningPage;