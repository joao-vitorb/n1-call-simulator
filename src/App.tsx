import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { BrowserShell } from './components/BrowserShell/BrowserShell';

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <BrowserShell />;
}

export default App;
