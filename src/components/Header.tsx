import React from 'react';
import { Calendar, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
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
  activeTab = 'overview',
  onSelectTab,
  currentPeriodLabel = 'ספטמבר 2026',
  onExportExcel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE6DF] transition-all pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline">
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              familywealth<span className="text-[#737373] font-normal">.app</span>
            </span>
          </div>

          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#EAE6DF] text-[10.5px] font-medium text-[#737373] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>מעודכן</span>
          </div>
        </div>

        {/* Desktop / Tablet Nav (when screen is wider) */}
        {onSelectTab && (
          <nav className="hidden md:flex items-center gap-1 bg-white p-1 rounded-full border border-[#EAE6DF] shadow-xs text-xs font-medium">
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              מבט-על
            </button>
            <button
              onClick={() => onSelectTab('stocks')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'stocks'
                  ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              מניות והשקעות
            </button>
            <button
              onClick={() => onSelectTab('income')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'income'
                  ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              הכנסות
            </button>
            <button
              onClick={() => onSelectTab('form')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'form'
                  ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              הזנה חודשית
            </button>
            <button
              onClick={() => onSelectTab('analytics')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              צמיחה
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'history'
                  ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              היסטוריה
            </button>
          </nav>
        )}

        {/* Quick Utilities & Period Capsule */}
        <div className="flex items-center gap-2">
          {/* Period Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE6DF] text-xs font-medium text-[#1A1A1A] shadow-2xs font-num">
            <Calendar className="w-3.5 h-3.5 text-[#737373]" />
            <span>{currentPeriodLabel}</span>
          </div>

          {/* Export Excel Button */}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[#737373] hover:text-[#1A1A1A] active:scale-95 transition shadow-2xs"
              title="ייצוא לאקסל"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Refresh Button */}
          <button
            onClick={() => {
              try {
                localStorage.removeItem('family_finance_records');
              } catch (e) {}
              window.location.reload();
            }}
            className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] flex items-center justify-center text-[#737373] hover:text-[#1A1A1A] active:scale-95 transition shadow-2xs"
            title="רענן וסנכרן"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold font-serif-luxury shadow-2xs">
            <span>דב</span>
          </div>
        </div>

      </div>
    </header>
  );
};
