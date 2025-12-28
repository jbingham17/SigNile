// Instagram Content Blocker
// Blocks feed while allowing search, explore, and profile viewing

(function() {
  'use strict';

  // Selectors for elements to hide (only on home feed)
  const HIDE_SELECTORS = [
    // Feed posts
    'article',
    // Stories
    'div[role="menu"]',
    '[aria-label*="Stories"]',
    // Suggested users
    'aside',
    // Reels nav link
    '[href*="/reels/"]',
    // Notification content
    '[aria-label="Notifications"] > div > div:not(:first-child)',
  ];

  // Selectors for elements to always keep visible
  const KEEP_SELECTORS = [
    'nav',
    'header',
    '[role="search"]',
    'input[aria-label*="Search"]',
    'input[placeholder*="Search"]',
    '[data-testid="search-results"]',
    '[role="listbox"]',
  ];

  // Check if current page is allowed (profile, explore, or post view)
  function isAllowedPage() {
    const path = window.location.pathname;

    // Block these paths
    const blockedPaths = ['/reels', '/direct', '/stories'];

    // Allow these paths explicitly
    const allowedPaths = ['/explore', '/p/'];

    // Home feed is blocked
    if (path === '/' || path === '') return false;

    // Check if explicitly blocked
    if (blockedPaths.some(blocked => path.startsWith(blocked))) return false;

    // Check if explicitly allowed (explore, individual posts)
    if (allowedPaths.some(allowed => path.startsWith(allowed))) return true;

    // Everything else (profile pages like /{username}/) is allowed
    return true;
  }

  // Alias for backward compatibility
  function isProfilePage() {
    return isAllowedPage();
  }

  // Check if on search results
  function isSearchActive() {
    return document.querySelector('[role="dialog"] input[aria-label*="Search"]') !== null ||
           document.querySelector('[data-testid="search-results"]') !== null;
  }

  // Hide unwanted elements
  function hideElements() {
    // Don't hide on profile pages (user navigated via search)
    if (isProfilePage()) {
      return;
    }

    HIDE_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // Don't hide if it's part of search
        const isPartOfSearch = KEEP_SELECTORS.some(keepSel =>
          el.closest(keepSel) || el.querySelector(keepSel)
        );

        if (!isPartOfSearch) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    });
  }

  // Show blocked message
  function showBlockedMessage() {
    if (isProfilePage() || isSearchActive()) return;

    const main = document.querySelector('main[role="main"]');
    if (main && !document.getElementById('blocker-message')) {
      const existingContent = main.querySelector('section > main');
      if (existingContent) {
        existingContent.style.setProperty('visibility', 'hidden', 'important');
      }

      const message = document.createElement('div');
      message.id = 'blocker-message';
      message.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60vh;
        font-size: 20px;
        color: #8e8e8e;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
        padding: 20px;
      `;
      message.textContent = 'Feed blocked — Use search to find people';

      // Insert at beginning of main
      if (!main.querySelector('#blocker-message')) {
        main.insertBefore(message, main.firstChild);
      }
    }
  }

  // Remove blocked message when on allowed pages
  function removeBlockedMessage() {
    const message = document.getElementById('blocker-message');
    if (message && (isProfilePage() || isSearchActive())) {
      message.remove();
      const main = document.querySelector('main[role="main"] section > main');
      if (main) {
        main.style.removeProperty('visibility');
      }
    }
  }

  // Run blocker
  function runBlocker() {
    hideElements();
    if (isProfilePage()) {
      removeBlockedMessage();
    } else {
      showBlockedMessage();
    }
  }

  // Initial run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBlocker);
  } else {
    runBlocker();
  }

  // Watch for dynamic content (Instagram is a SPA)
  const observer = new MutationObserver((mutations) => {
    runBlocker();
  });

  // Start observing when body is available
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      setTimeout(startObserver, 10);
    }
  }

  startObserver();

  // Also run on navigation (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(runBlocker, 100);
    }
  }).observe(document, { subtree: true, childList: true });

})();
