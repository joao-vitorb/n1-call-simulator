import type { ServiceOrder } from '../../types/serviceOrder';
import { SomStatusPill } from './SomStatusPill';

type SomResultsTableProps = {
  results: ServiceOrder[];
  onSelect: (order: ServiceOrder) => void;
};

export function SomResultsTable({ results, onSelect }: SomResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 animate-fade-in">
        Nenhuma OS encontrada para os filtros informados.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white animate-fade-in">
      <div className="border-b border-zinc-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Resultados
          <span className="ml-2 font-normal text-zinc-500">
            {results.length} {results.length === 1 ? 'ordem' : 'ordens'}
          </span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3">Protocolo</th>
              <th className="px-4 py-3">Número da OS</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3">Circuito</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Regional</th>
            </tr>
          </thead>
          <tbody>
            {results.map((order) => (
              <tr
                key={order.serviceOrderNumber}
                className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50"
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-700">{order.protocol}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(order)}
                    className="font-mono text-xs font-medium text-indigo-700 hover:underline"
                  >
                    {order.serviceOrderNumber}
                  </button>
                </td>
                <td className="px-4 py-3 text-zinc-700">{order.type}</td>
                <td className="px-4 py-3">
                  <SomStatusPill status={order.status} />
                </td>
                <td className="px-4 py-3 text-zinc-800">{order.customerLegalName}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700">{order.cnpj}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700">{order.circuit}</td>
                <td className="px-4 py-3 text-zinc-700">{order.product}</td>
                <td className="px-4 py-3 text-zinc-700">{order.regional}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
