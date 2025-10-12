import React, { useState } from "react";
import axios from "axios";
import "./ChatbotComp.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

const ChatbotComp = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]); // now holds both summary & tables
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Push user's message to chat
    setChat((prev) => [...prev, { sender: "user", text: input }]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/cortex/ask`, {
        question: userInput,
      });

      const { summary, sql_results } = response.data;

      // Build bot message
      const botMessage = {
        sender: "bot",
        summary: summary && summary.length > 0 ? summary.join("\n") : null,
        tableData:
          sql_results &&
          sql_results.length > 0 &&
          sql_results[0].data &&
          sql_results[0].data.length > 0
            ? sql_results[0].data
            : null,
      };

      // Append bot response
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error fetching data from server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-area">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {/* === USER MESSAGE === */}
            {msg.sender === "user" && <>{msg.text}</>}

            {/* === BOT MESSAGE === */}
            {msg.sender === "bot" && (
              <>
                {msg.text && <div>{msg.text}</div>}

                {/* Summary */}
                {msg.summary && (
                  <div style={{ marginTop: "4px" }}>
                    <strong>Summary:</strong>
                    <p style={{ whiteSpace: "pre-line" }}>{msg.summary}</p>
                  </div>
                )}

                {/* Table */}
                {msg.tableData && msg.tableData.length > 0 && (
                  <div className="table-wrapper" style={{ marginTop: "8px" }}>
                    <strong>Results:</strong>
                    <table className="chatbot-table">
                      <thead>
                        <tr>
                          {Object.keys(msg.tableData[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.tableData.map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((value, i) => (
                              <td key={i}>{String(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-message bot">Processing your request...</div>
        )}
      </div>

      <div className="chatbot-input-box">
        <textarea
          className="chatbot-input"
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button className="chatbot-send" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotComp;
