import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { BrowserShell } from './components/BrowserShell/BrowserShell';
import { TrainingSessionProvider } from './contexts/TrainingSessionContext';
import { CreatedOrdersProvider } from './contexts/CreatedOrdersContext';
import { ClientHubDataProvider } from './contexts/ClientHubDataContext';

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <TrainingSessionProvider>
      <CreatedOrdersProvider>
        <ClientHubDataProvider>
          <BrowserShell />
        </ClientHubDataProvider>
      </CreatedOrdersProvider>
    </TrainingSessionProvider>
  );
}

export default App;
