import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";

const AdminComplaints = () => {
  const { API } = useApp();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all", // all, resolved, unresolved
    search: "",
  });

  // Fetch all computers with complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Apply filters when complaints or filters change
  useEffect(() => {
    applyFilters();
  }, [complaints, filters]);

  // Check for expired resolved complaints (older than 3 days)
  useEffect(() => {
    const checkExpiredComplaints = () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      setComplaints((prev) =>
        prev.filter((complaint) => {
          if (complaint.status === "resolved" && complaint.resolvedAt) {
            const resolvedDate = new Date(complaint.resolvedAt);
            return resolvedDate > threeDaysAgo;
          }
          return true;
        })
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
      // get all computers
      const { data } = await API.get("/computers");

      if (data.success) {
        // Filter computers that have complaints and flatten the complaints array
        const computersWithComplaints = data.data.data.filter(
          (computer) => computer.complaints && computer.complaints.length > 0
        );

        // Create an array of complaints with computer info
        const allComplaints = computersWithComplaints.flatMap((computer) =>
          computer.complaints.map((complaint, index) => ({
            id: `${computer.id}-${index}-${complaint}`,
            complaint,
            computerId: computer.id,
            computer: {
              asset_tag: computer.asset_tag,
              location: computer.location,
              system_status: computer.system_status,
              system_info: computer.system_info,
            },
            status: "unresolved", // Default status
            createdAt: computer.updated_at || computer.created_at,
            resolvedAt: null,
          }))
        );

        setComplaints(allComplaints);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError("Failed to fetch complaints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...complaints];

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((complaint) =>
        filters.status === "resolved"
          ? complaint.status === "resolved"
          : complaint.status === "unresolved"
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (complaint) =>
          complaint.complaint.toLowerCase().includes(searchTerm) ||
          complaint.computer.asset_tag.toLowerCase().includes(searchTerm) ||
          complaint.computer.location.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredComplaints(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      // Find the complaint to get computer ID and complaint text
      const complaint = complaints.find((c) => c.id === complaintId);
      if (!complaint) return;

      if (newStatus === "resolved") {
        // Remove the complaint from the computer's complaints array via API
        await removeComplaintFromComputer(
          complaint.computerId,
          complaint.complaint
        );

        // Update the complaint status locally with resolved timestamp
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? {
                  ...c,
                  status: "resolved",
                  resolvedAt: new Date().toISOString(),
                }
              : c
          )
        );
      } else {
        // Reopen complaint - add it back to the computer's complaints array
        await addComplaintToComputer(complaint.computerId, complaint.complaint);

        // Update the complaint status locally
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === complaintId
              ? { ...c, status: "unresolved", resolvedAt: null }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
      // Revert the change if it fails
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? { ...c, status: c.status } : c))
      );
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
      // Get all complaints for this computer
      const computerComplaints = complaints.filter(
        (c) => c.computerId === computerId && c.status === "unresolved"
      );

      // Remove all complaints from the computer via API
      await API.patch(`/computers/${computerId}/complaints`, {
        complaints: [],
      });

      // Update all complaints for this computer to resolved status
      setComplaints((prev) =>
        prev.map((c) =>
          c.computerId === computerId && c.status === "unresolved"
            ? { ...c, status: "resolved", resolvedAt: new Date().toISOString() }
            : c
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
              Showing {filteredComplaints.length} of {complaints.length}{" "}
              complaints
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {complaints.length}
          </div>
          <div className="text-sm text-gray-600">Total Complaints</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {complaints.filter((c) => c.status === "resolved").length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {complaints.filter((c) => c.status === "unresolved").length}
          </div>
          <div className="text-sm text-gray-600">Unresolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">
            {new Set(complaints.map((c) => c.computerId)).size}
          </div>
          <div className="text-sm text-gray-600">Affected Computers</div>
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No complaints found
          </h3>
          <p className="text-gray-500">
            {complaints.length === 0
              ? "No complaints have been reported yet."
              : "No complaints match your current filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Computer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {complaint.computer.asset_tag}
                    </div>
                    <div className="text-sm text-gray-500">
                      {complaint.computer.location}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {complaint.computerId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {complaint.complaint}
                    </div>
                    {complaint.status === "resolved" &&
                      complaint.resolvedAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Resolved:{" "}
                          {new Date(complaint.resolvedAt).toLocaleDateString()}
                          {getTimeRemaining(complaint.resolvedAt) && (
                            <span className="ml-2 text-orange-600">
                              (Auto-remove in:{" "}
                              {getTimeRemaining(complaint.resolvedAt)})
                            </span>
                          )}
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        complaint.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {complaint.status === "unresolved" ? (
                      <button
                        onClick={() =>
                          handleStatusChange(complaint.id, "resolved")
                        }
                        className="text-green-600 hover:text-green-900 mr-4">
                        Mark Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatusChange(complaint.id, "unresolved")
                        }
                        className="text-yellow-600 hover:text-yellow-900 mr-4">
                        Reopen
                      </button>
                    )}
                    <button
                      onClick={() =>
                        resolveAllComplaintsForComputer(complaint.computerId)
                      }
                      className="text-blue-600 hover:text-blue-900">
                      Resolve All for PC
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;