import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { TaskListPage } from './pages/TaskListPage';

export default function App() {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return <LoginPage onAuthed={() => setAuthed(true)} />;
  }

  return <TaskListPage />;
}
