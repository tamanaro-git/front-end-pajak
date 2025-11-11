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

          <Route path="book" element={<BookPage />} />
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    // </Router>
  );
}

export default App;
