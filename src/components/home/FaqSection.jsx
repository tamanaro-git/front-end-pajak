import { useState, useEffect } from "react";

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const faqs = [
    {
      question: "Apa itu Taxmin.id?",
      answer: "Taxmin.id adalah platform jasa konsultan pajak profesional yang membantu individu dan perusahaan dalam mengelola kewajiban perpajakan dengan mudah dan efisien. Kami menyediakan solusi lengkap dari konsultasi hingga pelaporan pajak."
    },
    {
      question: "Layanan apa saja yang tersedia?",
      answer: "Kami menyediakan berbagai layanan termasuk konsultasi pajak, perencanaan pajak, penghitungan pajak, pelaporan SPT Tahunan, pembuatan NPWP, dan pendampingan audit pajak. Semua layanan ditangani oleh tim ahli yang berpengalaman."
    },
    {
      question: "Berapa biaya konsultasi pajak?",
      answer: "Biaya konsultasi bervariasi tergantung jenis layanan dan kompleksitas kasus. Kami menawarkan paket konsultasi yang fleksibel mulai dari konsultasi dasar hingga pendampingan penuh. Silakan hubungi kami untuk informasi detail mengenai harga."
    },
    {
      question: "Apakah data saya aman?",
      answer: "Keamanan data klien adalah prioritas utama kami. Semua data pribadi dan finansial dilindungi dengan sistem enkripsi tingkat tinggi dan disimpan dengan standar keamanan internasional. Kami juga menerapkan kebijakan privasi yang ketat."
    },
    {
      question: "Bagaimana cara memulai konsultasi?",
      answer: "Anda dapat memulai dengan mendaftar di platform kami, kemudian memilih layanan yang dibutuhkan. Tim kami akan menghubungi Anda untuk jadwal konsultasi. Konsultasi pertama bisa dilakukan secara online atau tatap muka sesuai preferensi Anda."
    },
    {
      question: "Berapa lama proses pelaporan pajak?",
      answer: "Waktu proses tergantung kompleksitas laporan dan kelengkapan dokumen. Untuk kasus standar, biasanya memerlukan 3-5 hari kerja. Kami juga menyediakan layanan express untuk kebutuhan mendesak dengan tambahan biaya."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            // Reset progress and move to next question
            setActiveIndex((prevIndex) => (prevIndex + 1) % faqs.length);
            return 0;
          }
          return prevProgress + 1;
        });
      }
    }, 50); // Update every 50ms (5 seconds total per question)

    return () => clearInterval(timer);
  }, [activeIndex, faqs.length, isPaused]);

  const handleQuestionClick = (index) => {
    setActiveIndex(index);
    setProgress(0);
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-dark font-semibold text-sm uppercase tracking-wide">
            FAQ
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mt-4 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan konsultasi pajak kami
          </p>
        </div>

        {/* FAQ Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Questions */}
          <div 
            className="space-y-3"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 relative overflow-hidden ${
                  activeIndex === index
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-neutral-light text-primary hover:bg-gray-200'
                }`}
              >
                {/* Progress Bar */}
                {activeIndex === index && (
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg pr-4">
                    {faq.question}
                  </span>
                  <svg 
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      activeIndex === index ? 'rotate-90' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Right Side - Answer */}
          <div 
            className="lg:sticky lg:top-32 h-fit"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-neutral-light rounded-xl p-8 shadow-lg">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {faqs[activeIndex].question}
                  </h3>
                  <p className="text-secondary text-lg leading-relaxed">
                    {faqs[activeIndex].answer}
                  </p>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-secondary text-sm mb-4">
                  Masih ada pertanyaan lain?
                </p>
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-colors">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;