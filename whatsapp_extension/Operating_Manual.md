# WhatsApp AI Extension - Operating Manual

## System Components
- **Content Script (`content.js`):** Scrapes messages from WhatsApp Web, injects AI replies, and listens for popup commands.
- **Popup UI (`pop.html`, `pop.js`):** User interface for viewing, copying, exporting, and generating AI replies.
- **Backend (`app.py`):** Python Flask server that generates AI reply suggestions based on recent messages.

## Operating Procedure

### 1. Setup
- Install the extension in Chrome as described in the User Manual.
- Start the Flask backend server before using AI features.

### 2. Message Scraping
- The content script automatically scrapes messages from the active chat on WhatsApp Web.
- Messages are stored locally and shown in the popup, with the newest at the top.

### 3. Generating AI Replies
- Click "Generate AI Replies" in the popup.
- The extension sends the latest 10 messages (newest first) to the backend.
- The backend returns AI-generated suggestions, which are displayed as buttons.
- Click a suggestion to inject and send it in WhatsApp Web.

### 4. Copying and Exporting
- Use the "Copy Last 10" button to copy the latest 10 messages to your clipboard.
- Use the "Export" button to download all messages as a JSON file.

### 5. Clearing and Refreshing
- Use the "Clear" button to remove all stored messages.
- After clearing, the extension automatically requests the content script to re-scrape and fetch the latest messages from WhatsApp Web.

### 6. Error Handling
- If the backend is not running, AI suggestions will not be available.
- If WhatsApp Web changes its layout, scraping or injection may fail; update selectors in the code if needed.
- Always refresh WhatsApp Web and the extension after making code changes.

## Security & Privacy
- All message processing happens locally in your browser and on your machine.
- No data is sent to third-party servers unless you modify the backend.

## Maintenance
- Update the extension if WhatsApp Web changes its UI.
- Keep your Python environment and dependencies up to date.
- Review and update selectors in `content.js` as needed.

---
For end-user instructions, see the User Manual.
