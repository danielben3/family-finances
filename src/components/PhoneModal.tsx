import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, QrCode, Share2, Sparkles } from 'lucide-react';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=0B0F19&color=f59e0b&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D121F] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-rose-950/50">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">גישה בסמארטפון (עבורך ועבור אשתך)</h3>
          <p className="text-xs text-slate-400 mt-1">
            האפליקציה פועלת כ-PWA מותאמת לסמארטפון עם סנכרון בזמן אמת
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#070A12] rounded-2xl border border-white/10 mb-5">
          <img
            src={qrCodeUrl}
            alt="סרוק קוד לפתיחה בנייד"
            className="w-44 h-44 rounded-xl border border-white/10 shadow-md"
          />
          <span className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            סרוק באמצעות מצלמת הטלפון
          </span>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 mb-5">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="bg-transparent text-xs text-slate-300 px-2 flex-1 outline-none font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'הועתק!' : 'העתק קישור'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-xs text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
          <div className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>איך הופכים את זה לאפליקציה במסך הבית?</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 pr-2">
            <div>
              <strong className="text-slate-200">באייפון (Safari):</strong> לוחצים על כפתור השיתוף בתחתית ובוחרים "הוסף למסך הבית" (Add to Home Screen).
            </div>
            <div>
              <strong className="text-slate-200">באנדרואיד (Chrome):</strong> לוחצים על שלוש הנקודות למעלה ובוחרים "התקן אפליקציה" או "הוסף למסך הבית".
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
        >
          סגור
        </button>
      </div>
    </div>
  );
};
