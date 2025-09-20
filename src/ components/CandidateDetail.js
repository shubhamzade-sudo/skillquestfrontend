import React, { useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiChevronLeft } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./CandidateDetail.css";
import { ReactComponent as StarIcon } from "../assets/idea_logo.svg";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state?.candidate;
  const contentRef = useRef(null);

  // PDF Export
  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth - 20; // margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${candidate?.name || "candidate"}-report.pdf`);
  };




  console.log("CandidateDetail render", { id, candidate });
  if (!candidate) {
    return (
      <div className="candidate-detail-root">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft size={20} />
        </button>
        <h2>Candidate not found</h2>
        <p>Open a candidate card from the list to view details.</p>
      </div>
    );
  }

  return (
    <div className="candidate-detail-root" ref={contentRef}>
      {/* Header */}
      {/* Header */}
      <div className="detail-header">
        {/* Left side */}
        <div className="title-with-back">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiChevronLeft size={25} color="#000000" />
          </button>
          <div className="header-inline">
            <h1>Workday Id {candidate.id}</h1>
            <span className="meta">{candidate.role}</span>
            <span className="sep">•</span>
            <span className="meta"> REQ ID: {candidate?.raw?.jd_id}</span>
            <span className="sep">•</span>
            <span className="meta score-pill">Score: {candidate.score}</span>
          </div>
        </div>

        {/* Right side */}
        <button
          onClick={handleDownloadPdf}
          className="download-btn"
          title="Download results as PDF"
          aria-label="Download PDF"
        >
          <FiDownload size={16} style={{ marginRight: 8 }} />
          Download
        </button>
      </div>

      {/* Body */}
      <section>
        <h2>Overview</h2>
        <p className="summary">
          The candidate is a strong fit for the role with a solid technical background and relevant experience.
          However, they have skill gaps in {candidate.skills_gaps || "certain areas"} that need to be addressed in order to fully meet the job requirements.
          To bridge these gaps, it is recommended that the candidate undergo training in{" "}
          <strong>{candidate.recommended_training || "relevant technologies"}</strong>,
          which will further enhance their skills and better align them with the job description.
        </p>
      </section>


      <section>
        <h3>skills Gaps</h3>
        {candidate.skills_gaps?.split(",").length ? (
          <div className="skills-tabs">
            {candidate.skills_gaps?.split(",").map((t, i) => (
              <div key={i} className="tab">{t}</div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No tech stack provided.</p>
        )}
      </section>
      <section className="training-section">
        <div style={{ display: "flex", alignItems: "center",textAlign:"center", gap: 8 }}>
          <StarIcon className="star-icon" /> 
           <h3 style={{marginTop:"12px"}}>Recommended Training</h3>
        </div>
       
        <div className="training-box">
          <p>{candidate.recommended_training}</p>
        </div>
      </section>

      <section>
        <h3>Experience</h3>
        {candidate.experience?.length ? (
          <ul className="experience-list">
            {candidate.experience.map((exp, i) => (
              <li key={i}>
                <strong>{exp.position}</strong> at {exp.company} ({exp.years})
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">No experience data available.</p>
        )}
      </section>

      <section>
        <h3>Education</h3>
        {candidate.education ? (
          <p>
            {candidate.education.degree} — {candidate.education.institution} ({candidate.education.year})
          </p>
        ) : (
          <p className="empty-text">No education details available.</p>
        )}
      </section>



      <section>
        <h3>Notes</h3>
        {/* <p className="long-text">{candidate.notes}</p> */}
        <p className="long-text">The candidate is reliable and detail-oriented.
          They take ownership of tasks and deliver results on time.
          Recommended to involve them in client-facing projects to build confidence.
        </p>
      </section>
    </div>
  );
};

export default CandidateDetail;
