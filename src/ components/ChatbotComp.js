import React, { useState, useRef, useEffect } from "react";
import "./ChatbotComp.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const ChatbotComp = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatAreaRef = useRef(null);

  // Lock parent .main-content scroll when chatbot is mounted
  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.overflow = "hidden";
      mainContent.style.padding = "0";
    }
    return () => {
      if (mainContent) {
        mainContent.style.overflow = "";
        mainContent.style.padding = "";
      }
    };
  }, []);

  // Scroll only within chat-area
  useEffect(() => {
    const el = chatAreaRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chat, loading]);

  const formatBotResponse = (data) => {
    const parts = [];

    if (data.summary && data.summary.length > 0) {
      parts.push(data.summary.join("\n"));
    }

    if (data.sql_results && data.sql_results.length > 0) {
      data.sql_results.forEach((result) => {
        if (result.error) {
          parts.push(`Error: ${result.error}`);
        } else if (result.data && result.data.length > 0) {
          const columns = Object.keys(result.data[0]);
          parts.push({ type: "table", columns, rows: result.data });
        }
      });
    }

    return parts;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setChat((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/cortex/ask`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const parts = formatBotResponse(data);

      setChat((prev) => [...prev, { sender: "bot", parts }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", parts: [`Something went wrong: ${error.message}`] },
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

  const renderMessage = (msg, index) => {
    if (msg.sender === "user") {
      return (
        <div key={index} className="chat-message user">
          {msg.text}
        </div>
      );
    }

    return (
      <div key={index} className="chat-message bot">
        {msg.parts.map((part, i) => {
          if (typeof part === "string") {
            return <p key={i} style={{ margin: "0 0 8px 0", whiteSpace: "pre-wrap" }}>{part}</p>;
          }
          if (part.type === "table") {
            return (
              <table key={i} className="chat-table">
                <thead>
                  <tr>
                    {part.columns.map((col) => (
                      <th key={col}>{col.replace(/_/g, " ")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {part.rows.map((row, ri) => (
                    <tr key={ri}>
                      {part.columns.map((col) => (
                        <td key={col}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="chatbot-container">
      <div className="chat-area" ref={chatAreaRef}>
        {chat.map((msg, index) => renderMessage(msg, index))}
        {loading && (
          <div className="chat-message bot">
            <em>Thinking...</em>
          </div>
        )}
      </div>

      <div className="chatbot-input-box">
        <textarea
          className="chatbot-input"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          disabled={loading}
        />
        <button className="chatbot-send" onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotComp;
