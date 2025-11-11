// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/_TemplateTablePage.jsx
// TEMPLATE: Copy file ini untuk halaman dengan table

import { useState } from "react";

const TemplateTablePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data - replace with your data
  const data = [
    { id: 1, name: "Item 1", status: "Active", date: "2025-01-15" },
    { id: 2, name: "Item 2", status: "Inactive", date: "2025-01-14" },
    { id: 3, name: "Item 3", status: "Active", date: "2025-01-13" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Table Page</h1>
          <p className="text-secondary mt-1">Manage your data</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          + Add New Item
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors">
              All
            </button>
            <button className="px-4 py-2 border-2 border-gray-300 text-secondary hover:border-primary hover:text-primary rounded-lg transition-colors">
              Active
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-neutral-light transition-colors">
                  <td className="px-6 py-4 font-semibold">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary">{item.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-primary hover:text-primary-dark font-semibold">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 font-semibold">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-semibold">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-secondary">
            Showing 1 to {data.length} of {data.length} entries
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-neutral-light">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-neutral-light">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateTablePage;