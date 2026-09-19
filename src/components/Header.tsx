import React from 'react';
import { ShieldCheck, Moon, Sun, Cloud, CloudOff, Smartphone, QrCode } from 'lucide-react';

interface HeaderProps {
  isCloudSynced: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPhoneModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCloudSynced,
  isDarkMode,
  onToggleTheme,
  onOpenPhoneModal,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070A12]/85 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                ניהול פיננסי משפחתי
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              מעקב צמיחת הון, תזרים והשקעות בענן פרטי ומאובטח
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* Cloud Sync Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            {isCloudSynced ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">מסונכרן לענן</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">מקומי (ממתין לסנכרון)</span>
              </>
            )}
          </div>

          {/* Phone Access Modal Button */}
          <button
            onClick={onOpenPhoneModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs sm:text-sm font-medium transition"
            title="פתח בסמארטפון"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden xs:inline">סרוק לטלפון</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="החלף מצב תצוגה"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

        </div>

      </div>
    </header>
  );
};
