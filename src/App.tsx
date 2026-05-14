import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { BrowserShell } from './components/BrowserShell/BrowserShell';
import { TrainingSessionProvider } from './contexts/TrainingSessionContext';

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <TrainingSessionProvider>
      <BrowserShell />
    </TrainingSessionProvider>
  );
}

export default App;
