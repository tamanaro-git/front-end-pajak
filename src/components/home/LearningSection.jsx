
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../../services/bookService";

const LearningSection = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks({
        page: 1,
        limit: 3 // Only show 3 books in home section
      });
      
      if (response.status === 'success') {
        setBooks(response.data.books || []);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/learning/${bookId}`);
  };

  const bgColors = ['bg-blue-50', 'bg-gray-900', 'bg-purple-50'];

  if (loading) {
    return (
      <section className="bg-neutral-light py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-light py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-dark font-semibold text-sm uppercase tracking-wide">
            Program Edukasi
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mt-4 mb-4">
            Buku & Materi Pembelajaran Pajak
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Tingkatkan pengetahuan pajak Anda melalui koleksi buku dan materi pembelajaran yang kami sediakan
          </p>
        </div>

        {/* Cards Grid - 3 Cards Side by Side */}
        {books.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Buku Tersedia</h3>
            <p className="text-gray-500">Materi pembelajaran akan segera tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => {
              const bgColor = bgColors[index % bgColors.length];
              const isLight = bgColor !== 'bg-gray-900';

              return (
                <div 
                  key={book.id}
                  onClick={() => handleBookClick(book.id)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                >
                  {/* Image/Header Section */}
                  <div className={`${bgColor} ${isLight ? 'text-primary' : 'text-white'} p-6 h-64 flex flex-col justify-between relative overflow-hidden`}>
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 border-4 border-current transform rotate-45"></div>
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
                    <h4 className="text-xl font-bold text-primary mb-4 line-clamp-2">
                      {book.title}
                    </h4>

                    {/* Description */}
                    {book.description && (
                      <p className="text-secondary text-sm mb-4 line-clamp-3">
                        {book.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-4">
                      <div className="flex items-center text-secondary text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{book.chapters?.length || 0} Chapters</span>
                      </div>
                      <span className="inline-flex items-center text-green-600 font-semibold text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Gratis
                      </span>
                    </div>

                    {/* Read Button */}
                    <button 
                      onClick={() => handleBookClick(book.id)}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Baca Sekarang</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {books.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/learning')}
              className="inline-flex items-center bg-white hover:bg-primary hover:text-white text-primary px-8 py-3 rounded-full font-semibold transition-all duration-300 border-2 border-primary shadow-md hover:shadow-lg"
            >
              Lihat Semua Buku Pembelajaran
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}
      </div>

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
  );
};

export default LearningSection;