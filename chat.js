const chatBtn = document.getElementById("chat-btn");
const chatBox = document.getElementById("chat-container");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");

chatBtn.onclick = () => chatBox.style.display = "flex";
closeChat.onclick = () => chatBox.style.display = "none";

sendBtn.onclick = sendMessage;

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user-msg");
  userInput.value = "";

  // Temporary AI response
  setTimeout(() => {
    addMessage(getBotReply(text), "bot-msg");
  }, 600);
}

function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerText = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotReply(query) {
  return "I'm here to help! Soon I’ll provide AI-powered answers related to resumes, ATS optimization, and templates.";
}
