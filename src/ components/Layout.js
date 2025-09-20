import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <div className="content-wrapper">
        {/* Sidebar stays mounted, never re-renders on route change */}
        <Sidebar />  
        <main className="main-content">
          {/* Only this part changes */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
