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
    <div className="relative border-b border-zinc-200 bg-zinc-50 px-6">
      <nav className="flex gap-6 text-sm">
        <TabButton active={activeTab === 'cliente'} onClick={() => onTabChange('cliente')}>
          Cliente
        </TabButton>
        <TabButton active={activeTab === 'contratos'} onClick={() => onTabChange('contratos')}>
          Contratos
        </TabButton>
        <button
          type="button"
          onClick={handleTechClick}
          className={`-mb-px border-b-2 py-3 font-medium transition-colors ${
            techOpen
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
          } ${hasSelectedContract ? '' : 'opacity-60'}`}
        >
          Técnico ▾
        </button>
      </nav>

      {techOpen && hasSelectedContract && (
        <div className="absolute right-6 top-full z-10 mt-1 w-56 rounded-md border border-zinc-200 bg-white shadow-md">
          {TECH_OPTIONS.map((option) => (
            <button
              key={option.kind}
              type="button"
              onClick={() => handleTechOption(option.kind)}
              className="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {techError && (
        <div className="absolute right-6 top-full z-10 mt-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 shadow-sm">
          {techError}
        </div>
      )}
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
      className={`-mb-px border-b-2 py-3 font-medium transition-colors ${
        active
          ? 'border-zinc-900 text-zinc-900'
          : 'border-transparent text-zinc-600 hover:text-zinc-900'
      }`}
    >
      {children}
    </button>
  );
}
