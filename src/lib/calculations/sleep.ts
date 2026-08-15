export function calculateSleepTimes(timeStr: string, mode: 'wake' | 'sleep'): string[] {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
  if (!match) return [];
  let h = parseInt(match[1], 10);
  let m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return [];

  let baseMinutes = h * 60 + m;
  if (mode === 'sleep') baseMinutes += 15; // Average 15 mins to fall asleep

  const times: string[] = [];
  for (let i = 1; i <= 6; i++) {
    let mins = mode === 'sleep' ? baseMinutes + i * 90 : baseMinutes - i * 90;
    mins = ((mins % 1440) + 1440) % 1440;
    const hh = Math.floor(mins / 60).toString().padStart(2, '0');
    const mm = (mins % 60).toString().padStart(2, '0');
    times.push(`${hh}:${mm}`);
  }
  return mode === 'wake' ? times.reverse() : times;
}
