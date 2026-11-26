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
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result = isRegister
        ? await api.register(email, password)
        : await api.login(email, password);
      setToken(result.token);
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
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
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
        <button type="submit" disabled={busy}>
          {isRegister ? 'Create account' : 'Log in'}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setIsRegister((v) => !v);
            setError(null);
          }}
        >
          {isRegister ? 'Have an account? Log in' : 'New here? Register'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
