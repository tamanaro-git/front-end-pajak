// filepath: /home/zarif/Project/taxmin/front-end/src/pages/admin/_TemplateFormPage.jsx
// TEMPLATE: Copy file ini untuk halaman dengan form

import { useState } from "react";

const TemplateFormPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    status: "active"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Create New Item</h1>
        <p className="text-secondary mt-1">Fill in the form below</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-primary mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter title"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-primary mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter description"
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-primary mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select category</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
            </select>
          </div>

          {/* Status Radio */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-2 text-secondary">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-2 text-secondary">Inactive</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Save
            </button>
            <button
              type="button"
              className="px-8 py-3 border-2 border-gray-300 text-secondary hover:border-primary hover:text-primary font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateFormPage;