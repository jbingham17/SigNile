// X/Twitter Content Blocker - Hide right sidebar, show only Explore and Profile in nav
// Block home feed (For You / Following) but allow user profiles and posts

(function() {
  'use strict';

  // Block the home feed pages - show blank page
  function isBlockedFeedPage() {
    const path = window.location.pathname;
    return path === '/home' || path === '/' || path === '/explore';
  }

  function blockFeed() {
    if (isBlockedFeedPage()) {
      document.documentElement.innerHTML = '<html><head><title>X</title></head><body style="background:#000"></body></html>';
      return true;
    }
    return false;
  }

  // Check immediately and block if on feed page
  if (blockFeed()) {
    return; // Stop execution if blocked
  }

  function hideElements() {
    // Hide the right sidebar column
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (sidebar) {
      sidebar.style.display = 'none';
    }

    // Hide posts/timeline on user profile pages
    // Profile pages are /@username or /username (not system pages like /home, /explore, /i/*, /search, etc.)
    const path = window.location.pathname;
    const isProfilePage = path.match(/^\/[a-zA-Z0-9_]+$/) &&
                          !['home', 'explore', 'search', 'notifications', 'messages', 'i', 'settings', 'compose'].includes(path.slice(1));

    if (isProfilePage) {
      // Hide all tweets/posts in the timeline
      document.querySelectorAll('[data-testid="tweet"]').forEach(el => {
        el.style.display = 'none';
      });
      // Hide the timeline container that holds posts
      document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach(el => {
        el.style.display = 'none';
      });
      // Hide the tabs (Posts, Replies, Subs, Highlights, Media)
      document.querySelectorAll('[role="tablist"]').forEach(el => {
        el.style.display = 'none';
      });
    }

    // Hide nav items we don't want (keep Explore and Profile)
    const navItemsToHide = [
      'a[href="/home"]',
      'a[href="/i/connect_people"]',
      'a[href="/i/grok"]',
      'a[href$="/communities"]',
      'a[href="/notifications"]',
      'a[href="/messages"]',
      'a[href="/i/bookmarks"]',
      'a[href="/i/lists"]',
      'a[href$="/lists"]',
      'a[href="/i/premium_sign_up"]',
      'a[href="/i/verified-choose"]',
      '[data-testid="AppTabBar_Home_Link"]',
      '[data-testid="AppTabBar_Notifications_Link"]',
      '[data-testid="AppTabBar_DirectMessage_Link"]',
      '[data-testid="AppTabBar_Grok_Link"]',
      '[data-testid="AppTabBar_Communities_Link"]',
      '[data-testid="AppTabBar_More_Menu"]',
      'a[data-testid="SideNav_NewTweet_Button"]',
      'a[aria-label="Lists"]',
      'a[aria-label="Bookmarks"]',
      'a[aria-label="Premium"]'
    ];

    navItemsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
      });
    });

    // Also hide Lists link that has dynamic username in href
    document.querySelectorAll('a[href$="/lists"]').forEach(el => {
      el.style.display = 'none';
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideElements);
  } else {
    hideElements();
  }

  // Use MutationObserver to handle dynamically loaded content
  const observer = new MutationObserver(hideElements);

  function startObserving() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      hideElements();
    } else {
      requestAnimationFrame(startObserving);
    }
  }

  startObserving();

  // Also monitor for client-side navigation (X is a SPA)
  let lastPath = window.location.pathname;
  const navigationObserver = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      blockFeed();
    }
  });

  navigationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
