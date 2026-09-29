import React from 'react';
import { Home, Edit3, Briefcase, Table } from 'lucide-react';

export type NavTab = 'overview' | 'stocks' | 'form' | 'history';

interface MobileNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'מבט-על', icon: Home },
    { id: 'stocks' as NavTab, label: 'השקעות', icon: Briefcase },
    { id: 'form' as NavTab, label: 'הזנה', icon: Edit3 },
    { id: 'history' as NavTab, label: 'היסטוריה', icon: Table },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto z-40 glass-nav rounded-full px-3 py-2 floating-dock-shadow transition-all border border-[#EAE6DF]">
      <div className="flex items-center justify-around gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onChangeTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#1A1A1A] font-bold'
                  : 'text-[#8A8680] hover:text-[#1A1A1A] font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white shadow-xs scale-105'
                    : 'text-[#737373] hover:bg-black/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span className={`text-[10.5px] tracking-tight truncate max-w-full text-center mt-1 ${
                isActive ? 'font-bold text-[#1A1A1A]' : 'font-normal text-[#737373]'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
