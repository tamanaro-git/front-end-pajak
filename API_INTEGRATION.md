# Frontend API Integration Documentation

## 📁 Struktur Services

```
src/services/
├── api.js              # Axios instance dengan interceptors
├── authService.js      # Authentication service
├── userService.js      # User management service
├── learningService.js  # Learning content service
├── newsService.js      # News/articles service
└── index.js            # Export all services
```

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install axios
# or
yarn add axios
```

### 2. Environment Variables

Create `.env` file in root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### 3. API Base Configuration (`api.js`)

Axios instance sudah dikonfigurasi dengan:
- Base URL dari environment variable
- Timeout 10 detik
- Auto add Bearer token ke headers
- Global error handling (401, 403, 500)
- Auto redirect ke login jika unauthorized

## 🔐 Authentication Service

### Register

```javascript
import authService from './services/authService';

// Register new user
const handleRegister = async () => {
  try {
    const response = await authService.register({
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user" // default: user, optional: admin
    });
    
    console.log(response);
    // {
    //   status: "success",
    //   data: {
    //     token: "jwt_token_here",
    //     user: { id, email, fullName, role }
    //   }
    // }
  } catch (error) {
    console.error(error.message);
  }
};
```

### Login

```javascript
// Regular login
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: "john@example.com",
      password: "password123"
    });
    
    // Token dan user otomatis disimpan ke localStorage
    const user = authService.getCurrentUser();
    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
};
```

### Google OAuth Login

```javascript
// Step 1: Get Google auth URL
const handleGoogleLogin = async () => {
  try {
    const response = await authService.getGoogleAuthUrl();
    
    if (response.status === 'success') {
      // Redirect user to Google OAuth page
      window.location.href = response.data.authUrl;
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Step 2: Handle callback (backend akan redirect dengan token di URL)
// Frontend akan menerima token dari URL params
```

### Logout

```javascript
const handleLogout = async () => {
  try {
    await authService.logout();
    // User data dan token otomatis dihapus dari localStorage
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error(error.message);
  }
};
```

### Check Authentication

```javascript
// Check if user is authenticated
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log('User logged in:', user);
} else {
  console.log('User not logged in');
}
```

### Forgot & Reset Password

```javascript
// Forgot password
const handleForgotPassword = async () => {
  try {
    const response = await authService.forgotPassword("john@example.com");
    console.log(response.message);
  } catch (error) {
    console.error(error.message);
  }
};

// Reset password
const handleResetPassword = async () => {
  try {
    const response = await authService.resetPassword(
      "reset_token_from_email",
      "new_password_123"
    );
    console.log(response.message);
  } catch (error) {
    console.error(error.message);
  }
};
```

## 📝 Contoh Implementasi di Component

### Login Page

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.status === 'success') {
        const user = authService.getCurrentUser();
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

### Registration Page

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'user'
      });

      if (response.status === 'success') {
        // Auto login setelah register
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

## 🔒 Protected Routes

```jsx
import { Navigate } from 'react-router-dom';
import authService from './services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authService.getCurrentUser();
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Usage in routes
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  } 
/>
```

## 📊 Response Format

Semua API response mengikuti format standar:

### Success Response
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "Full Name",
      "role": "user"
    }
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message here"
}
```

## 🚀 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/google` - Get Google OAuth URL
- `GET /auth/google/callback` - Handle Google callback
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

## 💡 Tips

1. **Token Management**: Token otomatis disimpan di localStorage dan ditambahkan ke setiap request
2. **Error Handling**: Error dari API otomatis di-handle oleh interceptor
3. **Auto Logout**: Jika token expired (401), user otomatis di-redirect ke login
4. **Type Safety**: Bisa ditambahkan TypeScript untuk type checking yang lebih baik

## 🔗 Next Steps

Tambahkan service lain sesuai kebutuhan:
- `userService.js` - untuk user management
- `learningService.js` - untuk learning content
- `newsService.js` - untuk news/articles
- `consultationService.js` - untuk consultation

Struktur yang sama bisa digunakan untuk semua service!