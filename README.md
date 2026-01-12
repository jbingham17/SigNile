# SigNile

A Chrome extension that blocks distracting content on social media sites while keeping essential features accessible.

## Supported Sites

### Instagram
- Blocks the main feed, stories, reels, and DMs
- Allows access to search and user profiles

### YouTube
- Hides homepage feed, recommendations sidebar, and Shorts
- Removes autoplay, end screen suggestions, and pause overlay suggestions
- Hides search bar and left sidebar
- Allows direct video playback via URL

### Reddit
- Blocks homepage, r/popular, r/all, and non-whitelisted subreddits
- Allows configurable subreddit whitelist (edit `reddit.js` to customize)
- Permits threads accessed from external links (Google, etc.)
- Hides sidebars and community suggestions

### X (Twitter)
- Hides Creator Studio from the sidebar

### LinkedIn
- Blocks the main feed
- Allows access to profiles and individual posts

### Wikipedia
- Blocks distracting content while preserving article access

### JetPunk
- Blocks distracting content

### smol.ai
- Hides Discord recap sections

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder

## Configuration

### Reddit Whitelist
Edit the `WHITELISTED_SUBREDDITS` array in `reddit.js` to allow specific subreddits:

```javascript
const WHITELISTED_SUBREDDITS = [
  'claudeai',
  'claudecode',
  // add your subreddits here
];
```

## License

MIT
