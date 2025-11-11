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
  const [completedSections, setCompletedSections] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleCompletion = (chapterIndex, sectionIndex) => {
    const key = `${chapterIndex}-${sectionIndex}`;
    if (completedSections.includes(key)) {
      setCompletedSections(completedSections.filter(item => item !== key));
    } else {
      setCompletedSections([...completedSections, key]);
    }
  };

  const isCompleted = (chapterIndex, sectionIndex) => {
    return completedSections.includes(`${chapterIndex}-${sectionIndex}`);
  };

  const getProgress = () => {
    if (chapters.length === 0) return 0;
    const totalSections = chapters.reduce((acc, chapter) => acc + (chapter.subchapters?.length || 0), 0);
    if (totalSections === 0) return 0;
    return Math.round((completedSections.length / totalSections) * 100);
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
            
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs sm:text-sm text-secondary">Progress</p>
                <p className="text-sm sm:text-lg font-bold text-primary">{getProgress()}%</p>
              </div>
              <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <div className="sm:hidden text-primary font-bold text-sm">
                {getProgress()}%
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
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCompleted(chapterIndex, sectionIndex)
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        }`}>
                          {isCompleted(chapterIndex, sectionIndex) && (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
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
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
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
                      <h4 className="font-bold text-yellow-800 mb-1 text-sm">Resume</h4>
                      <p className="text-sm text-yellow-700">{currentSection.resume}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mark as Complete Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={() => toggleCompletion(activeChapter, activeSection)}
                  className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isCompleted(activeChapter, activeSection)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-secondary hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    {isCompleted(activeChapter, activeSection) ? 'Selesai' : 'Tandai Selesai'}
                  </span>
                </button>

                <div className="flex gap-2">
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
                      className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
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
            </div>

            {/* Tips Card */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">Tips Belajar</h4>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    Pelajari setiap materi dengan seksama dan jangan ragu untuk mengulang jika belum memahami. 
                    Catat poin-poin penting untuk referensi di masa depan!
                  </p>
                </div>
              </div>
            </div>

            {/* CSS for HTML Content */}
            <style>{`
              .prose img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              
              .prose ul, .prose ol {
                padding-left: 1.5rem;
                margin: 1rem 0;
              }
              
              .prose li {
                margin: 0.5rem 0;
              }
              
              .prose h1, .prose h2, .prose h3 {
                font-weight: bold;
                color: #0066CC;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }
              
              .prose h1 { font-size: 1.875rem; }
              .prose h2 { font-size: 1.5rem; }
              .prose h3 { font-size: 1.25rem; }
              
              .prose p {
                margin: 1rem 0;
                line-height: 1.75;
              }
              
              .prose strong {
                font-weight: 600;
                color: #0066CC;
              }
              
              .prose a {
                color: #0066CC;
                text-decoration: underline;
              }
              
              .prose code {
                background-color: #f3f4f6;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-family: monospace;
              }
              
              .prose pre {
                background-color: #1f2937;
                color: #f3f4f6;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
              }
              
              .prose blockquote {
                border-left: 4px solid #0066CC;
                padding-left: 1rem;
                font-style: italic;
                color: #6b7280;
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningDetailPage;