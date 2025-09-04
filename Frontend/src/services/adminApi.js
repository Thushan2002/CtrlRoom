import API from "./api";

/**
 * Admin API Service
 * Handles all admin-specific API calls
 */
export const adminApi = {
  // Computer Management
  getComputers: (params = {}) => API.get("/computers", { params }),
  getComputer: (id) => API.get(`/computers/${id}`),
  createComputer: (data) => API.post("/computers", data),
  updateComputer: (id, data) => API.put(`/computers/${id}`, data),
  patchComputer: (id, data) => API.patch(`/computers/${id}`, data),
  deleteComputer: (id) => API.delete(`/computers/${id}`),

  // Computer Status Management
  updateComputerStatus: (id, status) =>
    API.patch(`/computers/${id}/status`, { system_status: status }),
  updateComputerComplaints: (id, complaints) =>
    API.patch(`/computers/${id}/complaints`, { complaints }),
  getComputersByStatus: (status) => API.get(`/computers/status/${status}`),

  // Statistics
  getStatistics: () => API.get("/computers/statistics/overview"),

  // User Management (when backend endpoints are available)
  getUsers: () => API.get("/admin/users").catch(() => ({ data: [] })), // Fallback for now
  createUser: (data) =>
    API.post("/admin/users", data).catch(() => ({ data: null })),
  updateUser: (id, data) =>
    API.put(`/admin/users/${id}`, data).catch(() => ({ data: null })),
  deleteUser: (id) =>
    API.delete(`/admin/users/${id}`).catch(() => ({ data: null })),

  // Complaints Management (when backend endpoints are available)
  getComplaints: () => API.get("/admin/complaints").catch(() => ({ data: [] })), // Fallback for now
  updateComplaint: (id, data) =>
    API.put(`/admin/complaints/${id}`, data).catch(() => ({ data: null })),
  deleteComplaint: (id) =>
    API.delete(`/admin/complaints/${id}`).catch(() => ({ data: null })),
};

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);

  if (error.response) {
    // Server responded with error status
    return (
      error.response.data?.message ||
      error.response.data?.error ||
      defaultMessage
    );
  } else if (error.request) {
    // Request was made but no response received
    return "Network error. Please check your connection.";
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

/**
 * Helper function to format computer data for forms
 */
export const formatComputerForForm = (computer) => {
  if (!computer) return {};

  return {
    system_status: computer.system_status || "available",
    complaints: computer.complaints || [],
    os: computer.os || "",
    processor: computer.processor || "",
    ram: computer.ram || "",
    storage: computer.storage || "",
    graphics_card: computer.graphics_card || "",
    motherboard: computer.motherboard || "",
    location: computer.location || "",
    asset_tag: computer.asset_tag || "",
  };
};

/**
 * Helper function to validate computer data
 */
export const validateComputerData = (data) => {
  const errors = {};

  if (!data.system_status) {
    errors.system_status = "System status is required";
  }

  if (data.asset_tag && data.asset_tag.length > 255) {
    errors.asset_tag = "Asset tag must be less than 255 characters";
  }

  if (data.location && data.location.length > 255) {
    errors.location = "Location must be less than 255 characters";
  }

  if (data.complaints && !Array.isArray(data.complaints)) {
    errors.complaints = "Complaints must be an array";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
