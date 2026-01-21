document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('waMessagesViewer');
  const waKey = 'waData_web.whatsapp.com';

  // --- AI Reply Button and Handler ---
  async function generateAIReply() {
    const responseArea = document.getElementById('aiResponseArea');
    const waKey = 'waData_web.whatsapp.com';
    
    const storage = await chrome.storage.local.get(waKey);
    const messages = storage[waKey]?.messages || [];
    if (messages.length === 0) {
      responseArea.innerText = "No messages found. Please open a chat first.";
      return;
    }
    responseArea.innerText = "✨ Thinking...";
    try {
      // Use the latest 10 messages (newest first)
      const last10 = messages.slice(-10).reverse();
      const result = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: last10 })
      });
      const data = await result.json();
      if (data.status === "success") {
        // Split suggestions by new lines or numbering
        let suggestions = data.response.split(/\n\s*\d+\.|\n\s*-|\n/).filter(s => s.trim());
        if (suggestions.length < 2) suggestions = [data.response];
        responseArea.innerHTML = '';
        suggestions.forEach((s) => {
          const btn = document.createElement('button');
          btn.innerText = s.trim();
          btn.className = "ai-suggestion-btn";
          btn.style = "display:block; width:100%; margin:6px 0; background:#e7f3ff; color:#222; border:1px solid #b3d7ff; border-radius:6px; padding:8px; cursor:pointer; text-align:left;";
          btn.onclick = () => {
              sendSuggestionToWhatsApp(s.trim());
              btn.style.background = '#25D366';
              btn.style.color = '#fff';
              btn.innerText = "✓ Injected";
          };
          responseArea.appendChild(btn);
        });
      } else {
        responseArea.innerText = "Error: " + data.message;
      }
    } catch (error) {
      responseArea.innerText = "Check terminal: Flask app might be stopped.";
    }
  }

  // --- Send selected suggestion to WhatsApp Input ---
  function sendSuggestionToWhatsApp(text) {
    // 1. Copy to clipboard as backup
    navigator.clipboard.writeText(text);

    // 2. Send message directly to content.js listener
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.url?.includes('web.whatsapp.com')) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: 'INJECT_AI_TEXT',
          text: text
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError.message);
            showNotification('Error: Refresh WhatsApp page');
          } else if (response?.status === "success") {
            showNotification('Injected into WhatsApp!');
            // Optional: window.close(); // Closes popup after sending
          }
        });
      }
    });
  }

  // --- Messaging & Storage UI Logic ---
  function renderMessages() {
    chrome.storage.local.get(waKey, (data) => {
      const messages = data[waKey]?.messages || [];
      viewer.innerHTML = '<div style="font-weight: bold; margin-bottom: 6px;">WhatsApp Messages</div>';
      // Show latest messages at the top
      messages.slice().reverse().forEach(m => {
        const msgDiv = document.createElement('div');
        msgDiv.style = `padding:5px; border-bottom:1px solid #eee; font-size:12px; background:${m.senderType === 'Me' ? '#dcf8c6' : '#fff'}`;
        msgDiv.innerHTML = `<strong>${m.senderType}:</strong> ${m.text}`;
        viewer.appendChild(msgDiv);
      });
    });
  }

  // --- Event Listeners ---
  document.getElementById('askAIButton').addEventListener('click', generateAIReply);
  // document.getElementById('reloadButton') removed
  document.getElementById('exportButton').addEventListener('click', exportWhatsAppMessages);
  
  document.getElementById('clearStorageButton').addEventListener('click', () => {
    if(confirm("Clear all captured messages?")) {
      chrome.storage.local.remove(waKey, () => {
        renderMessages();
        showNotification('Storage cleared');
        // Request content script to re-scrape messages
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.url?.includes('web.whatsapp.com')) {
            chrome.tabs.sendMessage(activeTab.id, { type: 'WA_AUTO_CAPTURE_FORCE' });
          }
        });
      });
    }
  });

  document.getElementById('copyAllButton').addEventListener('click', () => {
    chrome.storage.local.get(waKey, (data) => {
      const messages = data[waKey]?.messages || [];
      const last10 = messages.slice(-10).reverse().map(m => `${m.senderType}: ${m.text}`).join('\n');
      navigator.clipboard.writeText(last10).then(() => showNotification('Copied last 10!'));
    });
  });

  // --- Notification Setup ---
  const notif = document.createElement('div');
  notif.id = 'wa-notification';
  notif.style = "position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#323232; color:#fff; padding:10px 24px; border-radius:8px; font-size:14px; opacity:0; transition:opacity 0.3s; z-index:9999; pointer-events:none;";
  document.body.appendChild(notif);

  function showNotification(msg) {
    notif.textContent = msg;
    notif.style.opacity = '1';
    setTimeout(() => { notif.style.opacity = '0'; }, 2000);
  }

  // Initial render
  renderMessages();
});