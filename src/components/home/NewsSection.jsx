
import { useState, useEffect } from "react";
import newsService from "../../services/newsService";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews({
        page: 1,
        limit: 3
        ,
        status: 'published' // Only show published news
      });
      
      if (response.status === 'success') {
        setNews(response.data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Perpajakan": "bg-blue-100 text-blue-800",
      "Ekonomi": "bg-green-100 text-green-800",
      "Perspective": "bg-purple-100 text-purple-800",
      "Pajak Penghasilan": "bg-blue-100 text-blue-800",
      "PPN": "bg-green-100 text-green-800",
      "PPh": "bg-indigo-100 text-indigo-800",
      "KUP": "bg-yellow-100 text-yellow-800",
      "Coretax": "bg-pink-100 text-pink-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    // Remove HTML tags
    const cleanText = text.replace(/<[^>]*>/g, '');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-dark font-semibold text-sm uppercase tracking-wide">
            Berita & Artikel
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mt-4 mb-4">
            Informasi Terkini Seputar Pajak
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Dapatkan update terbaru tentang peraturan pajak, tips, dan panduan dari para ahli
          </p>
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">Belum ada berita tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-primary"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-primary', 'via-primary-dark', 'to-secondary');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary via-primary-dark to-secondary">
                      {/* Pattern Overlay */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-20 h-20 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {item.kategori && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(item.kategori)}`}>
                        {item.kategori}
                      </span>
                    </div>
                  )}

                  {/* Sub-category Badge */}
                  {item.subKategori && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-primary shadow-lg">
                        {item.subKategori}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Stats Overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-white text-xs font-semibold">
                    {/* Views */}
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{item.views || 0}</span>
                    </div>
                    
                    {/* Likes */}
                    <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{item.likes || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-dark transition-colors line-clamp-2 min-h-[3.5rem]">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-secondary text-sm mb-4 line-clamp-3 leading-relaxed min-h-[4rem]">
                    {truncateText(item.content || item.fullContent, 150)}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-4"></div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-secondary mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">{item.author?.fullName || 'Admin'}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <a 
                    href={`/news/${item.artikelId}`}
                    className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all duration-300 group/btn"
                  >
                    Baca Artikel
                    <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {news.length > 0 && (
          <div className="text-center mt-12">
            <a 
              href="/news"
              className="inline-flex items-center bg-neutral-light hover:bg-primary hover:text-white text-primary px-8 py-3 rounded-full font-semibold transition-all duration-300 border-2 border-primary"
            >
              Lihat Semua Artikel
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;