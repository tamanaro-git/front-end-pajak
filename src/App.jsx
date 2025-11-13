import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/authentication/LoginPage';
import RegistrationPage from './pages/authentication/RegistrationPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import NewsDetailPage from './pages/news/index';
import LearningPage from './pages/learning/index';
import LearningDetailPage from './pages/learning/detail/index';
import BookPage from './pages/admin/learning/BookPage';
import ChapterPage from './pages/admin/learning/ChapterPage';
import SubchapterPage from './pages/admin/learning/SubchapterPage';
import AddSubchapter from './pages/admin/learning/AddSubchapter';
import UpdateSubchapter from './pages/admin/learning/UpdateSubchapter';
import SuperAdminPage from './pages/admin/management-user/SuperAdminPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import ManagementUserSuperAdmin from './pages/admin/management-user/SuperAdminPage';
function App() {
  return (
    // <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path='/news' element={<NewsDetailPage />} />
        <Route path='/learning' element={<LearningPage />} />
        <Route path='/learning/:id' element={<LearningDetailPage />} />
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
        </Route>
      </Routes>
    // </Router>
  );
}

export default App;
