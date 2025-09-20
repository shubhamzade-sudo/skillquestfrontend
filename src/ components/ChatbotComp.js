import React, { useState } from "react";
import "./ChatbotComp.css";

const ChatbotComp = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setChat([...chat, { text: input, sender: "user" }]);
    setInput("");

    // Optional bot reply
    setTimeout(() => {
      setChat((prev) => [...prev, { text: "How can I help you?", sender: "bot" }]);
    }, 600);
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
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chatbot-input-box">
        <textarea
          className="chatbot-input"
          placeholder="Type your message…"
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
