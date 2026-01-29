document.getElementById("feedbackForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Step 1: Create feedback object
  const feedbackData = {
    name: e.target[0].value || "Anonymous",
    email: e.target[1].value || "Not provided",
    message: e.target[2].value,
    timestamp: new Date().toLocaleString(),
    reviewed: false
  };

  // Step 2: Get existing feedback from localStorage
  const existingFeedback =
    JSON.parse(localStorage.getItem("userFeedback")) || [];

  // Step 3: Add new feedback
  existingFeedback.push(feedbackData);

  // Step 4: Save back to localStorage
  localStorage.setItem("userFeedback", JSON.stringify(existingFeedback));

  // Step 5: Show success message
  document.getElementById("feedbackSuccess").style.display = "block";

  // Step 6: Reset form
  e.target.reset();
});
