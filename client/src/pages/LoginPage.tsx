import { FormEvent, useState } from 'react';
import { api, setToken } from '../api/client';

interface Props {
  onAuthed: () => void;
}

export function LoginPage({ onAuthed }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = isRegister ? await api.register(email, password) : await api.login(email, password);
      setToken(result.token);
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegister((v) => !v)}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
