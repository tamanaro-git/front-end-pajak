import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import chapterService from "../../../services/chapterService";

const LearningDetailPage = () => {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  const fetchBookData = async () => {
    setLoading(true);
    try {
      const response = await chapterService.getChaptersByBook(bookId);
      
      if (response.status === 'success') {
        setBook(response.data.book);
        setChapters(response.data.chapters || []);
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    const title = `${currentSection?.title || 'Materi'} - ${book?.title || 'Pajax Learning'}`;
    const text = `Belajar tentang: ${title}`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const getContentIcon = (type = 'reading') => {
    switch(type) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!book || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Buku Tidak Ditemukan</h3>
          <p className="text-gray-500 mb-4">Buku ini tidak memiliki chapter atau belum tersedia</p>
          <button
            onClick={() => navigate('/learning')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Kembali ke Learning
          </button>
        </div>
      </div>
    );
  }

  const currentChapter = chapters[activeChapter];
  const currentSection = currentChapter?.subchapters?.[activeSection];

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-primary hover:text-primary-dark p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button className="hidden sm:block text-primary hover:text-primary-dark" onClick={() => navigate('/learning')}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold text-primary truncate">{book?.title || 'Loading...'}</h1>
                <p className="text-xs sm:text-sm text-secondary truncate hidden sm:block">
                  {book?.author ? `By ${book.author}` : 'Belajar tentang perpajakan'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar - Chapters List */}
        <aside className={`
          fixed lg:sticky top-[57px] sm:top-[73px] left-0 z-20
          w-72 sm:w-80 bg-white shadow-lg 
          h-[calc(100vh-57px)] sm:h-[calc(100vh-73px)]
          overflow-y-auto transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-primary">Daftar Materi</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-secondary hover:text-primary"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="mb-4">
                <button
                  onClick={() => {
                    setActiveChapter(chapterIndex);
                    setActiveSection(0);
                  }}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all ${
                    activeChapter === chapterIndex
                      ? 'bg-primary text-white'
                      : 'bg-neutral-light hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        BAB {chapter.orderIndex || chapterIndex + 1}
                      </p>
                      <h3 className="font-bold text-sm sm:text-base">{chapter.title}</h3>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform shrink-0 ml-2 ${
                        activeChapter === chapterIndex ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="flex items-center text-xs opacity-75">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {chapter.subchapters?.length || 0} Subchapters
                  </div>
                </button>

                {activeChapter === chapterIndex && chapter.subchapters && chapter.subchapters.length > 0 && (
                  <div className="mt-2 space-y-1 ml-2 sm:ml-4">
                    {chapter.subchapters.map((section, sectionIndex) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(sectionIndex);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all flex items-center space-x-2 sm:space-x-3 ${
                          activeSection === sectionIndex
                            ? 'bg-primary-dark text-white'
                            : 'hover:bg-neutral-light text-secondary'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold truncate">{section.title}</p>
                        </div>
                        <div className="shrink-0">
                          {getContentIcon('reading')}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Content Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
              {/* Content Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                    {getContentIcon('reading')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-secondary font-semibold">
                      BAB {currentChapter?.orderIndex || activeChapter + 1} - Materi {activeSection + 1}
                    </p>
                    <h2 className="text-lg sm:text-2xl font-bold text-primary truncate">
                      {currentSection?.title || 'Loading...'}
                    </h2>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="shrink-0 ml-2 p-2 sm:p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                  title="Share"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>

              {/* Content Text (HTML Rendered) */}
              {currentSection?.content ? (
                <div className="prose prose-sm sm:prose max-w-none mb-6 sm:mb-8">
                  <div 
                    className="text-sm sm:text-base text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentSection.content }}
                  />
                </div>
              ) : (
                <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
                  <svg className="w-16 h-16 text-blue-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-secondary">Konten tidak tersedia</p>
                </div>
              )}

                {/* Resume Section (if exists) */}
              {currentSection?.resume && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-bold text-yellow-800 mb-1 text-sm">Ringkasan</h4>
                      <p className="text-sm text-yellow-700">{currentSection.resume}</p>
                    </div>
                  </div>
                </div>
              )}

                 {currentSection?.regulation && (
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-800 mb-2 text-sm">Peraturan/Regulasi Terkait</h4>
                      <div 
                        className="text-sm text-blue-700 prose-regulation"
                        dangerouslySetInnerHTML={{ __html: currentSection.regulation }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-2 pt-4 sm:pt-6 border-t border-gray-200">
                {activeSection > 0 && (
                  <button
                    onClick={() => setActiveSection(activeSection - 1)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>
                )}
                
                {currentChapter?.subchapters && activeSection < currentChapter.subchapters.length - 1 && (
                  <button
                    onClick={() => setActiveSection(activeSection + 1)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors ml-auto"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <span className="sm:hidden">Next</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
                  <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-primary">Bagikan Materi</h3>
                          <p className="text-sm text-secondary">Bagikan ke teman Anda</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Social Media Buttons */}
                    <div className="space-y-3 mb-6">
                      {/* Facebook */}
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Bagikan ke Facebook</span>
                      </button>

                      {/* Twitter */}
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center space-x-3 p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span>Bagikan ke Twitter</span>
                      </button>

                      {/* WhatsApp */}
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className="w-full flex items-center space-x-3 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>Bagikan ke WhatsApp</span>
                      </button>

                      {/* LinkedIn */}
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full flex items-center space-x-3 p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span>Bagikan ke LinkedIn</span>
                      </button>

                      {/* Telegram */}
                      <button
                        onClick={() => handleShare('telegram')}
                        className="w-full flex items-center space-x-3 p-4 bg-sky-400 hover:bg-sky-500 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        <span>Bagikan ke Telegram</span>
                      </button>
                    </div>

                    {/* Copy Link */}
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Atau salin link</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={window.location.href}
                          readOnly
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
                        />
                        <button
                          onClick={handleCopyLink}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            copySuccess 
                              ? 'bg-green-500 text-white' 
                              : 'bg-primary hover:bg-primary-dark text-white'
                          }`}
                        >
                          {copySuccess ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {copySuccess && (
                        <p className="text-xs text-green-600 mt-2 font-semibold">✓ Link berhasil disalin!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <h4 className="font-bold text-green-800 mb-2 text-sm sm:text-base">Tips Belajar</h4>
                  <p className="text-xs sm:text-sm text-green-700">
                    Pelajari setiap materi dengan seksama dan jangan ragu untuk mengulang jika belum memahami. 
                    Catat poin-poin penting untuk referensi di masa depan!
                  </p>
                </div>
              </div>
            </div>

            {/* CSS for HTML Content */}
            <style>{`
              /* Prose Content Styling */
              .prose img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1rem 0;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              }
              
              /* List Styling - FIXED */
              .prose ul {
                list-style-type: disc;
                padding-left: 1.5rem;
                margin: 1rem 0;
              }
              
              .prose ol {
                list-style-type: decimal;
                padding-left: 1.5rem;
                margin: 1rem 0;
              }
              
              .prose ul ul {
                list-style-type: circle;
                margin: 0.5rem 0;
              }
              
              .prose ul ul ul {
                list-style-type: square;
              }
              
              .prose li {
                margin: 0.5rem 0;
                display: list-item;
              }
              
              .prose li p {
                margin: 0;
                display: inline;
              }
              
              /* Headings */
              .prose h1, .prose h2, .prose h3 {
                font-weight: bold;
                color: #0066CC;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              
              .prose h1 { font-size: 1.875rem; }
              .prose h2 { font-size: 1.5rem; }
              .prose h3 { font-size: 1.25rem; }
              
              /* Paragraphs */
              .prose p {
                margin: 1rem 0;
                line-height: 1.75;
              }
              
              /* Text Formatting */
              .prose strong {
                font-weight: 600;
                color: #0066CC;
              }
              
              .prose em {
                font-style: italic;
              }
              
              .prose u {
                text-decoration: underline;
              }
              
              .prose a {
                color: #0066CC;
                text-decoration: underline;
              }
              
              .prose a:hover {
                color: #0052A3;
              }
              
              /* Code Styling */
              .prose code {
                background-color: #f3f4f6;
                color: #ef4444;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-family: monospace;
                font-size: 0.875rem;
              }
              
              .prose pre {
                background-color: #1f2937;
                color: #f3f4f6;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1rem 0;
              }
              
              .prose pre code {
                background: none;
                color: inherit;
                padding: 0;
              }
              
              /* Blockquote */
              .prose blockquote {
                border-left: 4px solid #0066CC;
                padding-left: 1rem;
                font-style: italic;
                color: #6b7280;
                margin: 1rem 0;
              }
              
              /* Horizontal Rule */
              .prose hr {
                border: none;
                border-top: 2px solid #e5e7eb;
                margin: 2rem 0;
              }
              
              /* Video Wrapper for iframe */
              .prose .video-wrapper {
                position: relative;
                padding-bottom: 56.25%;
                height: 0;
                overflow: hidden;
                max-width: 100%;
                margin: 1rem 0;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              }
              
              .prose .video-wrapper iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 0;
                border-radius: 0.5rem;
              }
              
              .prose iframe {
                max-width: 100%;
                border-radius: 0.5rem;
              }
              
              /* Regulation Section Styling */
              .prose-regulation ul {
                list-style-type: disc;
                padding-left: 1.5rem;
                margin: 0.5rem 0;
              }
              
              .prose-regulation ol {
                list-style-type: decimal;
                padding-left: 1.5rem;
                margin: 0.5rem 0;
              }
              
              .prose-regulation li {
                margin: 0.25rem 0;
                display: list-item;
                color: #1e40af;
              }
              
              .prose-regulation li p {
                margin: 0;
                display: inline;
              }
              
              .prose-regulation strong {
                font-weight: 600;
                color: #1e3a8a;
              }
              
              .prose-regulation em {
                font-style: italic;
              }
              
              .prose-regulation u {
                text-decoration: underline;
              }
              
              .prose-regulation p {
                margin: 0.5rem 0;
              }
              
              /* Share Modal Animation */
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
              
              .animate-scale-in {
                animation: scale-in 0.2s ease-out;
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningDetailPage;