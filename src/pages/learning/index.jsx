
const LearningPage = () => {
  return (
    <div className="min-h-screen bg-white">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-primary-dark px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Mulai Belajar</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-transparent border-2 border-white hover:bg-white hover:text-primary-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Lihat Jadwal</span>
            </button>
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
          <h2 className="text-3xl font-bold text-primary mb-4">Program Pelatihan Tersedia</h2>
          <p className="text-secondary">Ikuti berbagai program pelatihan pajak yang kami sediakan</p>
        </div>

        {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Pelatihan Pajak untuk Pemula",
              description: "Memahami dasar-dasar perpajakan untuk individu dan UMKM",
              date: "18 Sep 25, 09.00 - 12.00 WIB",
              location: "Pelatihan Online",
              price: "Gratis",
              status: "Terdahulu",
              bgColor: "bg-blue-50"
            },
            {
              title: "Workshop SPT Tahunan & Pelaporan Pajak",
              description: "Cara mudah mengisi dan melaporkan SPT Tahunan dengan benar",
              date: "28 Feb 25, 15.00 - 17.00 WIB",
              location: "Pelatihan Online",
              price: "Gratis",
              status: "Terdahulu",
              bgColor: "bg-gray-900"
            },
            {
              title: "Strategi Optimalisasi Pajak Bisnis",
              description: "Tips dan trik mengoptimalkan kewajiban pajak perusahaan secara legal",
              date: "13 Feb 25, 13.00 - 15.00 WIB",
              location: "Pelatihan Online",
              price: "Gratis",
              status: "Terdahulu",
              bgColor: "bg-gray-900"
            },
            {
              title: "Pajak E-Commerce & Digital",
              description: "Panduan lengkap perpajakan untuk bisnis online dan e-commerce",
              date: "25 Mar 25, 10.00 - 13.00 WIB",
              location: "Pelatihan Online",
              price: "Gratis",
              status: "Tersedia",
              bgColor: "bg-blue-50"
            },
            {
              title: "Tax Planning untuk Korporat",
              description: "Strategi perencanaan pajak yang efektif untuk perusahaan",
              date: "30 Mar 25, 14.00 - 17.00 WIB",
              location: "Pelatihan Online",
              price: "Gratis",
              status: "Tersedia",
              bgColor: "bg-gray-900"
            },
            {
              title: "Audit Pajak & Compliance",
              description: "Memahami proses audit pajak dan cara mempersiapkannya",
              date: "5 Apr 25, 09.00 - 12.00 WIB",
              location: "Pelatihan Online",
              price: "Gratis",
              status: "Tersedia",
              bgColor: "bg-blue-50"
            }
          ].map((event, index) => (
            <div 
              key={index}
              className="relative"
            >
             
              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Image/Header Section */}
                <div className={`${event.bgColor} ${event.bgColor === 'bg-gray-900' ? 'text-white' : 'text-primary'} p-6 h-64 flex flex-col justify-between relative overflow-hidden`}>
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 border-4 border-current transform rotate-45"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-current transform -rotate-12"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.bgColor === 'bg-gray-900' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-primary text-white'
                      }`}>
                        JOIN INSIGHT
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold leading-tight">
                      {event.title}
                    </h3>
                  </div>

                  {/* Speaker/Info at bottom */}
                  <div className="relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold">Expert Speaker</p>
                        <p className="text-xs opacity-75">Konsultan Pajak</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-primary mb-4">
                    {event.title}
                  </h4>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                      event.status === 'Tersedia' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2 mb-4">
                    <p className="text-secondary text-sm">{event.date}</p>
                  </div>

                  {/* Location & Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-secondary text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <span className="inline-flex items-center text-green-600 font-semibold text-sm">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {event.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default LearningPage;