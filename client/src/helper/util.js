export function formatDateTime(timestamp) {
  const dateTime = new Date(Date.parse(timestamp));
  return dateTime.toLocaleDateString('de-DE', { hour: 'numeric', minute: 'numeric' });
}
