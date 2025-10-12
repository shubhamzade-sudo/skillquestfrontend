// MatchingEvaluation.jsx
import React, { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiDownload,FiChevronLeft } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./MatchingEvaluation.css";
import CandidateBarChart from "./CandidateBarChart";
import CandidateTable from "./CandidateTable";
import CandidateCards from "../ components/CandidateCards";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

const MatchingEvaluation = ({ job, onBack }) => {
  console.log("MatchingEvaluation received job prop:", job);
  const [topK, setTopK] = useState(5);
  const [scoringMode, setScoringMode] = useState("default");
  const [getEvaluation, setGetEvaluation] = useState(false);
  const lastEvaluatedJobIdRef = useRef(null);

  // New: candidates state fetched by parent
  const [candidates, setCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidatesError, setCandidatesError] = useState(null);

  const handleEvaluation = async () => {
    if (job?.id && lastEvaluatedJobIdRef.current === job.id && getEvaluation) return;

    // simulate async evaluation (replace with real API call)
    setGetEvaluation(false);
    await new Promise((r) => setTimeout(r, 250));
    lastEvaluatedJobIdRef.current = job?.id ?? null;
    setGetEvaluation(true);
  };

  // auto-run when job changes
  useEffect(() => {
    if (job) {
      setGetEvaluation(false);
      const t = setTimeout(() => handleEvaluation(), 50);
      return () => clearTimeout(t);
    } else {
      setGetEvaluation(false);
      lastEvaluatedJobIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  // NEW: fetch candidates for this jd_id when job?.jd_id changes
  useEffect(() => {
    if (job?.jd_id == null) {
      setCandidates([]);
      setCandidatesError(null);
      setCandidatesLoading(false);
      return;
    }

    let cancelled = false;
    async function fetchCandidates() {
      setCandidatesLoading(true);
      setCandidatesError(null);
      try {
        const resp = await axios.get(`${API_BASE}/jd_matching_score/${job.jd_id}`, {
          headers: { accept: "application/json" },
        });
        let data = resp.data;
        if (!Array.isArray(data)) data = [data];

        const mapped = data.map((row) => ({
          id: row.workday_id,
          score: row.weighted_score,
          recommendation: row.recommendation,
          skills_gaps: row.skills_gaps,
          recommended_training: row.recommended_training,
          raw: row,
        }));

        if (!cancelled) setCandidates(mapped);
      } catch (err) {
        if (!cancelled) {
          setCandidatesError(err?.response?.data || err.message || "Unknown error");
          setCandidates([]);
        }
      } finally {
        if (!cancelled) setCandidatesLoading(false);
      }
    }

    fetchCandidates();
    return () => {
      cancelled = true;
    };
  }, [job?.jd_id]);

  // PDF logic (unchanged)
  const handleDownloadPdf = async () => {
    if (!getEvaluation) {
      await handleEvaluation();
      await new Promise((r) => setTimeout(r, 300));
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 8;
    const a4WidthMm = 210;
    const a4HeightMm = 297;
    const availableWidth = a4WidthMm - margin * 2;

    const tableEl = document.getElementById("capture-table");
    const chartEl = document.getElementById("capture-chart");

    async function addElementToPdf(el, addNewPage = true) {
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = { widthPx: canvas.width, heightPx: canvas.height };
      const pxToMm = (px) => (px * 25.4) / 96;
      const imgWidthMm = pxToMm(imgProps.widthPx);
      const imgHeightMm = pxToMm(imgProps.heightPx);
      const scale = availableWidth / imgWidthMm;
      const renderWidth = imgWidthMm * scale;
      const renderHeight = imgHeightMm * scale;

      if (renderHeight <= a4HeightMm - margin * 2) {
        if (!addNewPage) {
          // first page already present
        } else {
          pdf.addPage();
          pdf.setPage(pdf.getNumberOfPages());
        }
        pdf.addImage(imgData, "PNG", margin, margin, renderWidth, renderHeight);
      } else {
        const pageHeightPx = Math.round(((a4HeightMm - margin * 2) * 96) / 25.4);
        const totalHeightPx = canvas.height;
        let yOffset = 0;
        let pageIndex = 0;

        while (yOffset < totalHeightPx) {
          const sliceHeight = Math.min(pageHeightPx, totalHeightPx - yOffset);
          const tmpCanvas = document.createElement("canvas");
          tmpCanvas.width = canvas.width;
          tmpCanvas.height = sliceHeight;
          const tmpCtx = tmpCanvas.getContext("2d");
          tmpCtx.drawImage(canvas, 0, yOffset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

          const tmpData = tmpCanvas.toDataURL("image/png");
          const sliceHeightMm = pxToMm(sliceHeight);
          const renderSliceHeight = sliceHeightMm * scale;

          if (pageIndex !== 0 || addNewPage) pdf.addPage();
          pdf.setPage(pdf.getNumberOfPages());
          pdf.addImage(tmpData, "PNG", margin, margin, renderWidth, renderSliceHeight);

          yOffset += sliceHeight;
          pageIndex++;
        }
      }
    }

    try {
      pdf.deletePage(1);
    } catch (err) {
      // ignore
    }

    await addElementToPdf(tableEl, true);
    await addElementToPdf(chartEl, true);

    pdf.save(`${(job?.title || "evaluation").replace(/\s+/g, "-")}-results.pdf`);
  };

  // helper to render tech stack badges (job.techStack expected as array of strings)
  const renderTechStack = () => {
    const stack = job?.techStack;
    if (!stack || !Array.isArray(stack) || stack.length === 0) return null;

    return (
      <div className="tech-stack" aria-label="Tech stack">
        {stack.map((t, i) => (
          <span key={i} className="tech-badge" title={t}>
            {t}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="matching-container">
      {/* header */}
      <div className="matching-header">
        <div className="title-block">
          <div className="title-and-meta">
            <strong className="job-title">{job?.title || "Selected JD"}</strong>
            <div className="job-id">{job?.jd_id ? `REQ ID: ${job.jd_id}` : ""}</div>
            {job?.description && (
              <div className="job-desc-short">
                {job.description?.split(" ").slice(0, 20).join(" ") +
                  (job.description?.split(" ").length > 10 ? "..." : "")}
              </div>
            )}
            {renderTechStack()}
          </div>
        </div>

        <div className="right">
          {getEvaluation ? (
            <button
              onClick={handleDownloadPdf}
              className="download-btn"
              title="Download results as PDF"
              aria-label="Download PDF"
            >
              <FiDownload size={16} style={{ marginRight: 8 }} />
              Download
            </button>
          ) : (
            <div className="download-placeholder" aria-hidden="true" />
          )}
        </div>


      </div>

      {getEvaluation && (
        <>
          {/* Pass candidates/fetch state down to CandidateCards */}
          <CandidateCards
            topK={6}
            jd_id={job?.jd_id}
            candidates={candidates}
            loading={candidatesLoading}
            error={candidatesError}
          />

          <h2 className="table-title">Candidate Ranking Table</h2>
          <div id="capture-table" className="capture-wrapper">
            <CandidateTable topK={topK} candidates={candidates} />
          </div>

          <h2 className="table-title">Candidate Final Score Comparison</h2>
          <div id="capture-chart" className="capture-wrapper">
            <CandidateBarChart topK={topK} candidates={candidates} />
          </div>
        </>
      )}
    </div>
  );
};

export default MatchingEvaluation;
