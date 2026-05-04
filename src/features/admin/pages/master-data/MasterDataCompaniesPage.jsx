import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { companyApi } from '../../../../api/companyApi';
import { categoryApi } from '../../../../api/categoryApi';

export default function MasterDataCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyAbbreviation: '',
    website: '',
    categoryId: '',
    subcategoryId: '',
  });
  const nameRef = useRef(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await companyApi.getCompanies({ limit: 200 });
      setCompanies(Array.isArray(data?.result?.result)
        ? data.result.result
        : Array.isArray(data?.result)
          ? data.result
          : []);
      setError(null);
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await categoryApi.getCategories('companies');
      setCategories(Array.isArray(cats?.result) ? cats.result : []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
  }, [fetchCompanies, fetchCategories]);

  const openModal = (company = null) => {
    const matchedCategory = company
      ? categories.find((cat) => cat.categoryName === company.categoryName)
      : null;
    const matchedSubcategory = matchedCategory?.subCategories?.find(
      (sub) => sub.subCategoryName === company?.subcategoryName
    );

    setModal(company ? 'edit' : 'create');
    setModalError(null);
    setFormData(company ? {
      companyId: company.companyId || company.id,
      companyName: company.companyName || '',
      companyAbbreviation: company.companyAbbreviation || '',
      website: company.website || '',
      categoryId: matchedCategory?.categoryId || '',
      subcategoryId: matchedSubcategory?.subCategoryId || '',
    } : {
      companyName: '',
      companyAbbreviation: '',
      website: '',
      categoryId: '',
      subcategoryId: '',
    });
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  const closeModal = () => {
    setModal(null);
    setModalError(null);
    setFormData({
      companyId: '',
      companyName: '',
      companyAbbreviation: '',
      website: '',
      categoryId: '',
      subcategoryId: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.companyName?.trim()) {
      setModalError('Company name is required');
      return;
    }
    if (!formData.companyAbbreviation?.trim()) {
      setModalError('Company abbreviation is required');
      return;
    }
    if (!formData.website?.trim()) {
      setModalError('Website is required');
      return;
    }
    if (!formData.subcategoryId) {
      setModalError('Subcategory is required');
      return;
    }

    setSubmitting(true);
    try {
      if (modal === 'create') {
        await companyApi.createCompany({
          companyName: formData.companyName,
          companyAbbreviation: formData.companyAbbreviation,
          website: formData.website,
          subcategoryId: Number(formData.subcategoryId),
        });
      } else if (modal === 'edit') {
        await companyApi.updateCompany(formData.companyId || formData.id, {
          companyName: formData.companyName,
          companyAbbreviation: formData.companyAbbreviation,
          website: formData.website,
          subcategoryId: Number(formData.subcategoryId),
        });
      }
      closeModal();
      await fetchCompanies();
    } catch (err) {
      const validationErrors = err.response?.data?.result?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length > 0) {
        setModalError(validationErrors.map((item) => `${item.field}: ${item.message}`).join('; '));
      } else {
        setModalError(err.response?.data?.message || 'Failed to save company');
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await companyApi.deleteCompany(companyId);
      await fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.companyAbbreviation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.subcategoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categories.find((cat) => String(cat.categoryId || cat.id) === String(formData.categoryId));
  const availableSubcategories = selectedCategory?.subCategories || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data — Companies</h1>
          <p className="text-gray-600">Manage company records</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Add Company
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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search companies..."
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
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Abbreviation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Subcategory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company.companyId || company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {company.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {company.companyAbbreviation || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {company.website || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {company.categoryName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {company.subcategoryName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {company.reviewCount ?? company.totalReviews ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(company)}
                          className="rounded p-1 text-blue-500 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(company.companyId || company.id)}
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
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No companies found
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
              {modal === 'create' ? 'Add Company' : 'Edit Company'}
            </h2>
            {modalError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {modalError}
              </div>
            )}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Abbreviation
                </label>
                <input
                  type="text"
                  value={formData.companyAbbreviation || ''}
                  onChange={(e) => setFormData({ ...formData, companyAbbreviation: e.target.value })}
                  placeholder="e.g., ABC"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website *
                </label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="e.g., https://company.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    categoryId: e.target.value,
                    subcategoryId: '',
                  })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId || cat.id} value={cat.categoryId || cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory *
                </label>
                <select
                  value={formData.subcategoryId || ''}
                  onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="">Select a subcategory</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub.subCategoryId || sub.id} value={sub.subCategoryId || sub.id}>
                      {sub.subCategoryName}
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
