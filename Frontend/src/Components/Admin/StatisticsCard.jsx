import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * StatisticsCard - Reusable card component for displaying statistics
 */
const StatisticsCard = ({
  title,
  value,
  icon,
  color = "blue",
  trend = null,
  subtitle = null,
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    yellow: "bg-yellow-500 text-white",
    red: "bg-red-500 text-white",
    purple: "bg-purple-500 text-white",
    indigo: "bg-indigo-500 text-white",
  };

  const iconColorClasses = {
    blue: "text-blue-100",
    green: "text-green-100",
    yellow: "text-yellow-100",
    red: "text-red-100",
    purple: "text-purple-100",
    indigo: "text-indigo-100",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
            >
              <FontAwesomeIcon icon={icon} className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {value !== null && value !== undefined
                  ? value.toLocaleString()
                  : "N/A"}
              </p>
              {trend && (
                <span
                  className={`ml-2 text-sm font-medium ${
                    trend > 0
                      ? "text-green-600"
                      : trend < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
