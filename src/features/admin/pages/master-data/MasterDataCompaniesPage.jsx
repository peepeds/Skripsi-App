import { useState, useEffect } from 'react';
import { getCompanies } from '../../../../api/companyApi';
import { getCategories } from '../../../../api/categoryApi';

export function MasterDataCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    fetchCompanies();
    fetchCategoryMap();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getCompanies({ limit: 200 });
      if (response.success) {
        setCompanies(response.result || []);
      } else {
        setError(response.message || 'Failed to fetch companies');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryMap = async () => {
    try {
      const res = await getCategories('companies');
      if (res && res.success) {
        const categories = res.result || [];
        const map = {};
        categories.forEach((cat) => {
          (cat.subCategories || []).forEach((sub) => {
            if (sub && sub.subCategoryName) map[sub.subCategoryName] = cat.categoryName;
          });
        });
        setCategoryMap(map);
      }
    } catch (err) {
      console.error('Failed to load categories for mapping', err);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const categoryName = categoryMap[company.subcategoryName] || company.categoryName || '';
    return (
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data — Companies</h1>
        <p className="text-gray-600">Manage company records</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Subcategory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Reviews
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
                    {categoryMap[company.subcategoryName] || company.categoryName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {company.subcategoryName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600">
                    {company.website ? (
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                        {company.website}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {company.totalReviews ?? company.reviewCount ?? 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
