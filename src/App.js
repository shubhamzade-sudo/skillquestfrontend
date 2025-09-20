import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Ingestion from "./pages/Ingestion";
import Layout from "./ components/Layout";
import Settings from "./pages/Upload";
import Chatbot from "./pages/ChatBot";
import CandidateDetail from "./ components/CandidateDetail"

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Default redirect */}
          <Route index element={<Navigate to="home" replace />} />

          {/* Child routes will render inside <Outlet /> of Layout */}
          <Route path="home" element={<Home />} />
          <Route path="ingestion" element={<Ingestion />} />
          <Route path="upload" element={<Settings />} />
          <Route path="chatbot" element={<Chatbot />} />
           <Route path="candidate/:id" element={<CandidateDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
