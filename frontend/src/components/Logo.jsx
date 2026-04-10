import React from 'react';

const SIZES = {
  sm: {
    container: 'gap-2',
    iconBase: 'w-8 h-8 rounded-xl',
    svg: 'w-4 h-4',
    title: 'text-lg',
  },
  md: {
    container: 'gap-3',
    iconBase: 'w-11 h-11 rounded-2xl',
    svg: 'w-5 h-5',
    title: 'text-xl',
  },
  lg: {
    container: 'gap-4',
    iconBase: 'w-14 h-14 rounded-[1.5rem]',
    svg: 'w-7 h-7',
    title: 'text-3xl',
  },
};

const OptionA = ({ iconClass, svgClass }) => (
  <div className={`${iconClass} bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-xl shadow-blue-500/30 shrink-0 relative overflow-hidden ring-1 ring-white/10`}>
    <div className="absolute inset-0 bg-gradient-to-tl from-black/10 to-transparent pointer-events-none"></div>
    <svg className={`${svgClass} text-white relative z-10 drop-shadow-md`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 21H8a6 6 0 0 1-6-6V9a6 6 0 0 1 6-6h2" />
      <polygon points="12 3 22 3 15 12 20 12 10 22 12 13 8 13" fill="currentColor" stroke="none" />
    </svg>
  </div>
);

const OptionB = ({ iconClass, svgClass }) => (
  <div className={`${iconClass} bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-500/30 shrink-0 relative overflow-hidden`}>
    <svg className={`${svgClass} text-white relative z-10`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fillOpacity="0.9" />
    </svg>
  </div>
);

const OptionC = ({ iconClass, svgClass }) => (
  <div className={`${iconClass} bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 shrink-0 relative overflow-hidden`}>
    <svg className={`${svgClass} text-white relative z-10`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" opacity="0.2" fill="currentColor" />
      <path d="M10 8h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4v4" />
      <path d="M14 16l4-4" />
    </svg>
  </div>
);

export function Logo({ size = 'md', withText = true, theme = 'light', text = 'ClientFlow', option = 'A' }) {
  const sizeClasses = SIZES[size] || SIZES.md;
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';

  const renderIcon = () => {
    switch (option) {
      case 'B': return <OptionB iconClass={sizeClasses.iconBase} svgClass={sizeClasses.svg} />;
      case 'C': return <OptionC iconClass={sizeClasses.iconBase} svgClass={sizeClasses.svg} />;
      case 'A':
      default:
        return <OptionA iconClass={sizeClasses.iconBase} svgClass={sizeClasses.svg} />;
    }
  };

  return (
    <div className={`flex items-center ${sizeClasses.container} select-none group`}>
      {renderIcon()}
      {withText && (
        <span className={`font-black tracking-tight font-display ${sizeClasses.title} ${textColor}`}>
          {text}
        </span>
      )}
    </div>
  );
}

export default Logo;
