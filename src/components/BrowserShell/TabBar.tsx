import { useAuth } from '../../contexts/AuthContext';
import { TABS, type TabId } from '../../types/tab';

type TabBarProps = {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
};

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { currentUser, logout } = useAuth();
  const initial = currentUser?.username.charAt(0).toUpperCase() ?? '?';

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-4">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-sm text-zinc-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {initial}
          </span>
          {currentUser?.username}
        </span>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
