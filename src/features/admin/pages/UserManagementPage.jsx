import { Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { userApi } from '../../../api/userApi';
import { useAuth } from '@/hooks/useAuth';

export default function UserManagementPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState(null); // 'create', 'edit', or null
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const nameRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getUsers();
      setUsers(Array.isArray(data?.result) ? data.result : []);
      setError(null);
    } catch (err) {
      setUsers([]);
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchUsers();
    }
  }, [authLoading, isAdmin, fetchUsers]);

  if (authLoading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const openModal = useCallback((user = null) => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '', // Don't pre-fill password for security
        role: user.role || 'USER',
        userId: user.userId,
      });
      setModal('edit');
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'USER',
      });
      setModal('create');
    }
    setTimeout(() => nameRef.current?.focus(), 0);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER',
    });
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (modal === 'create' && !formData.password.trim()) {
      setError('Password is required for new users');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (modal === 'create') {
        await userApi.createUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      } else {
        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password.trim()) {
          updatePayload.password = formData.password;
        }
        await userApi.updateUser(formData.userId, updatePayload);
      }

      closeModal();
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await userApi.deleteUser(userId, { isDeleted: true });
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + Add User
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
          placeholder="Search users..."
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role?.toLowerCase() === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="rounded p-1 text-blue-500 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found
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
              {modal === 'create' ? 'Add User' : 'Edit User'}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {modal === 'create' ? '*' : '(Leave empty to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={modal === 'create' ? 'Enter password' : 'Leave empty to keep current'}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role || 'USER'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
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
