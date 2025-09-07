import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputer,
  faCheckCircle,
  faTools,
  faExclamationTriangle,
  faChartLine,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../context/AppContext";

const AdminOverview = () => {
  const { API } = useApp();
  const [stats, setStats] = useState({
    total_computers: 0,
    available_computers: 0,
    under_maintenance_computers: 0,
    computers_with_complaints: 0,
    availability_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/computers/statistics/overview");
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button
          onClick={fetchStats}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <FontAwesomeIcon icon={faRefresh} className="mr-2" />
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Computers Card */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              Total Computers
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon
                icon={faComputer}
                className="text-blue-600 text-lg"
              />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {stats.total_computers}
            </p>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              All Systems
            </div>
          </div>
        </div>

        {/* Available Computers Card */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Available</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-600 text-lg"
              />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {stats.available_computers}
            </p>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
              Ready to use
            </div>
          </div>
        </div>

        {/* Under Maintenance Card */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon
                icon={faTools}
                className="text-yellow-600 text-lg"
              />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {stats.under_maintenance_computers}
            </p>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              Being serviced
            </div>
          </div>
        </div>

        {/* Computers with Complaints Card */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">With Issues</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-600 text-lg"
              />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {stats.computers_with_complaints}
            </p>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
              Needs attention
            </div>
          </div>
        </div>

        {/* Availability Percentage Card */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Availability</h3>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FontAwesomeIcon
                icon={faChartLine}
                className="text-indigo-600 text-lg"
              />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">
              {stats.availability_percentage}%
            </p>
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
              Operational
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            System Availability
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-indigo-600 h-4 rounded-full"
              style={{ width: `${stats.availability_percentage}%` }}></div>
          </div>
          <p className="text-sm text-gray-600">
            {stats.availability_percentage}% of systems are currently available
            for use
          </p>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            System Status Distribution
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.total_computers
                          ? (stats.available_computers /
                              stats.total_computers) *
                            100
                          : 0
                      }%`,
                    }}></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {stats.total_computers
                    ? Math.round(
                        (stats.available_computers / stats.total_computers) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Maintenance</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.total_computers
                          ? (stats.under_maintenance_computers /
                              stats.total_computers) *
                            100
                          : 0
                      }%`,
                    }}></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {stats.total_computers
                    ? Math.round(
                        (stats.under_maintenance_computers /
                          stats.total_computers) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">With Issues</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.total_computers
                          ? (stats.computers_with_complaints /
                              stats.total_computers) *
                            100
                          : 0
                      }%`,
                    }}></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {stats.total_computers
                    ? Math.round(
                        (stats.computers_with_complaints /
                          stats.total_computers) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          System Health Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">
              Positive Indicators
            </h3>
            <ul className="text-sm text-green-700">
              <li className="mb-1">• High system availability rate</li>
              <li className="mb-1">• Majority of systems operational</li>
              {stats.computers_with_complaints === 0 && (
                <li className="mb-1">• No systems with reported issues</li>
              )}
            </ul>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-medium text-red-800 mb-2">
              Areas Needing Attention
            </h3>
            <ul className="text-sm text-red-700">
              {stats.computers_with_complaints > 0 && (
                <li className="mb-1">
                  • {stats.computers_with_complaints} system(s) with
                  user-reported issues
                </li>
              )}
              {stats.under_maintenance_computers > 0 && (
                <li className="mb-1">
                  • {stats.under_maintenance_computers} system(s) currently
                  under maintenance
                </li>
              )}
              {stats.availability_percentage < 90 && (
                <li className="mb-1">
                  • System availability below optimal levels
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
