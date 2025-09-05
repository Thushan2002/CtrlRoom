import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faUser,
  faExclamationTriangle,
  faWrench,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

/**
 * AdminRecent - Component to display recent system activities
 */
const AdminRecent = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - replace with actual API call
  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        type: "computer",
        action: "created",
        description: "New computer PC-1001 added to Lab 1",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        icon: faDesktop,
        color: "blue",
      },
      {
        id: 2,
        type: "user",
        action: "registered",
        description: "New student John Doe registered",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        icon: faUser,
        color: "green",
      },
      {
        id: 3,
        type: "complaint",
        action: "reported",
        description: "Complaint reported for PC-1005",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        icon: faExclamationTriangle,
        color: "red",
      },
      {
        id: 4,
        type: "maintenance",
        action: "completed",
        description: "Maintenance completed for PC-1003",
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        icon: faWrench,
        color: "yellow",
      },
      {
        id: 5,
        type: "computer",
        action: "available",
        description: "PC-1007 is now available",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        icon: faCheckCircle,
        color: "green",
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (activity) => {
    const iconClasses = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      red: "text-red-600 bg-red-100",
      yellow: "text-yellow-600 bg-yellow-100",
    };

    return (
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          iconClasses[activity.color]
        }`}>
        <FontAwesomeIcon icon={activity.icon} className="h-4 w-4" />
      </div>
    );
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                {getActivityIcon(activity)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecent;
