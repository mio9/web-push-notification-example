import webpush from 'web-push';

const publicVapidKey = 'BJ95QykDkZBpRRQEIZ2tSlvHKQI3NRcg42ydlcOnfTw7VQArRtjmkhBkgMA0fAub7JKmfsZmQUpqZp2Z_pk7RGI';
const privateVapidKey = 'cRmgB9x1UK-I8NqRqhNZTCxAIzQ7UvV5EsH62Zmg0n4';

export default (): void => {
  webpush.setVapidDetails(
    'mailto:admin@mio9.sh',
    publicVapidKey,
    privateVapidKey,
  );
};
