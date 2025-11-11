
const LearningSection = () => {
  const learningEvents = [
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
    }
  ];

  return (
    <section className="bg-neutral-light py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-dark font-semibold text-sm uppercase tracking-wide">
            Program Edukasi
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mt-4 mb-4">
            Webinar & Pelatihan Pajak
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Tingkatkan pengetahuan pajak Anda melalui program edukasi dan pelatihan yang kami sediakan
          </p>
        </div>

        {/* Cards Grid - 3 Cards Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningEvents.map((event, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
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
                  <span className="inline-block px-4 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningSection;