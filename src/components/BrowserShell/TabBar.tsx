import { useAuth } from '../../contexts/AuthContext';
import { TABS, type TabId } from '../../types/tab';

type TabBarProps = {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
};

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="flex items-end justify-between gap-4 border-b border-zinc-300 bg-zinc-200 px-3 pt-2">
      <div className="flex items-end gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={
                isActive
                  ? 'rounded-t-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm'
                  : 'rounded-t-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50'
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pb-2 text-sm">
        <span className="text-zinc-600">{currentUser?.username}</span>
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
