import { useEffect, useState } from "react";

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(chats);
  }, []);

  const sendReply = (id) => {
    const updated = messages.map((msg) =>
      msg.id === id ? { ...msg, reply: reply } : msg
    );

    localStorage.setItem("chatMessages", JSON.stringify(updated));
    setMessages(updated);
    setReply("");

    alert("Reply sent!");
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Student Queries</h2>

        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="list-item-card" style={{ marginBottom: 15 }}>
              <p><strong>User ID:</strong> {msg.userId || msg.user}</p>
              <p><strong>Message:</strong> {msg.message}</p>

              <p style={{ color: "green" }}>
                <strong>Reply:</strong> {msg.reply || "No reply yet"}
              </p>

              <textarea
                placeholder="Type reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />

              <button
                className="button"
                style={{ marginTop: 10 }}
                onClick={() => sendReply(msg.id)}
              >
                Send Reply
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminChat;
