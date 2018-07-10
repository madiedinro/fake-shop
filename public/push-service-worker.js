
self.addEventListener("activate", function(event) {

  // console.log('activated');

});

self.addEventListener('push', function(event) {

  // console.log('[Service Worker] Push Received.');
  // console.log('event:', event);
  // console.log('data:', event.data);

  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function(subscription) {

        var endpoint = subscription.endpoint;
        var data = {};

        if(event.data){
          data = event.data.json();
          // console.log('Push data:', data);
        }

        var queryUrl = 'https://api.pushk.in/api/pushdata?' +
          'uid='+(data.uid||'') +
          '&ctoken='+(data.campaignToken||'') +
          '&ptoken='+(data.projectToken||'') +
          '&endpoint='+endpoint;

        return fetch(queryUrl)
          .then(function(response){
            return response.json();
          })
          .then(function (remoteData) {
            // console.log('server data', remoteData);

            return self.registration.showNotification(remoteData.title, {
              body: remoteData.body,
              icon: remoteData.icon,
              badge: remoteData.badge,
              image: remoteData.image,
              requireInteraction: true,
              data: remoteData.data
            });
          });
      })
  );
});

self.addEventListener('notificationclick', function(event) {

  // console.log('[Service Worker] Notification click Received.');
  // console.log('event:', event);

  event.notification.close();

  var data = event.notification.data;
  var queryUrl = 'https://api.pushk.in/api/event?' +
    'name=push-click' +
    '&uid='+(data.uid||'') +
    '&ctoken='+(data.campaignToken||'') +
    '&ptoken='+(data.projectToken||'');

  event.waitUntil(
    Promise.all([
      clients.openWindow(data.url),
      fetch(queryUrl)
        .then(function(response){
          return response.json();
        })
    ]).then(function () {
      // console.log('ready');
    })
  );

});
