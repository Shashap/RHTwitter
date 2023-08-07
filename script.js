// script.js

// Function to load content based on the navigation link clicked
function loadContent(route) {
  const contentDiv = document.getElementById('content');

  fetch(route) // Replace with appropriate server route
    .then(response => response.text())
    .then(html => contentDiv.innerHTML = html)
    .catch(error => console.error('Error fetching content:', error));
}

// Handle navigation links clicks
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const route = link.getAttribute('href').substring(1);
      loadContent(route);
    });
  });
});

// Load default content on page load
document.addEventListener('DOMContentLoaded', () => {
  loadContent('feed'); // Load 'feed' content on page load
});
