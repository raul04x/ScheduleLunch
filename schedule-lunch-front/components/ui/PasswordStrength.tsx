'use client';

import { useTranslation } from '@/lib/i18n';

interface Props {
  password: string;
}

function evaluate(pwd: string) {
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
}

export function PasswordStrength({ password }: Props) {
  const { t } = useTranslation();
  if (!password) return null;

  const c = evaluate(password);
  const score = Object.values(c).filter(Boolean).length;

  const level =
    score <= 1 ? { bars: 1, bar: 'bg-red-500',    text: 'text-red-500',    label: t.passwordStrengthWeak }   :
    score === 2 ? { bars: 2, bar: 'bg-orange-400', text: 'text-orange-400', label: t.passwordStrengthFair }   :
    score === 3 ? { bars: 3, bar: 'bg-yellow-500', text: 'text-yellow-500', label: t.passwordStrengthGood }   :
                  { bars: 4, bar: 'bg-green-500',  text: 'text-green-500',  label: t.passwordStrengthStrong };

  const reqs = [
    { ok: c.length,    label: t.passwordReqLength },
    { ok: c.uppercase, label: t.passwordReqUppercase },
    { ok: c.lowercase, label: t.passwordReqLowercase },
    { ok: c.number,    label: t.passwordReqNumber },
    { ok: c.special,   label: t.passwordReqSpecial },
  ];

  return (
    <div className="space-y-2 pt-0.5">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                i <= level.bars ? level.bar : 'bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold ${level.text}`}>{level.label}</span>
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {reqs.map((r, i) => (
          <li
            key={i}
            className={`text-xs flex items-center gap-1 transition-colors ${
              r.ok ? 'text-green-500' : 'text-[var(--color-text-muted)]'
            }`}
          >
            <span className="text-[10px] w-3 text-center">{r.ok ? '✓' : '○'}</span>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
