# WhatsApp AI Extension 

## Overview
This extension enhances WhatsApp Web by allowing you to:
- View and export your latest chat messages in a popup.
- Generate AI-powered reply suggestions based on your latest 10 messages.
- Inject AI-generated replies directly into the WhatsApp input box and send them automatically.
- Copy or export chat messages for backup or analysis.

## Features
- **Message Viewer:** See the latest messages from the active chat, with the newest at the top.
- **AI Reply Generator:** Get smart reply suggestions using AI, based on your recent conversation.
- **One-Click Injection:** Instantly insert and send AI replies to WhatsApp Web.
- **Copy/Export:** Copy the last 10 messages or export all messages as JSON.
- **Clear & Refresh:** Clear stored messages and auto-refresh to fetch the latest from WhatsApp.

## How It Works
- The extension injects a content script into WhatsApp Web to scrape messages and listen for commands.
- The popup UI (pop.html) lets you view, copy, export, and generate AI replies.
- AI suggestions are fetched from a local backend (Flask app) running on your machine.
- When you clear messages, the extension auto-refreshes and fetches the latest chat data.

## Requirements
- Google Chrome (or Chromium-based browser)
- WhatsApp Web account
- Python 3.x (for the AI backend)
- Flask and required Python packages

## Installation
1. Clone or download this repository.
2. Go to `chrome://extensions/` in your browser.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the `whatsapp_extension` folder.
5. The extension icon should appear in your browser toolbar.

## Running the AI Backend
1. Ensure Python 3.x is installed.
2. Install Flask and any required packages:
   ```bash
   pip install flask
   # (Add any other requirements here)
   ```
3. Start the backend server (adjust port if needed):
   ```bash
   python3 app.py
   ```
   - By default, the extension expects the backend at `http://127.0.0.1:8000/`.
   - Make sure this matches the port in your extension code.

## Using the Extension
1. Open WhatsApp Web in your browser.
2. Click the extension icon to open the popup.
3. View your latest messages, copy/export them, or clear storage.
4. Click "Generate AI Replies" to get suggestions based on your latest 10 messages.
5. Click a suggestion to inject and send it in WhatsApp Web.
6. If you clear messages, the extension will auto-refresh and fetch the latest chat.

## Troubleshooting
- If AI suggestions do not appear, ensure your Flask backend is running and accessible.
- If injection fails, try refreshing WhatsApp Web and reloading the extension.
- For any issues, check the browser console for errors.

---
For more details, see the Operating Manual.
