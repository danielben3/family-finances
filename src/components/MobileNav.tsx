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
    <nav className="fixed bottom-4 left-3 right-3 max-w-md mx-auto z-40 glass-nav rounded-full md:hidden px-2 py-1.5 floating-dock-shadow transition-all border border-[#EAE6DF]">
      <div className="flex items-center justify-between gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 rounded-full transition-all active:scale-95 ${
                isActive
                  ? 'text-[#1A1A1A] font-bold'
                  : 'text-[#737373] hover:text-[#1A1A1A] font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                  isActive ? 'bg-[#1A1A1A] text-white shadow-xs scale-105' : 'text-[#737373]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9.5px] tracking-tight truncate max-w-full text-center mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
