import { useState, useEffect } from 'react';
import { getCategories } from '../../../../api/categoryApi';

export function MasterDataSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubcategories();
  }, [activeType]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories(activeType);
      if (response.success) {
        const flattened = (response.result || []).flatMap((category) =>
          (category.subCategories || []).map((subcategory) => ({
            subcategoryId: subcategory.subCategoryId,
            subcategoryName: subcategory.subCategoryName,
            categoryName: category.categoryName,
          }))
        );
        setSubcategories(flattened);
      } else {
        setError(response.message || 'Failed to fetch subcategories');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.subcategoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data — Subcategories</h1>
        <p className="text-gray-600">Manage subcategory records</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubcategories.length > 0 ? (
              filteredSubcategories.map((subcategory) => (
                <tr key={subcategory.subcategoryId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {subcategory.subcategoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {subcategory.categoryName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No subcategories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}