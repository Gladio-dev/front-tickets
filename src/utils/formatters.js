// src/utils/formatters.js
export function formatDate(isoString) {
  if (!isoString) return '---';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}