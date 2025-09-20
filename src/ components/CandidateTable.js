import React from "react";
import "./TextUploader.css";


// Sample static data for the table



const CandidateTable = ({ topK, candidates }) => {

    console.log("candidates in table:", candidates);
    return (
        <div className="table-container">

            <table className="candidate-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Candidate ID</th>

                        <th>score</th>
                        <th>Skills gaps</th>
                        <th>Recommended training</th>


                    </tr>
                </thead>
                <tbody>
                    {candidates?.map((row, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{row.id}</td>

                            <td>{row.score}</td>
                            <td>{row.skills_gaps}</td>
                            <td>{row.recommended_training}</td>


                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default CandidateTable;