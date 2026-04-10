import { Loader2 } from 'lucide-react';

/* ─────────────────────────────────────────────
   VARIANT + SIZE maps
───────────────────────────────────────────── */
const VARIANTS = {
  primary:     'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500/40 disabled:bg-blue-300',
  secondary:   'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 focus-visible:ring-blue-500/20 disabled:text-slate-400 disabled:border-slate-100',
  ghost:       'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-400/30 disabled:text-slate-300',
  dark:        'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-black focus-visible:ring-slate-700/40 disabled:bg-slate-400',
  destructive: 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500/40 disabled:bg-rose-300',
};

const SIZES = {
  sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
  md: 'text-sm px-5 py-3 gap-2 rounded-2xl',
  lg: 'text-base px-7 py-4 gap-2.5 rounded-2xl',
};

/* ─────────────────────────────────────────────
   Button
───────────────────────────────────────────── */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center font-bold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-4',
        'active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100',
        'hover:-translate-y-px disabled:hover:translate-y-0',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading
        ? <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin shrink-0" />
        : leftIcon && <span className="shrink-0">{leftIcon}</span>}

      {children && <span className="leading-none">{children}</span>}

      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

/* ─────────────────────────────────────────────
   IconButton  — square or circle icon-only
───────────────────────────────────────────── */
export function IconButton({
  icon,
  label,                   // required for a11y (aria-label)
  variant = 'ghost',
  size = 'md',
  shape = 'square',        // 'square' | 'circle'
  className = '',
  ...rest
}) {
  const ICON_SIZE = { sm: 'p-2', md: 'p-2.5', lg: 'p-3' };
  const radius    = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <Button
      variant={variant}
      className={`${ICON_SIZE[size] ?? ICON_SIZE.md} ${radius} ${className}`}
      aria-label={label}
      {...rest}
    >
      <span className="shrink-0">{icon}</span>
    </Button>
  );
}
