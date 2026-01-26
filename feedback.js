document.getElementById("feedbackForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    name: e.target[0].value,
    email: e.target[1].value,
    feedback: e.target[2].value,
    timestamp: new Date().toISOString()
  };

  console.log("User Feedback:", data);

  document.getElementById("feedbackSuccess").style.display = "block";
  e.target.reset();
});
