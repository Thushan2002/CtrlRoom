import React, { useEffect, useState } from "react";
import PcComponent from "../Components/pcComponent";
import { useApp } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Computers = () => {
  const { navigate, API } = useApp();
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchComputers = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/computers?page=${page}&per_page=15`);

      if (data.success) {
        setComputers(data.data.data);
        setPagination({
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total,
        });
      }
    } catch (error) {
      console.error("Error fetching computers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const handlePageChange = (page) => {
    fetchComputers(page);
  };

  const renderPagination = () => {
    const pages = [];
    const { current_page, last_page } = pagination;

    // Show previous button
    if (current_page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(current_page - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      );
    }

    // Show page numbers
    const startPage = Math.max(1, current_page - 2);
    const endPage = Math.min(last_page, current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b ${
            i === current_page
              ? "text-indigo-600 bg-indigo-50 border-indigo-500"
              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
          }`}>
          {i}
        </button>
      );
    }

    // Show next button
    if (current_page < last_page) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(current_page + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
          Computers
        </h1>
        <div className="text-sm text-gray-600">
          Showing {computers.length} of {pagination.total} computers
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5  gap-4 mb-6">
        {computers.map((pc) => (
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

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex justify-center items-center space-x-1">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default Computers;
