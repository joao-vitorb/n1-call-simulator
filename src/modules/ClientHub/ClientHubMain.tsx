import companyLogo from "../../assets/logos/company.svg";
import { CompanySearchCard } from "./CompanySearchCard";
import type { SearchType } from "../../utils/search";

type ClientHubMainProps = {
  onSearch: (type: SearchType, value: string) => void;
  onClear?: () => void;
  searchError: string | null;
};

export function ClientHubMain({
  onSearch,
  onClear,
  searchError,
}: ClientHubMainProps) {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-zinc-50 p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-200/30 blur-3xl animate-orb-drift"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[360px] w-[360px] rounded-full bg-violet-200/25 blur-3xl animate-orb-drift-slow"
      />

      <div className="relative w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Buscar empresa
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Consulte por razão social, CNPJ, protocolo ou circuito. Preencha
          apenas um campo.
        </p>
        <div className="mt-6">
          <CompanySearchCard
            onSearch={onSearch}
            onClear={onClear}
            searchError={searchError}
          />
        </div>
        <img src={companyLogo} alt="" className="h-30 w-30 block mx-auto" />
      </div>
    </section>
  );
}
