import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load components
const HomePage = lazy(() => import('./pages/homePage'));
const LoginPage = lazy(() => import('./pages/authentication/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/authentication/RegistrationPage'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const NewsListPage = lazy(() => import('./pages/news/index'));
const NewsDetailPage = lazy(() => import('./pages/news/NewsDetailPage'));
const LearningPage = lazy(() => import('./pages/learning/index'));
const LearningDetailPage = lazy(() => import('./pages/learning/detail/index'));
const BookPage = lazy(() => import('./pages/admin/learning/BookPage'));
const ChapterPage = lazy(() => import('./pages/admin/learning/ChapterPage'));
const SubchapterPage = lazy(() => import('./pages/admin/learning/SubchapterPage'));
const AddSubchapter = lazy(() => import('./pages/admin/learning/AddSubchapter'));
const UpdateSubchapter = lazy(() => import('./pages/admin/learning/UpdateSubchapter'));
const SuperAdminPage = lazy(() => import('./pages/admin/management-user/SuperAdminPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const ManagementUserSuperAdmin = lazy(() => import('./pages/admin/management-user/SuperAdminPage'));
const NewsPage = lazy(() => import('./pages/admin/journalist/NewsPage'));
const AddNewsPage = lazy(() => import('./pages/admin/journalist/AddNewsPage'));
const UpdateNewsPage = lazy(() => import('./pages/admin/journalist/UpdateNewsPage'));
const ManagementUserAdminNews = lazy(() => import('./pages/admin/management-user/AdminNewsPage'));
const OpinionPage = lazy(() => import('./pages/admin/users/OpinionPage'));
const AddOpinionPage = lazy(() => import('./pages/admin/users/AddOpinionPage'));
const UpdateOpinionPage = lazy(() => import('./pages/admin/users/UpdateOpinionPage'));
const NewsVerificationPage = lazy(() => import('./pages/admin/editor/journalist/index'));
const OpinionVerificationPage = lazy(() => import('./pages/admin/editor/opinion/index'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
      <p className="text-primary font-semibold text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path='/news' element={<NewsListPage />} />
        <Route path='/news/:artikelId' element={<NewsDetailPage />} />
        <Route path='/learning' element={<LearningPage />} />
        <Route path='/learning/:id' element={
          <ProtectedRoute allowedRoles={['user']}>  
            <LearningDetailPage />
          </ProtectedRoute>
        } />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />

        {/* Admin Routes - Protected by Role */}
        <Route 
          path="/admin" 
          element={
            // <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <AdminLayout />
            // </ProtectedRoute>
          }
        >
          {/* Dashboard - Admin & Manager */}
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Super Admin Management - Admin only */}
          <Route 
            path="super-admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <SuperAdminPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Users Management - Admin only */}
          <Route 
            path="users" 
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <ManagementUserSuperAdmin />
              </ProtectedRoute>
            } 
          />

          <Route path="users-news" element={<ManagementUserAdminNews />} />

          {/* Learning Management - Admin & Manager */}
          <Route path="books" element={
            <ProtectedRoute allowedRoles={["admin-learning", "super-admin"]}>  
            <BookPage />
            </ProtectedRoute>
            } />
          <Route path="chapters/:bookId" element={<ChapterPage />} />
          <Route path="subchapters/:chapterId" element={<SubchapterPage />} />
          <Route path="subchapters/:chapterId/add" element={<AddSubchapter />} />
          <Route path="subchapters/:chapterId/edit/:subchapterId" element={<UpdateSubchapter />} />

          <Route path="news" element={<NewsPage />} />
          <Route path="news/add" element={<AddNewsPage />} />
          <Route path="news/edit/:artikelId" element={<UpdateNewsPage />} />

          {/* Opinion Management */}
          <Route path="opinions" element={<OpinionPage />} />
          <Route path="opinions/add" element={<AddOpinionPage />} />
          <Route path="opinions/edit/:id" element={<UpdateOpinionPage />} />

          <Route path='verifications/news' element={<NewsVerificationPage />} />
          <Route path='verifications/opinions' element={<OpinionVerificationPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
