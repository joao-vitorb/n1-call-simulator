import { useEffect, useState, type ReactNode } from 'react';
import type { TechFormKind } from './ScriptIntegrado/TechFormModal';

export type CompanyTabId = 'cliente' | 'contratos';

const TECH_OPTIONS: { kind: TechFormKind; label: string }[] = [
  { kind: 'script-integrado', label: 'Script integrado' },
  { kind: 'visita-tecnica', label: 'Visita técnica' },
  { kind: 'rfo', label: 'RFO' },
  { kind: 'programacao-servicos', label: 'Programação de serviço' },
];

type CompanyTabsProps = {
  activeTab: CompanyTabId;
  onTabChange: (tab: CompanyTabId) => void;
  hasSelectedContract: boolean;
  onOpenTechForm: (kind: TechFormKind) => void;
};

export function CompanyTabs({
  activeTab,
  onTabChange,
  hasSelectedContract,
  onOpenTechForm,
}: CompanyTabsProps) {
  const [techOpen, setTechOpen] = useState(false);
  const [techError, setTechError] = useState<string | null>(null);

  useEffect(() => {
    if (!techError) return;
    const id = window.setTimeout(() => setTechError(null), 3000);
    return () => window.clearTimeout(id);
  }, [techError]);

  function handleTechClick() {
    if (!hasSelectedContract) {
      setTechError('Selecione um contrato antes de acessar o menu Técnico.');
      setTechOpen(false);
      return;
    }
    setTechError(null);
    setTechOpen((open) => !open);
  }

  function handleTechOption(kind: TechFormKind) {
    setTechOpen(false);
    onOpenTechForm(kind);
  }

  return (
    <div className="border-b border-zinc-200 bg-white px-8">
      <nav className="flex items-center gap-6">
        <TabButton active={activeTab === 'cliente'} onClick={() => onTabChange('cliente')}>
          Cliente
        </TabButton>
        <TabButton active={activeTab === 'contratos'} onClick={() => onTabChange('contratos')}>
          Contratos
        </TabButton>

        <div className="relative">
          <button
            type="button"
            onClick={handleTechClick}
            aria-expanded={techOpen}
            className={`-mb-px flex items-center gap-1 border-b-2 py-3 text-sm font-medium transition-colors ${
              techOpen
                ? 'border-indigo-600 text-zinc-900'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            } ${hasSelectedContract ? '' : 'opacity-50'}`}
          >
            Técnico
            <svg
              aria-hidden="true"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="mt-0.5"
            >
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {techOpen && hasSelectedContract && (
            <div className="absolute left-0 top-full z-10 mt-1 w-56 origin-top-left overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg animate-dropdown">
              {TECH_OPTIONS.map((option) => (
                <button
                  key={option.kind}
                  type="button"
                  onClick={() => handleTechOption(option.kind)}
                  className="block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {techError && (
            <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 shadow-sm animate-dropdown">
              {techError}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

type TabButtonProps = {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
};

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 py-3 text-sm font-medium transition-colors ${
        active
          ? 'border-indigo-600 text-zinc-900'
          : 'border-transparent text-zinc-600 hover:text-zinc-900'
      }`}
    >
      {children}
    </button>
  );
}
