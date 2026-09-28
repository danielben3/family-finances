import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TrustVerificationBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] rounded-2xl p-4 border border-black/[0.06] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <span className="font-semibold text-stone-900 text-xs block font-sans">
            אימות חשבונות ונאמנות פיננסית
          </span>
          <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed font-sans">
            כל הנתונים מסונכרנים ב-API מאובטח ופרטי, מוצפנים בתקן בנקאי ומגובים בענן.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[11px] font-semibold text-stone-800 border border-black/[0.06] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          סנכרון מלא פעיל
        </span>
      </div>
    </section>
  );
};
