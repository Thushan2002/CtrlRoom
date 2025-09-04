import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputer,
  faMicrochip,
  faMemory,
  faHardDrive,
  faDisplay,
  faMapMarkerAlt,
  faEdit,
  faExclamationTriangle,
  faTimes,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const Computer = () => {
  const { pcId } = useParams();
  const [computer, setComputer] = useState({});
  const { API, role } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const fetchComputer = async () => {
    try {
      const { data } = await API.get(`/computers/${pcId}`);
      if (data.success) {
        setComputer(data.data);
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  useEffect(() => {
    fetchComputer();
  }, []);

  const handleSubmitComplaint = async () => {
    if (!complaintText.trim()) {
      setSubmitStatus({ type: "error", message: "Complaint cannot be empty" });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // This would be your actual API endpoint for submitting complaints
      const { data } = await API.post(`/computers/${computer.id}/complaints`, {
        complaint: complaintText,
      });

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Complaint submitted successfully!",
        });
        setComplaintText("");
        setTimeout(() => {
          setShowComplaintModal(false);
          setSubmitStatus(null);
        }, 1500);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to submit complaint. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine status color
  const getStatusColor = () => {
    switch (computer.system_status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "in-use":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "broken":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {/* Header with ID and status */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faComputer}
              className="text-indigo-500 mr-2"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              Computer #{computer.id}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {computer.system_status}
          </span>
        </div>

        {/* Main content */}
        <div className="p-5">
          {/* Asset tag and location */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {computer.asset_tag}
              </h2>
              {role === "admin" && (
                <button
                  className={`p-2 rounded-full transition-colors ${
                    isHovered
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-400"
                  }`}
                  aria-label="Edit computer">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
            </div>
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-sm" />
              <span className="text-sm">{computer.location}</span>
            </div>
          </div>

          {/* Specifications grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OS */}
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FontAwesomeIcon icon={faDisplay} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Operating System</p>
                <p className="text-sm font-medium">{computer.os}</p>
              </div>
            </div>

            {/* Processor */}
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <FontAwesomeIcon
                  icon={faMicrochip}
                  className="text-purple-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Processor</p>
                <p className="text-sm font-medium">{computer.processor}</p>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <FontAwesomeIcon icon={faMemory} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">RAM</p>
                <p className="text-sm font-medium">{computer.ram}</p>
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <FontAwesomeIcon
                  icon={faHardDrive}
                  className="text-orange-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Storage</p>
                <p className="text-sm font-medium">{computer.storage}</p>
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Graphics Card</p>
                <p className="text-sm">{computer.graphics_card}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Motherboard</p>
                <p className="text-sm">{computer.motherboard}</p>
              </div>
            </div>
          </div>

          {/* Complaints section if exists */}
          {computer.complaints && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-xs font-medium text-red-800">
                Complaints Reported
              </p>
              <p className="text-sm text-red-700">{computer.complaints}</p>
            </div>
          )}

          {/* Student complaint button */}
          {role === "student" && (
            <div className="mt-6">
              <button
                onClick={() => setShowComplaintModal(true)}
                className="flex items-center justify-center w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-2"
                />
                Report an Issue
              </button>
            </div>
          )}
        </div>

        {/* Footer with last updated */}
        <div className="px-5 py-3 bg-gray-50 text-xs text-gray-500">
          Last updated: {new Date(computer.updated_at).toLocaleDateString()}
        </div>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-amber-500 mr-2"
                />
                Report an Issue
              </h3>
              <button
                onClick={() => {
                  setShowComplaintModal(false);
                  setComplaintText("");
                  setSubmitStatus(null);
                }}
                className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Please describe the issue you're experiencing with{" "}
                {computer.asset_tag}:
              </p>

              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Describe the problem in detail..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows="4"
              />

              {submitStatus && (
                <div
                  className={`mt-3 p-2 rounded-lg text-center ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {submitStatus.message}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => {
                  setShowComplaintModal(false);
                  setComplaintText("");
                  setSubmitStatus(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                onClick={handleSubmitComplaint}
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center disabled:opacity-50">
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Computer;
