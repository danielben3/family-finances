import React from 'react';
import { ShieldCheck, Cloud, CloudOff, Smartphone, Sparkles } from 'lucide-react';

interface HeaderProps {
  isCloudSynced: boolean;
  onOpenPhoneModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCloudSynced,
  onOpenPhoneModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand & Family Info */}
        <div className="flex items-center gap-3">
          {/* Avatar Initial */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base shadow-md shadow-blue-500/20">
            <span>ד</span>
            {isCloudSynced && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white"></span>
              </span>
            )}
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                ניהול פיננסי משפחתי
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                ענן פעיל
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">שלום דניאל</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              {isCloudSynced ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  <span>מסונכרן לענן</span>
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <CloudOff className="w-3 h-3" />
                  <span>סנכרון מקומי</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Phone Access Modal Button */}
          <button
            onClick={onOpenPhoneModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold transition shadow-sm active:scale-95"
            title="סרוק או שלח קישור לטלפון"
          >
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span className="hidden xs:inline">פתח בטלפון</span>
          </button>
        </div>

      </div>
    </header>
  );
};
