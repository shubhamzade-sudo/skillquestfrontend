import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./CandidateCards.css";

// Import your SVG logo
import { ReactComponent as StarIcon } from "../assets/idea_logo.svg";

const CandidateCards = ({
  topK = 5,
  jd_id,
  candidates = [],
  loading = false,
  error = null,
  nameMap = {},
  roleMap = {},
}) => {
  const navigate = useNavigate();

  // sort desc by score and take topK
  const list = useMemo(() => {
    return (candidates || [])
      .slice()
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, topK);
  }, [candidates, topK]);

  const handleCardClick = (candidate) => {
    navigate(`/candidate/${candidate.id}`, { state: { candidate } });
  };

  return (
    <div className="candidate-cards-root">
      <h1 className="cards-heading">
        <StarIcon className="star-icon" />
        Top {list.length} Candidates
      </h1>
      {loading && <div className="info">Loading candidates…</div>}
      {error && <div className="error">Error: {JSON.stringify(error)}</div>}

      <div className="candidate-grid">
        {list.map((c, i) => {
          const skills = c.skills_gaps ? c.skills_gaps.split(",").map((s) => s.trim()) : [];
          const name = nameMap[c.id] || `${c.id}`;
          const role = roleMap[c.id] || c.recommendation || "—";
          const recText = c.recommended_training || "—";

          return (
            <article
              key={c.id ?? i}
              className="candidate-card"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(c)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(c);
                }
              }}
              aria-label={`Open candidate ${c.id}`}
            >
              <div className="card-head">
                <div className="candidate-id">{c.id}</div>
                <div className="badge" aria-hidden>
                  {i + 1}
                </div>
              </div>

              <div className="card-body">
                {/* Row: Workday id */}
                <div className="line">
                  <div className="label">workday id:</div>
                  <div className="value name-value">{name}</div>
                </div>

                {/* Row: Role */}
                {/* <div className="line">
                  <div className="label">Role:</div>
                  <div className="value role-value">{role}</div>
                </div> */}

                {/* Row: Score */}
                <div className="line">
                  <div className="label">Score:</div>
                  <div className="value score-value">{c.score ?? "—"}</div>
                </div>

                {/* Row: Recommended Training */}
                <div className="line rec">
                  <div className="label">Recommended Training:</div>
                  <div className="value rec-text" title={recText}>
                    {recText}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateCards;
