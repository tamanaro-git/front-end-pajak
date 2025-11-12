// filepath: /home/zarif/Project/taxmin/front-end/src/pages/UnauthorizedPage.jsx
import { useNavigate } from 'react-router-dom';
import authUtils from '../utils/auth';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const userRole = authUtils.getRole();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-primary mb-2">
            Akses Ditolak
          </h1>

          {/* Message */}
          <p className="text-secondary mb-6">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
            {userRole && (
              <span className="block mt-2 text-sm">
                Role Anda: <strong className="text-primary">{userRole}</strong>
              </span>
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-semibold transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors"
            >
              Ke Beranda
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-4 text-sm text-secondary">
          Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;