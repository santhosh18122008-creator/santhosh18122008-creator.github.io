import { useState } from 'react';
import { hexToRgb, rgbToHex } from '../../lib/utilities/color';
import ResultDisplay from './ResultDisplay';

export default function ColorConverter() {
  const [hex, setHex] = useState('#2F5D8A');
  const [r, setR] = useState('47');
  const [g, setG] = useState('93');
  const [b, setB] = useState('138');
  const [error, setError] = useState('');

  const handleHexChange = (val: string) => {
    setHex(val);
    const res = hexToRgb(val);
    if (res.success && res.value) {
      setR(String(res.value.r));
      setG(String(res.value.g));
      setB(String(res.value.b));
      setError('');
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: string) => {
    if (channel === 'r') setR(val);
    if (channel === 'g') setG(val);
    if (channel === 'b') setB(val);
    const numR = channel === 'r' ? Number(val) : Number(r);
    const numG = channel === 'g' ? Number(val) : Number(g);
    const numB = channel === 'b' ? Number(val) : Number(b);
    const res = rgbToHex(numR, numG, numB);
    if (res.success) {
      setHex(res.value as string);
      setError('');
    }
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="color-hex" className="mb-1 block text-sm font-medium">Hex code</label>
          <input id="color-hex" type="text" value={hex} onChange={(e) => handleHexChange(e.target.value)} className="field" placeholder="#2F5D8A" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="color-r" className="mb-1 block text-sm font-medium">Red</label>
            <input id="color-r" type="text" inputMode="numeric" value={r} onChange={(e) => handleRgbChange('r', e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="color-g" className="mb-1 block text-sm font-medium">Green</label>
            <input id="color-g" type="text" inputMode="numeric" value={g} onChange={(e) => handleRgbChange('g', e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="color-b" className="mb-1 block text-sm font-medium">Blue</label>
            <input id="color-b" type="text" inputMode="numeric" value={b} onChange={(e) => handleRgbChange('b', e.target.value)} className="field" />
          </div>
        </div>
      </div>
      
      {hexToRgb(hex).success && (
        <div className="mt-6 rounded-xl border border-ink/10 p-4 flex items-center gap-4 dark:border-ink/20">
          <div className="h-16 w-16 shrink-0 rounded-lg border border-ink/10 dark:border-ink/20" style={{ backgroundColor: hex }} />
          <div>
            <p className="text-sm text-soft">Preview</p>
            <p className="font-mono text-xl font-bold text-ink dark:text-paper">{hex}</p>
          </div>
        </div>
      )}
    </div>
  );
}
