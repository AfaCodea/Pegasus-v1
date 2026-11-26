import { useState } from 'react';
import { setToken } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { TaskListPage } from './pages/TaskListPage';

export default function App() {
  const [authed, setAuthed] = useState(false);

  function handleLogout() {
    setToken(null);
    setAuthed(false);
  }

  if (!authed) {
    return <LoginPage onAuthed={() => setAuthed(true)} />;
  }

  return <TaskListPage onLogout={handleLogout} />;
}
