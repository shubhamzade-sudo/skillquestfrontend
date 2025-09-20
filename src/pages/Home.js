import React from "react";
import "./Home.css";
import PopulationChart from "./PopulationChart";

const Home = () => {
  const totalRecords = 5768;
  const bench = 207;
  const lastUpdated = "2025-09-03";

  return (
    <div className="home">
      <h2 className="snapshot-heading">Employee Snapshot</h2>

      <div className="snapshot">
        <div className="card">
          <h3>Total Records</h3>
          <p>{totalRecords.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Bench</h3>
          <p>{bench}</p>
        </div>
        <div className="card">
          <h3>Last Updated</h3>
          <p>{lastUpdated}</p>
        </div>
      </div>

      <div className="chart">
        <div className="echart-wrapper">
          <PopulationChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
