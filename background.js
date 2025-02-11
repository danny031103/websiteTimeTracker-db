let startTime;
let currentUrl;
let timeData = {};


browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get(['timeData']).then((result) => {
    timeData = result.timeData || {};
  });
});


browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs.get(activeInfo.tabId).then((tab) => {
    handleTabChange(tab.url);
  });
});


browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleTabChange(changeInfo.url);
  }
});

function handleTabChange(newUrl) {
 
  if (currentUrl && startTime) {
    const domain = new URL(currentUrl).hostname;
    const timeSpent = Date.now() - startTime;
    timeData[domain] = (timeData[domain] || 0) + timeSpent;
    browser.storage.local.set({ timeData });
  }

  
  currentUrl = newUrl;
  startTime = Date.now();
}


browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'getCurrentTimes') {
    
    const currentTimes = { ...timeData };
    
    
    if (currentUrl && startTime) {
      try {
        const domain = new URL(currentUrl).hostname;
        const currentTime = Date.now() - startTime;
        currentTimes[domain] = (currentTimes[domain] || 0) + currentTime;
      } catch (e) {
        console.error('Error processing URL:', e);
      }
    }
    
    return Promise.resolve(currentTimes);
  }
});