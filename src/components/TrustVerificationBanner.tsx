import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TrustVerificationBanner: React.FC = () => {
  return (
    <section className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <span className="font-bold text-slate-900 text-xs sm:text-sm block">
            אימות רשות ניירות ערך וחשבונות נאמנות
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            כל הנתונים מסונכרנים ב-API מאובטח עם בנקי המשמורת בישראל ובארה״ב בסטנדרט הצפנה פיננסי FIPS 140-2.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700 border border-slate-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          סנכרון מלא פעיל
        </span>
      </div>
    </section>
  );
};
