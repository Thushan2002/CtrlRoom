import React, { useState } from "react";
import PcComponent from "../Components/pcComponent";

// const computers = Array.from({ length: 48 }, (_, i) => {
//   const num = (i + 1).toString().padStart(3, "0");
//   const id = `PC-${num}`;
//   const status = (i + 3) % 10 === 0 ? "Unavailable" : "Available";
//   return { id, status };
// });

const Computers = () => {
  const [computers, setComputers] = useState([]);

  const fetchComputers = async () => {
    try {
    } catch (error) {}
  };
  return (
    <div className="pb-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
        Computers
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {computers.map((pc) => (
          <PcComponent key={pc.id} id={pc.id} status={pc.status} />
        ))}
      </div>
    </div>
  );
};

export default Computers;
