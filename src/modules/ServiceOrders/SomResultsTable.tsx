import type { ServiceOrder } from '../../types/serviceOrder';

type SomResultsTableProps = {
  results: ServiceOrder[];
  onSelect: (order: ServiceOrder) => void;
};

export function SomResultsTable({ results, onSelect }: SomResultsTableProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
        Nenhuma OS encontrada para os filtros informados.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-2">Protocolo</th>
            <th className="px-4 py-2">Número da OS</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">CNPJ</th>
            <th className="px-4 py-2">Circuito</th>
            <th className="px-4 py-2">Produto</th>
            <th className="px-4 py-2">Regional</th>
          </tr>
        </thead>
        <tbody>
          {results.map((order) => (
            <tr
              key={order.serviceOrderNumber}
              className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50"
            >
              <td className="px-4 py-3 text-zinc-800">{order.protocol}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSelect(order)}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {order.serviceOrderNumber}
                </button>
              </td>
              <td className="px-4 py-3 text-zinc-800">{order.type}</td>
              <td className="px-4 py-3 text-zinc-800">{order.customerLegalName}</td>
              <td className="px-4 py-3 text-zinc-800">{order.cnpj}</td>
              <td className="px-4 py-3 text-zinc-800">{order.circuit}</td>
              <td className="px-4 py-3 text-zinc-800">{order.product}</td>
              <td className="px-4 py-3 text-zinc-800">{order.regional}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
