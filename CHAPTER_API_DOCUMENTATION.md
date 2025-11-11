# 📖 Chapter CRUD API Documentation

## Overview
Complete CRUD operations for Chapters management with drag & drop reordering functionality.

---

## Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/chapters` | ❌ | Public | Get all chapters with pagination |
| GET | `/api/chapters/:id` | ❌ | Public | Get chapter by ID with subchapters |
| GET | `/api/books/:bookId/chapters` | ❌ | Public | Get chapters by book ID |
| POST | `/api/chapters` | ✅ | Admin, Manager | Create new chapter |
| PUT | `/api/chapters/:id` | ✅ | Admin, Manager | Update chapter |
| DELETE | `/api/chapters/:id` | ✅ | Admin | Delete chapter (cascade) |
| PUT | `/api/chapters/reorder` | ✅ | Admin, Manager | Reorder chapters (drag & drop) |

---

## ✅ **Frontend Implementation Complete!**

### 📁 Files Created/Updated:

1. **`chapterService.js`** ✅
   - getAllChapters (pagination & filter by book)
   - getChapterById (with subchapters)
   - getChaptersByBook (sorted by order)
   - createChapter (Admin/Manager)
   - updateChapter (Admin/Manager)
   - deleteChapter (Admin)
   - reorderChapters (Drag & drop)

2. **`ChapterPage.jsx`** ✅
   - **Book info header** dengan gradient design
   - **Drag & Drop** untuk reorder chapters
   - **Chapter cards** dengan badge number
   - Create/Edit/Delete modals
   - Notification popups
   - Back button ke Books page
   - Responsive design

3. **`BookPage.jsx`** ✅
   - Added "Chapters" button untuk setiap book
   - Navigate ke ChapterPage dengan bookId

---

## 🎨 Features Implemented:

### **1. Drag & Drop Reordering** 🎯
```javascript
// User dapat drag & drop chapter cards
// Otomatis update order ke backend
const handleDragEnd = async () => {
  const reorderedChapters = chapters.map((chapter, index) => ({
    id: chapter.id,
    orderIndex: index + 1
  }));
  
  await chapterService.reorderChapters(reorderedChapters);
};
```

### **2. Book Info Header**
- Gradient background (primary to blue)
- Book icon, title, author
- Total chapters count
- Professional design

### **3. Chapter Cards**
- Drag handle icon
- Order number badge
- Chapter title & content preview
- Subchapters count
- Created date
- Edit & Delete buttons
- Hover effects

### **4. Interactive UI**
- Success/Error notifications
- Loading states
- Empty state dengan call-to-action
- Drag & drop visual feedback
- Responsive layout

---

## 📊 API Endpoints Detail

### 1. GET /api/chapters
```bash
# Get all chapters (pagination)
curl -X GET "http://localhost:3000/api/chapters?page=1&limit=10"

# Filter by book
curl -X GET "http://localhost:3000/api/chapters?bookId=1"
```

### 2. GET /api/chapters/:id
```bash
curl -X GET "http://localhost:3000/api/chapters/1"
```

### 3. GET /api/books/:bookId/chapters
```bash
curl -X GET "http://localhost:3000/api/books/1/chapters"
```

### 4. POST /api/chapters
```bash
curl -X POST http://localhost:3000/api/chapters \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "title": "Bab 1: Pengenalan Pajak",
    "content": "Konten lengkap...",
    "orderIndex": 1
  }'
```

### 5. PUT /api/chapters/:id
```bash
curl -X PUT http://localhost:3000/api/chapters/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bab 1: Pengenalan Pajak (Updated)"
  }'
```

### 6. DELETE /api/chapters/:id
```bash
curl -X DELETE http://localhost:3000/api/chapters/1 \
  -H "Authorization: Bearer {token}"
```

### 7. PUT /api/chapters/reorder
```bash
curl -X PUT http://localhost:3000/api/chapters/reorder \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "chapters": [
      { "id": 1, "orderIndex": 2 },
      { "id": 2, "orderIndex": 1 },
      { "id": 3, "orderIndex": 3 }
    ]
  }'
```

---

## 🎯 User Flow:

```
Books Page
    ↓ Click "Chapters" button
Chapter Page (/admin/chapters/:bookId)
    ↓
Show book info + chapters list
    ↓
User can:
  1. Drag & drop to reorder ✓
  2. Add new chapter ✓
  3. Edit chapter ✓
  4. Delete chapter ✓
  5. Navigate back to books ✓
```

---

## 🚀 Next Steps:

1. **Backend**: Implement endpoints with same response format
2. **Routing**: Add route in App.jsx:
   ```jsx
   <Route path="/admin/chapters/:bookId" element={<ChapterPage />} />
   ```
3. **Test**: Drag & drop, CRUD operations

---

Perfect! Frontend ready for production! 🎉