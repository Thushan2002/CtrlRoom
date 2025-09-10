import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faCheck,
  faTimes,
  faDesktop,
  faExclamationTriangle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const AdminComplaints = () => {
  const { API } = useApp();
  const [computersWithComplaints, setComputersWithComplaints] = useState([]);
  const [filteredComputers, setFilteredComputers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComputers, setExpandedComputers] = useState(new Set());
  const [filters, setFilters] = useState({
    status: "all", // all, resolved, unresolved
    search: "",
  });

  // Fetch all computers with complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Apply filters when computersWithComplaints or filters change
  useEffect(() => {
    applyFilters();
  }, [computersWithComplaints, filters]);

  // Check for expired resolved complaints (older than 3 days)
  useEffect(() => {
    const checkExpiredComplaints = () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      setComputersWithComplaints((prev) =>
        prev
          .map((computer) => ({
            ...computer,
            complaints: computer.complaints.filter((complaint) => {
              if (complaint.status === "resolved" && complaint.resolvedAt) {
                const resolvedDate = new Date(complaint.resolvedAt);
                return resolvedDate > threeDaysAgo;
              }
              return true;
            }),
          }))
          .filter((computer) => computer.complaints.length > 0)
      );
    };

    // Check every hour for expired complaints
    const interval = setInterval(checkExpiredComplaints, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all computers with a high per_page limit to get all data
      const { data } = await API.get("/computers?per_page=1000");

      if (data.success) {
        // Filter computers that have complaints and group them
        const computersWithComplaints = data.data.data
          .filter(
            (computer) => computer.complaints && computer.complaints.length > 0
          )
          .map((computer) => ({
            id: computer.id,
            asset_tag: computer.asset_tag,
            location: computer.location,
            system_status: computer.system_status,
            system_info: computer.system_info,
            complaints: computer.complaints.map((complaint, index) => ({
              id: `${computer.id}-${index}-${complaint}`,
              text: complaint,
              status: "unresolved", // Default status
              createdAt: computer.updated_at || computer.created_at,
              resolvedAt: null,
            })),
            totalComplaints: computer.complaints.length,
            unresolvedComplaints: computer.complaints.length,
          }));

        setComputersWithComplaints(computersWithComplaints);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to fetch complaints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...computersWithComplaints];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (computer) =>
          computer.asset_tag.toLowerCase().includes(searchTerm) ||
          computer.location.toLowerCase().includes(searchTerm) ||
          computer.complaints.some((complaint) =>
            complaint.text.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Filter by status - show computers that have complaints matching the status
    if (filters.status !== "all") {
      result = result.filter((computer) => {
        if (filters.status === "resolved") {
          return computer.complaints.some(
            (complaint) => complaint.status === "resolved"
          );
        } else {
          return computer.complaints.some(
            (complaint) => complaint.status === "unresolved"
          );
        }
      });
    }

    setFilteredComputers(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleComputerExpansion = (computerId) => {
    const newExpanded = new Set(expandedComputers);
    if (newExpanded.has(computerId)) {
      newExpanded.delete(computerId);
    } else {
      newExpanded.add(computerId);
    }
    setExpandedComputers(newExpanded);
  };

  const handleComplaintStatusChange = async (
    computerId,
    complaintId,
    newStatus
  ) => {
    try {
      // Find the computer and complaint
      const computer = computersWithComplaints.find((c) => c.id === computerId);
      const complaint = computer?.complaints.find((c) => c.id === complaintId);
      if (!complaint) return;

      if (newStatus === "resolved") {
        // Remove the complaint from the computer's complaints array via API
        await removeComplaintFromComputer(computerId, complaint.text);

        // Update the complaint status locally with resolved timestamp
        setComputersWithComplaints((prev) =>
          prev.map((comp) =>
            comp.id === computerId
              ? {
                  ...comp,
                  complaints: comp.complaints.map((c) =>
                    c.id === complaintId
                      ? {
                          ...c,
                          status: "resolved",
                          resolvedAt: new Date().toISOString(),
                        }
                      : c
                  ),
                }
              : comp
          )
        );
      } else {
        // Reopen complaint - add it back to the computer's complaints array
        await addComplaintToComputer(computerId, complaint.text);

        // Update the complaint status locally
        setComputersWithComplaints((prev) =>
          prev.map((comp) =>
            comp.id === computerId
              ? {
                  ...comp,
                  complaints: comp.complaints.map((c) =>
                    c.id === complaintId
                      ? { ...c, status: "unresolved", resolvedAt: null }
                      : c
                  ),
                }
              : comp
          )
        );
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const removeComplaintFromComputer = async (computerId, complaintText) => {
    try {
      // Get the current computer data
      const { data: computerData } = await API.get(`/computers/${computerId}`);

      if (computerData.success) {
        const computer = computerData.data;

        // Remove the specific complaint from the array
        const updatedComplaints = computer.complaints.filter(
          (comp) => comp !== complaintText
        );

        // Update the computer with the modified complaints array
        await API.patch(`/computers/${computerId}/complaints`, {
          complaints: updatedComplaints,
        });
      }
    } catch (error) {
      console.error("Error removing complaint from computer:", error);
      throw error;
    }
  };

  const addComplaintToComputer = async (computerId, complaintText) => {
    try {
      // Get the current computer data
      const { data: computerData } = await API.get(`/computers/${computerId}`);

      if (computerData.success) {
        const computer = computerData.data;

        // Add the complaint back to the array if it doesn't exist
        const updatedComplaints = [...computer.complaints];
        if (!updatedComplaints.includes(complaintText)) {
          updatedComplaints.push(complaintText);
        }

        // Update the computer with the modified complaints array
        await API.patch(`/computers/${computerId}/complaints`, {
          complaints: updatedComplaints,
        });
      }
    } catch (error) {
      console.error("Error adding complaint to computer:", error);
      throw error;
    }
  };

  const resolveAllComplaintsForComputer = async (computerId) => {
    try {
      // Remove all complaints from the computer via API
      await API.patch(`/computers/${computerId}/complaints`, {
        complaints: [],
      });

      // Update all complaints for this computer to resolved status
      setComputersWithComplaints((prev) =>
        prev.map((comp) =>
          comp.id === computerId
            ? {
                ...comp,
                complaints: comp.complaints.map((c) =>
                  c.status === "unresolved"
                    ? {
                        ...c,
                        status: "resolved",
                        resolvedAt: new Date().toISOString(),
                      }
                    : c
                ),
              }
            : comp
        )
      );
    } catch (error) {
      console.error("Error resolving all complaints:", error);
    }
  };

  // Calculate time remaining until complaint is automatically removed
  const getTimeRemaining = (resolvedAt) => {
    if (!resolvedAt) return null;

    const resolvedDate = new Date(resolvedAt);
    const expirationDate = new Date(resolvedDate);
    expirationDate.setDate(expirationDate.getDate() + 3);

    const now = new Date();
    const timeRemaining = expirationDate - now;

    if (timeRemaining <= 0) return "Expired";

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return `${days}d ${remainingHours}h`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
        <button
          onClick={fetchComplaints}
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Computer Complaints
        </h2>
        <button
          onClick={fetchComplaints}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Complaints</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
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
              placeholder="Search complaints, asset tags, locations..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <span className="text-sm text-gray-500">
              Showing {filteredComputers.length} of{" "}
              {computersWithComplaints.length} computers with complaints
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {computersWithComplaints.reduce(
              (total, computer) => total + computer.complaints.length,
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Total Complaints</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {computersWithComplaints.reduce(
              (total, computer) =>
                total +
                computer.complaints.filter((c) => c.status === "resolved")
                  .length,
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {computersWithComplaints.reduce(
              (total, computer) =>
                total +
                computer.complaints.filter((c) => c.status === "unresolved")
                  .length,
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Unresolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">
            {computersWithComplaints.length}
          </div>
          <div className="text-sm text-gray-600">Affected Computers</div>
        </div>
      </div>

      {/* Computers with Complaints List */}
      {filteredComputers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FontAwesomeIcon
            icon={faDesktop}
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No computers with complaints found
          </h3>
          <p className="text-gray-500">
            {computersWithComplaints.length === 0
              ? "No complaints have been reported yet."
              : "No computers match your current filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComputers.map((computer) => (
            <div
              key={computer.id}
              className="bg-white rounded-lg shadow overflow-hidden">
              {/* Computer Header */}
              <div
                className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleComputerExpansion(computer.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FontAwesomeIcon
                      icon={
                        expandedComputers.has(computer.id)
                          ? faChevronDown
                          : faChevronRight
                      }
                      className="text-gray-400"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <FontAwesomeIcon
                          icon={faDesktop}
                          className="text-indigo-600"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {computer.asset_tag}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {computer.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {
                          computer.complaints.filter(
                            (c) => c.status === "unresolved"
                          ).length
                        }{" "}
                        unresolved
                      </div>
                      <div className="text-xs text-gray-500">
                        {computer.complaints.length} total complaints
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveAllComplaintsForComputer(computer.id);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                      Resolve All
                    </button>
                  </div>
                </div>
              </div>

              {/* Complaints List (Expandable) */}
              {expandedComputers.has(computer.id) && (
                <div className="divide-y divide-gray-200">
                  {computer.complaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FontAwesomeIcon
                              icon={faExclamationTriangle}
                              className={`text-sm ${
                                complaint.status === "resolved"
                                  ? "text-green-500"
                                  : "text-orange-500"
                              }`}
                            />
                            <p className="text-sm text-gray-900">
                              {complaint.text}
                            </p>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                complaint.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                              {complaint.status}
                            </span>
                          </div>
                          {complaint.status === "resolved" &&
                            complaint.resolvedAt && (
                              <div className="text-xs text-gray-500 ml-6">
                                Resolved:{" "}
                                {new Date(
                                  complaint.resolvedAt
                                ).toLocaleDateString()}
                                {getTimeRemaining(complaint.resolvedAt) && (
                                  <span className="ml-2 text-orange-600">
                                    (Auto-remove in:{" "}
                                    {getTimeRemaining(complaint.resolvedAt)})
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                        <div className="ml-4">
                          {complaint.status === "unresolved" ? (
                            <button
                              onClick={() =>
                                handleComplaintStatusChange(
                                  computer.id,
                                  complaint.id,
                                  "resolved"
                                )
                              }
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="mr-1"
                              />
                              Resolve
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleComplaintStatusChange(
                                  computer.id,
                                  complaint.id,
                                  "unresolved"
                                )
                              }
                              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                              <FontAwesomeIcon
                                icon={faTimes}
                                className="mr-1"
                              />
                              Reopen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
