import React from 'react';
import { Home, Edit3, TrendingUp, Table, Briefcase } from 'lucide-react';

export type NavTab = 'overview' | 'stocks' | 'form' | 'analytics' | 'history';

interface MobileNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as NavTab, label: 'מבט-על', icon: Home },
    { id: 'stocks' as NavTab, label: 'תיק מניות', icon: Briefcase },
    { id: 'form' as NavTab, label: 'הזנה ועריכה', icon: Edit3 },
    { id: 'analytics' as NavTab, label: 'גרף צמיחה', icon: TrendingUp },
    { id: 'history' as NavTab, label: 'טבלה', icon: Table },
  ];

  return (
    <nav className="fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl floating-dock-shadow md:hidden px-2 py-1.5">
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
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600 scale-105' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
