import { useState, useEffect } from "react";
import authService from "../../../services/authService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const getRoleBadgeColor = (role) => {
    const roleColors = {
      'super-admin': 'bg-purple-100 text-purple-800 border-purple-300',
      'admin-learning': 'bg-blue-100 text-blue-800 border-blue-300',
      'admin-news': 'bg-green-100 text-green-800 border-green-300',
      'editor': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'journalist': 'bg-orange-100 text-orange-800 border-orange-300',
      'user': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-secondary mt-1">Kelola informasi profil dan keamanan akun Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white text-4xl font-bold">{getUserInitials()}</span>
              </div>
              <h2 className="text-2xl font-bold text-primary text-center">{user?.fullName}</h2>
              <p className="text-secondary text-sm mt-1">{user?.email}</p>
              
              {/* Role Badge */}
              {user?.role && (
                <span className={`mt-3 px-4 py-2 rounded-full text-sm font-bold border-2 ${getRoleBadgeColor(user.role)}`}>
                  {user.role.replace('-', ' ').toUpperCase()}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Status</span>
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600">Active</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Member Since</span>
                <span className="text-sm font-semibold text-primary">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">User ID</span>
                <span className="text-sm font-mono font-semibold text-primary">#{user?.id}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Profile Details & Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary">Personal Information</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-secondary mb-1">Full Name</label>
                  <p className="text-primary font-semibold">{user?.fullName || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-secondary mb-1">Email Address</label>
                  <p className="text-primary font-semibold">{user?.email || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-secondary mb-1">Role</label>
                  <p className="text-primary font-semibold capitalize">{user?.role?.replace('-', ' ') || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-xs font-semibold text-secondary mb-1">Account Status</label>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-600 font-semibold">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-primary mb-2">Security Tips</h4>
                <ul className="text-sm text-secondary space-y-2">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Gunakan password yang kuat (minimal 8 karakter)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Jangan bagikan password Anda kepada siapapun</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Logout jika menggunakan komputer umum</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;