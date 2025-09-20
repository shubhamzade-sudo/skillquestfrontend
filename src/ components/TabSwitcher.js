import React, { useState } from "react";
import TextUploader from "../ components/TextUploader"
import MatchingEvaluation from "../ components/MatchingEvaluation"
import { FiArrowLeft, FiChevronLeft } from "react-icons/fi"; // react icon import



const TabSwitcher = () => {
  // "uploader" shows JD Upload, "matching" shows MatchingEvaluation
  const [view, setView] = useState("uploader");
  const [selectedJob, setSelectedJob] = useState(null);

  // called by JobList when user clicks View
  const openMatching = (job) => {
    setSelectedJob(job);
    setView("matching");
  };

  const goBackToUploader = () => {
    setSelectedJob(null);
    setView("uploader");
  };

  return (
    <div>
      {/* Header area — change title based on view */}
      <header style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        {view === "matching" && (
          <button
            onClick={goBackToUploader}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiChevronLeft size={25} color="#000000" /> {/* Sharp black chevron */}
          </button>
        )}





        <h2 style={{ marginLeft: "4px" }}>
          {view === "uploader" ? "JD Upload" : "Matching & Evaluation"}
        </h2>

        {/* When in matching view show a Back button */}

      </header>

      <main>
        {view === "uploader" ? (
          <TextUploader openMatching={openMatching} />
        ) : (
          <MatchingEvaluation job={selectedJob} onBack={goBackToUploader} />
        )}
      </main>
    </div>
  );
};

export default TabSwitcher;
