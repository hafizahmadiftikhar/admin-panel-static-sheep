import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthShell from '../components/layout/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Login — centered gold-glow card (AuthShell).
 * Any credentials are accepted (mock auth) → routes to the dashboard.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('hafiz@fiznex.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    // simulate a tiny round-trip so the button shows its loading state
    setTimeout(() => {
      login(email);
      navigate('/dashboard', { replace: true });
    }, 450);
  };

  return (
    <AuthShell footer="Demo console — any credentials will sign you in.">
      <h2 className="font-serif text-xl text-gold-light">Welcome back</h2>
      <p className="mt-1 text-sm text-white/45">Sign in to manage the flock.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@fiznex.com"
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end pt-1">
          <Link
            to="/forgot-password"
            className="text-xs text-gold transition-colors hover:text-gold-light"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="solid"
          loading={loading}
          iconRight={ArrowRight}
          className="mt-2 w-full"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  );
}
