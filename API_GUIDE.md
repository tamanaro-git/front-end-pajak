# API Services Setup Guide

## 📁 Struktur Folder

```
src/services/
├── api.js                    # Axios instance dengan interceptors
├── authService.js            # Authentication services
├── userService.js            # User management services
├── newsService.js            # News/artikel services
├── learningService.js        # Learning/courses services
├── consultationService.js    # Consultation/ticket services
└── index.js                  # Central export
```

## 🚀 Setup Environment

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📝 Cara Menggunakan

### 1. Import Service

```jsx
import { authService, userService, newsService } from '@/services';
```

### 2. Contoh di Component (Login)

```jsx
import { useState } from 'react';
import { authService } from '@/services';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      console.log('Login success:', response);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

### 3. Contoh Fetch Data (Users List)

```jsx
import { useEffect, useState } from 'react';
import { userService } from '@/services';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

### 4. Contoh Create Data

```jsx
import { newsService } from '@/services';

const createNews = async (newsData) => {
  try {
    const response = await newsService.createNews({
      title: 'New Article',
      content: 'Article content...',
      category: 'Tax'
    });
    console.log('News created:', response);
  } catch (error) {
    console.error('Error creating news:', error);
  }
};
```

### 5. Contoh Upload File (Consultation)

```jsx
import { consultationService } from '@/services';

const submitConsultation = async (formData) => {
  const data = new FormData();
  data.append('title', 'Question about tax');
  data.append('description', 'My question is...');
  data.append('file', fileInput.files[0]);

  try {
    const response = await consultationService.createConsultation(data);
    console.log('Consultation created:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🔐 Authentication Flow

1. **Login**: Token disimpan di localStorage otomatis
2. **Request**: Token ditambahkan otomatis di header setiap request
3. **Logout**: Token dihapus dari localStorage
4. **Expired Token**: Auto redirect ke login page

## 📦 Available Services

### AuthService
- `login(credentials)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `getCurrentUser()` - Get current logged in user
- `isAuthenticated()` - Check if user logged in
- `forgotPassword(email)` - Send reset password email
- `resetPassword(token, newPassword)` - Reset password

### UserService
- `getAllUsers(params)` - Get all users with filters
- `getUserById(id)` - Get user detail
- `createUser(userData)` - Create new user
- `updateUser(id, userData)` - Update user
- `deleteUser(id)` - Delete user
- `getProfile()` - Get logged in user profile
- `updateProfile(userData)` - Update profile

### NewsService
- `getAllNews(params)` - Get all news
- `getNewsById(id)` - Get news detail
- `createNews(newsData)` - Create news
- `updateNews(id, newsData)` - Update news
- `deleteNews(id)` - Delete news
- `getFeaturedNews()` - Get featured news
- `searchNews(query)` - Search news

### LearningService
- `getAllCourses(params)` - Get all courses
- `getCourseById(id)` - Get course detail
- `enrollCourse(courseId)` - Enroll in course
- `getEnrolledCourses()` - Get user's courses
- `markSectionComplete(courseId, sectionId)` - Mark complete
- `getCourseProgress(courseId)` - Get progress
- `submitQuiz(courseId, quizId, answers)` - Submit quiz

### ConsultationService
- `getAllConsultations(params)` - Get all consultations
- `getConsultationById(id)` - Get detail
- `createConsultation(data)` - Create ticket
- `updateConsultationStatus(id, status)` - Update status
- `addReply(id, message)` - Add reply
- `getUserConsultations()` - Get user's consultations

## 🛠️ Custom Hooks (Optional)

Buat custom hooks untuk reusable logic:

```jsx
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '@/services';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

## 🔧 Error Handling

Semua service sudah handle error otomatis:
- 401: Auto redirect to login
- 403: Forbidden access
- 404: Not found
- 500: Server error

Error message tersedia di `error.response.data` atau `error.message`

---

**Setup API selesai! Tinggal sesuaikan endpoint dengan backend Anda.**