import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AuthShell from '../components/layout/AuthShell';
import CodeInput from '../components/ui/CodeInput';
import Button from '../components/ui/Button';

/**
 * Step 1 of password recovery — enter the verification code.
 * On submit, routes to /reset-password (a separate full-screen route).
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (code.trim().length < 6) {
      setError('Enter the full 6-digit code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate('/reset-password');
    }, 450);
  };

  return (
    <AuthShell footer="Demo console — any 6-digit code will work.">
      <h2 className="font-serif text-xl text-gold-light">Verify your code</h2>
      <p className="mt-1 text-sm text-white/45">
        We sent a 6-digit code to{' '}
        <span className="text-gold-light">hafiz@fiznex.com</span>. Enter it
        below to continue.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <CodeInput value={code} onChange={setCode} />
        {error && <p className="text-xs text-red-300/90">{error}</p>}

        <div className="flex items-center justify-between pt-1 text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-white/45 transition-colors hover:text-gold-light"
          >
            <ArrowLeft size={13} /> Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => {
              setResent(true);
              setTimeout(() => setResent(false), 2200);
            }}
            className="text-gold transition-colors hover:text-gold-light"
          >
            {resent ? 'Code resent ✓' : 'Resend code'}
          </button>
        </div>

        <Button
          type="submit"
          variant="solid"
          loading={loading}
          iconRight={ArrowRight}
          className="mt-2 w-full"
        >
          {loading ? 'Verifying…' : 'Verify Code'}
        </Button>
      </form>
    </AuthShell>
  );
}
