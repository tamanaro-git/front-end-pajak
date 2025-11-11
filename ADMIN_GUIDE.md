// filepath: /home/zarif/Project/taxmin/front-end/ADMIN_GUIDE.md
# Admin Dashboard Setup Guide

## 📁 Struktur Folder

```
src/
├── components/
│   └── admin/
│       ├── Navbar.jsx      # Top navigation bar
│       └── Sidebar.jsx     # Side navigation menu
├── layouts/
│   └── AdminLayout.jsx     # Main layout wrapper
└── pages/
    └── admin/
        ├── DashboardPage.jsx
        └── UsersPage.jsx
```

## 🚀 Cara Membuat Halaman Admin Baru

### Step 1: Buat File Page Baru

Buat file baru di `/src/pages/admin/`, contoh: `KonsultasiPage.jsx`

```jsx
const KonsultasiPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Konsultasi</h1>
          <p className="text-secondary mt-1">Kelola konsultasi pajak</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          + Tambah Konsultasi
        </button>
      </div>

      {/* Your Content Here */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <p>Content goes here...</p>
      </div>
    </div>
  );
};

export default KonsultasiPage;
```

### Step 2: Tambahkan Route di App.jsx

```jsx
// Import page
import KonsultasiPage from './pages/admin/KonsultasiPage';

// Tambahkan route di dalam AdminLayout
<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<DashboardPage />} />
  <Route path="users" element={<UsersPage />} />
  <Route path="konsultasi" element={<KonsultasiPage />} /> {/* New Route */}
</Route>
```

### Step 3: Update Menu di Sidebar.jsx (Optional)

Menu sudah otomatis tersedia di `Sidebar.jsx`. Jika ingin menambah menu baru:

```jsx
const menuItems = [
  // ...existing menu
  {
    title: "Menu Baru",
    icon: <svg>...</svg>,
    path: "/admin/menu-baru"
  }
];
```

## 🎨 Template Halaman

### Template Dasar
```jsx
const PageName = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Page Title</h1>
        <p className="text-secondary mt-1">Page Description</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Content */}
      </div>
    </div>
  );
};
```

### Template dengan Table
```jsx
const TablePage = () => {
  const data = [/* your data */];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Table Page</h1>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">
          + Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left">Column 1</th>
              <th className="px-6 py-4 text-left">Column 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-neutral-light">
                <td className="px-6 py-4">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### Template dengan Cards
```jsx
const CardsPage = () => {
  const cards = [/* your cards */];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Cards Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-primary mb-2">{card.title}</h3>
            <p className="text-secondary">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎨 Color Palette (Sudah Tersedia)

```css
--color-primary-dark: #0F044C  /* Deep purple/navy */
--color-primary: #141E61       /* Navy blue */
--color-secondary: #787A91     /* Gray purple */
--color-neutral-light: #EEEEEE /* Light gray */
```

Gunakan class Tailwind:
- `bg-primary-dark`
- `bg-primary`
- `text-secondary`
- `bg-neutral-light`

## 📱 Responsive Layout

Layout sudah responsive by default:
- **Mobile**: Sidebar hidden, toggle dengan hamburger menu
- **Desktop**: Sidebar always visible

## 🔧 Fitur yang Tersedia

1. **Sidebar Navigation**: Menu navigasi dengan submenu support
2. **Navbar**: Top bar dengan notifications dan profile
3. **Responsive**: Mobile-friendly dengan hamburger menu
4. **State Management**: Sidebar open/close state
5. **Active Menu**: Automatic active state berdasarkan URL

## 📝 Tips

1. Gunakan `space-y-6` untuk spacing antar section
2. Gunakan `bg-white rounded-xl shadow-md` untuk card
3. Button style: `bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg`
4. Semua halaman admin otomatis wrapped dengan AdminLayout

## 🌐 URL Structure

```
/                     -> Home Page
/login                -> Login Page
/register             -> Registration Page
/admin/dashboard      -> Admin Dashboard
/admin/users          -> Users Management
/admin/konsultasi     -> Konsultasi (example)
```

---

**Setup selesai! Anda sekarang bisa membuat halaman admin baru dengan mudah.**