// TikTok Full Site Blocker
// Completely blocks TikTok to prevent distractions

(function() {
  'use strict';

  // Inject blocking styles immediately
  const style = document.createElement('style');
  style.textContent = `
    body > * {
      display: none !important;
    }
    body::before {
      content: "TikTok is blocked";
      display: flex !important;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #000;
      color: #888;
      font-size: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      z-index: 999999;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  // Stop any video playback
  function stopVideos() {
    document.querySelectorAll('video').forEach(video => {
      video.pause();
      video.src = '';
      video.load();
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stopVideos);
  } else {
    stopVideos();
  }

  // Watch for dynamically added videos
  const observer = new MutationObserver(() => {
    stopVideos();
  });

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
})();
