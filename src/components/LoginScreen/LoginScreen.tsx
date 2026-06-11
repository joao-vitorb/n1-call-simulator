import { useState, type FormEvent } from 'react';
import companyLogo from '../../assets/logos/company.svg';
import { useAuth } from '../../contexts/AuthContext';

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,}$/;

export function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = username.trim();
    if (!USERNAME_PATTERN.test(value)) {
      setError('Use apenas letras, números, ponto, hífen ou underscore. Mínimo de 3 caracteres.');
      return;
    }
    setError(null);
    login(value);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/60 via-white to-zinc-50 p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-200/30 blur-3xl animate-orb-drift"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[360px] w-[360px] rounded-full bg-violet-200/25 blur-3xl animate-orb-drift-slow"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm animate-slide-up"
      >
        <img src={companyLogo} alt="" className="mb-6 h-12 w-auto" />
        <p className="mt-2 text-sm text-zinc-500">
          Entre com seu usuário para começar o treinamento.
        </p>

        <label htmlFor="username" className="mb-1.5 mt-6 block text-xs font-medium text-zinc-500">
          Usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          autoFocus
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
