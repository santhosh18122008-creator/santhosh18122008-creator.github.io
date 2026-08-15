export interface CountdownResult {
  isPast: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getCountdown(targetMs: number, nowMs: number): CountdownResult {
  const diff = targetMs - nowMs;
  if (diff <= 0) return { isPast: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { isPast: false, days, hours, minutes, seconds };
}
