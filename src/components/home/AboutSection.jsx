
const AboutSection = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Konsultasi Profesional"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Hemat Biaya & Waktu"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Laporan Lengkap"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Aman & Terpercaya"
    }
  ];

  return (
    <section className="bg-neutral-light py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - About */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-primary-dark font-semibold text-sm uppercase tracking-wide">
                Tentang Kami
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
              Taxmin.id Platform Jasa Konsultan Pajak
            </h2>
            
            <p className="text-secondary text-lg leading-relaxed">
              Taxmin.id adalah platform jasa konsultan pajak profesional yang membantu individu dan perusahaan 
              dalam mengelola kewajiban perpajakan dengan lebih mudah dan efisien.
            </p>
            
            <p className="text-secondary text-lg leading-relaxed">
              Kami menyediakan solusi lengkap mulai dari konsultasi, perencanaan pajak, hingga pelaporan 
              dengan didukung oleh tim ahli yang berpengalaman dan terpercaya.
            </p>

            <div className="pt-4">
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-medium transition-colors">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>

          {/* Right Content - Features */}
          <div>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;