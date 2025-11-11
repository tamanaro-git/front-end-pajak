
const FooterSection = () => {
  const socialLinks = [
    { name: "YouTube", url: "#", icon: "youtube" },
    { name: "Instagram", url: "#", icon: "instagram" },
    { name: "TikTok", url: "#", icon: "tiktok" },
    { name: "Twitter/X", url: "#", icon: "twitter" },
    { name: "WhatsApp Channel", url: "#", icon: "whatsapp" },
    { name: "Telegram Group", url: "#", icon: "telegram" }
  ];

  return (
    <footer className="bg-primary-dark">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-dark to-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Kirim Pertanyaan Anda Melalui Sistem Tiket Kami
          </h2>
          <p className="text-neutral-light text-lg mb-8 max-w-3xl mx-auto">
            Tulis deskripsi dan unggah dokumen pendukung PDF. Kami akan membalas saat tersedia, 
            dan Anda dapat melacak statusnya di dashboard.
          </p>
          <button className="bg-neutral-light text-primary-dark px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl">
            Buat Tiket Pertanyaan
          </button>
        </div>
      </div>

      {/* Social Links & Copyright */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="text-white hover:text-yellow-400 transition-colors font-medium text-sm md:text-base"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 mb-8"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-neutral-light text-sm md:text-base">
              © 2025 Taxmin.id. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;