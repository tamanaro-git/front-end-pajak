import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { GoogleLogin } from '@react-oauth/google';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalAgreeTerms, setModalAgreeTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any parent form submission
    
    setError("");
    setSuccess("");
    
    if (password !== confirmPassword) {
      setError("Password tidak cocok!");
      return;
    }
    
    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan!");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter!");
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.register({
        fullName,
        email,
        password,
        role: 'user' // default role
      });

      if (response.status === 'success') {
        setSuccess('Registrasi berhasil! Mengalihkan ke dashboard...');
        
        // Auto redirect after successful registration
        setTimeout(() => {
         navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      
      if (response.status === 'success') {
        setSuccess('Registrasi berhasil! Mengalihkan ke dashboard...');
        
        setTimeout(() => {
          const user = authService.getCurrentUser();
          if (user?.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Google register gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google register gagal. Silakan coba lagi.');
  };

  const handleOpenTermsModal = (e) => {
    e.preventDefault();
    setModalAgreeTerms(agreeTerms);
    setShowTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
    setModalAgreeTerms(false);
  };

  const handleAcceptTerms = () => {
    setAgreeTerms(modalAgreeTerms);
    setShowTermsModal(false);
  };

  return (

    <div className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <img src="/images/pajax-biru.png" alt="Pajax Logo" className="mx-auto " width={120} />
          <p className="text-secondary text-lg">Buat Akun Baru</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}
         

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-primary mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="nama@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  placeholder="Ulangi password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
                required
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm text-secondary">
                Saya menyetujui{" "}
                <button
                  type="button"
                  onClick={handleOpenTermsModal}
                  className="font-semibold text-primary hover:text-primary-dark underline"
                >
                  Syarat & Ketentuan dan Kebijakan Privasi
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

           {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-secondary">Atau daftar dengan email</span>
            </div>
          </div>

                    {/* Google Register Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              size="large"
              width="100%"
              text="signup_with"
              theme="outline"
            />
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary">
              Sudah punya akun?{" "}
              <a href="/login" className="font-semibold text-primary hover:text-primary-dark">
                Masuk di sini
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-secondary">
          <p>© 2025 Taxmin.id. All rights reserved.</p>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-primary">Syarat & Ketentuan dan Kebijakan Privasi</h2>
              <button
                onClick={handleCloseTermsModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Kebijakan Privasi */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-4">Kebijakan Privasi Pajax</h3>
                <p className="text-secondary mb-4">
                  Kebijakan Privasi ini menjelaskan bagaimana Pajax (www.pajax.id) mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami. Kami berkomitmen untuk menjaga keamanan data Anda.
                </p>

                <h4 className="font-bold text-primary mb-2">1. Informasi yang Kami Kumpulkan</h4>
                <p className="text-secondary mb-3">Untuk menyediakan layanan, kami dapat mengumpulkan beberapa jenis informasi:</p>
                <ul className="list-disc list-inside text-secondary mb-4 space-y-2">
                  <li><strong>Informasi yang Anda Berikan:</strong> Data yang Anda masukkan secara sukarela saat mendaftar atau menggunakan fitur, seperti nama, alamat email, dan detail profil lainnya.</li>
                  <li><strong>Informasi yang Dikumpulkan Otomatis:</strong> Data teknis saat Anda mengakses situs, termasuk alamat IP, jenis peramban (browser), halaman yang dikunjungi, dan data yang dikumpulkan melalui cookies.</li>
                  <li><strong>Informasi Tambahan:</strong> Data yang mungkin diperlukan untuk fitur spesifik, seperti informasi untuk verifikasi identitas atau kebutuhan layanan perpajakan tertentu.</li>
                </ul>

                <h4 className="font-bold text-primary mb-2">2. Tujuan Penggunaan Data</h4>
                <p className="text-secondary mb-3">Kami menggunakan informasi Anda untuk tujuan berikut:</p>
                <ul className="list-disc list-inside text-secondary mb-4 space-y-2">
                  <li>Menyediakan, mengoperasikan, dan memelihara Layanan Pajax.</li>
                  <li>Meningkatkan, mempersonalisasi, dan mengembangkan fitur kami untuk pengalaman pengguna yang lebih baik.</li>
                  <li>Berkomunikasi dengan Anda, termasuk mengirimkan pembaruan layanan, informasi penting, atau materi pemasaran (dengan persetujuan Anda).</li>
                  <li>Memastikan keamanan dan integritas platform kami serta mencegah aktivitas ilegal.</li>
                </ul>

                <h4 className="font-bold text-primary mb-2">3. Bagaimana Kami Mengelola Data</h4>
                <p className="text-secondary mb-3">Data Anda digunakan secara internal untuk:</p>
                <ul className="list-disc list-inside text-secondary mb-4 space-y-2">
                  <li>Mengaktifkan fitur dan layanan yang Anda minta.</li>
                  <li>Menganalisis pola penggunaan untuk mengoptimalkan fungsionalitas situs.</li>
                  <li>Mematuhi kewajiban hukum yang berlaku yang mungkin mensyaratkan pemrosesan data Anda.</li>
                </ul>

                <h4 className="font-bold text-primary mb-2">4. Pembagian Informasi dengan Pihak Ketiga</h4>
                <p className="text-secondary mb-3">
                  Pajax tidak akan menjual data pribadi Anda kepada pihak mana pun. Kami hanya membagikan informasi dalam situasi berikut:
                </p>
                <ul className="list-disc list-inside text-secondary mb-4 space-y-2">
                  <li>Kepada penyedia layanan pihak ketiga yang membantu operasional kami (misalnya, penyedia hosting, pemrosesan pembayaran, dan alat analitik). Pihak ini terikat kontrak untuk menjaga kerahasiaan data Anda.</li>
                  <li>Jika diwajibkan oleh hukum, panggilan pengadilan, atau proses hukum yang sah dari otoritas yang berwenang.</li>
                </ul>

                <h4 className="font-bold text-primary mb-2">5. Cookies dan Teknologi Pelacakan</h4>
                <p className="text-secondary mb-4">
                  Situs kami menggunakan cookies untuk meningkatkan fungsionalitas, menyimpan preferensi Anda, dan menganalisis lalu lintas situs. Anda memiliki kontrol untuk menerima atau menolak cookies melalui pengaturan peramban Anda. Namun, penolakan cookies dapat memengaruhi fungsi beberapa fitur di situs kami.
                </p>

                <h4 className="font-bold text-primary mb-2">6. Keamanan Data</h4>
                <p className="text-secondary mb-4">
                  Kami menerapkan langkah-langkah keamanan teknis, administratif, dan prosedural yang wajar untuk melindungi data Anda dari akses, pengungkapan, modifikasi, atau penghancuran yang tidak sah.
                </p>

                <h4 className="font-bold text-primary mb-2">7. Hak Anda atas Data Anda</h4>
                <p className="text-secondary mb-3">Anda memiliki hak penuh atas data pribadi Anda, termasuk:</p>
                <ul className="list-disc list-inside text-secondary mb-4 space-y-2">
                  <li>Hak untuk mengakses data pribadi yang kami simpan tentang Anda.</li>
                  <li>Hak untuk meminta koreksi atau pembaruan atas data yang tidak akurat.</li>
                  <li>Hak untuk meminta pembatasan pemrosesan data Anda dalam kondisi tertentu.</li>
                  <li>Hak untuk berhenti berlangganan (opt-out) dari komunikasi pemasaran kapan saja.</li>
                </ul>

                <h4 className="font-bold text-primary mb-2">8. Perubahan Kebijakan</h4>
                <p className="text-secondary mb-4">
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan pada praktik kami atau karena alasan hukum. Versi terbaru akan selalu dipublikasikan di situs ini. Kami akan memberi tahu Anda tentang perubahan signifikan melalui email atau notifikasi di situs.
                </p>

                <h4 className="font-bold text-primary mb-2">9. Hubungi Kami</h4>
                <p className="text-secondary mb-4">
                  Jika Anda memiliki pertanyaan mengenai kebijakan ini atau data pribadi Anda, silakan hubungi tim Pajax melalui saluran kontak resmi yang tersedia di www.pajax.id.
                </p>
              </div>

              {/* Syarat dan Ketentuan */}
              <div className="mb-8 border-t pt-8">
                <h3 className="text-xl font-bold text-primary mb-4">Syarat dan Ketentuan Pajax</h3>

                <h4 className="font-bold text-primary mb-2">1. Penerimaan Persyaratan</h4>
                <p className="text-secondary mb-4">
                  Selamat datang di Pajax. Dengan mengakses atau menggunakan situs www.pajax.id ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan ("Ketentuan") ini. Jika Anda tidak menyetujui Ketentuan ini, Anda tidak diperkenankan menggunakan Layanan.
                </p>

                <h4 className="font-bold text-primary mb-2">2. Layanan Berlangganan</h4>
                <p className="text-secondary mb-4">
                  Jika Pajax menawarkan layanan berbasis langganan, masa berlaku layanan Anda diatur oleh paket yang Anda pilih. Ketentuan mengenai perpanjangan, pembatalan, dan peningkatan paket akan diatur secara terpisah pada saat pembelian atau pendaftaran.
                </p>

                <h4 className="font-bold text-primary mb-2">3. Kewajiban Pengguna</h4>
                <p className="text-secondary mb-3">Sebagai pengguna, Anda setuju untuk:</p>
                <ul className="list-disc list-inside text-secondary mb-4 space-y-2">
                  <li>Memberikan informasi yang akurat, terkini, dan lengkap saat pendaftaran dan selama menggunakan Layanan.</li>
                  <li>Menggunakan Layanan hanya untuk tujuan yang sah menurut hukum dan tidak melanggar hak pihak ketiga.</li>
                  <li>Menjaga kerahasiaan kata sandi (password) dan kredensial akun Anda, serta bertanggung jawab penuh atas semua aktivitas yang terjadi di bawah akun Anda.</li>
                  <li>Memastikan bahwa setiap konten atau data yang Anda unggah (upload) atau kirimkan adalah sah dan Anda memiliki hak penuh atas konten tersebut.</li>
                </ul>

                <h4 className="font-bold text-primary mb-2">4. Penangguhan dan Penghentian Akun</h4>
                <p className="text-secondary mb-4">
                  Pajax berhak, atas kebijakannya sendiri, untuk menangguhkan, membatasi, atau menghentikan akun Anda jika Anda terbukti melanggar Ketentuan ini, melakukan aktivitas ilegal, atau tindak tanduk Anda membahayakan keamanan platform atau pengguna lain.
                </p>

                <h4 className="font-bold text-primary mb-2">5. Hak Kekayaan Intelektual</h4>
                <p className="text-secondary mb-4">
                  Seluruh materi di dalam Layanan, termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar, kode, dan perangkat lunak, adalah milik Pajax atau pemberi lisensinya, dan dilindungi oleh undang-undang hak cipta dan kekayaan intelektual yang berlaku. Dilarang keras mereproduksi, memodifikasi, atau mendistribusikan materi ini untuk tujuan komersial tanpa izin tertulis dari Pajax.
                </p>

                <h4 className="font-bold text-primary mb-2">6. Ketentuan Pembayaran dan Pengembalian Dana (Refund)</h4>
                <p className="text-secondary mb-4">
                  Untuk layanan berbayar, Anda setuju untuk membayar semua biaya yang berlaku sesuai dengan ketentuan penagihan yang ditetapkan. Pembayaran dianggap sah setelah terverifikasi. Kebijakan pengembalian dana (refund), jika ada, akan diatur oleh ketentuan spesifik yang ditetapkan oleh Pajax pada saat pembelian.
                </p>

                <h4 className="font-bold text-primary mb-2">7. Perubahan Layanan dan Ketentuan</h4>
                <p className="text-secondary mb-4">
                  Pajax berhak memodifikasi, menangguhkan, atau menghentikan bagian mana pun dari Layanan kapan saja, dengan atau tanpa pemberitahuan. Kami juga dapat mengubah Ketentuan ini secara berkala. Penggunaan Layanan secara terus-menerus setelah perubahan dipublikasikan merupakan penerimaan Anda terhadap Ketentuan yang telah diperbarui.
                </p>

                <h4 className="font-bold text-primary mb-2">8. Pembatasan Tanggung Jawab</h4>
                <p className="text-secondary mb-4">
                  Layanan Pajax disediakan "sebagaimana adanya" (as is) dan "sebagaimana tersedia" (as available). Kami berusaha memberikan informasi perpajakan yang akurat, namun kami tidak menjamin bahwa Layanan akan selalu bebas dari kesalahan (error), tanpa gangguan, atau sepenuhnya akurat. Pajax tidak bertanggung jawab atas kerugian langsung, tidak langsung, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan.
                </p>

                <h4 className="font-bold text-primary mb-2">9. Hukum yang Berlaku dan Penyelesaian Sengketa</h4>
                <p className="text-secondary mb-4">
                  Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia. Segala sengketa yang timbul dari Ketentuan ini akan diupayakan untuk diselesaikan secara musyawarah. Jika musyawarah gagal, sengketa akan diselesaikan melalui yurisdiksi pengadilan yang ditunjuk oleh Pajax.
                </p>

                <h4 className="font-bold text-primary mb-2">10. Ketentuan Penutup</h4>
                <p className="text-secondary mb-4">
                  Ketentuan ini, bersama dengan Kebijakan Privasi, merupakan keseluruhan perjanjian antara Anda dan Pajax terkait penggunaan Layanan. Jika ada bagian dari Ketentuan ini yang dianggap tidak sah atau tidak dapat dilaksanakan, bagian tersebut akan dihapus dan bagian lainnya tetap berlaku penuh.
                </p>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  id="modalAgreeTerms"
                  checked={modalAgreeTerms}
                  onChange={(e) => setModalAgreeTerms(e.target.checked)}
                  className="w-5 h-5 mt-1 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="modalAgreeTerms" className="ml-3 text-sm font-semibold text-primary">
                  Saya telah membaca dan menyetujui Syarat & Ketentuan serta Kebijakan Privasi Pajax
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t">
              <button
                onClick={handleCloseTermsModal}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Tutup
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={!modalAgreeTerms}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Setuju & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;