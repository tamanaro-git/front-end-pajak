
const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "Perubahan Tarif Pajak Penghasilan 2025",
      excerpt: "Pemerintah mengumumkan perubahan tarif PPh untuk meningkatkan keadilan pajak dan mendorong pertumbuhan ekonomi. Simak detail perubahan yang perlu Anda ketahui.",
      image: "/news-1.jpg",
      category: "Regulasi",
      date: "15 Februari 2025",
      readTime: "5 min",
      author: "Tim Taxmin"
    },
    {
      id: 2,
      title: "Tips Maksimalkan Potongan Pajak UMKM",
      excerpt: "Panduan lengkap untuk pelaku UMKM dalam memanfaatkan insentif pajak yang tersedia untuk mengoptimalkan bisnis dan mengurangi beban pajak secara legal.",
      image: "/news-2.jpg",
      category: "Tips & Trik",
      date: "12 Februari 2025",
      readTime: "7 min",
      author: "Konsultan Pajak"
    },
    {
      id: 3,
      title: "Deadline Pelaporan SPT Tahunan 2025",
      excerpt: "Jangan lewatkan batas waktu pelaporan SPT Tahunan. Simak jadwal lengkap, cara pelaporan yang mudah, dan hindari denda keterlambatan.",
      image: "/news-3.jpg",
      category: "Informasi",
      date: "10 Februari 2025",
      readTime: "4 min",
      author: "Admin Taxmin"
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Regulasi": "bg-blue-100 text-blue-800",
      "Tips & Trik": "bg-green-100 text-green-800",
      "Informasi": "bg-yellow-100 text-yellow-800",
      "Tutorial": "bg-purple-100 text-purple-800",
      "Panduan": "bg-pink-100 text-pink-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article 
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary"
            >
              {/* Image with Overlay */}
              <div className="relative h-56 bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                </div>
                
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="transform group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-20 h-20 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                {/* Gradient Overlay Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-dark transition-colors line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-secondary text-sm mb-4 line-clamp-3 leading-relaxed min-h-[4rem]">
                  {item.excerpt}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 mb-4"></div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-secondary mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{item.author}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Read More Link */}
                <a 
                  href="#" 
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

        {/* Load More Button - Hidden since only 3 cards */}
        <div className="text-center mt-12">
          <a 
            href="#"
            className="inline-flex items-center bg-neutral-light hover:bg-primary hover:text-white text-primary px-8 py-3 rounded-full font-semibold transition-all duration-300 border-2 border-primary"
          >
            Lihat Semua Artikel
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;