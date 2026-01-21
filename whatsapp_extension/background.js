chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'WA_AUTO_CAPTURE') {
    const waKey = `waData_web.whatsapp.com`;

    chrome.storage.local.get(waKey, (data) => {
      const prev = data[waKey] || { messages: [] };
      const incomingMsgs = message.messages || [];

      // Improved de-duplication logic
      const newMsgs = incomingMsgs.filter(newM => 
        !prev.messages.some(oldM => 
          oldM.text === newM.text && 
          oldM.meta === newM.meta && 
          oldM.senderType === newM.senderType
        )
      );

      if (newMsgs.length > 0) {
        const allMsgs = prev.messages.concat(newMsgs);
        
        // Keep only the last 100 messages to prevent storage bloat
        const limitedMsgs = allMsgs.slice(-100);

        chrome.storage.local.set({
          [waKey]: {
            messages: limitedMsgs,
            lastUpdate: Date.now()
          }
        });
      }
    });
  }
});