import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { BrowserShell } from './components/BrowserShell/BrowserShell';
import { TrainingSessionProvider } from './contexts/TrainingSessionContext';
import { CreatedOrdersProvider } from './contexts/CreatedOrdersContext';
import { ClientHubDataProvider } from './contexts/ClientHubDataContext';
import { TicketUpdatesProvider } from './contexts/TicketUpdatesContext';

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <ClientHubDataProvider>
      <TrainingSessionProvider>
        <CreatedOrdersProvider>
          <TicketUpdatesProvider>
            <BrowserShell />
          </TicketUpdatesProvider>
        </CreatedOrdersProvider>
      </TrainingSessionProvider>
    </ClientHubDataProvider>
  );
}

export default App;
