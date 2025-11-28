
const FooterSection = () => {
  const socialLinks = [
    { name: "YouTube", url: "https://www.youtube.com/@pajaxid", icon: "youtube" },
    { name: "Instagram", url: "https://www.instagram.com/pajax.id/", icon: "instagram" },
    { name: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbBLv2I4o7qIaQtvjH02", icon: "whatsapp" },
  ];

  return (
    <footer className="bg-primary-dark">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-dark to-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ada pertanyaan yang perlu kami bantu? Silakan sampaikan detailnya di sini
          </h2>
          <p className="text-neutral-light text-lg mb-8 max-w-3xl mx-auto">
            Deskripsikan dengan detail dan lampirkan dokumen pendukung yang relevan. 
Anda dapat memantau status penanganannya secara langsung melalui dashboard
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
                target="_blank"
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