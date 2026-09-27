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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* === Mobile-Only Header === */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            {/* Minion Gold Crest Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-300 font-bold text-sm shadow-inner">
                  <span className="bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent font-black">MR</span>
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500/20"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm tracking-tight text-slate-900">שלום, דניאל</h1>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 border border-slate-200 font-bold text-slate-600">VIP Private</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">משפחת בן • ניהול הון רב-דורי</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Month badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs font-num">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentPeriodLabel}</span>
            </div>

            {/* Export Excel Button */}
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition shadow-2xs"
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
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition shadow-2xs"
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
