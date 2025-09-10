import React, { useState, useEffect } from "react";
import PcComponent from "../pcComponent";
import { useApp } from "../../context/AppContext";

const AdminComputers = () => {
  const { computers, navigate, API } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredComputers, setFilteredComputers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    system_status: "",
    location: "",
    search: "",
    page: 1,
    per_page: 15,
  });

  const [formData, setFormData] = useState({
    system_status: "available",
    complaints: [],
    os: "",
    processor: "",
    ram: "",
    storage: "",
    graphics_card: "",
    motherboard: "",
    location: "",
    asset_tag: "",
  });

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = async () => {
    setIsLoading(true);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          queryParams.append(key, value);
        }
      });

      // Make API call with filters
      const { data } = await API.get(`/computers?${queryParams.toString()}`);

      if (data.success) {
        setFilteredComputers(data.data.data);
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
        });
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      // Fallback to client-side filtering if API fails
      filterLocally();
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering fallback
  const filterLocally = async () => {
    try {
      // If API filtering fails, get all computers and filter locally
      const { data } = await API.get("/computers?per_page=1000"); // Get all computers
      if (data.success) {
        let result = [...data.data.data];

        // Filter by status
        if (filters.system_status) {
          result = result.filter(
            (computer) => computer.system_status === filters.system_status
          );
        }

        // Filter by location (partial match)
        if (filters.location) {
          result = result.filter((computer) =>
            computer.location
              .toLowerCase()
              .includes(filters.location.toLowerCase())
          );
        }

        // Search across multiple fields
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          result = result.filter(
            (computer) =>
              computer.os.toLowerCase().includes(searchTerm) ||
              computer.processor.toLowerCase().includes(searchTerm) ||
              computer.asset_tag.toLowerCase().includes(searchTerm) ||
              computer.location.toLowerCase().includes(searchTerm)
          );
        }

        setFilteredComputers(result);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: result.length,
          total: result.length,
        });
      }
    } catch (error) {
      console.error("Error in local filtering:", error);
      setFilteredComputers([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      system_status: "",
      location: "",
      search: "",
      page: 1,
      per_page: 15,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleComplaintsChange = (e) => {
    const complaintsText = e.target.value;
    // Split by commas or new lines to create an array
    const complaintsArray = complaintsText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      complaints: complaintsArray,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { data } = await API.post("/computers", formData);

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Computer added successfully!",
        });
        // Reset form
        setFormData({
          system_status: "available",
          complaints: [],
          os: "",
          processor: "",
          ram: "",
          storage: "",
          graphics_card: "",
          motherboard: "",
          location: "",
          asset_tag: "",
        });
        // Close modal after a brief delay
        setTimeout(() => {
          setShowAddModal(false);
          // Refresh filters to include the new computer
          applyFilters();
        }, 1500);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to add computer. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Computers</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 py-2 px-4 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filters
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 py-2 px-4 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter Computers</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800">
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="system_status"
                value={filters.system_status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="under_maintenance">Under Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search OS, processor, asset tag, location"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredComputers.length} of {pagination.total} computers
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Items per page:</label>
              <select
                name="per_page"
                value={filters.per_page}
                onChange={handleFilterChange}
                className="p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredComputers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No computers found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your filters or add a new computer.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredComputers.map((pc) => (
                <div
                  key={pc.id}
                  onClick={() => {
                    navigate(`/computer/${pc.id}`);
                  }}
                  className="hover:scale-105 transition-transform cursor-pointer">
                  <PcComponent key={pc.id} pc={pc} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex justify-center items-center space-x-1 mt-6">
          <button
            onClick={() => {
              const newFilters = {
                ...filters,
                page: pagination.current_page - 1,
              };
              setFilters(newFilters);
            }}
            disabled={pagination.current_page === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  const newFilters = { ...filters, page: pageNum };
                  setFilters(newFilters);
                }}
                className={`px-3 py-2 text-sm font-medium border-t border-b ${
                  pageNum === pagination.current_page
                    ? "text-indigo-600 bg-indigo-50 border-indigo-500"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
                }`}>
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => {
              const newFilters = {
                ...filters,
                page: pagination.current_page + 1,
              };
              setFilters(newFilters);
            }}
            disabled={pagination.current_page === pagination.last_page}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      )}

      {/* Add Computer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Computer
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSubmitStatus(null);
                }}
                className="text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {submitStatus && (
                <div
                  className={`mb-4 p-3 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Tag*
                  </label>
                  <input
                    type="text"
                    name="asset_tag"
                    value={formData.asset_tag}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., PC-1001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Computer Lab 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operating System*
                  </label>
                  <input
                    type="text"
                    name="os"
                    value={formData.os}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Windows 11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processor*
                  </label>
                  <input
                    type="text"
                    name="processor"
                    value={formData.processor}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Intel Core i7-11700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RAM*
                  </label>
                  <input
                    type="text"
                    name="ram"
                    value={formData.ram}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 16GB DDR4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage*
                  </label>
                  <input
                    type="text"
                    name="storage"
                    value={formData.storage}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 512GB SSD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graphics Card
                  </label>
                  <input
                    type="text"
                    name="graphics_card"
                    value={formData.graphics_card}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., NVIDIA RTX 3060"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motherboard
                  </label>
                  <input
                    type="text"
                    name="motherboard"
                    value={formData.motherboard}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., ASUS PRIME B450M-A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Status*
                  </label>
                  <select
                    name="system_status"
                    value={formData.system_status}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="available">Available</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complaints (one per line or comma separated)
                </label>
                <textarea
                  name="complaints"
                  onChange={handleComplaintsChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Screen flickering, USB ports not working"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add Computer"
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

export default AdminComputers;
