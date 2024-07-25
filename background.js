// background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleDropdown
    });
  });
  
  function toggleDropdown() {
    // Send a message to the content script to toggle the dropdown
    chrome.runtime.sendMessage({ action: 'toggleDropdown' });
  }
  