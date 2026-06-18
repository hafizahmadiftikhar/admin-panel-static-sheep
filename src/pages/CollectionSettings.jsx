import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Save, Check, Layers, Tag, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import TierBadge from '../components/TierBadge';
import { COLLECTION_SETTINGS } from '../data/mockData';

export default function CollectionSettings() {
  const [name, setName] = useState(COLLECTION_SETTINGS.name);
  const [description, setDescription] = useState(COLLECTION_SETTINGS.description);
  const [blackSheep, setBlackSheep] = useState(
    COLLECTION_SETTINGS.blackSheepEnabled
  );
  const [tiers, setTiers] = useState(COLLECTION_SETTINGS.tiers);
  const [phases, setPhases] = useState(COLLECTION_SETTINGS.phases);
  const [saved, setSaved] = useState(false);

  const setTierPrice = (key, field, value) =>
    setTiers((list) =>
      list.map((t) => (t.key === key ? { ...t, [field]: value } : t))
    );

  const togglePhase = (name) =>
    setPhases((list) =>
      list.map((p) => (p.name === name ? { ...p, enabled: !p.enabled } : p))
    );

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Collection identity */}
      <Card
        title="Collection Details"
        subtitle="Public-facing name and description"
      >
        <div className="space-y-4">
          <Input
            label="Collection name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            as="textarea"
            label="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Card>

      {/* Tier prices */}
      <Card
        title="Tier Pricing"
        subtitle="Set the mint price for each tier"
        action={<Tag size={16} className="text-gold" />}
      >
        <div className="space-y-3">
          {tiers.map((t) => (
            <div
              key={t.key}
              className="grid grid-cols-1 items-center gap-3 rounded-xl border border-white/8 bg-ink p-4 sm:grid-cols-[1fr_auto_auto]"
            >
              <div className="flex items-center gap-3">
                <TierBadge tier={t.key} size="lg" />
                <span className="text-xs text-white/40">
                  Supply {t.supply.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-white/40">
                  SOL
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={t.priceSol}
                  onChange={(e) =>
                    setTierPrice(t.key, 'priceSol', Number(e.target.value))
                  }
                  className="field h-10 w-28"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-white/40">
                  USDC
                </span>
                <input
                  type="number"
                  value={t.priceUsdc}
                  onChange={(e) =>
                    setTierPrice(t.key, 'priceUsdc', Number(e.target.value))
                  }
                  className="field h-10 w-28"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Phase management */}
      <Card
        title="Phase Management"
        subtitle="Enable or disable release phases"
        action={<Layers size={16} className="text-gold" />}
      >
        <div className="space-y-3">
          {phases.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-ink p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gold-light">
                    {p.name}
                  </span>
                  <span className="text-xs text-white/40">· {p.label}</span>
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {p.released} minted in this phase
                </p>
              </div>
              <Toggle checked={p.enabled} onChange={() => togglePhase(p.name)} />
            </div>
          ))}
        </div>
      </Card>

      {/* Black sheep + special */}
      <Card
        title="Special Items"
        subtitle="One-of-one and rare mechanics"
        action={<Sparkles size={16} className="text-gold" />}
      >
        <div className="rounded-xl border border-white/8 bg-ink p-4">
          <Toggle
            checked={blackSheep}
            onChange={setBlackSheep}
            label="Black Sheep (1 of 1)"
            description="The rarest piece — lifetime studio access, producer credit and homestead suite key."
          />
        </div>
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-xl border border-white/8 bg-ink-2/90 px-5 py-4 backdrop-blur">
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-sm text-emerald-300"
            >
              <Check size={15} /> Changes saved
            </motion.span>
          )}
        </AnimatePresence>
        <Button variant="solid" icon={Save} onClick={save}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
