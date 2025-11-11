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
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />

          <Route path="books" element={<BookPage />} />
          <Route path="chapters/:bookId" element={<ChapterPage />} />
          <Route path="subchapters/:chapterId" element={<SubchapterPage />} />
          <Route path="subchapters/:chapterId/add" element={<AddSubchapter />} />
          <Route path="subchapters/:chapterId/edit/:subchapterId" element={<UpdateSubchapter />} />
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    // </Router>
  );
}

export default App;
