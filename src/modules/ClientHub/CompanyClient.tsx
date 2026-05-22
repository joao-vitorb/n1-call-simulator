import { useState } from 'react';
import type { Company } from '../../types/company';

type CompanyClientProps = {
  company: Company;
};

export function CompanyClient({ company }: CompanyClientProps) {
  const [contactsOpen, setContactsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <SectionCard title="Responsável pelo CNPJ">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Info label="Nome" value={company.responsibleContact.name} />
          <Info label="E-mail" value={company.responsibleContact.email} />
          <Info
            label="Telefone"
            value={`(${company.responsibleContact.phone.ddd}) ${company.responsibleContact.phone.number}`}
            mono
          />
          <Info label="Setor" value={company.responsibleContact.department} />
          <Info label="Cliente desde" value={company.responsibleContact.customerSince} mono />
        </div>
      </SectionCard>

      <SectionCard
        title="Contatos da empresa"
        action={
          <button
            type="button"
            onClick={() => setContactsOpen((open) => !open)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            {contactsOpen ? 'Ocultar' : `${company.contacts.length} contatos`}
          </button>
        }
      >
        {contactsOpen ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">E-mail</th>
                <th className="py-2 pr-4">Telefone</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Setor</th>
              </tr>
            </thead>
            <tbody>
              {company.contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-zinc-100 last:border-b-0">
                  <td className="py-3 pr-4 text-sm text-zinc-900">{contact.name}</td>
                  <td className="py-3 pr-4 text-sm text-zinc-700">{contact.email}</td>
                  <td className="py-3 pr-4 font-mono text-sm text-zinc-700">
                    ({contact.phone.ddd}) {contact.phone.number}
                  </td>
                  <td className="py-3 pr-4 text-sm">
                    <StatusPill active={contact.active} />
                  </td>
                  <td className="py-3 text-sm text-zinc-700">{contact.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-zinc-500">Clique para expandir a lista de contatos.</p>
        )}
      </SectionCard>

      <SectionCard title="Consultor">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Info label="Nome" value={company.consultant.name} />
          <Info label="E-mail" value={company.consultant.email} />
          <Info
            label="Telefone"
            value={`(${company.consultant.phone.ddd}) ${company.consultant.phone.number}`}
            mono
          />
        </div>
      </SectionCard>
    </div>
  );
}

type SectionCardProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

type InfoProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function Info({ label, value, mono }: InfoProps) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium text-zinc-500">{label}</p>
      <p className={`text-sm text-zinc-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
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
