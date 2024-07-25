// content.js

console.log('Content script loaded');

// Function to create the dropdown menu
function createDropdown() {
  console.log('Creating dropdown menu');

  // Create the dropdown element
  const dropdown = document.createElement('select');
  dropdown.id = 'gameModeDropdown';
  dropdown.style.position = 'fixed';
  dropdown.style.top = '10px';
  dropdown.style.right = '10px';
  dropdown.style.zIndex = 1000;
  dropdown.style.padding = '5px';
  dropdown.style.fontSize = '14px';
  dropdown.style.textDecoration = 'Uppercase'
  dropdown.style.backgroundColor = '#fff';
  dropdown.style.color = '#000';
  dropdown.style.border = '1px solid #000';

  // Create the default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.text = 'Select a game Mode from LICHES TV';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  dropdown.appendChild(defaultOption);

  // Append the dropdown to the body
  document.body.appendChild(dropdown);

  // Fetch the game modes from the nav container on the TV page
  fetch('https://lichess.org/tv')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const navContainer = doc.querySelector('.subnav__inner');
      if (navContainer) {
        const links = navContainer.querySelectorAll('a.tv-channel');
        links.forEach(link => {
          const mode = link.getAttribute('href').split('/').pop();
          const modeName = link.querySelector('strong').innerText.toUpperCase();
          const option = document.createElement('option');
          option.value = mode;
          option.text = modeName;
          dropdown.appendChild(option);
        });

        console.log('Dropdown menu added to the page');

        // Event listener to change game mode
        dropdown.addEventListener('change', () => {
          const selectedMode = dropdown.value;
          console.log(`Selected mode: ${selectedMode}`);
          window.location.href = `https://lichess.org/tv/${selectedMode}`;
        });
      } else {
        console.log('Nav container not found');
      }
    })
    .catch(error => console.error('Error fetching TV page:', error));
}

// Function to remove the dropdown menu
function removeDropdown() {
  const dropdown = document.getElementById('gameModeDropdown');
  if (dropdown) {
    dropdown.remove();
    console.log('Dropdown menu removed from the page');
  }
}

// Start the dropdown creation when the page loads
window.addEventListener('load', createDropdown);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleDropdown') {
    removeDropdown();
    createDropdown();
  }
});
