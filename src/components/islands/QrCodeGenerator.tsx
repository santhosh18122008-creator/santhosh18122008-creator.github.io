import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://santhosh18122008-creator.github.io');
  const [width, setWidth] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#1B2430');
  const [bgColor, setBgColor] = useState('#F7F8F5');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!text.trim()) { setDataUrl(''); return; }
    QRCode.toDataURL(text, { errorCorrectionLevel: errorLevel, width, margin: 1, color: { dark: fgColor, light: bgColor } })
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

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="qr-text" className="mb-1 block text-sm font-medium">Text or URL</label>
          <textarea id="qr-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} className="field" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-size" className="mb-1 block text-sm font-medium">Size (px)</label>
              <select id="qr-size" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="field">
                <option value={128}>128</option><option value={256}>256</option><option value={512}>512</option><option value={1024}>1024</option>
              </select>
            </div>
            <div>
              <label htmlFor="qr-ecl" className="mb-1 block text-sm font-medium">Error correction</label>
              <select id="qr-ecl" value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as any)} className="field">
                <option value="L">Low (7%)</option><option value="M">Medium (15%)</option><option value="Q">Quartile (25%)</option><option value="H">High (30%)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-fg" className="mb-1 block text-sm font-medium">Foreground</label>
              <input type="color" id="qr-fg" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-ink/10" />
            </div>
            <div>
              <label htmlFor="qr-bg" className="mb-1 block text-sm font-medium">Background</label>
              <input type="color" id="qr-bg" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-ink/10" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="Generated QR code" className="w-full max-w-[256px] rounded-md border border-ink/10" />
              <button onClick={handleDownload} className="btn-filled mt-4">Download PNG</button>
            </>
          ) : (
            <div className="flex h-[256px] w-[256px] items-center justify-center rounded-md border-2 border-dashed border-ink/20 text-soft">Enter text to generate</div>
          )}
          {error && <p className="err-text mt-3 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
