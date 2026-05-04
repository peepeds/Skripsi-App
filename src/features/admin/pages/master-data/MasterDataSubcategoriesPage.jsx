import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { categoryApi } from '../../../../api/categoryApi';

export function MasterDataSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const nameRef = useRef(null);

  const fetchSubcategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getCategories({ type: activeType, IncludeSubCategories: 1 });
      const categoryList = Array.isArray(data?.result) ? data.result : [];
      setCategories(categoryList);
      const flattened = categoryList.flatMap((category) =>
        (category.subCategories || []).map((subcategory) => ({
          subCategoryId: subcategory.subCategoryId,
          subCategoryName: subcategory.subCategoryName,
          categoryId: category.categoryId,
          categoryName: category.categoryName,
        }))
      );
      setSubcategories(flattened);
      setError(null);
    } catch (err) {
      setError('Failed to load subcategories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeType]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const openModal = (subcategory = null) => {
    setModal(subcategory ? 'edit' : 'create');
    if (subcategory) {
      setFormData({ ...subcategory });
    } else {
      setFormData({ subCategoryName: '', categoryId: '' });
    }
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const closeModal = () => {
    setModal(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    if (!formData.subCategoryName?.trim()) {
      setError('Subcategory name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (modal === 'create') {
        await categoryApi.createSubCategory({
          subCategoryName: formData.subCategoryName,
          categoryId: Number(formData.categoryId),
        });
      } else if (modal === 'edit') {
        await categoryApi.updateSubCategory(formData.subCategoryId, {
          subCategoryName: formData.subCategoryName,
          categoryId: Number(formData.categoryId),
        });
      }
      closeModal();
      await fetchSubcategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subcategory');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await categoryApi.deleteSubCategory(subcategoryId);
      await fetchSubcategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subcategory');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.categoryId === categoryId || c.id === categoryId);
    return category?.categoryName || category?.name || '-';
  };

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.subCategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data — Subcategories</h1>
          <p className="text-gray-600">Manage subcategory records</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Add Subcategory
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
          placeholder="Search subcategories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Subcategory Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubcategories.length > 0 ? (
              filteredSubcategories.map((subcategory) => (
                <tr key={subcategory.subCategoryId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {subcategory.subCategoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {getCategoryName(subcategory.categoryId)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(subcategory)}
                        className="rounded p-1 text-blue-500 hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory.subCategoryId)}
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
                  No subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">
              {modal === 'create' ? 'Add Subcategory' : 'Edit Subcategory'}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={formData.subCategoryName || ''}
                  onChange={(e) => setFormData({ ...formData, subCategoryName: e.target.value })}
                  placeholder="Enter subcategory name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId || cat.id} value={cat.categoryId || cat.id}>
                      {cat.categoryName || cat.name}
                    </option>
                  ))}
                </select>
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