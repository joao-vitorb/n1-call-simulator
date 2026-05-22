import type { Company, Segment, SubSegment } from '../../types/company';

type CompanyHeaderProps = {
  company: Company;
};

const SEGMENT_DOT: Record<Segment, string> = {
  Corporativo: 'bg-indigo-500',
  Empresarial: 'bg-sky-500',
  Governamental: 'bg-amber-500',
  Operadoras: 'bg-violet-500',
};

const SUB_SEGMENT_TONE: Record<SubSegment, string> = {
  Black: 'bg-zinc-900 text-white ring-zinc-900',
  Platinum: 'bg-zinc-200 text-zinc-800 ring-zinc-200',
  Gold: 'bg-amber-100 text-amber-800 ring-amber-200',
  Green: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
};

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white px-8 py-6 animate-fade-in">
      <div>
        <p className="text-xs font-medium text-zinc-500">Razão social</p>
        <h2 className="mt-0.5 text-2xl font-semibold tracking-tight text-zinc-900">
          {company.legalName}
        </h2>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
        <Field label="CNPJ">
          <span className="font-mono text-sm text-zinc-900">{company.cnpj}</span>
        </Field>
        <Field label="Segmento">
          <span className="flex items-center gap-1.5 text-sm text-zinc-900">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${SEGMENT_DOT[company.segment]}`} />
            {company.segment}
          </span>
        </Field>
        <Field label="Sub-segmento">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${SUB_SEGMENT_TONE[company.subSegment]}`}
          >
            {company.subSegment}
          </span>
        </Field>
        <Field label="Cliente GTD">
          <span className="text-sm text-zinc-900">{company.isGtd ? 'Sim' : 'Não'}</span>
        </Field>
        <Field label="Endereço" className="col-span-2 md:col-span-3 lg:col-span-4">
          <span className="text-sm text-zinc-900">{company.mainAddress.fullAddress}</span>
        </Field>
      </dl>
    </header>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

function Field({ label, children, className }: FieldProps) {
  return (
    <div className={className}>
      <dt className="mb-1 text-xs font-medium text-zinc-500">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
