import type { Company } from '../../types/company';

type CompanyHeaderProps = {
  company: Company;
};

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4">
      <h2 className="text-lg font-semibold text-zinc-900">{company.legalName}</h2>
      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
        <Info label="CNPJ" value={company.cnpj} />
        <Info label="Segmento" value={company.segment} />
        <Info label="Sub-segmento" value={company.subSegment} />
        <Info label="Cliente GTD" value={company.isGtd ? 'Sim' : 'Não'} />
        <Info label="Endereço" value={company.mainAddress.fullAddress} className="col-span-2" />
      </div>
    </header>
  );
}

type InfoProps = {
  label: string;
  value: string;
  className?: string;
};

function Info({ label, value, className }: InfoProps) {
  return (
    <div className={className}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium text-zinc-900">{value}</p>
    </div>
  );
}
