import { useState } from 'react';

export function InteractionPanel() {
  const [summary, setSummary] = useState('');

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm">
      <label className="block">
        <span className="mb-2 block font-medium text-zinc-700">Formulário da interação</span>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={5}
          placeholder="Descreva o assunto do atendimento"
          className="w-full resize-y rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-zinc-900 outline-none focus:border-zinc-500"
        />
      </label>
    </section>
  );
}
