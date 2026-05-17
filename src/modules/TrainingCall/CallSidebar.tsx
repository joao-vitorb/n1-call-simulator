import { useAuth } from '../../contexts/AuthContext';
import { formatElapsed } from '../../utils/time';
import type { CallEntry } from '../../types/trainingCall';

type CallSidebarProps = {
  onlineSeconds: number;
  callsCount: number;
  finishedCalls: CallEntry[];
  selectedId: string | null;
  disabled: boolean;
  onSelectCall: (id: string | null) => void;
};

export function CallSidebar({
  onlineSeconds,
  callsCount,
  finishedCalls,
  selectedId,
  disabled,
  onSelectCall,
}: CallSidebarProps) {
  const { currentUser } = useAuth();

  return (
    <aside className="flex w-72 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 p-4">
        <p className="text-xs text-zinc-500">Usuário</p>
        <p className="font-medium text-zinc-900">{currentUser?.username}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-zinc-500">Tempo online</p>
            <p className="font-medium text-zinc-900">{formatElapsed(onlineSeconds)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Atendimentos</p>
            <p className="font-medium text-zinc-900">{callsCount}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Histórico
        </p>
        {finishedCalls.length === 0 ? (
          <p className="text-sm text-zinc-400">Nenhum atendimento ainda.</p>
        ) : (
          <ul className="space-y-2">
            {finishedCalls.map((call) => {
              const isSelected = selectedId === call.id;
              return (
                <li key={call.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectCall(isSelected ? null : call.id)}
                    className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    } ${disabled ? 'cursor-not-allowed opacity-50 hover:bg-white' : ''}`}
                  >
                    <p className="font-medium text-zinc-900">{call.scenario.companyLegalName}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {call.phoneNumber} · {formatElapsed(call.durationSeconds ?? 0)}
                    </p>
                    {!call.saved && (
                      <p className="mt-1 text-xs font-medium text-amber-600">Pendente</p>
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
