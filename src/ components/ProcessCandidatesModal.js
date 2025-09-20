import React, { useState, useEffect } from "react";


const Spinner = () => (
  <div className="spinner"></div>
);


const ProcessCandidatesModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(true);
      setDone(false);

      // Step 1: Load data to Snowflake for 2 seconds
      const step1Timer = setTimeout(() => {
        setStep(2);
        setLoading(true);

        // Step 2: Generate candidate embeddings for 2 seconds
        const step2Timer = setTimeout(() => {
          setLoading(false);
          setDone(true);
        }, 2000);

        return () => clearTimeout(step2Timer);
      }, 2000);

      return () => clearTimeout(step1Timer);
    } else {
      // reset when modal closes
      setStep(1);
      setLoading(true);
      setDone(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!done && (
          <>
            {step === 1 && (
              <>
                <h3>Load Data to Snowflake</h3>
                {/* {loading && <div className="loader">Loading...</div>} */}
                {loading && <Spinner />}

              </>
            )}

            {step === 2 && (
              <>
                <h3>Generate Candidate Embeddings</h3>
                {/* {loading && <div className="loader">Loading...</div>} */}
              {loading && <Spinner />}

              </>
            )}
          </>
        )}

        {done && (
          <div>
            <h3>Process Completed Successfully!</h3>
            <button className="done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessCandidatesModal;
