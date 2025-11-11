import { useState } from "react";

const LearningDetailPage = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chapters = [
    {
      title: "Pengenalan Pajak",
      duration: "45 menit",
      sections: [
        { 
          title: "Apa itu Pajak?", 
          duration: "10 menit",
          content: "Pajak adalah kontribusi wajib kepada negara yang terutang oleh orang pribadi atau badan yang bersifat memaksa berdasarkan Undang-Undang, dengan tidak mendapatkan imbalan secara langsung dan digunakan untuk keperluan negara bagi sebesar-besarnya kemakmuran rakyat.",
          type: "video"
        },
        { 
          title: "Jenis-jenis Pajak", 
          duration: "15 menit",
          content: "Pajak dibedakan menjadi beberapa jenis berdasarkan sifat, sasaran, dan lembaga pemungutnya. Pajak Penghasilan (PPh), Pajak Pertambahan Nilai (PPN), dan Pajak Bumi dan Bangunan (PBB) adalah beberapa contoh pajak yang berlaku di Indonesia.",
          type: "reading"
        },
        { 
          title: "Fungsi dan Manfaat Pajak", 
          duration: "10 menit",
          content: "Pajak memiliki fungsi budgetair (mengisi kas negara) dan fungsi regulerend (mengatur). Manfaat pajak dapat dirasakan dalam pembangunan infrastruktur, pendidikan, kesehatan, dan berbagai program sosial lainnya.",
          type: "reading"
        },
        { 
          title: "Quiz: Dasar-dasar Pajak", 
          duration: "10 menit",
          content: "Uji pemahaman Anda tentang konsep dasar perpajakan dengan mengerjakan quiz ini.",
          type: "quiz"
        }
      ]
    },
    {
      title: "Pajak Penghasilan (PPh)",
      duration: "60 menit",
      sections: [
        { 
          title: "Pengertian PPh", 
          duration: "12 menit",
          content: "PPh adalah pajak yang dikenakan terhadap subjek pajak atas penghasilan yang diterima atau diperolehnya dalam tahun pajak.",
          type: "video"
        },
        { 
          title: "Subjek dan Objek PPh", 
          duration: "18 menit",
          content: "Subjek pajak meliputi orang pribadi, warisan yang belum terbagi, badan, dan bentuk usaha tetap. Objek pajak adalah setiap tambahan kemampuan ekonomis.",
          type: "reading"
        },
        { 
          title: "Tarif PPh", 
          duration: "15 menit",
          content: "Tarif PPh Pasal 17 untuk Wajib Pajak Orang Pribadi dalam negeri adalah progresif dengan lapisan penghasilan kena pajak.",
          type: "reading"
        },
        { 
          title: "Latihan Soal PPh", 
          duration: "15 menit",
          content: "Kerjakan latihan soal untuk memahami perhitungan PPh.",
          type: "quiz"
        }
      ]
    },
    {
      title: "Pelaporan SPT Tahunan",
      duration: "50 menit",
      sections: [
        { 
          title: "Pengenalan SPT", 
          duration: "10 menit",
          content: "SPT adalah surat yang digunakan untuk melaporkan penghitungan dan pembayaran pajak.",
          type: "video"
        },
        { 
          title: "Cara Mengisi SPT", 
          duration: "20 menit",
          content: "Panduan lengkap mengisi SPT Tahunan Orang Pribadi formulir 1770S.",
          type: "reading"
        },
        { 
          title: "E-Filing", 
          duration: "15 menit",
          content: "Tutorial menggunakan sistem e-Filing untuk pelaporan SPT online.",
          type: "video"
        },
        { 
          title: "Test Akhir", 
          duration: "5 menit",
          content: "Evaluasi pemahaman Anda tentang pelaporan SPT.",
          type: "quiz"
        }
      ]
    }
  ];

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
    const totalSections = chapters.reduce((acc, chapter) => acc + chapter.sections.length, 0);
    return Math.round((completedSections.length / totalSections) * 100);
  };

  const getContentIcon = (type) => {
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

              <button className="hidden sm:block text-primary hover:text-primary-dark">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold text-primary truncate">Pelatihan Pajak untuk Pemula</h1>
                <p className="text-xs sm:text-sm text-secondary truncate hidden sm:block">Memahami dasar-dasar perpajakan</p>
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
              <div key={chapterIndex} className="mb-4">
                <button
                  onClick={() => setActiveChapter(chapterIndex)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all ${
                    activeChapter === chapterIndex
                      ? 'bg-primary text-white'
                      : 'bg-neutral-light hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        BAB {chapterIndex + 1}
                      </p>
                      <h3 className="font-bold text-sm sm:text-base">{chapter.title}</h3>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {chapter.duration}
                  </div>
                </button>

                {activeChapter === chapterIndex && (
                  <div className="mt-2 space-y-1 ml-2 sm:ml-4">
                    {chapter.sections.map((section, sectionIndex) => (
                      <button
                        key={sectionIndex}
                        onClick={() => {
                          setActiveSection(sectionIndex);
                          setSidebarOpen(false); // Close sidebar on mobile when selecting
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
                          <p className="text-xs opacity-75">{section.duration}</p>
                        </div>
                        <div className="shrink-0">
                          {getContentIcon(section.type)}
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
                  {getContentIcon(chapters[activeChapter].sections[activeSection].type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-secondary font-semibold">
                    BAB {activeChapter + 1} - Materi {activeSection + 1}
                  </p>
                  <h2 className="text-lg sm:text-2xl font-bold text-primary truncate">
                    {chapters[activeChapter].sections[activeSection].title}
                  </h2>
                </div>
              </div>

              {/* Video Player or Content */}
              {chapters[activeChapter].sections[activeSection].type === 'video' ? (
                <div className="bg-gray-900 rounded-lg sm:rounded-xl aspect-video mb-4 sm:mb-6 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <svg className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-base sm:text-lg font-semibold">Video Player</p>
                    <p className="text-xs sm:text-sm opacity-75">Durasi: {chapters[activeChapter].sections[activeSection].duration}</p>
                  </div>
                </div>
              ) : chapters[activeChapter].sections[activeSection].type === 'quiz' ? (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg sm:rounded-xl p-6 sm:p-8 mb-4 sm:mb-6">
                  <div className="text-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">Quiz Interaktif</h3>
                    <p className="text-sm sm:text-base text-secondary mb-4">Uji pemahaman Anda dengan mengerjakan quiz</p>
                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                      Mulai Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 text-primary mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-semibold text-sm sm:text-base">Materi Bacaan</p>
                  </div>
                </div>
              )}

              {/* Content Text */}
              <div className="prose max-w-none mb-6 sm:mb-8">
                <p className="text-sm sm:text-lg text-secondary leading-relaxed">
                  {chapters[activeChapter].sections[activeSection].content}
                </p>
              </div>

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
                  
                  {activeSection < chapters[activeChapter].sections.length - 1 && (
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
                    Pelajari setiap materi dengan seksama dan jangan ragu untuk mengulang video jika belum memahami. 
                    Catat poin-poin penting untuk referensi di masa depan!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearningDetailPage;