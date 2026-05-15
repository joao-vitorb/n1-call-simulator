import { CompanySearchCard } from './CompanySearchCard';
import type { SearchType } from '../../utils/search';

type ClientHubMainProps = {
  onSearch: (type: SearchType, value: string) => void;
  onClear?: () => void;
  searchError: string | null;
};

export function ClientHubMain({ onSearch, onClear, searchError }: ClientHubMainProps) {
  return (
    <section className="flex flex-1 items-center justify-center bg-zinc-50 p-8">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-xl font-semibold text-zinc-900">Client Hub</h2>
        <CompanySearchCard onSearch={onSearch} onClear={onClear} searchError={searchError} />
      </div>
    </section>
  );
}
