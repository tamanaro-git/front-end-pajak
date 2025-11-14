// filepath: /home/zarif/Project/taxmin/front-end/src/pages/news/NewsDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newsService from "../../services/newsService";

const NewsDetailPage = () => {
  const { artikelId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLiking, setIsLiking] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchNewsDetail();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artikelId]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await newsService.getNewsByArtikelId(artikelId);
      
      if (response.status === 'success') {
        setNews(response.data);
        
        // Fetch related news based on category
        if (response.data.kategori) {
          fetchRelatedNews(response.data.kategori, response.data.id);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async (kategori, currentNewsId) => {
    try {
      const response = await newsService.getAllNews({
        page: 1,
        limit: 3,
        status: 'published',
        kategori: kategori
      });
      
      if (response.status === 'success') {
        // Filter out current news
        const filtered = response.data.news.filter(item => item.id !== currentNewsId);
        setRelatedNews(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  // Handle like button
  const handleLike = async () => {
    if (isLiking || !news) return;
    
    try {
      setIsLiking(true);
      const response = await newsService.incrementLikes(news.id);
      
      if (response.status === 'success') {
        setNews(prev => ({ ...prev, likes: response.data.likes }));
        showNotification('Terima kasih! Anda menyukai artikel ini ❤️');
      }
    } catch (error) {
      console.error('Error liking news:', error);
      showNotification('Gagal memberikan like');
    } finally {
      setIsLiking(false);
    }
  };

  // Handle share button
  const handleShare = async (platform) => {
    if (!news) return;
    
    const url = window.location.href;
    const title = news.title;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        showNotification('Link berhasil disalin! 📋');
        // Increment shares for copy link
        try {
          const response = await newsService.incrementShares(news.id);
          if (response.status === 'success') {
            setNews(prev => ({ ...prev, shares: response.data.shares }));
          }
        } catch (error) {
          console.error('Error incrementing shares:', error);
        }
        return;
      default:
        return;
    }
    
    // Open share window
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Increment shares counter
      try {
        const response = await newsService.incrementShares(news.id);
        if (response.status === 'success') {
          setNews(prev => ({ ...prev, shares: response.data.shares }));
        }
      } catch (error) {
        console.error('Error incrementing shares:', error);
      }
    }
  };

  // Show notification
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Artikel Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
          <button
            onClick={() => navigate('/news')}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
          >
            Kembali ke Daftar Berita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header/Navbar Placeholder */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-white/80 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/news" className="hover:text-white transition-colors">Berita</a>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{news.title}</span>
          </div>

          {/* Category & Sub-category */}
          <div className="flex items-center space-x-3 mb-6">
            {news.kategori && (
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                📁 {news.kategori}
              </span>
            )}
            {news.subKategori && (
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold">
                {news.subKategori}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/70">Penulis</p>
                <p className="font-semibold">{news.author?.fullName || 'Admin'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-white/70">Dipublikasikan</p>
                <p className="font-semibold">{formatDate(news.publishedAt || news.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-semibold">{news.views || 0}</span>
              </div>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                title="Like artikel ini"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold">{news.likes || 0}</span>
              </button>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="font-semibold">{news.shares || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              {news.image && (
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {/* Article Body */}
              <div className="p-8 lg:p-12">
                {/* Excerpt/Summary */}
                {news.content && (
                  <div className="mb-8 p-6 bg-blue-50 border-l-4 border-primary rounded-r-lg">
                    <h3 className="text-lg font-bold text-primary mb-2">📌 Ringkasan</h3>
                    <p className="text-secondary leading-relaxed">{news.content}</p>
                  </div>
                )}

                {/* Tags */}
                {news.tags && news.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {news.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Full Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: news.fullContent }}
                />

                {/* Author Info Box */}
                <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                      {news.author?.fullName ? news.author.fullName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-secondary mb-1">Ditulis oleh</p>
                      <h4 className="text-xl font-bold text-primary">{news.author?.fullName || 'Admin'}</h4>
                      <p className="text-sm text-secondary">{news.author?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-primary mb-4">📤 Bagikan Artikel</h4>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleShare('facebook')}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleShare('twitter')}
                      className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button 
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => handleShare('copy')}
                      className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Artikel Terkait
                  </h3>
                  <div className="space-y-4">
                    {relatedNews.map((item) => (
                      <a
                        key={item.id}
                        href={`/news/${item.artikelId}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-primary group-hover:text-primary-dark transition-colors line-clamp-2 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-secondary">
                              {formatDate(item.publishedAt || item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags Populer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['pajak', 'pph', 'ppn', 'spt', 'coretax', 'kup', 'reformasi'].map((tag) => (
                    <a
                      key={tag}
                      href={`/news?tag=${tag}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-full text-sm font-semibold transition-colors"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Animations */
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        /* Prose Styles */
        .prose h1 { font-size: 2.25rem; font-weight: bold; margin: 2rem 0 1rem; color: #1e3a8a; }
        .prose h2 { font-size: 1.875rem; font-weight: bold; margin: 1.5rem 0 0.75rem; color: #1e3a8a; }
        .prose h3 { font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0 0.5rem; color: #1e3a8a; }
        .prose p { margin: 1rem 0; line-height: 1.875; color: #374151; font-size: 1.125rem; }
        .prose ul { list-style-type: disc; padding-left: 2rem; margin: 1rem 0; }
        .prose ol { list-style-type: decimal; padding-left: 2rem; margin: 1rem 0; }
        .prose li { margin: 0.5rem 0; line-height: 1.75; color: #374151; }
        .prose img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 2rem auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .prose blockquote { border-left: 4px solid #3b82f6; padding-left: 1.5rem; margin: 1.5rem 0; font-style: italic; color: #6b7280; background: #f9fafb; padding: 1rem 1rem 1rem 1.5rem; border-radius: 0 0.5rem 0.5rem 0; }
        .prose pre { background: #1f2937; color: #f3f4f6; padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; overflow-x: auto; font-size: 0.875rem; }
        .prose code { background: #f3f4f6; color: #ef4444; padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.875rem; font-family: 'Courier New', monospace; }
        .prose a { color: #3b82f6; text-decoration: underline; font-weight: 500; }
        .prose a:hover { color: #2563eb; }
        .prose strong { font-weight: 700; color: #1e3a8a; }
        .prose em { font-style: italic; }
        .prose hr { border: none; border-top: 2px solid #e5e7eb; margin: 2.5rem 0; }
        
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

export default NewsDetailPage;