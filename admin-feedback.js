// Get table body element
const tableBody = document.querySelector("#feedbackTable tbody");

// Function to load feedback from localStorage
function loadFeedback() {
  // Clear existing rows
  tableBody.innerHTML = "";

  // Get stored feedback
  const feedbackList =
    JSON.parse(localStorage.getItem("userFeedback")) || [];

  // If no feedback found
  if (feedbackList.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="6" style="text-align:center;">
        No feedback submitted yet.
      </td>
    `;
    tableBody.appendChild(row);
    return;
  }

  // Loop through feedback and create rows
  feedbackList.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.message}</td>
      <td>${item.timestamp}</td>
      <td class="${item.reviewed ? "status-reviewed" : "status-pending"}">
        ${item.reviewed ? "Reviewed" : "Pending"}
      </td>
      <td>
        <button onclick="markReviewed(${index})">Review</button>
        <button onclick="deleteFeedback(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Mark feedback as reviewed
function markReviewed(index) {
  const feedbackList =
    JSON.parse(localStorage.getItem("userFeedback")) || [];

  feedbackList[index].reviewed = true;
  localStorage.setItem("userFeedback", JSON.stringify(feedbackList));

  loadFeedback();
}

// Delete feedback
function deleteFeedback(index) {
  const feedbackList =
    JSON.parse(localStorage.getItem("userFeedback")) || [];

  feedbackList.splice(index, 1);
  localStorage.setItem("userFeedback", JSON.stringify(feedbackList));

  loadFeedback();
}

// Load feedback on page load
loadFeedback();
