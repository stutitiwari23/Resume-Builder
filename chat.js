const chatBtn = document.getElementById("chat-btn");
const chatBox = document.getElementById("chat-container");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBody = document.getElementById("chat-body");
const resizeHandle = document.getElementById("chat-resize-handle");

chatBtn.onclick = () => chatBox.style.display = "flex";
closeChat.onclick = () => chatBox.style.display = "none";

sendBtn.onclick = sendMessage;

// Resize functionality
let isResizing = false;
let startX, startY, startWidth, startHeight, startRight, startBottom;

resizeHandle.addEventListener("mousedown", initResize);

function initResize(e) {
  e.preventDefault();
  isResizing = true;
  
  startX = e.clientX;
  startY = e.clientY;
  startWidth = chatBox.offsetWidth;
  startHeight = chatBox.offsetHeight;
  
  const rect = chatBox.getBoundingClientRect();
  startRight = window.innerWidth - rect.right;
  startBottom = window.innerHeight - rect.bottom;
  
  document.body.classList.add("chat-resizing");
  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}

function resize(e) {
  if (!isResizing) return;
  
  const deltaX = startX - e.clientX;
  const deltaY = startY - e.clientY;
  
  const newWidth = Math.min(Math.max(startWidth + deltaX, 280), 600);
  const newHeight = Math.min(Math.max(startHeight + deltaY, 300), window.innerHeight * 0.8);
  
  chatBox.style.width = newWidth + "px";
  chatBox.style.height = newHeight + "px";
}

function stopResize() {
  isResizing = false;
  document.body.classList.remove("chat-resizing");
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
}

// Touch support for resize
resizeHandle.addEventListener("touchstart", initTouchResize, { passive: false });

function initTouchResize(e) {
  e.preventDefault();
  const touch = e.touches[0];
  isResizing = true;
  
  startX = touch.clientX;
  startY = touch.clientY;
  startWidth = chatBox.offsetWidth;
  startHeight = chatBox.offsetHeight;
  
  document.body.classList.add("chat-resizing");
  document.addEventListener("touchmove", touchResize, { passive: false });
  document.addEventListener("touchend", stopTouchResize);
}

function touchResize(e) {
  if (!isResizing) return;
  e.preventDefault();
  
  const touch = e.touches[0];
  const deltaX = startX - touch.clientX;
  const deltaY = startY - touch.clientY;
  
  const newWidth = Math.min(Math.max(startWidth + deltaX, 280), 600);
  const newHeight = Math.min(Math.max(startHeight + deltaY, 300), window.innerHeight * 0.8);
  
  chatBox.style.width = newWidth + "px";
  chatBox.style.height = newHeight + "px";
}

function stopTouchResize() {
  isResizing = false;
  document.body.classList.remove("chat-resizing");
  document.removeEventListener("touchmove", touchResize);
  document.removeEventListener("touchend", stopTouchResize);
}

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
