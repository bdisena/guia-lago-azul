/** Ícones de traço fino (1.25px), no lugar dos emojis. */
type P = { className?: string };
const base = (path: React.ReactNode, className = "h-5 w-5") => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{path}</svg>
);
export const IconHome = ({ className }: P) => base(<><path d="M3.5 10.5 12 4l8.5 6.5" /><path d="M5.5 9v10.5h13V9" /><path d="M10 19.5v-5h4v5" /></>, className);
export const IconQuote = ({ className }: P) => base(<><rect x="5" y="3.5" width="14" height="17" rx="0.5" /><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" /></>, className);
export const IconStar = ({ className }: P) => base(<path d="m12 4 2.3 4.9 5.2.6-3.9 3.6 1.1 5.2L12 15.7l-4.7 2.6 1.1-5.2-3.9-3.6 5.2-.6Z" />, className);
export const IconPlus = ({ className }: P) => base(<><circle cx="12" cy="12" r="8.5" /><path d="M12 8v8M8 12h8" /></>, className);
export const IconSearch = ({ className }: P) => base(<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>, className);
export const IconArrow = ({ className }: P) => base(<path d="M5 12h14m-5-5 5 5-5 5" />, className);
export const IconBack = ({ className }: P) => base(<path d="M19 12H5m5-5-5 5 5 5" />, className);
export const IconCheck = ({ className }: P) => base(<path d="m5 12.5 4.5 4.5L19 7.5" />, className);
export const IconPhone = ({ className }: P) => base(<path d="M5 4.5h3.5l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5V19a1 1 0 0 1-1 1A15.5 15.5 0 0 1 4 5.5a1 1 0 0 1 1-1Z" />, className);
export const IconClose = ({ className }: P) => base(<path d="M6 6l12 12M18 6 6 18" />, className);
export const IconDownload = ({ className }: P) => base(<><path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5" /><path d="M5 19.5h14" /></>, className);
