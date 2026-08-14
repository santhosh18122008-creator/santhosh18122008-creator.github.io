import { useState } from 'react';
import { splitIntoTeams } from '../../lib/utilities/teamSplitter';
import { parseAndValidateNumber } from '../../lib/validation/number';
import ResultDisplay from './ResultDisplay';

function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x = 0;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
}

export default function TeamSplitter() {
  const [namesText, setNamesText] = useState('');
  const [numGroups, setNumGroups] = useState('2');
  const [teams, setTeams] = useState<string[][] | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ groups?: string }>({});

  const handleGenerate = () => {
    const v = parseAndValidateNumber(numGroups);
    if (!v.valid) { setErrors({ groups: v.error as string }); setTeams(null); setError(''); return; }
    setErrors({});
    const names = namesText.split('\n');
    const r = splitIntoTeams(names, v.num as number, secureRandomInt);
    if (r.success) { setTeams(r.value); setError(''); }
    else { setTeams(null); setError(r.error as string); }
  };

  const handleReset = () => { setNamesText(''); setNumGroups('2'); setTeams(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="team-names" className="mb-1 block text-sm font-medium">Names (one per line)</label>
          <textarea id="team-names" rows={6} value={namesText} onChange={(e) => setNamesText(e.target.value)} placeholder={"Alice\nBob\nCharlie\nDiana"} className="field" />
        </div>
        <div>
          <label htmlFor="team-groups" className="mb-1 block text-sm font-medium">Number of teams</label>
          <input id="team-groups" type="text" inputMode="numeric" value={numGroups} onChange={(e) => setNumGroups(e.target.value)} className={'field' + (errors.groups ? ' field-invalid' : '')} />
          {errors.groups && <p className="err-text">{errors.groups}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleGenerate} className="btn-filled">Generate teams</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {teams && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map((team, i) => (
            <div key={i} className="rounded-xl border border-ink/10 bg-card p-4 text-center dark:border-ink/20">
              <p className="text-sm text-soft">Team {i + 1}</p>
              <ul className="mt-2 space-y-1">
                {team.map((name, j) => (
                  <li key={j} className="font-mono text-lg font-semibold text-ink dark:text-paper">{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
