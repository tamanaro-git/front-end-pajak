const SectionComponent = () => {
  return (
    <section className="bg-primary-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Payment Gateway Indonesia Terlengkap untuk Bisnis Anda
            </h1>
            <p className="text-lg text-secondary mb-8">
              Bersama Midtrans, fokus pada bisnis Anda untuk kelola semua pembayaran.
            </p>
            <button className="bg-primary hover:bg-opacity-80 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Daftar Sekarang
            </button>
          </div>

          {/* Right Content - Laptop Image */}
          <div className="relative z-10">
            <div className="relative">
              {/* Decorative Polygon Background */}
              <div 
                className="absolute inset-0 bg-primary transform scale-110 -z-10"
                style={{
                  clipPath: 'polygon(30% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%, 0% 30%)',
                }}
              ></div>
              
              {/* Laptop Mockup Container with Polygon Shape */}
              <div 
                className="relative overflow-hidden p-4"
                style={{
                  clipPath: 'polygon(25% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%, 0% 25%)',
                }}
              >
                <img 
                  src="/images/foto_section.png" 
                  alt="Midtrans Dashboard" 
                  className="w-full h-auto"
                />
              </div>

              <div className="absolute top-1/2 -right-12 w-15 h-15 opacity-70">
                <svg viewBox="0 0 100 100" className="w-full h-full text-green-400">
                  <circle cx="50" cy="50" r="45" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Background */}
      <div className="relative">
        <svg viewBox="0 0 1440 118" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="#EEEEEE" 
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default SectionComponent;