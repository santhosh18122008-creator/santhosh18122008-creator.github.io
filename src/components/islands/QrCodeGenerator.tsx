import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://santhosh18122008-creator.github.io');
  const [width, setWidth] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#0B2447');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!text.trim()) {
      setDataUrl('');
      return;
    }
    QRCode.toDataURL(text, {
      errorCorrectionLevel: errorLevel,
      width,
      margin: 1,
      color: { dark: fgColor, light: bgColor },
    })
      .then((url) => { setDataUrl(url); setError(''); })
      .catch(() => { setError('Text is too long for the selected error correction level.'); setDataUrl(''); });
  }, [text, width, errorLevel, fgColor, bgColor]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectClass = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950";
  const labelClass = "mb-1 block text-sm font-medium";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="qr-text" className={labelClass}>Text or URL</label>
          <textarea id="qr-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950" />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-size" className={labelClass}>Size (px)</label>
              <select id="qr-size" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={selectClass}>
                <option value={128}>128</option><option value={256}>256</option><option value={512}>512</option><option value={1024}>1024</option>
              </select>
            </div>
            <div>
              <label htmlFor="qr-ecl" className={labelClass}>Error Correction</label>
              <select id="qr-ecl" value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as any)} className={selectClass}>
                <option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-fg" className={labelClass}>Foreground</label>
              <input type="color" id="qr-fg" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-slate-300 dark:border-slate-700" />
            </div>
            <div>
              <label htmlFor="qr-bg" className={labelClass}>Background</label>
              <input type="color" id="qr-bg" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-slate-300 dark:border-slate-700" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="Generated QR Code" className="w-full max-w-[256px] rounded-md border border-slate-200 dark:border-slate-700" />
              <button onClick={handleDownload} className="mt-4 rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600">Download PNG</button>
            </>
          ) : (
            <div className="flex h-[256px] w-[256px] items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-slate-400 dark:border-slate-700">Enter text to generate</div>
          )}
          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
