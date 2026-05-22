import { useEffect, useState } from 'react';
import clientHubLogo from '../../assets/logos/client-hub.svg';
import { CompanySearchCard } from './CompanySearchCard';
import { isCompanyActive, type CompanySearchProps } from '../../utils/search';
import type { Company } from '../../types/company';

const PER_PAGE = 10;

type ClientHubResultsProps = CompanySearchProps & {
  results: Company[];
  onSelectCompany: (company: Company) => void;
};

export function ClientHubResults({
  results,
  onSelectCompany,
  ...searchProps
}: ClientHubResultsProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [results]);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageItems = results.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section className="flex flex-1 bg-zinc-50">
      <aside className="flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-zinc-200 bg-white p-5">
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
            <img src={clientHubLogo} alt="Client Hub" className="h-7 w-7" />
          </span>
        </div>
        <CompanySearchCard {...searchProps} />
      </aside>

      <div className="flex flex-1 flex-col overflow-y-auto p-8">
        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Resultados da busca
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {results.length} empresa{results.length === 1 ? '' : 's'} encontrada
            {results.length === 1 ? '' : 's'}. Clique na razão social para abrir.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/60 text-left text-xs font-medium text-zinc-500">
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">CNPJ</th>
                  <th className="px-6 py-3">Situação</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-zinc-100 last:border-b-0 transition-colors hover:bg-zinc-50/60"
                  >
                    <td className="px-6 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectCompany(company)}
                        className="text-sm font-medium text-indigo-700 transition-colors hover:text-indigo-800 hover:underline"
                      >
                        {company.legalName}
                      </button>
                    </td>
                    <td className="px-6 py-3 font-mono text-sm text-zinc-700">{company.cnpj}</td>
                    <td className="px-6 py-3 text-sm">
                      <SituationPill active={isCompanyActive(company)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 text-sm">
                <span className="text-zinc-500">
                  Página {safePage} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SituationPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-zinc-400'}`}
      />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}
