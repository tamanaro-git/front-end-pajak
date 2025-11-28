
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import newsService from "../../services/newsService";

const NewsListPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 0 });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const kategoriOptions = ["Perpajakan", "Ekonomi", "Perspective"];
  
  const subKategoriMapping = {
    "Perpajakan": ["KUP", "PPh", "PPN", "Coretax", "Kepabeanan & Cukai", "Lainnya"],
    "Ekonomi": ["Bisnis dan Investasi", "Nasional", "Internasional", "Lainnya"],
    "Perspective": ["Ekonomi", "Bisnis dan Investasi", "PPh", "PPN", "KUP", "Coretax", "Kepabeanan & Cukai"]
  };

  // Get available sub-categories based on selected category
  const availableSubKategori = selectedCategory ? subKategoriMapping[selectedCategory] || [] : [];

  const filters = [
    { id: 'all', label: 'Semua Berita', icon: '📰' },
    { id: 'latest', label: 'Terbaru', icon: '🆕' },
    { id: 'popular', label: 'Populer', icon: '🔥' },
    { id: 'trending', label: 'Trending', icon: '📈' }
  ];

  useEffect(() => {
    fetchNews();
    fetchTrendingNews();
  }, []);

  useEffect(() => {
    fetchNews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedSubCategory, activeFilter]);

  const fetchNews = async (page = pagination.page) => {
    try {
      setLoading(true);
      
      let params = {
        page,
        limit: 9,
        status: 'published'
      };

      // If subcategory is selected, use only subcategory filter
      if (selectedSubCategory) {
        params.subKategori = selectedSubCategory;
        // Don't add kategori when subcategory is selected
      } else if (selectedCategory) {
        // Only add main category if no subcategory is selected
        params.kategori = selectedCategory;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await newsService.getAllNews(params);
      
      if (response.status === 'success') {
        let newsData = response.data.news || [];
        
        // Apply filter sorting
        if (activeFilter === 'latest') {
          newsData = newsData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        } else if (activeFilter === 'popular') {
          newsData = newsData.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else if (activeFilter === 'trending') {
          newsData = newsData.sort((a, b) => {
            const scoreA = (a.views || 0) * 0.5 + (a.likes || 0) * 2 + (a.shares || 0) * 3;
            const scoreB = (b.views || 0) * 0.5 + (b.likes || 0) * 2 + (b.shares || 0) * 3;
            return scoreB - scoreA;
          });
        }
        
        setNews(newsData);
        setPagination(response.data.pagination || { total: 0, page: 1, limit: 9, totalPages: 0 });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingNews = async () => {
    try {
      const response = await newsService.getAllNews({
        page: 1,
        limit: 5,
        status: 'published'
      });
      
      if (response.status === 'success') {
        const sorted = (response.data.news || []).sort((a, b) => {
          const scoreA = (a.views || 0) * 0.5 + (a.likes || 0) * 2 + (a.shares || 0) * 3;
          const scoreB = (b.views || 0) * 0.5 + (b.likes || 0) * 2 + (b.shares || 0) * 3;
          return scoreB - scoreA;
        });
        setTrendingNews(sorted.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching trending news:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(1);
  };

  const handleNewsClick = (artikelId) => {
    navigate(`/news/${artikelId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  const getCategoryColor = (category, subCategory) => {
    // Primary category colors
    const categoryColors = {
      "Perpajakan": "bg-blue-100 text-blue-800",
      "Ekonomi": "bg-green-100 text-green-800",
      "Perspective": "bg-purple-100 text-purple-800"
    };

    // Sub-category specific colors
    const subCategoryColors = {
      "KUP": "bg-yellow-100 text-yellow-800",
      "PPh": "bg-indigo-100 text-indigo-800", 
      "PPN": "bg-pink-100 text-pink-800",
      "Coretax": "bg-orange-100 text-orange-800",
      "Kepabeanan & Cukai": "bg-teal-100 text-teal-800",
      "Bisnis dan Investasi": "bg-emerald-100 text-emerald-800",
      "Nasional": "bg-red-100 text-red-800",
      "Internasional": "bg-sky-100 text-sky-800"
    };

    // If sub-category exists and has specific color, use it
    if (subCategory && subCategoryColors[subCategory]) {
      return subCategoryColors[subCategory];
    }

    // Otherwise use category color
    return categoryColors[category] || "bg-gray-100 text-gray-800";
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, '');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-white">{/* ...existing code... */}
      <section className="relative bg-primary-dark text-white py-20 overflow-hidden">
        {/* Background Decorative Icons */}
        <div className="absolute inset-0 opacity-10">
          {/* Top Left */}
          <svg className="absolute top-10 left-10 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>

          {/* Top Right */}
          <svg className="absolute top-20 right-20 w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>

          {/* Bottom Left */}
          <svg className="absolute bottom-10 left-20 w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          {/* Right Side */}
          <svg className="absolute bottom-32 right-10 w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>

          {/* Center Decorations */}
          <svg className="absolute top-40 left-1/4 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>

          <svg className="absolute bottom-20 right-1/3 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 4 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Taxmin <span className="text-yellow-400">News</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Portal berita ekonomi, bisnis, investasi, dan perpajakan terpercaya 
            dengan analisis mendalam untuk Indonesia
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-primary-dark px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Mulai Membaca</span>
            </button>

            <Link to="/login" className="flex items-center space-x-2 bg-transparent border-2 border-white hover:bg-white hover:text-primary-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Gabung Sekarang</span>
            </Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-primary mb-4">🔍 Cari Berita</h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul, topik..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              {/* Filter by Type */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-primary mb-4">📂 Filter</h3>
                <div className="space-y-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                        activeFilter === filter.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-xl">{filter.icon}</span>
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-primary mb-4">🏷️ Kategori</h3>
                <div className="space-y-3">
                  {/* Reset All Categories */}
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSubCategory('');
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === '' && selectedSubCategory === ''
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Semua Kategori
                  </button>

                  {/* Main Categories */}
                  {kategoriOptions.map((category) => (
                    <div key={category} className="space-y-2">
                      <button
                        onClick={() => {
                          if (selectedCategory === category && !selectedSubCategory) {
                            // If same category clicked and no subcategory, reset all
                            setSelectedCategory('');
                            setSelectedSubCategory('');
                          } else {
                            // Select new category and reset subcategory
                            setSelectedCategory(category);
                            setSelectedSubCategory('');
                          }
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                          selectedCategory === category && !selectedSubCategory
                            ? 'bg-primary text-white'
                            : selectedCategory === category && selectedSubCategory
                            ? 'bg-primary-dark text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>{category}</span>
                        {subKategoriMapping[category] && (
                          <svg 
                            className={`w-4 h-4 transition-transform ${
                              selectedCategory === category ? 'rotate-180' : ''
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>

                      {/* Sub Categories */}
                      {selectedCategory === category && availableSubKategori.length > 0 && (
                        <div className="ml-4 space-y-1 border-l-2 border-primary pl-3">
                          <button
                            onClick={() => {
                              if (selectedSubCategory === '') {
                                // Already showing all for this category, so reset everything
                                setSelectedCategory('');
                                setSelectedSubCategory('');
                              } else {
                                // Reset subcategory to show all for this category
                                setSelectedSubCategory('');
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedSubCategory === '' && selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-100 text-gray-600'
                            }`}
                          >
                            Semua {category}
                          </button>
                          {availableSubKategori.map((subCategory) => (
                            <button
                              key={subCategory}
                              onClick={() => {
                                if (selectedSubCategory === subCategory) {
                                  // If same subcategory clicked, reset to show all in category
                                  setSelectedSubCategory('');
                                } else {
                                  // Select new subcategory
                                  setSelectedSubCategory(subCategory);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedSubCategory === subCategory
                                  ? 'bg-primary-dark text-white'
                                  : 'hover:bg-gray-100 text-gray-600'
                              }`}
                            >
                              {subCategory}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Trending */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔥</span>
                  Top Trending
                </h3>
                <div className="space-y-4">
                  {trendingNews.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleNewsClick(item.artikelId)}
                      className="flex space-x-3 cursor-pointer group"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-primary group-hover:text-primary-dark transition-colors line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs text-secondary">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {item.views || 0}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {item.likes || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - News Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {selectedSubCategory 
                    ? `${selectedCategory} - ${selectedSubCategory}` 
                    : selectedCategory || 'Semua'} Berita
                </h2>
                <p className="text-secondary text-sm">
                  Menampilkan {news.length} dari {pagination.total} artikel
                  {selectedCategory && (
                    <span className="ml-2 text-xs">
                      📂 {selectedCategory}
                      {selectedSubCategory && ` > ${selectedSubCategory}`}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Berita</h3>
                <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            ) : (
              <>
                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {news.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => handleNewsClick(item.artikelId)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        {(item.kategori || item.subKategori) && (
                          <div className="absolute top-3 left-3 space-y-1">
                            {item.kategori && (
                              <span className={`block px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(item.kategori, item.subKategori)}`}>
                                {item.kategori}
                              </span>
                            )}
                            {item.subKategori && (
                              <span className={`block px-2 py-1 rounded-full text-xs font-semibold shadow-md bg-white/90 ${
                                item.subKategori === 'KUP' ? 'text-yellow-700' :
                                item.subKategori === 'PPh' ? 'text-indigo-700' :
                                item.subKategori === 'PPN' ? 'text-pink-700' :
                                item.subKategori === 'Coretax' ? 'text-orange-700' :
                                'text-gray-700'
                              }`}>
                                {item.subKategori}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Stats Overlay */}
                        <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-white text-xs font-semibold">
                          <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {item.views || 0}
                          </div>
                          <div className="flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {item.likes || 0}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-primary-dark transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-secondary text-sm mb-4 line-clamp-3">
                          {truncateText(item.content || item.fullContent)}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center text-xs text-secondary">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {item.author?.fullName || 'Admin'}
                          </div>
                          <div className="text-xs text-secondary">
                            {formatDate(item.publishedAt || item.createdAt)}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => fetchNews(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex space-x-2">
                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchNews(pageNum)}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-primary text-white shadow-md'
                                : 'border-2 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.totalPages > 5 && (
                        <>
                          <span className="px-2 py-2">...</span>
                          <button
                            onClick={() => fetchNews(pagination.totalPages)}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                              pagination.page === pagination.totalPages
                                ? 'bg-primary text-white shadow-md'
                                : 'border-2 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => fetchNews(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
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
    </div>
  );
};

export default NewsListPage;