import { ShieldCheck, Cloud, CloudOff, Smartphone, Sparkles, Home, Briefcase, Table, RefreshCw } from 'lucide-react';
import { NavTab } from './MobileNav';

interface HeaderProps {
  isCloudSynced: boolean;
  onOpenPhoneModal: () => void;
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCloudSynced,
  onOpenPhoneModal,
  activeTab = 'overview',
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand & Family Info */}
        <div className="flex items-center gap-3">
          {/* Quiet Wealth Monogram Crest */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-900 text-amber-300 font-bold text-base shadow-sm ring-1 ring-slate-800 flex-shrink-0">
            <span className="tracking-tight bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent font-black">
              MR
            </span>
            {isCloudSynced && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white"></span>
              </span>
            )}
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                משפחת בן | ניהול הון
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs">
                VIP PRIVATE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-normal text-slate-500">ניהול פיננסי משפחתי • פרימיום מנוטר</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              {isCloudSynced ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  <span>סנכרון פעיל</span>
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <CloudOff className="w-3 h-3" />
                  <span>מקומי</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        {onSelectTab && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => onSelectTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>דשבורד ראשי</span>
            </button>

            <button
              onClick={() => onSelectTab('stocks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'stocks'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>תיק מניות חי</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'history'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>היסטוריה ואקסל</span>
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 font-num">
            <span>₪ ILS</span>
          </div>

          {/* Phone Access Modal Button */}
          <button
            onClick={onOpenPhoneModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold transition shadow-sm active:scale-95"
            title="סרוק או שלח קישור לטלפון"
          >
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">סנכרן טלפון</span>
          </button>

          {/* Force Refresh & Cache Clear Button */}
          <button
            onClick={async () => {
              if ('caches' in window) {
                try {
                  const names = await caches.keys();
                  await Promise.all(names.map(n => caches.delete(n)));
                } catch (e) {}
              }
              window.location.reload();
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition active:scale-95"
            title="רענן גרסה ונקה מטמון"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
