// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/_TemplateBasicPage.jsx
// TEMPLATE: Copy file ini untuk membuat halaman admin baru

const TemplateBasicPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Page Title</h1>
          <p className="text-secondary mt-1">Page description here</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
          + Add New
        </button>
      </div>

      {/* Stats Cards (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">Total Items</p>
              <p className="text-3xl font-bold text-primary">123</p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Content Section</h2>
        <p className="text-secondary">Your content goes here...</p>
      </div>
    </div>
  );
};

export default TemplateBasicPage;