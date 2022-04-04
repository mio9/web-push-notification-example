// Check if service workers are supported
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  });
}

const publicVapidKey = 'BCGCDm1yl8nX1WZbW6t6WtB4_v7mqyAIFPqztZs-pWBucoD9onTjPZdqeqldElN0Yl76nGNKsMAUP6JGXW0tfUg';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const getSubscribedElement = () => document.getElementById('subscribed');
const getUnsubscribedElement = () => document.getElementById('unsubscribed');

const setSubscribeMessage = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  getSubscribedElement().setAttribute('style', `display: ${subscription ? 'block' : 'none'};`);
  getUnsubscribedElement().setAttribute('style', `display: ${subscription ? 'none' : 'block'};`);
};

window.subscribe = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  const response = await fetch('http://localhost:8500/api/notification/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoyLCJhIjo5MDU2LCJ5IjoibG9jYWwiLCJ0IjoicGVyc29uIiwiZSI6Nzc4MSwiYyI6IkRFViIsInUiOiJrZW4uY2hhbitjaGF0MTBAc3dpdmVsc29mdHdhcmUuY29tIiwiaSI6dHJ1ZSwiaWF0IjoxNjM5NzEzOTc4LCJleHAiOjQ3NjM5MTYzNzgsImlzcyI6IiIsInN1YiI6IiJ9.G6wj-Fv1NQfVI2YLeOVqJGdJTbygteJEzSSb3QdICEM'
    },
  });

  if (response.ok) {
    setSubscribeMessage();
    console.dir(response);
  }
};

window.unsubscribe = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const { endpoint } = subscription;
  const response = await fetch(`http://localhost:8500/api/notification/unsubscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoyLCJhIjo5MDU2LCJ5IjoibG9jYWwiLCJ0IjoicGVyc29uIiwiZSI6Nzc4MSwiYyI6IkRFViIsInUiOiJrZW4uY2hhbitjaGF0MTBAc3dpdmVsc29mdHdhcmUuY29tIiwiaSI6dHJ1ZSwiaWF0IjoxNjM5NzEzOTc4LCJleHAiOjQ3NjM5MTYzNzgsImlzcyI6IiIsInN1YiI6IiJ9.G6wj-Fv1NQfVI2YLeOVqJGdJTbygteJEzSSb3QdICEM'
    },
  });

  if (response.ok) {
    await subscription.unsubscribe();
    setSubscribeMessage();
  }
};

window.broadcast = async () => {
  await fetch('http://localhost:8500/api/notification/send', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
};

setSubscribeMessage();
