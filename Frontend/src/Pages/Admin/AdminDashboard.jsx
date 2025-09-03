import React, { useState, useEffect } from 'react';
import { adminApi, handleApiError } from '../../services/adminApi';
import StatisticsCard from '../../Components/Admin/StatisticsCard';
import RecentActivity from '../../Components/Admin/RecentActivity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDesktop,
  faCheckCircle,
  faWrench,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

/**
 * AdminDashboard - Main dashboard for admin users
 * Displays system statistics and recent activity
 */
const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getStatistics();
      setStatistics(response.data.data);
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to load statistics');
      setError(errorMessage);
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchStatistics();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={refreshData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your system.</p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Computers"
          value={statistics?.total_computers}
          icon={faDesktop}
          color="blue"
          loading={loading}
          subtitle="All registered computers"
        />
        <StatisticsCard
          title="Available"
          value={statistics?.available_computers}
          icon={faCheckCircle}
          color="green"
          loading={loading}
          subtitle="Ready for use"
        />
        <StatisticsCard
          title="Under Maintenance"
          value={statistics?.under_maintenance_computers}
          icon={faWrench}
          color="yellow"
          loading={loading}
          subtitle="Currently being serviced"
        />
        <StatisticsCard
          title="With Complaints"
          value={statistics?.computers_with_complaints}
          icon={faExclamationTriangle}
          color="red"
          loading={loading}
          subtitle="Issues reported"
        />
      </div>

      {/* Availability Percentage */}
      {statistics && !loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Availability</h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Availability Rate</span>
                <span>{statistics.availability_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${statistics.availability_percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-6 text-right">
              <p className="text-2xl font-bold text-gray-900">
                {statistics.availability_percentage}%
              </p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <RecentActivity />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FontAwesomeIcon icon={faDesktop} className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add Computer</h4>
            <p className="text-sm text-gray-600">Register a new computer</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FontAwesomeIcon icon={faWrench} className="h-6 w-6 text-yellow-600 mb-2" />
            <h4 className="font-medium text-gray-900">Schedule Maintenance</h4>
            <p className="text-sm text-gray-600">Plan maintenance tasks</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-red-600 mb-2" />
            <h4 className="font-medium text-gray-900">View Complaints</h4>
            <p className="text-sm text-gray-600">Review reported issues</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
