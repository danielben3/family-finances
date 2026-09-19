import { ShieldCheck, Cloud, CloudOff, Smartphone, Sparkles, Home, Briefcase, Table } from 'lucide-react';
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
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                תיק משפחת בן
              </h1>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shadow-xs" title="מאומת - חשבון ראשי">
                <ShieldCheck className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">דניאל והמשפחה</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              {isCloudSynced ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  <span>סנכרון ענן פעיל</span>
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
        </div>

      </div>
    </header>
  );
};
