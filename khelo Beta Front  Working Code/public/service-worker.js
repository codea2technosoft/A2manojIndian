self.addEventListener('push', event => {
    let data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        console.error('Failed to parse push message data:', e);
        
        data = {
          title: "Default Title",
          body: "There was an error with the notification data."
        };
      }
    } else {
      console.error('Push event data is null or undefined');
     
      data = {
        title: "No Title",
        body: "No data provided in push message."
      };
    }
  
    const options = {
      body: data.body,
      icon: data.icon || 'default-icon.png',
      badge: data.badge || 'default-badge.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });




  