import React, { useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import headerBg from "../assets/dentsuwebsiteheaders.jpg";
import "./Header.css";

const Header = () => {
  const brandRef = useRef(null);
  const uMeasureRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    function setBrandVars() {
      const brandEl = brandRef.current;
      const uEl = uMeasureRef.current;
      const rootEl = rootRef.current;
      if (!brandEl || !uEl || !rootEl) return;

      const uRect = uEl.getBoundingClientRect();
      const brandRect = brandEl.getBoundingClientRect();

      const a = Math.round(brandRect.height); // reference letter height
      const uWidth = Math.round(uRect.width);

      rootEl.style.setProperty("--a", `${a}px`);
      rootEl.style.setProperty("--u-width", `${uWidth}px`);
    }

    setBrandVars();
    window.addEventListener("resize", setBrandVars);
    window.addEventListener("load", setBrandVars);

    return () => {
      window.removeEventListener("resize", setBrandVars);
      window.removeEventListener("load", setBrandVars);
    };
  }, []);

  return (
    <header
      className="dq-header"
      style={{
        backgroundImage: `linear-gradient(rgba(8,10,25,0.52), rgba(8,10,25,0.52)), url(${headerBg})`,
      }}
    >
      <div className="dq-header-inner" ref={rootRef}>
        <div className="dq-left">
          <div className="dq-brand-wrap" aria-label="Dentsu brand">
            <div style={{ position: "relative" }}>
              <strong className="dq-brand-bold" ref={brandRef} tabIndex={0}>
                dentsu
              </strong>
              <span
                className="dq-measure"
                ref={uMeasureRef}
                aria-hidden="true"
              >
                u
              </span>
            </div>

            {/* skillquest split */}
            <span className="dq-brand-sub">
              <span>skillquest</span>
            </span>
          </div>
        </div>

        <div className="dq-right">
          <nav className="dq-nav" aria-label="Primary navigation">
            <a className="dq-nav-link" href="/">Home</a>
            <a className="dq-nav-link" href="/">About</a>
            <a className="dq-nav-link" href="/">Contact</a>
          </nav>

          <button
            className="dq-avatar"
            aria-label="Open profile"
            title="Profile"
            type="button"
          >
            <FaUserCircle />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
