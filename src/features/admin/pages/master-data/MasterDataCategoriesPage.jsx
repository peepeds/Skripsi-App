import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { categoryApi } from '../../../../api/categoryApi';

export default function MasterDataCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null); // 'create', 'edit', or null
  const [formData, setFormData] = useState({
    categoryName: '',
  });
  const nameRef = useRef(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getCategories(activeType);
      setCategories(Array.isArray(data?.result) ? data.result : []);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeType]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = useCallback((category = null) => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || '',
        categoryId: category.categoryId,
      });
      setModal('edit');
    } else {
      setFormData({
        categoryName: '',
      });
      setModal('create');
    }
    setTimeout(() => nameRef.current?.focus(), 0);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setFormData({
      categoryName: '',
    });
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (modal === 'create') {
        await categoryApi.createCategory({
          categoryName: formData.categoryName,
          type: activeType,
        });
      } else {
        await categoryApi.updateCategory(formData.categoryId, {
          categoryName: formData.categoryName,
          type: activeType,
        });
      }

      closeModal();
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await categoryApi.deleteCategory(categoryId, { isDeleted: true });
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data — Categories</h1>
          <p className="text-gray-600">Manage category records</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-sm hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveType('companies')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeType === 'companies'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Companies
        </button>
        <button
          onClick={() => setActiveType('jobs')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeType === 'jobs'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Jobs
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading ? (
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.categoryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {category.categoryName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {category.subCategories?.length > 0
                        ? category.subCategories.map((sub) => sub.subCategoryName).join(', ')
                        : 'No subcategories'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(category)}
                          className="rounded p-1 text-blue-500 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.categoryId)}
                          disabled={submitting}
                          className="rounded p-1 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">
              {modal === 'create' ? 'Add Category' : 'Edit Category'}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={formData.categoryName || ''}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  placeholder="Enter category name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
