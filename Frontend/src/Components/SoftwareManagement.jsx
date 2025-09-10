import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faDesktop,
  faCode,
  faGamepad,
  faFileAlt,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const SoftwareManagement = ({ computerId, role }) => {
  const { API } = useApp();
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSoftware, setEditingSoftware] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    category: "",
    description: "",
    vendor: "",
    install_date: "",
    is_licensed: false,
  });

  const fetchSoftware = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);

      const { data } = await API.get(
        `/computers/${computerId}/software?${params.toString()}`
      );
      if (data.success) {
        setSoftware(data.data);
      }
    } catch (error) {
      console.error("Error fetching software:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to fetch software list",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/software/categories");
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSoftware();
    fetchCategories();
  }, [computerId, searchTerm, selectedCategory]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      version: "",
      category: "",
      description: "",
      vendor: "",
      install_date: "",
      is_licensed: false,
    });
    setEditingSoftware(null);
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = { ...formData };
      if (payload.install_date === "") {
        delete payload.install_date;
      }

      let response;
      if (editingSoftware) {
        response = await API.put(
          `/computers/${computerId}/software/${editingSoftware.id}`,
          payload
        );
      } else {
        response = await API.post(`/computers/${computerId}/software`, payload);
      }

      if (response.data.success) {
        setSubmitStatus({
          type: "success",
          message: editingSoftware
            ? "Software updated successfully!"
            : "Software added successfully!",
        });
        resetForm();
        setShowAddModal(false);
        fetchSoftware();
        setTimeout(() => setSubmitStatus(null), 2000);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to save software. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (softwareItem) => {
    setEditingSoftware(softwareItem);
    setFormData({
      name: softwareItem.name,
      version: softwareItem.version,
      category: softwareItem.category || "",
      description: softwareItem.description || "",
      vendor: softwareItem.vendor || "",
      install_date: softwareItem.install_date || "",
      is_licensed: softwareItem.is_licensed || false,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (softwareId) => {
    if (!window.confirm("Are you sure you want to delete this software?")) {
      return;
    }

    try {
      const { data } = await API.delete(
        `/computers/${computerId}/software/${softwareId}`
      );
      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Software deleted successfully!",
        });
        fetchSoftware();
        setTimeout(() => setSubmitStatus(null), 2000);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to delete software. Please try again.",
      });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "development":
        return faCode;
      case "gaming":
        return faGamepad;
      case "productivity":
        return faFileAlt;
      default:
        return faDesktop;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "development":
        return "bg-blue-100 text-blue-800";
      case "gaming":
        return "bg-purple-100 text-purple-800";
      case "productivity":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submitStatus && (
        <div
          className={`p-3 rounded-lg text-center ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {submitStatus.message}
        </div>
      )}

      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faFilter}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Software Button (Admin only) */}
        {role === "admin" && (
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Software
          </button>
        )}
      </div>

      {/* Software List */}
      <div className="grid gap-3">
        {software.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon={faDesktop} className="text-4xl mb-2" />
            <p>No software found</p>
            {role === "admin" && (
              <p className="text-sm">Click "Add Software" to get started</p>
            )}
          </div>
        ) : (
          software.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <FontAwesomeIcon
                        icon={getCategoryIcon(item.category)}
                        className="text-indigo-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">v{item.version}</p>
                    </div>
                    {item.category && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          item.category
                        )}`}>
                        {item.category}
                      </span>
                    )}
                    {item.is_licensed && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Licensed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    {item.vendor && (
                      <div>
                        <span className="font-medium">Vendor:</span>{" "}
                        {item.vendor}
                      </div>
                    )}
                    {item.install_date && (
                      <div>
                        <span className="font-medium">Installed:</span>{" "}
                        {new Date(item.install_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Admin Actions */}
                {role === "admin" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingSoftware ? "Edit Software" : "Add Software"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Software Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) =>
                      handleInputChange("version", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select Category</option>
                    <option value="Development">Development</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Security">Security</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) =>
                      handleInputChange("vendor", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Install Date
                  </label>
                  <input
                    type="date"
                    value={formData.install_date}
                    onChange={(e) =>
                      handleInputChange("install_date", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_licensed"
                    checked={formData.is_licensed}
                    onChange={(e) =>
                      handleInputChange("is_licensed", e.target.checked)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_licensed"
                    className="ml-2 text-sm text-gray-700">
                    Licensed Software
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {submitStatus && (
                <div
                  className={`p-3 rounded-lg text-center ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center disabled:opacity-50">
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      {editingSoftware ? "Update" : "Add"} Software
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareManagement;
