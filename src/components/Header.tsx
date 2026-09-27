import React from 'react';
import { ShieldCheck, Cloud, CloudOff, Smartphone, Home, Briefcase, Table, RefreshCw, Calendar, Download, Bell } from 'lucide-react';
import { NavTab } from './MobileNav';

interface HeaderProps {
  isCloudSynced: boolean;
  onOpenPhoneModal: () => void;
  activeTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
  currentPeriodLabel?: string;
  onExportExcel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCloudSynced,
  onOpenPhoneModal,
  activeTab = 'overview',
  onSelectTab,
  currentPeriodLabel = 'ספטמבר 2026',
  onExportExcel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 transition-all pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        
        {/* === Mobile & Desktop Responsive Header === */}
        <div className="flex items-center justify-between w-full gap-2">
          {/* User & Crest Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            {/* Minion Gold Crest Avatar */}
            <div className="relative shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] shadow-xs">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-300 font-bold text-xs shadow-inner">
                  <span className="bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent font-black">MR</span>
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500/20"></div>
            </div>

            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5 truncate">
                <h1 className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 truncate">שלום, דניאל</h1>
                <span className="hidden xs:inline-block text-[8.5px] sm:text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 border border-slate-200 font-bold text-slate-600 shrink-0">VIP</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-normal truncate">משפחת בן • ניהול הון</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          {onSelectTab && (
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold">
              <button
                onClick={() => onSelectTab('overview')}
                className={`pb-1 transition border-b-2 ${activeTab === 'overview' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                מבט-על
              </button>
              <button
                onClick={() => onSelectTab('stocks')}
                className={`pb-1 transition border-b-2 ${activeTab === 'stocks' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                תיק מניות
              </button>
              <button
                onClick={() => onSelectTab('income')}
                className={`pb-1 transition border-b-2 ${activeTab === 'income' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                הכנסות ומענקים
              </button>
              <button
                onClick={() => onSelectTab('form')}
                className={`pb-1 transition border-b-2 ${activeTab === 'form' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                הזנת נתונים
              </button>
              <button
                onClick={() => onSelectTab('analytics')}
                className={`pb-1 transition border-b-2 ${activeTab === 'analytics' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                צמיחה ויעדים
              </button>
              <button
                onClick={() => onSelectTab('history')}
                className={`pb-1 transition border-b-2 ${activeTab === 'history' ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                טבלה מלאה
              </button>
            </nav>
          )}

          {/* Quick Actions Cluster */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Month badge */}
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs font-num shrink-0">
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate max-w-[70px] sm:max-w-none">{currentPeriodLabel}</span>
            </div>

            {/* Export Excel Button */}
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition shadow-2xs shrink-0"
                title="ייצוא לאקסל"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
              </button>
            )}

            {/* Refresh / Clear cache button */}
            <button
              onClick={async () => {
                try {
                  localStorage.removeItem('family_finance_records');
                } catch (e) {}
                if ('caches' in window) {
                  try {
                    const names = await caches.keys();
                    await Promise.all(names.map(n => caches.delete(n)));
                  } catch (e) {}
                }
                window.location.reload();
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition shadow-2xs shrink-0"
              title="רענן וסנכרן"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
