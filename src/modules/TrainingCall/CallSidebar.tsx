import trainingCallLogo from '../../assets/logos/training-call.svg';
import { useAuth } from '../../contexts/AuthContext';
import { formatElapsed } from '../../utils/time';
import type { CallEntry } from '../../types/trainingCall';

type CallSidebarProps = {
  onlineSeconds: number;
  callsCount: number;
  activeCall: CallEntry | null;
  finishedCalls: CallEntry[];
  selectedId: string | null;
  onSelectCall: (id: string | null) => void;
};

export function CallSidebar({
  onlineSeconds,
  callsCount,
  activeCall,
  finishedCalls,
  selectedId,
  onSelectCall,
}: CallSidebarProps) {
  const { currentUser } = useAuth();
  const initial = currentUser?.username.charAt(0).toUpperCase() ?? '?';

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
          <img src={trainingCallLogo} alt="Training Call" className="h-7 w-7" />
        </span>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {initial}
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900">{currentUser?.username}</p>
            <p className="text-xs text-zinc-500">Atendente N1</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Tempo online</p>
            <p className="mt-0.5 font-mono text-sm font-medium text-zinc-900">
              {formatElapsed(onlineSeconds)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Atendimentos</p>
            <p className="mt-0.5 text-sm font-medium text-zinc-900">{callsCount}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-2 px-1 text-xs font-medium text-zinc-500">Histórico</p>
        {!activeCall && finishedCalls.length === 0 ? (
          <p className="px-1 text-sm text-zinc-400">Nenhum atendimento ainda.</p>
        ) : (
          <ul className="space-y-2">
            {activeCall && (
              <li key={activeCall.id}>
                <button
                  type="button"
                  onClick={() => onSelectCall(activeCall.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedId === activeCall.id
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                  }`}
                >
                  <p className="text-sm font-medium text-zinc-900">
                    {activeCall.scenario.companyLegalName}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">{activeCall.phoneNumber}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Em andamento
                  </span>
                </button>
              </li>
            )}
            {finishedCalls.map((call) => {
              const isSelected = selectedId === call.id;
              return (
                <li key={call.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCall(isSelected ? null : call.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-zinc-900">
                      {call.scenario.companyLegalName}
                    </p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {call.phoneNumber} · {formatElapsed(call.durationSeconds ?? 0)}
                    </p>
                    {!call.saved && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Pendente
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
