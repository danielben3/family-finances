import React from 'react';
import { Home, Edit3, TrendingUp, Table, Briefcase, Coins } from 'lucide-react';

export type NavTab = 'overview' | 'stocks' | 'income' | 'form' | 'analytics' | 'history';

interface MobileNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'מבט-על', icon: Home },
    { id: 'stocks' as NavTab, label: 'מניות', icon: Briefcase },
    { id: 'income' as NavTab, label: 'הכנסות', icon: Coins },
    { id: 'form' as NavTab, label: 'הזנה', icon: Edit3 },
    { id: 'analytics' as NavTab, label: 'צמיחה', icon: TrendingUp },
    { id: 'history' as NavTab, label: 'טבלה', icon: Table },
  ];

  return (
    <nav className="fixed bottom-3.5 left-3 right-3 max-w-md mx-auto z-40 glass-nav rounded-2xl md:hidden px-1 py-1 shadow-xl transition-all border border-slate-200/80">
      <div className="flex items-center justify-between gap-0.5">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-emerald-800 font-extrabold'
                  : 'text-slate-400 hover:text-slate-700 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
                  isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs scale-105' : ''
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-full text-center mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
