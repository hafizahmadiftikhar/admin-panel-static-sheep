import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, Lock, Mail, User as UserIcon, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_AVATAR } from '../data/mockData';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const fileRef = useRef(null);

  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [savedProfile, setSavedProfile] = useState(false);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const saveProfile = () => {
    updateProfile({ name, avatar });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2200);
  };

  const savePassword = () => {
    setPwError('');
    if (!pw.current) return setPwError('Enter your current password.');
    if (pw.next.length < 8)
      return setPwError('New password must be at least 8 characters.');
    if (pw.next !== pw.confirm)
      return setPwError('New password and confirmation do not match.');
    setPwSaved(true);
    setPw({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 2200);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: avatar + identity */}
      <div className="lg:col-span-1">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="group relative">
              <img
                src={avatar}
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
                className="h-28 w-28 rounded-2xl border border-gold/30 object-cover shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-ink-2 text-gold-light transition-all duration-200 hover:bg-gold hover:text-ink hover:shadow-[0_0_12px_rgba(201,168,64,0.25)]"
                aria-label="Change photo"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickAvatar}
              />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-gold-light">{name}</h2>
            <p className="text-sm text-white/45">{profile.email}</p>
            <div className="mt-3">
              <Badge tone="gold">{profile.role}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Right: editable fields */}
      <div className="space-y-6 lg:col-span-2">
        {/* Account details */}
        <Card title="Account Details" subtitle="Your admin identity">
          <div className="space-y-4">
            <Input
              label="Admin name"
              icon={UserIcon}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              icon={Mail}
              value={profile.email}
              disabled
              hint="Email is tied to your login and can't be changed here."
              className="cursor-not-allowed opacity-70"
            />
            <div className="flex items-center justify-end gap-3 pt-1">
              <AnimatePresence>
                {savedProfile && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm text-emerald-300"
                  >
                    <Check size={15} /> Profile saved
                  </motion.span>
                )}
              </AnimatePresence>
              <Button variant="solid" icon={Save} onClick={saveProfile}>
                Save changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Change password */}
        <Card
          title="Change Password"
          subtitle="Keep your console secure"
          action={<Lock size={16} className="text-gold" />}
        >
          <div className="space-y-4">
            <Input
              label="Current password"
              type="password"
              icon={Lock}
              value={pw.current}
              onChange={(e) => setPw((s) => ({ ...s, current: e.target.value }))}
              placeholder="••••••••"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="New password"
                type="password"
                icon={Lock}
                value={pw.next}
                onChange={(e) => setPw((s) => ({ ...s, next: e.target.value }))}
                placeholder="At least 8 characters"
              />
              <Input
                label="Confirm new password"
                type="password"
                icon={Lock}
                value={pw.confirm}
                onChange={(e) =>
                  setPw((s) => ({ ...s, confirm: e.target.value }))
                }
                placeholder="Re-enter new password"
                error={pwError || undefined}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <AnimatePresence>
                {pwSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-sm text-emerald-300"
                  >
                    <Check size={15} /> Password updated
                  </motion.span>
                )}
              </AnimatePresence>
              <Button variant="solid" icon={Save} onClick={savePassword}>
                Update password
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
