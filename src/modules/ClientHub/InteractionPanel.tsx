import { useState } from 'react';

export function InteractionPanel() {
  const [summary, setSummary] = useState('');

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-zinc-900">
          Formulário da interação
        </span>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={5}
          placeholder="Descreva o assunto do atendimento"
          className="w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </label>
    </section>
  );
}
