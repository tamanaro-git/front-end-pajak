import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import authService from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  // Modal states
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    try {
      const response = await authService.googleLogin(credentialResponse.credential);
      
      if (response.status === 'success') {
        const user = authService.getCurrentUser();
        localStorage.setItem('role', user.role);
        
        if (user.role === 'user') {
          navigate('/admin/opinions');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login gagal. Silakan coba lagi.');
    } 
  };

  const handleGoogleError = () => {
    setError('Google login gagal. Silakan coba lagi.');
  };

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <img src="/images/pajax-biru.png" alt="Pajax Logo" className="mx-auto" width={120} />
          <h1 className="text-3xl font-bold text-primary mt-4 mb-2">Selamat Datang!</h1>
          <p className="text-secondary text-;lg">Masuk dengan akun Google Anda</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Google Login Button */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              size="large"
              width="100%"
              text="signin_with"
              theme="outline"
            />
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-semibold">Login Mudah & Aman</p>
                <p className="text-xs text-blue-700 mt-1">Gunakan akun Google Anda untuk akses cepat dan aman ke platform Taxmin</p>
              </div>
            </div>
          </div>

          {/* Terms and Privacy Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 mb-2">Dengan masuk, Anda menyetujui</p>
            <div className="flex justify-center space-x-4 text-xs">
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-primary hover:text-primary-dark underline transition-colors font-medium"
              >
                Syarat & Ketentuan
              </button>
              <span className="text-gray-400">dan</span>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-primary hover:text-primary-dark underline transition-colors font-medium"
              >
                Kebijakan Privasi
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-secondary">
          <p>© 2025 Taxmin.id. All rights reserved.</p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary">Kebijakan Privasi Pajax</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 mb-4">
                  Kebijakan Privasi ini menjelaskan bagaimana Pajax (www.pajax.id) mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami. Kami berkomitmen untuk menjaga keamanan data Anda.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">1. Informasi yang Kami Kumpulkan</h3>
                <p className="text-gray-700 mb-2">Untuk menyediakan layanan, kami dapat mengumpulkan beberapa jenis informasi:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li><strong>Informasi yang Anda Berikan:</strong> Data yang Anda masukkan secara sukarela saat mendaftar atau menggunakan fitur, seperti nama, alamat email, dan detail profil lainnya.</li>
                  <li><strong>Informasi yang Dikumpulkan Otomatis:</strong> Data teknis saat Anda mengakses situs, termasuk alamat IP, jenis peramban (browser), halaman yang dikunjungi, dan data yang dikumpulkan melalui cookies.</li>
                  <li><strong>Informasi Tambahan:</strong> Data yang mungkin diperlukan untuk fitur spesifik, seperti informasi untuk verifikasi identitas atau kebutuhan layanan perpajakan tertentu.</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">2. Tujuan Penggunaan Data</h3>
                <p className="text-gray-700 mb-2">Kami menggunakan informasi Anda untuk tujuan berikut:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Menyediakan, mengoperasikan, dan memelihara Layanan Pajax.</li>
                  <li>Meningkatkan, mempersonalisasi, dan mengembangkan fitur kami untuk pengalaman pengguna yang lebih baik.</li>
                  <li>Berkomunikasi dengan Anda, termasuk mengirimkan pembaruan layanan, informasi penting, atau materi pemasaran (dengan persetujuan Anda).</li>
                  <li>Memastikan keamanan dan integritas platform kami serta mencegah aktivitas ilegal.</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">3. Bagaimana Kami Mengelola Data</h3>
                <p className="text-gray-700 mb-2">Data Anda digunakan secara internal untuk:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Mengaktifkan fitur dan layanan yang Anda minta.</li>
                  <li>Menganalisis pola penggunaan untuk mengoptimalkan fungsionalitas situs.</li>
                  <li>Mematuhi kewajiban hukum yang berlaku yang mungkin mensyaratkan pemrosesan data Anda.</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">4. Pembagian Informasi dengan Pihak Ketiga</h3>
                <p className="text-gray-700 mb-2">Pajax tidak akan menjual data pribadi Anda kepada pihak mana pun.</p>
                <p className="text-gray-700 mb-2">Kami hanya membagikan informasi dalam situasi berikut:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Kepada penyedia layanan pihak ketiga yang membantu operasional kami (misalnya, penyedia hosting, pemrosesan pembayaran, dan alat analitik). Pihak ini terikat kontrak untuk menjaga kerahasiaan data Anda.</li>
                  <li>Jika diwajibkan oleh hukum, panggilan pengadilan, atau proses hukum yang sah dari otoritas yang berwenang.</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">5. Cookies dan Teknologi Pelacakan</h3>
                <p className="text-gray-700 mb-4">
                  Situs kami menggunakan cookies untuk meningkatkan fungsionalitas, menyimpan preferensi Anda, dan menganalisis lalu lintas situs. Anda memiliki kontrol untuk menerima atau menolak cookies melalui pengaturan peramban Anda. Namun, penolakan cookies dapat memengaruhi fungsi beberapa fitur di situs kami.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">6. Keamanan Data</h3>
                <p className="text-gray-700 mb-4">
                  Kami menerapkan langkah-langkah keamanan teknis, administratif, dan prosedural yang wajar untuk melindungi data Anda dari akses, pengungkapan, modifikasi, atau penghancuran yang tidak sah.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">7. Hak Anda atas Data Anda</h3>
                <p className="text-gray-700 mb-2">Anda memiliki hak penuh atas data pribadi Anda, termasuk:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Hak untuk mengakses data pribadi yang kami simpan tentang Anda.</li>
                  <li>Hak untuk meminta koreksi atau pembaruan atas data yang tidak akurat.</li>
                  <li>Hak untuk meminta pembatasan pemrosesan data Anda dalam kondisi tertentu.</li>
                  <li>Hak untuk berhenti berlangganan (opt-out) dari komunikasi pemasaran kapan saja.</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">8. Perubahan Kebijakan</h3>
                <p className="text-gray-700 mb-4">
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan pada praktik kami atau karena alasan hukum. Versi terbaru akan selalu dipublikasikan di situs ini. Kami akan memberi tahu Anda tentang perubahan signifikan melalui email atau notifikasi di situs.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">9. Hubungi Kami</h3>
                <p className="text-gray-700 mb-4">
                  Jika Anda memiliki pertanyaan mengenai kebijakan ini atau data pribadi Anda, silakan hubungi tim Pajax melalui saluran kontak resmi yang tersedia di www.pajax.id.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary">Syarat dan Ketentuan Pajax</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-bold text-primary mt-6 mb-3">1. Penerimaan Persyaratan</h3>
                <p className="text-gray-700 mb-4">
                  Selamat datang di Pajax. Dengan mengakses atau menggunakan situs www.pajax.id ("Layanan"), Anda setuju untuk terikat oleh Syarat dan Ketentuan ("Ketentuan") ini. Jika Anda tidak menyetujui Ketentuan ini, Anda tidak diperkenankan menggunakan Layanan.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">2. Layanan Berlangganan</h3>
                <p className="text-gray-700 mb-4">
                  Jika Pajax menawarkan layanan berbasis langganan, masa berlaku layanan Anda diatur oleh paket yang Anda pilih. Ketentuan mengenai perpanjangan, pembatalan, dan peningkatan paket akan diatur secara terpisah pada saat pembelian atau pendaftaran.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">3. Kewajiban Pengguna</h3>
                <p className="text-gray-700 mb-2">Sebagai pengguna, Anda setuju untuk:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Memberikan informasi yang akurat, terkini, dan lengkap saat pendaftaran dan selama menggunakan Layanan.</li>
                  <li>Menggunakan Layanan hanya untuk tujuan yang sah menurut hukum dan tidak melanggar hak pihak ketiga.</li>
                  <li>Menjaga kerahasiaan kata sandi (password) dan kredensial akun Anda, serta bertanggung jawab penuh atas semua aktivitas yang terjadi di bawah akun Anda.</li>
                  <li>Memastikan bahwa setiap konten atau data yang Anda unggah (upload) atau kirimkan adalah sah dan Anda memiliki hak penuh atas konten tersebut.</li>
                </ul>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">4. Penangguhan dan Penghentian Akun</h3>
                <p className="text-gray-700 mb-4">
                  Pajax berhak, atas kebijakannya sendiri, untuk menangguhkan, membatasi, atau menghentikan akun Anda jika Anda terbukti melanggar Ketentuan ini, melakukan aktivitas ilegal, atau tindak tanduk Anda membahayakan keamanan platform atau pengguna lain.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">5. Hak Kekayaan Intelektual</h3>
                <p className="text-gray-700 mb-4">
                  Seluruh materi di dalam Layanan, termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar, kode, dan perangkat lunak, adalah milik Pajax atau pemberi lisensinya, dan dilindungi oleh undang-undang hak cipta dan kekayaan intelektual yang berlaku. Dilarang keras mereproduksi, memodifikasi, atau mendistribusikan materi ini untuk tujuan komersial tanpa izin tertulis dari Pajax.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">6. Ketentuan Pembayaran dan Pengembalian Dana (Refund)</h3>
                <p className="text-gray-700 mb-4">
                  Untuk layanan berbayar, Anda setuju untuk membayar semua biaya yang berlaku sesuai dengan ketentuan penagihan yang ditetapkan. Pembayaran dianggap sah setelah terverifikasi. Kebijakan pengembalian dana (refund), jika ada, akan diatur oleh ketentuan spesifik yang ditetapkan oleh Pajax pada saat pembelian.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">7. Perubahan Layanan dan Ketentuan</h3>
                <p className="text-gray-700 mb-4">
                  Pajax berhak memodifikasi, menangguhkan, atau menghentikan bagian mana pun dari Layanan kapan saja, dengan atau tanpa pemberitahuan. Kami juga dapat mengubah Ketentuan ini secara berkala. Penggunaan Layanan secara terus-menerus setelah perubahan dipublikasikan merupakan penerimaan Anda terhadap Ketentuan yang telah diperbarui.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">8. Pembatasan Tanggung Jawab</h3>
                <p className="text-gray-700 mb-4">
                  Layanan Pajax disediakan "sebagaimana adanya" (as is) dan "sebagaimana tersedia" (as available). Kami berusaha memberikan informasi perpajakan yang akurat, namun kami tidak menjamin bahwa Layanan akan selalu bebas dari kesalahan (error), tanpa gangguan, atau sepenuhnya akurat. Pajax tidak bertanggung jawab atas kerugian langsung, tidak langsung, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan Layanan.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">9. Hukum yang Berlaku dan Penyelesaian Sengketa</h3>
                <p className="text-gray-700 mb-4">
                  Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia. Segala sengketa yang timbul dari Ketentuan ini akan diupayakan untuk diselesaikan secara musyawarah. Jika musyawarah gagal, sengketa akan diselesaikan melalui yurisdiksi pengadilan yang ditunjuk oleh Pajax.
                </p>

                <h3 className="text-lg font-bold text-primary mt-6 mb-3">10. Ketentuan Penutup</h3>
                <p className="text-gray-700 mb-4">
                  Ketentuan ini, bersama dengan Kebijakan Privasi, merupakan keseluruhan perjanjian antara Anda dan Pajax terkait penggunaan Layanan. Jika ada bagian dari Ketentuan ini yang dianggap tidak sah atau tidak dapat dilaksanakan, bagian tersebut akan dihapus dan bagian lainnya tetap berlaku penuh.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;