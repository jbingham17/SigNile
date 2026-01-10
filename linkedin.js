// LinkedIn Content Blocker
// Blocks only the home feed while allowing profiles, posts, and other pages

(function() {
  'use strict';

  // Check if on the home feed page (not profiles or posts)
  function isBlockedPage() {
    const path = window.location.pathname.toLowerCase();

    // Only block the main home feed
    if (path === '/feed' || path === '/feed/' || path.startsWith('/feed?')) return true;

    // Block homepage that redirects to feed
    if (path === '/' || path === '') return true;

    // Allow everything else: profiles (/in/), posts (/posts/), jobs, messages, etc.
    return false;
  }

  // Hide feed content
  function hideContent() {
    if (!isBlockedPage()) return;

    const hideSelectors = [
      // Main content area - hide everything
      'main.scaffold-layout__main',
      '.scaffold-layout__main',
      '.scaffold-layout__content',
      '.scaffold-layout__row',
      // Main feed container
      '.scaffold-finite-scroll',
      '.feed-shared-update-v2',
      '.occludable-update',
      // Feed posts
      '[data-id^="urn:li:activity"]',
      // News module
      '.news-module',
      // Feed sidebar
      '.feed-follows-module',
      // Core rail
      '.core-rail',
      // All main elements
      'main[role="main"]',
      'div.scaffold-layout',
    ];

    hideSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    });

    // Also hide all elements inside main
    document.querySelectorAll('main').forEach(main => {
      main.style.setProperty('display', 'none', 'important');
    });
  }

  // Create and show blocked message
  function showBlockedMessage() {
    if (!isBlockedPage()) {
      removeBlockedMessage();
      return;
    }

    if (document.getElementById('linkedin-blocker-message')) return;

    const message = document.createElement('div');
    message.id = 'linkedin-blocker-message';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      color: #666;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      text-align: center;
      padding: 40px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 99999;
      max-width: 400px;
    `;

    message.innerHTML = `
      <div style="font-size: 24px; margin-bottom: 16px; color: #0a66c2;">LinkedIn Feed Blocked</div>
      <div style="margin-bottom: 20px;">The home feed is blocked to help you stay focused.</div>
      <div style="font-size: 14px; color: #666;">
        You can still access:<br>
        <span style="color: #0a66c2;">Profiles, Posts, Jobs, Messages, Notifications, and Search</span>
      </div>
    `;

    document.body.appendChild(message);
  }

  // Remove blocked message
  function removeBlockedMessage() {
    const message = document.getElementById('linkedin-blocker-message');
    if (message) {
      message.remove();
    }
  }

  // Main blocker function
  function runBlocker() {
    if (isBlockedPage()) {
      hideContent();
      showBlockedMessage();
    } else {
      removeBlockedMessage();
    }
  }

  // Initial run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBlocker);
  } else {
    runBlocker();
  }

  // Watch for dynamic content (LinkedIn is a SPA)
  const observer = new MutationObserver(() => {
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
