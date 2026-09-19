import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, QrCode, Sparkles } from 'lucide-react';

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
  )}&bgcolor=FFFFFF&color=2563EB&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-sm">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">פתיחה בסמארטפון (עבורך ועבור אשתך)</h3>
          <p className="text-xs text-slate-500 mt-1">
            סנכרון ענן מלא בזמן אמת – כל שינוי מופיע מיד בשני המכשירים
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
          <img
            src={qrCodeUrl}
            alt="סרוק קוד לפתיחה בנייד"
            className="w-44 h-44 rounded-xl border border-slate-200 shadow-sm"
          />
          <span className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            סרוק באמצעות מצלמת הטלפון
          </span>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 mb-5">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="bg-transparent text-xs text-slate-700 px-2 flex-1 outline-none font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shrink-0 shadow-sm active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'הועתק!' : 'העתק קישור'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-xs text-slate-700 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100">
          <div className="font-semibold text-blue-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>התקנה כאפליקציה עצמאית במסך הבית:</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-600 pr-2">
            <div>
              <strong className="text-slate-800">באייפון (Safari):</strong> כפתור שיתוף בתחתית ⬅️ "הוסף למסך הבית".
            </div>
            <div>
              <strong className="text-slate-800">באנדרואיד (Chrome/Brave):</strong> 3 נקודות למעלה ⬅️ "התקן אפליקציה".
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          סגור
        </button>
      </div>
    </div>
  );
};
