import { useState } from 'react';
import Login from './pages/Login.jsx';
import Projects from './pages/Projects.jsx';
import { isAuthenticated, logout } from './auth/auth';

function App() {
  const [authed, setAuthed] = useState(isAuthenticated())

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
