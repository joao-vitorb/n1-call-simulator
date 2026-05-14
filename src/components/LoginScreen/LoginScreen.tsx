import { useState, type FormEvent } from 'react';
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900">N1 Call Simulator</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Entre com seu usuário para começar o treinamento.
        </p>

        <label htmlFor="username" className="mb-2 block text-sm font-medium text-zinc-700">
          Usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          autoFocus
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
