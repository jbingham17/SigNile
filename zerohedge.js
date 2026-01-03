// ZeroHedge Content Blocker
// Removes ads, sidebars, and promotional content

(function() {
  'use strict';

  // Elements to hide (selectors)
  const selectorsToHide = [
    '.leaderboard',
    '[class*="leaderboard"]',
    '.sidebar-left',
    '[class*="SidebarLeft"]',
    '[class*="SidebarRight"]',
    'iframe[aria-label="Advertisement"]',
    '.banner',
    '.bottom-banner-container',
    '.bottom-banner',
    '[class*="PolymarketEmbed"]',
    '[class*="FeaturedContributors"]',
    '[class*="storePromo"]',
    '[class*="TheMarketEarHomePageSidebar"]',
    '[class*="SidebarExpandableTitle"]',
    '[class*="ZeroHedgeReads"]',
    '[class*="TopPosts"]',
    'img[alt*="Zerohedge store"]',
    'img[alt*="ZeroHedge store"]'
  ];

  // Hide elements matching selectors
  function hideElements() {
    selectorsToHide.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });

    // Hide gold earnings calculator widget by text content
    document.querySelectorAll('div').forEach(el => {
      if (el.textContent.includes('Earn up to') && el.textContent.includes('gold')) {
        const region = el.closest('region, [role="region"], div[class*="region"]');
        if (region) {
          region.style.setProperty('display', 'none', 'important');
        } else if (el.children.length < 10) {
          el.style.setProperty('display', 'none', 'important');
        }
      }
    });

    // Center the main content
    const mainContent = document.querySelector('.main-content, [class*="ListFrontPage"]');
    if (mainContent) {
      mainContent.style.setProperty('max-width', '900px', 'important');
      mainContent.style.setProperty('margin', '0 auto', 'important');
      mainContent.style.setProperty('padding', '0 20px', 'important');
    }
  }

  // Track if we've done initial hide
  let initialHideDone = false;

  // Initial run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideElements);
  } else {
    hideElements();
  }

  // Watch for dynamic content - React apps need immediate response on first render
  const observer = new MutationObserver((mutations) => {
    // Run immediately on first significant mutation (React hydration)
    if (!initialHideDone) {
      const hasSignificantContent = document.querySelector('[class*="ListFrontPage"], [class*="Article"], main, article');
      if (hasSignificantContent) {
        initialHideDone = true;
        hideElements();
      }
    }

    // Debounce subsequent runs
    if (observer.timeout) clearTimeout(observer.timeout);
    observer.timeout = setTimeout(hideElements, 100);
  });

  // Start observing when body is available
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      // Run hideElements aggressively during initial load
      hideElements();
      setTimeout(hideElements, 50);
      setTimeout(hideElements, 150);
      setTimeout(hideElements, 300);
      setTimeout(hideElements, 500);
    } else {
      setTimeout(startObserver, 10);
    }
  }

  startObserver();

  // Run periodically to catch any lazy-loaded ads
  setInterval(hideElements, 2000);

})();
