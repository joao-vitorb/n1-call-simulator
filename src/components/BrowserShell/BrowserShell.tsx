import { TabBar } from './TabBar';

export function BrowserShell() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-200">
      <TabBar />
      <main className="flex-1 bg-white">
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-sm text-zinc-500">Selecione uma aba para começar.</p>
        </div>
      </main>
    </div>
  );
}
