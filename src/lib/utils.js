/**
 * Format a number with commas: 1234567 → "1,234,567"
 */
export function formatNumber(num) {
  if (num == null) return '—';
  return Number(num).toLocaleString('en-US');
}

/**
 * Format currency: 1234.5 → "$1,234.50"
 */
export function formatCurrency(num) {
  if (num == null) return '—';
  return `$${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format percentage: 0.0172 → "1.72%"
 */
export function formatPercent(num, decimals = 2) {
  if (num == null) return '—';
  return `${Number(num).toFixed(decimals)}%`;
}

/**
 * Get health score color class
 */
export function getScoreColor(score) {
  if (score >= 81) return 'text-teal-400';
  if (score >= 61) return 'text-teal-500';
  if (score >= 31) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Get health score bg color class
 */
export function getScoreBgColor(score) {
  if (score >= 81) return 'bg-teal-500';
  if (score >= 61) return 'bg-teal-600';
  if (score >= 31) return 'bg-amber-500';
  return 'bg-red-500';
}

/**
 * Extract health score from AI response text
 */
export function extractHealthScore(text) {
  const match = text.match(/\*\*Score:\s*(\d+)\s*\/\s*100\*\*/);
  if (match) return parseInt(match[1], 10);
  const match2 = text.match(/Score:\s*(\d+)\s*\/\s*100/);
  if (match2) return parseInt(match2[1], 10);
  return null;
}

/**
 * Generate a simple UUID-like id
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Truncate text to maxLen chars with ellipsis
 */
export function truncate(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '…';
}

/**
 * Debounce a function
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Get greeting based on time of day
 */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
