import { useState } from 'react';
import type { Company } from '../../types/company';

type CompanyClientProps = {
  company: Company;
};

export function CompanyClient({ company }: CompanyClientProps) {
  const [contactsOpen, setContactsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-zinc-700">Responsável pelo CNPJ</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Nome" value={company.responsibleContact.name} />
          <Info label="E-mail" value={company.responsibleContact.email} />
          <Info
            label="Telefone"
            value={`(${company.responsibleContact.phone.ddd}) ${company.responsibleContact.phone.number}`}
          />
          <Info label="Setor" value={company.responsibleContact.department} />
          <Info label="Cliente desde" value={company.responsibleContact.customerSince} />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700">Contatos da empresa</p>
          <button
            type="button"
            onClick={() => setContactsOpen((open) => !open)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            {contactsOpen ? 'Ocultar' : 'Contatos'}
          </button>
        </div>
        {contactsOpen && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="py-2">Nome</th>
                <th className="py-2">E-mail</th>
                <th className="py-2">Telefone</th>
                <th className="py-2">Status</th>
                <th className="py-2">Setor</th>
              </tr>
            </thead>
            <tbody>
              {company.contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-zinc-100 text-zinc-800">
                  <td className="py-2">{contact.name}</td>
                  <td className="py-2">{contact.email}</td>
                  <td className="py-2">
                    ({contact.phone.ddd}) {contact.phone.number}
                  </td>
                  <td className="py-2">{contact.active ? 'Ativo' : 'Inativo'}</td>
                  <td className="py-2">{contact.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-zinc-700">Consultor</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Nome" value={company.consultant.name} />
          <Info label="E-mail" value={company.consultant.email} />
          <Info
            label="Telefone"
            value={`(${company.consultant.phone.ddd}) ${company.consultant.phone.number}`}
          />
        </div>
      </section>
    </div>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium text-zinc-900">{value}</p>
    </div>
  );
}
