import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Check, ArrowRight } from 'lucide-react';
import AuthShell from '../components/layout/AuthShell';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * Step 2 of password recovery — set a new password + confirm it.
 * On success shows a confirmation, then returns to /login.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    }, 450);
  };

  if (done) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center py-4 text-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
          >
            <Check size={26} />
          </motion.span>
          <h2 className="mt-5 font-serif text-xl text-gold-light">
            Password updated
          </h2>
          <p className="mt-1 text-sm text-white/45">
            You can now sign in with your new password.
          </p>
          <Button
            to="/login"
            variant="solid"
            iconRight={ArrowRight}
            className="mt-6 w-full"
          >
            Back to Sign In
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer="Choose a strong password you haven't used before.">
      <h2 className="font-serif text-xl text-gold-light">Set a new password</h2>
      <p className="mt-1 text-sm text-white/45">
        Your code was verified. Enter and confirm your new password.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          label="New password"
          type="password"
          icon={Lock}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <Input
          label="Confirm new password"
          type="password"
          icon={Lock}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter new password"
          error={error || undefined}
          autoComplete="new-password"
        />

        <div className="flex items-center justify-end pt-1">
          <Link
            to="/login"
            className="text-xs text-white/45 transition-colors hover:text-gold-light"
          >
            Back to sign in
          </Link>
        </div>

        <Button
          type="submit"
          variant="solid"
          loading={loading}
          iconRight={ArrowRight}
          className="mt-2 w-full"
        >
          {loading ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
    </AuthShell>
  );
}
