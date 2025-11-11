# 📚 Book CRUD API Documentation

## Overview
Complete CRUD operations for Books management with authentication and role-based access control.

---

## Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/books` | ❌ | Public | Get all books with pagination |
| GET | `/api/books/:id` | ❌ | Public | Get book by ID with chapters |
| POST | `/api/books` | ✅ | Admin, Manager | Create new book |
| PUT | `/api/books/:id` | ✅ | Admin, Manager | Update book |
| DELETE | `/api/books/:id` | ✅ | Admin | Delete book (cascade) |

---

## API Details

### 1. GET /api/books - Get All Books

Get list of all books with pagination and search functionality.

**Authentication**: Not required  
**Role**: Public access

**Query Parameters**:
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page  
- `search` (string, optional) - Search by title, author, or description

**Request Example**:
```bash
# Get all books (page 1, 10 items)
curl -X GET "http://localhost:3000/api/books"

# Get with pagination
curl -X GET "http://localhost:3000/api/books?page=2&limit=20"

# Search books
curl -X GET "http://localhost:3000/api/books?search=pajak"

# Combined
curl -X GET "http://localhost:3000/api/books?page=1&limit=10&search=pajak"
```

**Success Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": 1,
        "title": "Panduan Pajak Indonesia 2024",
        "description": "Buku panduan lengkap perpajakan untuk individu dan UMKM",
        "author": "Tim Pajak Indonesia",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "chapters": [
          {
            "id": 1,
            "title": "Bab 1: Pengenalan Pajak",
            "orderIndex": 1
          },
          {
            "id": 2,
            "title": "Bab 2: Jenis-jenis Pajak",
            "orderIndex": 2
          }
        ]
      },
      {
        "id": 2,
        "title": "SPT Tahunan untuk Pemula",
        "description": "Panduan mengisi SPT Tahunan dengan mudah",
        "author": "John Doe",
        "createdAt": "2024-01-16T08:00:00.000Z",
        "updatedAt": "2024-01-16T08:00:00.000Z",
        "chapters": []
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

**Frontend Implementation**:
```javascript
const fetchBooks = async (page = 1, search = '') => {
  try {
    const response = await bookService.getAllBooks({
      page,
      limit: 10,
      search
    });
    
    if (response.status === 'success') {
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

### 2. GET /api/books/:id - Get Book by ID

Get detailed information of a specific book including all chapters.

**Authentication**: Not required  
**Role**: Public access

**URL Parameters**:
- `id` (number, required) - Book ID

**Request Example**:
```bash
curl -X GET "http://localhost:3000/api/books/1"
```

**Success Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Panduan Pajak Indonesia 2024",
    "description": "Buku panduan lengkap perpajakan untuk individu dan UMKM",
    "author": "Tim Pajak Indonesia",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "chapters": [
      {
        "id": 1,
        "bookId": 1,
        "title": "Bab 1: Pengenalan Pajak",
        "content": "Pajak adalah kontribusi wajib kepada negara...",
        "orderIndex": 1,
        "createdAt": "2024-01-15T10:35:00.000Z",
        "updatedAt": "2024-01-15T10:35:00.000Z",
        "subchapters": [
          {
            "id": 1,
            "title": "1.1 Definisi Pajak",
            "content": "...",
            "orderIndex": 1
          }
        ]
      }
    ]
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "status": "error",
  "message": "Book not found"
}
```

**Frontend Implementation**:
```javascript
const getBookDetail = async (bookId) => {
  try {
    const response = await bookService.getBookById(bookId);
    
    if (response.status === 'success') {
      setBook(response.data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

---

### 3. POST /api/books - Create Book

Create a new book. Requires authentication with Admin or Manager role.

**Authentication**: Required (Bearer Token)  
**Role**: Admin, Manager

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Panduan Pajak Indonesia 2024",
  "description": "Buku panduan lengkap perpajakan untuk individu dan UMKM",
  "author": "Tim Pajak Indonesia"
}
```

**Validation Rules**:
- `title` (string, required, max: 255) - Book title (unique)
- `description` (string, optional, text) - Book description
- `author` (string, optional, max: 255) - Author name

**Request Example**:
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Panduan Pajak Indonesia 2024",
    "description": "Buku panduan lengkap perpajakan",
    "author": "Tim Pajak Indonesia"
  }'
```

**Success Response** (201 Created):
```json
{
  "status": "success",
  "message": "Book created successfully",
  "data": {
    "id": 1,
    "title": "Panduan Pajak Indonesia 2024",
    "description": "Buku panduan lengkap perpajakan",
    "author": "Tim Pajak Indonesia",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

**400 Bad Request** (Validation Error):
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**401 Unauthorized** (No token):
```json
{
  "status": "error",
  "message": "No token provided"
}
```

**403 Forbidden** (Wrong role):
```json
{
  "status": "error",
  "message": "Access denied. Admin or Manager role required"
}
```

**409 Conflict** (Duplicate title):
```json
{
  "status": "error",
  "message": "Book with this title already exists"
}
```

**Frontend Implementation**:
```javascript
const createBook = async (formData) => {
  try {
    const response = await bookService.createBook(formData);
    
    if (response.status === 'success') {
      showNotification('success', 'Buku berhasil ditambahkan!');
      fetchBooks(); // Refresh list
    }
  } catch (error) {
    showNotification('error', error.message);
  }
};
```

---

### 4. PUT /api/books/:id - Update Book

Update an existing book. Requires authentication with Admin or Manager role.

**Authentication**: Required (Bearer Token)  
**Role**: Admin, Manager

**URL Parameters**:
- `id` (number, required) - Book ID

**Headers**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "title": "Panduan Pajak Indonesia 2024 (Updated)",
  "description": "Buku panduan lengkap perpajakan - Edisi Terbaru",
  "author": "Tim Pajak Indonesia"
}
```

**Note**: Only provided fields will be updated. Omitted fields remain unchanged.

**Request Example**:
```bash
# Update title only
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Panduan Pajak Indonesia 2024 (Updated)"
  }'

# Update all fields
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "Panduan Pajak Indonesia 2024 (Updated)",
    "description": "Buku panduan lengkap perpajakan - Edisi Terbaru",
    "author": "Tim Pajak Indonesia"
  }'
```

**Success Response** (200 OK):
```json
{
  "status": "success",
  "message": "Book updated successfully",
  "data": {
    "id": 1,
    "title": "Panduan Pajak Indonesia 2024 (Updated)",
    "description": "Buku panduan lengkap perpajakan - Edisi Terbaru",
    "author": "Tim Pajak Indonesia",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "status": "error",
  "message": "Book not found"
}
```

**409 Conflict** (Duplicate title):
```json
{
  "status": "error",
  "message": "Book with this title already exists"
}
```

**Frontend Implementation**:
```javascript
const updateBook = async (bookId, formData) => {
  try {
    const response = await bookService.updateBook(bookId, formData);
    
    if (response.status === 'success') {
      showNotification('success', 'Buku berhasil diupdate!');
      fetchBooks(); // Refresh list
    }
  } catch (error) {
    showNotification('error', error.message);
  }
};
```

---

### 5. DELETE /api/books/:id - Delete Book

Delete a book and all its related chapters and subchapters (cascade delete). Requires Admin role.

**Authentication**: Required (Bearer Token)  
**Role**: Admin only

**URL Parameters**:
- `id` (number, required) - Book ID

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**⚠️ Warning**: This action will delete:
- The book
- All chapters of the book
- All subchapters of those chapters
- This action **cannot be undone**

**Request Example**:
```bash
curl -X DELETE http://localhost:3000/api/books/1 \
  -H "Authorization: Bearer {token}"
```

**Success Response** (200 OK):
```json
{
  "status": "success",
  "message": "Book deleted successfully"
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "status": "error",
  "message": "Book not found"
}
```

**403 Forbidden** (Not Admin):
```json
{
  "status": "error",
  "message": "Access denied. Admin role required"
}
```

**Frontend Implementation**:
```javascript
const deleteBook = async (bookId) => {
  try {
    const response = await bookService.deleteBook(bookId);
    
    if (response.status === 'success') {
      showNotification('success', 'Buku berhasil dihapus!');
      fetchBooks(); // Refresh list
    }
  } catch (error) {
    showNotification('error', error.message);
  }
};
```

---

## Frontend Integration Examples

### Complete Book Management Component

```javascript
import { useState, useEffect } from "react";
import bookService from "../services/bookService";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  // Fetch books
  const fetchBooks = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks({ page, limit: 10, search });
      if (response.status === 'success') {
        setBooks(response.data.books);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create book
  const createBook = async (formData) => {
    try {
      const response = await bookService.createBook(formData);
      if (response.status === 'success') {
        showNotification("success", "Buku berhasil ditambahkan!");
        fetchBooks();
      }
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  // Update book
  const updateBook = async (id, formData) => {
    try {
      const response = await bookService.updateBook(id, formData);
      if (response.status === 'success') {
        showNotification("success", "Buku berhasil diupdate!");
        fetchBooks();
      }
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    
    try {
      const response = await bookService.deleteBook(id);
      if (response.status === 'success') {
        showNotification("success", "Buku berhasil dihapus!");
        fetchBooks();
      }
    } catch (error) {
      showNotification("error", error.message);
    }
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Your UI here */}
    </div>
  );
};
```

---

## Database Schema

### Books Table
```sql
CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  author VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Relationships
```
books (1) -> (N) chapters (1) -> (N) subchapters
```

When deleting a book:
1. All chapters are deleted (ON DELETE CASCADE)
2. All subchapters are deleted (ON DELETE CASCADE)

---

## Testing with cURL

### Complete Test Flow

```bash
# 1. Get all books
curl -X GET "http://localhost:3000/api/books"

# 2. Create a book (requires token)
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Book",
    "description": "Test Description",
    "author": "Test Author"
  }'

# 3. Get book by ID
curl -X GET "http://localhost:3000/api/books/1"

# 4. Update book (requires token)
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Test Book"
  }'

# 5. Search books
curl -X GET "http://localhost:3000/api/books?search=test"

# 6. Delete book (requires admin token)
curl -X DELETE http://localhost:3000/api/books/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Error Codes Summary

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid input |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (role) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., title exists) |
| 500 | Internal Server Error | Server error |

---

## Best Practices

### 1. Always Handle Errors
```javascript
try {
  const response = await bookService.createBook(data);
  // Handle success
} catch (error) {
  // Handle error
  console.error(error.message);
}
```

### 2. Show User Feedback
```javascript
showNotification('success', 'Operasi berhasil!');
showNotification('error', 'Terjadi kesalahan!');
```

### 3. Validate Before Submit
```javascript
if (!formData.title || formData.title.length > 255) {
  setError('Title harus diisi dan maksimal 255 karakter');
  return;
}
```

### 4. Refresh Data After Changes
```javascript
await bookService.createBook(data);
fetchBooks(); // Reload list
```

### 5. Use Loading States
```javascript
setLoading(true);
try {
  await bookService.createBook(data);
} finally {
  setLoading(false);
}
```

---

## Summary

✅ **CRUD Complete**: Create, Read, Update, Delete  
✅ **Authentication**: JWT token-based  
✅ **Authorization**: Role-based access control  
✅ **Pagination**: Efficient data loading  
✅ **Search**: Filter by title, author, description  
✅ **Cascade Delete**: Clean related data  
✅ **Error Handling**: Comprehensive error responses  
✅ **Frontend Ready**: Service & UI implemented  

Perfect for production use! 🚀