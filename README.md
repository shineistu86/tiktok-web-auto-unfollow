# TikTok Web Auto Unfollow

Automation script for TikTok Web that automatically unfollows accounts with the **"Following"** status while safely skipping **"Friends"** (mutual) accounts.

The script runs directly inside the browser console using pure JavaScript DOM automation.

No private TikTok API, Puppeteer, Selenium, or external libraries are used.

---

# Features

- Auto unfollow `"Following"` accounts
- Automatically skip `"Friends"` accounts
- Human-like randomized delay
- Infinite scroll support
- Real-time progress logging
- Automatic cooldown when rate limit is detected
- Duplicate processing prevention
- Safe DOM existence checking
- Graceful error recovery
- Manual stop support via `window._stopUnfollow()`
- No external dependencies required
- Runs directly in Chrome DevTools Console

---

# How It Works

The script:

1. Detects the TikTok Following popup
2. Searches for buttons labeled `"Following"`
3. Simulates human-like clicks
4. Skips `"Friends"` accounts automatically
5. Scrolls through the popup dynamically
6. Repeats until all accounts are processed
7. Displays a final summary in the console

---

# Requirements

- Google Chrome
- Active TikTok Web session
- Logged into your TikTok account

---

# Installation

No installation required.

The script runs directly from the browser console.

---

# Usage

## 1. Open TikTok Web

Go to your TikTok profile page.

Example:

```text
https://www.tiktok.com/@yourusername
```

---

## 2. Open Following Popup

Click the **Following** count on your profile.

The Following popup must remain open while the script is running.

---

## 3. Open Chrome DevTools

Press:

```text
F12
```

Then open the:

```text
Console
```

tab.

---

## 4. Paste The Script

Copy the script content and paste it into the browser console.

Press:

```text
Enter
```

The automation will start immediately.

---

# Stop The Script

You can stop the automation anytime by running:

```javascript
window._stopUnfollow()
```

---

# Script Behavior

| Button Text | Action |
|---|---|
| Following | Unfollow |
| Friends | Skip |
| Follow | Ignore |

---

# Built-in Safety Mechanisms

The script includes several protections to reduce automation issues:

- Randomized delay between actions
- Automatic cooldown when rate limiting is detected
- Duplicate action prevention
- Scroll-aware processing
- Safe element validation before clicking
- Graceful error handling without stopping the script
- Human-like click simulation

---

# Configuration

The script contains configurable values inside:

```javascript
const CONFIG = {
  DELAY_MIN: 800,
  DELAY_MAX: 2500,
  SCROLL_AMOUNT: 400,
  SCROLL_WAIT: 1500,
  LOAD_WAIT_MIN: 1200,
  LOAD_WAIT_MAX: 2200,
  RATE_LIMIT_COOLDOWN: 30000,
  MAX_RATE_LIMIT_HITS: 3,
  MAX_ITERATIONS: 2000,
  NO_NEW_ITEMS_LIMIT: 5,
};
```

## Configuration Explanation

| Option | Description |
|---|---|
| DELAY_MIN | Minimum delay between actions |
| DELAY_MAX | Maximum delay between actions |
| SCROLL_AMOUNT | Scroll distance per iteration |
| LOAD_WAIT_MIN | Minimum wait time after scrolling |
| LOAD_WAIT_MAX | Maximum wait time after scrolling |
| RATE_LIMIT_COOLDOWN | Cooldown duration when rate limit is detected |
| MAX_RATE_LIMIT_HITS | Maximum failed attempts before cooldown |
| MAX_ITERATIONS | Maximum loop iterations |
| NO_NEW_ITEMS_LIMIT | Stop threshold when no new items are found |

---

# Console Output Example

```text
[TikTok-Unfollow] Script dimulai. Mencari tombol Following...

[TikTok-Unfollow] Unfollow: username123 (Total: 12)

[TikTok-Unfollow] Skip 5 akun Friends di layar ini.

[TikTok-Unfollow] Progress — Unfollow: 45 | Skip Friends: 12 | Gagal: 1 | Total: 58

[TikTok-Unfollow] Semua following telah diproses!
```

---

# File Structure

```text
tiktok-web-auto-unfollow/
│
├── README.md
└── auto-unfollow-tiktok-web.js
```

---

# Tech Stack

- JavaScript
- Browser DOM Automation
- Chrome DevTools

---

# Limitations

- TikTok UI updates may break selectors in the future
- Excessive unfollow actions may trigger temporary TikTok rate limits
- Requires the Following popup to stay open during execution
- Browser tab must remain active while running

---

# Troubleshooting

## Popup Not Detected

Make sure the Following popup is already open before running the script.

---

## Script Stops Automatically

TikTok may temporarily rate limit actions.

Wait a few minutes and try again.

---

## Buttons Not Clicking

Possible causes:
- TikTok changed its DOM structure
- Popup not fully loaded
- Browser extensions interfering with page scripts

---

# Disclaimer

This project is intended for educational and personal automation purposes only.

Users are responsible for complying with TikTok's Terms of Service and platform policies.

Use at your own risk.

---

# License

MIT License
