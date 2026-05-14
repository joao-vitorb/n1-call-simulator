import { useAuth } from '../../contexts/AuthContext';
import { formatElapsed } from '../../utils/time';
import type { FinishedCall } from '../../types/trainingCall';

type CallSidebarProps = {
  onlineSeconds: number;
  callsCount: number;
  finishedCalls: FinishedCall[];
};

export function CallSidebar({ onlineSeconds, callsCount, finishedCalls }: CallSidebarProps) {
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
            {finishedCalls.map((call) => (
              <li
                key={call.startedAt}
                className="rounded-md border border-zinc-200 bg-white p-3 text-sm"
              >
                <p className="font-medium text-zinc-900">{call.phoneNumber}</p>
                <p className="text-xs text-zinc-500">{formatElapsed(call.durationSeconds)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
