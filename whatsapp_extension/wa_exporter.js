function exportWhatsAppMessages() {
  const waKey = 'waData_web.whatsapp.com';
  
  chrome.storage.local.get(waKey, (data) => {
    const messages = data[waKey]?.messages || [];
    
    const exportObj = {
      chatPartner: "WhatsApp Chat",
      exportedAt: new Date().toLocaleString(),
      totalMessages: messages.length,
      // Maps the data to a clean format for your backend/n8n
      history: messages.map(m => ({
        from: m.senderType,
        text: m.text,
        time: m.meta // Detailed timestamp from WhatsApp
      }))
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WA_Export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  });
}