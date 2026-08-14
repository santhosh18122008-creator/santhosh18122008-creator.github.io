export function splitIntoTeams(
  names: string[], numGroups: number, randomInt: (max: number) => number
): { success: true; value: string[][] } | { success: false; error: string } {
  const cleanNames = names.map((n) => n.trim()).filter((n) => n.length > 0);
  if (cleanNames.length === 0) return { success: false, error: 'Enter at least one name.' };
  if (!Number.isInteger(numGroups) || numGroups < 1) return { success: false, error: 'Number of groups must be at least 1.' };
  if (numGroups > cleanNames.length) return { success: false, error: 'You cannot have more groups than people.' };

  const arr = [...cleanNames];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const teams: string[][] = Array.from({ length: numGroups }, () => []);
  arr.forEach((name, idx) => { teams[idx % numGroups].push(name); });
  return { success: true, value: teams };
}
