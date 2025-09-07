import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faUser,
  faEye,
  faEnvelope,
  faShieldAlt,
  faSpinner,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { API } = useApp();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Fetch users error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const viewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 text-gray-600">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin h-12 w-12 mb-2"
        />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={fetchUsers}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.avatar}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="h-5 w-5 text-blue-600"
                              />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="mr-2 text-gray-400"
                        />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faShieldAlt}
                          className="mr-2 text-gray-400"
                        />
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewProfile(user)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black/90  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  User Profile
                </h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                {selectedUser.avatar ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover mb-4"
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="h-12 w-12 text-blue-600"
                    />
                  </div>
                )}
                <h4 className="text-lg font-semibold text-gray-900">
                  {selectedUser.name}
                </h4>
                <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <p className="text-sm">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedUser.role}
                    </span>
                  </p>
                </div>

                {selectedUser.bio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
