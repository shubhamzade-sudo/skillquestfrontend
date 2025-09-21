import React, { useState, useMemo, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import "./JobList.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function JobList({ goToMatching }) {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newReqId, setNewReqId] = useState(""); // REQ ID
  const [editId, setEditId] = useState(null);

  // Refs
  const titleRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!API_URL) return;
        const response = await axios.get(`${API_URL}/jobs/`, {
          params: { skip: 0, limit: 50 },
          headers: { accept: "application/json" },
        });
        setJobs(response.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        (j.title || "").toLowerCase().includes(q) ||
        (j.description || "").toLowerCase().includes(q) ||
        String(j.jd_id || "").toLowerCase().includes(q)
    );
  }, [jobs, query]);

  const openModal = (job = null) => {
    if (job) {
      setEditId(job.jd_id);
      setNewReqId(job.jd_id ?? "");
      setNewTitle(job.title ?? "");
      setNewDesc(job.description ?? "");
    } else {
      setEditId(null);
      setNewReqId("");
      setNewTitle("");
      setNewDesc("");
    }
    setIsModalOpen(true);
    setTimeout(() => titleRef.current?.focus(), 80);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setNewReqId("");
      setNewTitle("");
      setNewDesc("");
      setEditId(null);
    }, 160);
  };

  const addOrUpdateJob = () => {
    const title = (newTitle || "").trim();
    const desc = (newDesc || "").trim() || "No description provided";
    const jdId = ((newReqId || "") + "").trim();

    if (!title) {
      alert("Please enter a job title");
      titleRef.current?.focus();
      return;
    }
    if (!jdId) {
      alert("Please enter a REQ ID");
      return;
    }

    if (editId) {
      setJobs((prev) =>
        prev.map((j) =>
          String(j.jd_id) === String(editId)
            ? { ...j, jd_id: jdId, title, description: desc }
            : j
        )
      );
    } else {
      const newJob = {
        jd_id: jdId,
        title,
        description: desc,
        status: "running",
      };
      setJobs((prev) => [newJob, ...prev]);
    }

    closeModal();
  };

  const removeJob = (jdId) => {
    setJobs((prev) => prev.filter((j) => String(j.jd_id) !== String(jdId)));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  const statusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "closed":
        return "View Evaluation";
      case "running":
        return "Evaluation in progress";
      case "completed":
        return "View Evaluation";
      default:
        return "Evaluation in progress";
    }
  };

  const isActionDisabled = (status) => (status || "").toLowerCase() === "running";

  return (
    <div className="joblist-root">
      <header className="joblist-header">
        <div className="search-wrap">
          <FiSearch className="icon search-icon" />
          <input
            className="search-input"
            type="search"
            placeholder="Search job title, description or REQ ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="clear-btn"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* ONLY Upload JD button — sharp corners, opens modal */}
        <button
          className="upload-btn"
          title="Upload JD"
          onClick={() => openModal(null)}
          aria-label="Upload JD"
          type="button"
        >
          Upload JD
        </button>
      </header>

      <main className="joblist-main">
        {filtered.length === 0 ? (
          // <div className="empty-state">No job descriptions found. Add one!</div>
          <div className="empty-state" aria-busy="true" aria-live="polite">
            <div className="circle-loader" role="status" aria-label="Loading job descriptions"></div>
          </div>


        ) : (
          <div className="card-grid">
            {filtered.map((job) => (
              <article
                key={job.jd_id}
                className={`job-card ${job.compact ? "compact" : ""}`}
                onClick={() => {
                  if (!isActionDisabled(job.status)) {
                    goToMatching?.(job);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isActionDisabled(job.status)) {
                    goToMatching?.(job);
                  }
                }}
                aria-label={`Open matching for ${job.title}`}
              >
                <div className="job-card-head">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="jd-id">REQ ID: {job.jd_id}</div>
                  </div>

                  <button
                    className="delete-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeJob(job.jd_id);
                    }}
                    aria-label="Delete job"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>

                <p className="job-desc">
                  {(job.description || "").split(" ").slice(0, 25).join(" ") +
                    ((job.description || "").split(" ").length > 25 ? "..." : "")}
                </p>

                <div className="job-footer">
                  <button
                    className={`action-btn ${job.status === "completed" ? "primary" : ""} ${job.status === "running" ? "disabled" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isActionDisabled(job.status)) return;
                      goToMatching?.(job);
                    }}
                    disabled={isActionDisabled(job.status)}
                  >
                    {statusLabel(job.status)}
                  </button>

                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(job);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h4>{editId ? "Edit Job Description" : "Upload / Add Job Description"}</h4>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                <FiX />
              </button>
            </div>

            {/* Fields */}
            <div className="modal-form">
              <div className="field">
                <label className="label">REQ ID</label>
                <input
                  value={newReqId}
                  onChange={(e) => setNewReqId(e.target.value)}
                  placeholder="e.g. REQ ID - 12345"
                />
              </div>

              <div className="field">
                <label className="label">Job Title</label>
                <input
                  ref={titleRef}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={6}
                  placeholder="Short job description"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={addOrUpdateJob}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
