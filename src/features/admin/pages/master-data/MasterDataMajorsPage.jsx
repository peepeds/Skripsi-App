import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { majorApi } from '../../../../api/majorApi';
import { departmentApi } from '../../../../api/departmentApi';
import { regionApi } from '../../../../api/regionApi';

export default function MasterDataMajorsPage() {
  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null); // 'create', 'edit', or null
  const [formData, setFormData] = useState({
    majorName: '',
    deptId: '',
    regionId: '',
  });
  const nameRef = useRef(null);

  const fetchMajors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await majorApi.getMajors();
      setMajors(Array.isArray(data?.result) ? data.result : []);
      setError(null);
    } catch (err) {
      setError('Failed to load majors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await departmentApi.getDepartments();
      setDepartments(data?.result || data || []);
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  }, []);

  const fetchRegions = useCallback(async () => {
    try {
      const data = await regionApi.getRegions();
      setRegions(data?.result || data || []);
    } catch (err) {
      console.error('Failed to load regions', err);
    }
  }, []);

  useEffect(() => {
    fetchMajors();
    fetchDepartments();
    fetchRegions();
  }, [fetchMajors, fetchDepartments, fetchRegions]);

  const openModal = (major = null) => {
    if (major) {
      setFormData({
        majorName: major.majorName || '',
        deptId: major.deptId || major.departmentId || '',
        regionId: major.regionId || '',
        majorId: major.majorId,
      });
      setModal('edit');
    } else {
      setFormData({
        majorName: '',
        deptId: '',
        regionId: '',
      });
      setModal('create');
    }
    setTimeout(() => nameRef.current?.focus(), 0);
  };

  const closeModal = () => {
    setModal(null);
    setFormData({
      majorName: '',
      deptId: '',
      regionId: '',
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.majorName?.trim()) {
      setError('Major name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (modal === 'create') {
        await majorApi.createMajor({
          majorName: formData.majorName,
          deptId: Number(formData.deptId),
          regionId: Number(formData.regionId),
        });
      } else {
        await majorApi.updateMajor(formData.majorId, {
          majorName: formData.majorName,
          deptId: Number(formData.deptId),
          regionId: Number(formData.regionId),
        });
      }

      closeModal();
      await fetchMajors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save major');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (majorId) => {
    if (!window.confirm('Are you sure you want to delete this major?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await majorApi.deleteMajor(majorId, { isDeleted: true });
      await fetchMajors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete major');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMajors = majors.filter(
    (major) =>
      major.majorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      major.deptName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Master Data — Majors</h1>
          <p className="text-gray-600">Manage academic major records</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Add Major
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
          placeholder="Search majors..."
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
                  Major Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMajors.length > 0 ? (
                filteredMajors.map((major) => (
                  <tr key={major.majorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {major.majorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {major.deptName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {major.regionName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(major)}
                          className="rounded p-1 text-blue-500 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(major.majorId)}
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
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No majors found
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
              {modal === 'create' ? 'Add Major' : 'Edit Major'}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={formData.majorName || ''}
                  onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                  placeholder="Enter major name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.deptId || ''}
                  onChange={(e) => setFormData({ ...formData, deptId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.deptId} value={dept.deptId}>
                      {dept.deptName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={formData.regionId || ''}
                  onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="">Select a region</option>
                  {regions.map((region) => (
                    <option key={region.regionId} value={region.regionId}>
                      {region.regionName}
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
