import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TextUploader from "../ components/TextUploader"
import MatchingEvaluation from "../ components/MatchingEvaluation"
import { FiChevronLeft } from "react-icons/fi"; // react icon import



const TabSwitcher = ({ title = "Upload" }) => {
  const location = useLocation();

  // Restore view & job from route state (when coming back from candidate detail)
  const [view, setView] = useState(() =>
    location.state?.selectedJob ? "matching" : "uploader"
  );
  const [selectedJob, setSelectedJob] = useState(() =>
    location.state?.selectedJob || null
  );

  // If route state changes (e.g. navigating back), restore
  useEffect(() => {
    if (location.state?.selectedJob) {
      setSelectedJob(location.state.selectedJob);
      setView("matching");
    }
  }, [location.state]);

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
          {view === "uploader" ? title : "Matching & Evaluation"}
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
