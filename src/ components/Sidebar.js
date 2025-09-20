import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css"; // we'll add CSS here

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <NavLink 
            to="/home" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>

          <li>
          <NavLink 
            to="/upload" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            JD upload
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/ingestion" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Ingestion page
          </NavLink>
        </li>
      

           <li>
          <NavLink 
            to="/chatbot" 
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
           ChatBot
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
