const base = { fill: "none", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconUpload({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M12 15V4M12 4L7.5 8.5M12 4l4.5 4.5" />
      <path d="M4.5 15v3a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-3" />
    </svg>
  );
}

export function IconFile({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M7 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M14 3.5V8a1 1 0 0 0 1 1h4.5" />
    </svg>
  );
}

export function IconCheck({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function IconAlert({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
      <path d="M12 2.5c.5 3.6 1.7 5.8 4.9 6.9-3.2 1.1-4.4 3.3-4.9 6.9-.5-3.6-1.7-5.8-4.9-6.9 3.2-1.1 4.4-3.3 4.9-6.9Z" />
      <path d="M19 14.5c.28 1.9.9 3 2.6 3.6-1.7.6-2.3 1.7-2.6 3.6-.28-1.9-.9-3-2.6-3.6 1.7-.6 2.3-1.7 2.6-3.6Z" />
    </svg>
  );
}

export function IconCopy({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <rect x="8.5" y="8.5" width="11" height="11" rx="1.8" />
      <path d="M15.5 8.5V6.3A1.8 1.8 0 0 0 13.7 4.5H6.3A1.8 1.8 0 0 0 4.5 6.3v7.4a1.8 1.8 0 0 0 1.8 1.8h2.2" />
    </svg>
  );
}

export function IconDownload({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M12 3.5V15M12 15l-4-4M12 15l4-4" />
      <path d="M4.5 17v1.7A2.3 2.3 0 0 0 6.8 21h10.4a2.3 2.3 0 0 0 2.3-2.3V17" />
    </svg>
  );
}

export function IconArrowRight({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M4 12h15.5M13 5.5 19.5 12 13 18.5" />
    </svg>
  );
}

export function IconClock({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconGauge({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 15.5 9.5" />
      <path d="M12 15h.01" />
    </svg>
  );
}

export function IconType({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M5 6h14M12 6v13" />
    </svg>
  );
}

export function IconChat({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M4.5 6.5A2 2 0 0 1 6.5 4.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4.2 3.3A.6.6 0 0 1 4.9 18.4V13.5a2 2 0 0 1-.4-1.2Z" />
    </svg>
  );
}

export function IconSend({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M4 12 20 4l-6.5 16-2.5-6.5L4 12Z" />
    </svg>
  );
}

export function IconHistory({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M4 12a8 8 0 1 0 2.5-5.8" />
      <path d="M4 4.5V9h4.5" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  );
}

export function IconTrash({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M5 7h14M9.5 7V5.3A1.3 1.3 0 0 1 10.8 4h2.4a1.3 1.3 0 0 1 1.3 1.3V7M7.5 7 8 19a1.5 1.5 0 0 0 1.5 1.4h5a1.5 1.5 0 0 0 1.5-1.4l.5-12" />
    </svg>
  );
}

export function IconX({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} stroke="currentColor">
      <path d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5" />
    </svg>
  );
}

export function IconLinkedin({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.5 20h-3.37v-5.98c0-1.43-.03-3.26-1.99-3.26-1.99 0-2.3 1.55-2.3 3.15V20H9.48V8.5h3.24v1.57h.05c.45-.86 1.56-1.76 3.21-1.76 3.43 0 4.06 2.26 4.06 5.2V20Z" />
    </svg>
  );
}

export function IconGithub({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
      <path d="M12 2.5a9.87 9.87 0 0 0-3.12 19.24c.5.09.68-.21.68-.48v-1.86c-2.76.6-3.34-1.19-3.34-1.19-.45-1.15-1.1-1.45-1.1-1.45-.9-.61.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.88 1.52 2.32 1.08 2.89.82.09-.64.35-1.08.63-1.33-2.2-.25-4.52-1.1-4.52-4.9 0-1.08.39-1.97 1.02-2.66-.1-.25-.44-1.26.1-2.63 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.38.1 2.63.64.69 1.02 1.58 1.02 2.66 0 3.81-2.33 4.65-4.55 4.9.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A9.87 9.87 0 0 0 12 2.5Z" />
    </svg>
  );
}
