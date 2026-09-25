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
        
        {/* === Mobile View Header (Matches Stitch Mobile Screen 1 exactly) === */}
        <div className="flex md:hidden items-center justify-between w-full">
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

        {/* === Desktop View Header (Matches Stitch Desktop Screen 1 exactly) === */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Brand Identity & Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 flex items-center justify-center text-amber-300 shadow-sm ring-1 ring-white/20 flex-shrink-0">
              <span className="font-black bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent text-base">MR</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base lg:text-lg text-slate-900 tracking-tight">משפחת בן | ניהול הון</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">VIP PRIVATE</span>
              </div>
              <p className="text-xs text-slate-400">ניהול פיננסי משפחתי • חשבון פרימיום מנוטר</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {onSelectTab && (
            <nav className="flex items-center gap-6">
              <button
                onClick={() => onSelectTab('overview')}
                className={`pb-1 text-sm font-semibold transition border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                סקירה כללית
              </button>
              <button
                onClick={() => onSelectTab('stocks')}
                className={`pb-1 text-sm font-semibold transition border-b-2 ${
                  activeTab === 'stocks'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                תיק השקעות ומניות
              </button>
              <button
                onClick={() => onSelectTab('history')}
                className={`pb-1 text-sm font-semibold transition border-b-2 ${
                  activeTab === 'history'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                היסטוריה ודוחות
              </button>
            </nav>
          )}

          {/* Actions Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Active Period Pill */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs font-num">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentPeriodLabel}</span>
            </div>

            {/* Export Excel Button */}
            {onExportExcel && (
              <button
                onClick={onExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition shadow-2xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>ייצוא Excel</span>
              </button>
            )}

            {/* Sync Phone Modal Button */}
            <button
              onClick={onOpenPhoneModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-semibold transition shadow-2xs active:scale-95"
              title="סנכרן טלפון"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>טלפון</span>
            </button>

            {/* Refresh Cache Button */}
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
              title="רענן גרסה"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Avatar Pill */}
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-300 font-bold font-num text-xs flex items-center justify-center shadow-xs ring-1 ring-slate-800">
              MR
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
