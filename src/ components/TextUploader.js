import React from "react";
import "./TextUploader.css"; // import css
import JobList from "./JobList";

const TextUploader = ({ openMatching }) => {
  return (
    <div>
      {/* You can keep other upload UI above if you like */}
      <JobList goToMatching={openMatching} />
    </div>
  );
};

export default TextUploader;