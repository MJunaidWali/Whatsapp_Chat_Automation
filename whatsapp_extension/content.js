/**
 * WhatsApp Web Content Script
 * 1. Scrapes active chat messages.
 * 2. Injects AI-generated replies into the input box.
 */

(function () {
  if (!window.location.hostname.includes('web.whatsapp.com')) return;

  // --- 1. MESSAGE SCRAPER LOGIC ---

  function getAllMessages() {
    const messages = [];
    const rows = document.querySelectorAll('div[role="row"]');
    
    rows.forEach(row => {
      const copyableText = row.querySelector('.copyable-text');
      const textSpan = row.querySelector('span.copyable-text');
      
      if (copyableText && textSpan) {
        const meta = copyableText.getAttribute('data-pre-plain-text') || "";
        const isOutgoing = row.querySelector('.message-out') !== null;
        
        messages.push({
          text: textSpan.innerText.trim(),
          meta: meta,
          senderType: isOutgoing ? 'Me' : 'Sender',
          timestamp: Date.now()
        });
      }
    });
    return messages;
  }

  function sendToBackground() {
    chrome.runtime.sendMessage({
      type: 'WA_AUTO_CAPTURE',
      messages: getAllMessages()
    }).catch(() => {});
  }

  // --- 2. AI TEXT INJECTION LOGIC ---

  /**
   * Listens for messages from the Popup (pop.js)
   */
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'INJECT_AI_TEXT') {
    const input = document.querySelector('div[contenteditable="true"][data-tab="10"]');
    
    if (input) {
      input.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
      document.execCommand('insertText', false, request.text);

      // Trigger input event to make the send button appear
      const evt = new Event('input', { bubbles: true });
      input.dispatchEvent(evt);

      // DELAYED CLICK: Wait 200ms for WhatsApp to render the send button
      setTimeout(() => {
        let sendBtn = document.querySelector('span[data-icon="send"]') || 
                      document.querySelector('button[aria-label="Send"]');
        
        if (sendBtn) {
          sendBtn.click();
        } else {
          console.log("Send button not found yet, trying a more forceful click...");
          // Fallback: Dispatch a 'Return' key press
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
          });
          input.dispatchEvent(enterEvent);
        }
      }, 200); 

      sendResponse({ status: "success" });
    } else {
      sendResponse({ status: "error", message: "Input box not found." });
    }
  }
  return true; 
});

  // --- 3. OBSERVER & INITIALIZATION ---

  const chatRoot = document.querySelector('#app');
  if (chatRoot) {
    let lastSent = 0;
    const observer = new MutationObserver(() => {
      // Throttle scraping to once per second for performance
      if (Date.now() - lastSent > 1000) {
        sendToBackground();
        lastSent = Date.now();
      }
    });
    
    observer.observe(chatRoot, { childList: true, subtree: true });
    // Initial scrape after load
    setTimeout(sendToBackground, 3000);
  }
})();