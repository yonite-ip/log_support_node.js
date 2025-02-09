import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUserCheck, FaHome, FaChartBar, FaCog, FaPlusCircle, FaProjectDiagram } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <div className={`h-screen bg-white border-r border-gray-300 shadow-md transition-all ${isOpen ? "w-64 p-5" : "w-16 p-2"}`}>
        <button
          className="text-gray-700 text-2xl focus:outline-none mb-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>

        <ul className="space-y-2">
          <li className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition ${isOpen ? 'justify-start' : 'justify-center'}">
            <FaHome className="text-gray-700" />
            {isOpen && <Link to="/" className="ml-3 text-gray-700">Home</Link>}
          </li>
          <li className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition ${isOpen ? 'justify-start' : 'justify-center'}">
            <FaUserCheck className="text-gray-700"/>
            {isOpen && <Link to="/check-registraion" className="ml-3 text-gray-700">Check Registration</Link>}
          </li>
          <li className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition ${isOpen ? 'justify-start' : 'justify-center'}">
            <FaProjectDiagram className="text-gray-700" />
            {isOpen && <Link to="/analyze-call-flow" className="ml-3 text-gray-700">Analyze Call Flow</Link>}
          </li>
          <li className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition ${isOpen ? 'justify-start' : 'justify-center'}">
            <FaPlusCircle className="text-gray-700" />
            {isOpen && <Link to="/build-domain" className="ml-3 text-gray-700">Build New Domain</Link>}
          </li>
          <li className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition ${isOpen ? 'justify-start' : 'justify-center'}">
            <FaChartBar className="text-gray-700" />
            {isOpen && <Link to="/dashboard" className="ml-3 text-gray-700">Dashboard</Link>}
          </li>
          <li className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-100 transition ${isOpen ? 'justify-start' : 'justify-center'}">
            <FaCog className="text-gray-700" />
            {isOpen && <span className="ml-3 text-gray-700">Settings</span>}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
