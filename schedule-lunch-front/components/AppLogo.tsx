interface Props {
  size?: number;
  withWordmark?: boolean;
}

export function AppLogo({ size = 28, withWordmark = true }: Props) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="64 64 384 384"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="256" cy="188" r="118" fill="#0F2040" />
        <circle cx="256" cy="188" r="118" fill="none" stroke="#C8D4E6" strokeWidth="11" />
        <line x1="256" y1="75" x2="256" y2="97" stroke="#C8D4E6" strokeWidth="9" strokeLinecap="round" />
        <line x1="369" y1="188" x2="347" y2="188" stroke="#C8D4E6" strokeWidth="9" strokeLinecap="round" />
        <line x1="256" y1="301" x2="256" y2="279" stroke="#C8D4E6" strokeWidth="9" strokeLinecap="round" />
        <line x1="143" y1="188" x2="165" y2="188" stroke="#C8D4E6" strokeWidth="9" strokeLinecap="round" />
        <line x1="256" y1="188" x2="191" y2="151" stroke="#C8D4E6" strokeWidth="14" strokeLinecap="round" />
        <line x1="256" y1="188" x2="256" y2="103" stroke="#F0A825" strokeWidth="10" strokeLinecap="round" />
        <circle cx="256" cy="188" r="12" fill="#F0A825" />
        <circle cx="256" cy="188" r="5" fill="#0F2040" />
        <circle cx="128" cy="398" r="27" fill="#1D3A5E" />
        <path d="M76 472 Q76 430 128 430 Q180 430 180 472Z" fill="#1D3A5E" />
        <circle cx="256" cy="386" r="33" fill="#F0A825" />
        <path d="M192 472 Q192 423 256 423 Q320 423 320 472Z" fill="#F0A825" />
        <circle cx="384" cy="398" r="27" fill="#1D3A5E" />
        <path d="M332 472 Q332 430 384 430 Q436 430 436 472Z" fill="#1D3A5E" />
      </svg>

      {withWordmark && (
        <span
          className="font-bold text-[var(--color-text)] leading-none"
          style={{ fontSize: size * 0.6 }}
        >
          SchLunch
        </span>
      )}
    </div>
  );
}
