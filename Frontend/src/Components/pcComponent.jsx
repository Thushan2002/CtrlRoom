import React from "react";
import pcImg from "../assets/images/pc_img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const statusStyles = {
  Available: "bg-green-600 text-white border border-2 border-white",
  Unavailable: "bg-red-600 text-white border border-2  border-white",
};

const PcComponent = ({ id, status = "Available", onClick }) => {
  const badgeClass = statusStyles[status] || statusStyles.Available;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left"
      aria-label={`Computer ${id} ${status}`}>
      <div className="p-4 bg-white flex flex-col items-center cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150">
        <span className="text-sm font-medium text-center text-slate-700">
          {id}
        </span>
        <div className="mt-3 flex items-center justify-between relative">
          <img
            src={pcImg}
            alt="Computer"
            className="w-16 h-16 mx-auto select-none "
            draggable={false}
          />
          <span
            className={`text-xs w-6 h-6 flex items-center justify-center rounded-full absolute bottom-[-7px] right-[-8px] ${badgeClass}`}>
            {status === "Available" ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
          </span>
        </div>
      </div>
    </button>
  );
};

export default PcComponent;
