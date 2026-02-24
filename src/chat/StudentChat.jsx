import { useEffect, useState } from "react";

function StudentChat() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const user = localStorage.getItem("loggedInUser");
  const userEmail = localStorage.getItem("loggedInUserEmail");

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(chats.filter((m) => m.user === user || m.user === userEmail));
  }, []);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const allMsgs = JSON.parse(localStorage.getItem("chatMessages")) || [];

    const msgObj = {
      id: Date.now(),
      user,
      userId: user,
      userEmail,
      message: newMsg,
      sender: "student",
      reply: null,
      date: new Date().toISOString(),
    };

    allMsgs.push(msgObj);
    localStorage.setItem("chatMessages", JSON.stringify(allMsgs));

    setMessages(allMsgs.filter((m) => m.user === user || m.user === userEmail));
    setNewMsg("");

    alert("Message sent to admin!");
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <h2 className="form-title">Chat with Admin</h2>

        <div className="clean-list">
          {messages.map((msg) => (
            <div key={msg.id} className="list-item-card" style={{ marginBottom: 12 }}>
              <p><strong>You:</strong> {msg.message}</p>
              <p style={{ marginLeft: 20, color: "green" }}>
                {msg.reply ? <strong>Admin:</strong> : ""} {msg.reply}
              </p>
            </div>
          ))}
        </div>

        <div className="form-row" style={{ marginTop: 15 }}>
          <textarea
            placeholder="Type your query..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
        </div>

        <button className="button" onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default StudentChat;
