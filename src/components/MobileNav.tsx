import React from 'react';
import { Home, Edit3, TrendingUp, Table } from 'lucide-react';

export type NavTab = 'overview' | 'form' | 'analytics' | 'history';

interface MobileNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'תמונת מצב', icon: Home },
    { id: 'form' as NavTab, label: 'הזנה ועריכה', icon: Edit3 },
    { id: 'analytics' as NavTab, label: 'גרף צמיחה', icon: TrendingUp },
    { id: 'history' as NavTab, label: 'טבלה ואקסל', icon: Table },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070A12]/95 backdrop-blur-xl border-t border-white/10 md:hidden px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-amber-500/20 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
