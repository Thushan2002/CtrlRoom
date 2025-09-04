import React from "react";
import pcImg from "../assets/images/pc_img.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const statusStyles = {
  Available: "bg-green-600 text-white border border-2 border-white",
  Unavailable: "bg-red-600 text-white border border-2  border-white",
};

const PcComponent = ({ pc }) => {
  const badgeClass = statusStyles[pc.system_status] || statusStyles.Available;

  return (
    <button
      type="button"
      className="w-full text-left"
      aria-label={`Computer ${pc.id} ${pc.system_status}`}>
      <div className="p-4 bg-white hover:bg-gray-100 flex flex-col items-center cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150">
        <span className="text-sm font-medium text-center text-slate-700">
          {pc.id}
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
            {pc.system_status === "available" ? (
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
