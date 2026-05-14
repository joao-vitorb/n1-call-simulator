import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen/LoginScreen';

function App() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-2 text-3xl font-semibold text-zinc-900">N1 Call Simulator</h1>
      <p className="mb-6 text-zinc-500">
        Logado como <span className="font-medium text-zinc-700">{currentUser.username}</span>.
      </p>
      <p className="mb-6 text-zinc-500">Em construção.</p>
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      >
        Sair
      </button>
    </main>
  );
}

export default App;
