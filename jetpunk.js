// JetPunk Full Blocker
// Completely blocks access to jetpunk.com

(function() {
  'use strict';

  // Stop page load immediately
  window.stop();

  // Clear the page and show blocked message
  function blockPage() {
    document.documentElement.innerHTML = `
      <head>
        <title>Blocked</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a2e;
            color: #eee;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .blocked-message {
            text-align: center;
          }
          .blocked-message h1 {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .blocked-message p {
            font-size: 18px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="blocked-message">
          <h1>🚫</h1>
          <p>jetpunk.com is blocked</p>
        </div>
      </body>
    `;
  }

  // Block immediately if possible
  if (document.documentElement) {
    blockPage();
  } else {
    document.addEventListener('DOMContentLoaded', blockPage);
  }
})();
