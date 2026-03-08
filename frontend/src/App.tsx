import { useState } from 'react';
import Login from './pages/Login';
import Projects from './pages/Projects';
import { isAuthenticated, logout } from './auth/auth';

function App() {
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return(
    <div>
      <button onClick={() => { logout(); setAuthed(false); }}>Logout</button>
      <Projects />
    </div>
  );
}

export default App;
