import React, { useState } from "react";
import Papa from "papaparse";
import "./Ingestion.css";
import ProcessCandidatesModal from "../ components/ProcessCandidatesModal";

const UploadCSV = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true, // treat first row as header
        skipEmptyLines: true,
        complete: function (results) {
          setColumns(Object.keys(results.data[0]));
          setData(results.data);
        },
      });
    }
  };

  // helper: truncate to N words (keeps words intact)
  const truncateWords = (text = "", limit = 20) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  return (
    <div className="upload-container">
      <h2>Upload Candidate CSV</h2>

      <div className="upload-box">
        <div className="upload-content">
          <div className="cloud-logo">
            {/* Cloud SVG */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M36 33H14c-3.31 0-6-2.69-6-6 0-2.45 1.6-4.68 3.94-5.58A7 7 0 0128 17c3.81 0 7 3.07 7 6.84 0 .55-.09 1.09-.24 1.59C38.51 26.12 40 28.23 40 30.5c0 2.48-2.02 4.5-4.5 4.5z"
                fill="#aeaebc"
              />
            </svg>
          </div>
          <div className="upload-instructions">
            <div className="drag-text">Drag and drop file here</div>
            <div className="detail-text">Limit 200MB per file, CSV only</div>
          </div>
          <label className="upload-csv-btn">
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Show table only after file uploaded */}
      {data.length > 0 && <h3>Candidates Data</h3>}
      {data.length > 0 && (
        <div className="table-container">
          {/* ✅ Updated table with proper class */}
          <table className="candidate-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => {
                    const isSkillCol = /^(skills|skills gaps)$/i.test(col.trim());
                    const cellValue = row[col] ?? "";

                    return (
                      <td
                        key={colIndex}
                        className={isSkillCol ? "skill-truncate" : undefined}
                        title={isSkillCol && cellValue ? cellValue : undefined}
                      >
                        {isSkillCol ? truncateWords(cellValue, 20) : cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     {data.length > 0 && (
  <button
    className="process-candidates-btn"
    onClick={() => setModalOpen(true)}
  >
    Process Candidates
  </button>
)}

      <ProcessCandidatesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default UploadCSV;
