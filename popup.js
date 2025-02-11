document.addEventListener('DOMContentLoaded', async () => {
    const timeList = document.getElementById('timeList');
    
    function formatTime(ms) {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor(ms / (1000 * 60 * 60));
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    async function updateTimes() {
      try {
        
        const timeData = await browser.runtime.sendMessage({type: 'getCurrentTimes' });
        
        const sortedSites = Object.entries(timeData).sort(([,a], [,b]) => b - a);
        
        timeList.innerHTML = '';
        
        if (sortedSites.length === 0) {
          const div = document.createElement('div');
          div.className = 'site-time';
          div.textContent = 'No tracking data yet';
          timeList.appendChild(div);
          return;
        }
        
        sortedSites.forEach(([domain, time]) => {
          const div = document.createElement('div');
          div.className = 'site-time';
          div.textContent = `${domain}: ${formatTime(time)}`;
          timeList.appendChild(div);
        });
      } catch (error) {
        console.error('Error loading time data:', error);
        timeList.innerHTML = '<div class="error">Error loading tracking data</div>';
      }
    }
    
    await updateTimes();
    
    setInterval(updateTimes, 1000);
  });