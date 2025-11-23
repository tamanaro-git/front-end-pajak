import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import authService from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

          {/* Admin Login Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary text-sm">
              Admin?{" "}
              <a href="/login-admin" className="font-semibold text-primary hover:text-primary-dark">
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

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;