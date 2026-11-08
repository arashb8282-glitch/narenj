import React from 'react';
import { Language, fmtNum } from '../../utils/format';

export const RoshanaBrandMark: React.FC<{ size?: number; inverted?: boolean }> = ({
  size = 38,
  inverted = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    className="shrink-0"
  >
    <rect
      width="64"
      height="64"
      rx="18"
      fill={inverted ? '#14B3C9' : '#154C66'}
    />
    <rect
      x="6"
      y="6"
      width="52"
      height="52"
      rx="13"
      fill={inverted ? '#0F384C' : '#1B6282'}
    />
    <path
      d="M17 44V26C17 20.477 21.477 16 27 16H47V34C47 39.523 42.523 44 37 44H17Z"
      fill="#14B3C9"
      fillOpacity="0.28"
    />
    {/* Sunlit learning spark */}
    <circle cx="41" cy="23" r="7.5" fill="#F5B524" />
    <circle cx="41" cy="23" r="3.5" fill="#FFFBEB" />
    {/* Rising geometric horizon */}
    <path
      d="M17 43C23 33 31 29 47 29"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M21 49H43"
      stroke="#F36D2F"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const StudentHeroIllustration: React.FC<{
  className?: string;
  onDark?: boolean;
}> = ({ className = '', onDark = false }) => (
  <svg
    viewBox="0 0 360 200"
    fill="none"
    aria-hidden="true"
    className={`w-full max-w-[330px] h-auto ${className}`}
  >
    {/* Sunlit geometric backdrop */}
    <rect
      x="8"
      y="10"
      width="344"
      height="180"
      rx="22"
      fill={onDark ? '#0B2D3D' : '#EBF6FB'}
      fillOpacity={onDark ? '0.55' : '1'}
      stroke={onDark ? '#227BA1' : '#BCE3F2'}
      strokeWidth="1.5"
    />
    {/* Decorative Persian geometric eight-point star / sun */}
    <circle cx="294" cy="48" r="28" fill="#F5B524" fillOpacity="0.22" />
    <circle cx="294" cy="48" r="14" fill="#F5B524" />
    <circle cx="64" cy="44" r="20" fill="#826FE0" fillOpacity="0.22" />
    <circle cx="64" cy="44" r="7" fill="#14B3C9" />

    {/* Discovery trajectory */}
    <path
      d="M48 150C92 104 142 124 190 74C220 44 258 58 294 48"
      stroke="#14B3C9"
      strokeWidth="2.8"
      strokeDasharray="6 5"
    />

    {/* Open notebook with colorful fraction & grid visuals */}
    <rect
      x="34"
      y="78"
      width="124"
      height="84"
      rx="12"
      fill="#FFFFFF"
      stroke="#154C66"
      strokeWidth="2.4"
    />
    <line x1="96" y1="78" x2="96" y2="162" stroke="#D5E2EA" strokeWidth="2" />
    {/* Left page fraction bars */}
    <rect x="46" y="94" width="38" height="10" rx="4" fill="#0D92A6" />
    <rect x="46" y="110" width="18" height="10" rx="4" fill="#F36D2F" />
    <rect x="66" y="110" width="18" height="10" rx="4" fill="#FEF3C7" stroke="#C8830D" strokeWidth="1.2" />
    <rect x="46" y="128" width="28" height="7" rx="3.5" fill="#ECE8FD" />
    <rect x="46" y="140" width="36" height="7" rx="3.5" fill="#DCF7EB" />

    {/* Right page 2x2 color matrix */}
    <rect x="106" y="94" width="40" height="40" rx="7" fill="#F6F4FE" stroke="#6854C9" strokeWidth="1.6" />
    <rect x="108" y="96" width="17" height="17" rx="3" fill="#25AB75" fillOpacity="0.75" />
    <rect x="127" y="96" width="17" height="17" rx="3" fill="#14B3C9" fillOpacity="0.65" />
    <rect x="108" y="115" width="17" height="17" rx="3" fill="#F5B524" fillOpacity="0.85" />
    <rect x="127" y="115" width="17" height="17" rx="3" fill="#ECE8FD" />

    {/* Architectural geometry triangle & protractor */}
    <polygon
      points="204,162 256,74 308,162"
      fill="#FFFFFF"
      stroke="#154C66"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <polygon
      points="226,148 256,98 286,148"
      fill="#826FE0"
      fillOpacity="0.24"
      stroke="#6854C9"
      strokeWidth="1.6"
    />
    <path
      d="M168 162C168 138.804 186.804 120 210 120C233.196 120 252 138.804 252 162"
      fill="#F36D2F"
      fillOpacity="0.28"
      stroke="#DF5418"
      strokeWidth="2.2"
    />
    {/* Milestone node */}
    <circle cx="190" cy="74" r="9" fill="#25AB75" stroke="#FFFFFF" strokeWidth="2.5" />
  </svg>
);

export const TopicIllustration: React.FC<{
  kind: 'fractions' | 'decimals' | 'geometry' | 'ratios' | 'data';
  size?: number;
}> = ({ kind, size = 64 }) => {
  const plateMap = {
    fractions: { bg: '#DCF7FB', border: '#A6ECF5' },
    decimals: { bg: '#FFEADB', border: '#FFD2B8' },
    geometry: { bg: '#ECE8FD', border: '#D5CDFB' },
    ratios: { bg: '#DCF7EB', border: '#B2EBD2' },
    data: { bg: '#FEF3C7', border: '#FDE396' },
  }[kind];

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true" className="shrink-0">
      <rect
        x="1"
        y="1"
        width="70"
        height="70"
        rx="18"
        fill={plateMap.bg}
        stroke={plateMap.border}
        strokeWidth="2"
      />
      {kind === 'fractions' && (
        <>
          <circle cx="36" cy="36" r="20" fill="#FFFFFF" stroke="#097383" strokeWidth="2.4" />
          <path d="M36 36L36 16A20 20 0 0 1 56 36Z" fill="#F36D2F" />
          <path d="M36 36L56 36A20 20 0 0 1 36 56Z" fill="#14B3C9" />
          <path d="M36 36L36 56A20 20 0 0 1 16 36Z" fill="#14B3C9" fillOpacity="0.28" />
          <line x1="16" y1="36" x2="56" y2="36" stroke="#097383" strokeWidth="2" />
          <line x1="36" y1="16" x2="36" y2="56" stroke="#097383" strokeWidth="2" />
        </>
      )}
      {kind === 'decimals' && (
        <>
          <rect x="16" y="16" width="40" height="40" rx="7" fill="#FFFFFF" stroke="#BD4310" strokeWidth="2.2" />
          <rect x="18" y="18" width="18" height="36" rx="2" fill="#F36D2F" fillOpacity="0.32" />
          <rect x="36" y="18" width="10" height="18" rx="2" fill="#F5B524" />
          <line x1="36" y1="16" x2="36" y2="56" stroke="#BD4310" strokeWidth="1.6" />
          <line x1="16" y1="36" x2="56" y2="36" stroke="#BD4310" strokeWidth="1.6" />
          <circle cx="36" cy="47" r="3.5" fill="#DF5418" />
        </>
      )}
      {kind === 'geometry' && (
        <>
          <polygon
            points="21,53 39,17 57,53"
            fill="#FFFFFF"
            stroke="#5240AD"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <rect
            x="15"
            y="33"
            width="21"
            height="21"
            rx="4"
            fill="#826FE0"
            fillOpacity="0.45"
            stroke="#5240AD"
            strokeWidth="2"
          />
          <circle cx="39" cy="17" r="3.5" fill="#F5B524" />
        </>
      )}
      {kind === 'ratios' && (
        <>
          <line x1="20" y1="53" x2="52" y2="53" stroke="#136A47" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="36,38 29,53 43,53" fill="#1B8A5D" />
          <line x1="17" y1="32" x2="55" y2="26" stroke="#136A47" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="22" cy="24" r="6.5" fill="#F5B524" stroke="#9A6207" strokeWidth="1.5" />
          <rect x="44" y="14" width="11" height="11" rx="3" fill="#14B3C9" stroke="#097383" strokeWidth="1.5" />
        </>
      )}
      {kind === 'data' && (
        <>
          <rect x="17" y="37" width="9" height="17" rx="3" fill="#14B3C9" />
          <rect x="31.5" y="26" width="9" height="28" rx="3" fill="#F36D2F" />
          <rect x="46" y="18" width="9" height="36" rx="3" fill="#1B8A5D" />
          <line x1="13" y1="54" x2="59" y2="54" stroke="#7C4E05" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const QuestionVisualDiagram: React.FC<{
  visualType?: 'fraction_bars' | 'decimal_grid' | 'geometry_rect' | 'number_line';
  lang: Language;
  widthCm?: number;
  heightCm?: number;
}> = ({ visualType, lang, widthCm = 8, heightCm = 5 }) => {
  if (!visualType) return null;

  if (visualType === 'fraction_bars') {
    return (
      <div className="my-4 rounded-card bg-surface-sky border border-turquoise-200 p-4 sm:p-5">
        <div className="typo-caption mb-3 font-semibold text-turquoise-700">
          {lang === 'fa'
            ? 'نمایش تصویری هم‌مخرج‌کردن روی نوار کسری:'
            : 'Visual fraction bar model:'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center" dir="ltr">
          <div className="bg-white p-3 rounded-control border border-turquoise-200 shadow-sm">
            <div className="text-xs font-bold text-turquoise-700 mb-1.5">1/2 = 2/4</div>
            <div className="grid grid-cols-4 h-10 rounded-control overflow-hidden border-2 border-brand-800 bg-white">
              <div className="bg-turquoise-500 border-r border-white/70" />
              <div className="bg-turquoise-500 border-r border-brand-800" />
              <div className="border-r border-border bg-canvas/40" />
              <div className="bg-canvas/40" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-control border border-orange-200 shadow-sm">
            <div className="text-xs font-bold text-orange-700 mb-1.5">+ 1/4</div>
            <div className="grid grid-cols-4 h-10 rounded-control overflow-hidden border-2 border-brand-800 bg-white">
              <div className="bg-orange-500 border-r border-brand-800" />
              <div className="border-r border-border bg-canvas/40" />
              <div className="border-r border-border bg-canvas/40" />
              <div className="bg-canvas/40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'decimal_grid') {
    return (
      <div className="my-4 rounded-card bg-orange-50 border border-orange-200 p-4 flex flex-col sm:flex-row items-center gap-4">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="shrink-0 bg-white rounded-control border-2 border-brand-800 shadow-sm"
        >
          {/* 4 columns (0.4) */}
          <rect x="0" y="0" width="40" height="100" fill="#14B3C9" fillOpacity="0.28" />
          {/* 3 rows (0.3) */}
          <rect x="0" y="0" width="100" height="30" fill="#F5B524" fillOpacity="0.35" />
          {/* Overlap 4x3 = 12 squares (0.12) */}
          <rect x="0" y="0" width="40" height="30" fill="#25AB75" fillOpacity="0.72" />
          {Array.from({ length: 9 }).map((_, i) => {
            const pos = (i + 1) * 10;
            return (
              <React.Fragment key={i}>
                <line x1={pos} y1="0" x2={pos} y2="100" stroke="#D5E2EA" strokeWidth="0.8" />
                <line x1="0" y1={pos} x2="100" y2={pos} stroke="#D5E2EA" strokeWidth="0.8" />
              </React.Fragment>
            );
          })}
        </svg>
        <div className="typo-caption text-ink-900 leading-relaxed">
          {lang === 'fa'
            ? 'در شبکه ۱۰۰ تایی، هم‌پوشانی ۴ ستون فیروزه‌ای (۰/۴) و ۳ ردیف زرد (۰/۳) به رنگ سبز مشخص شده است (۱۲ خانه از ۱۰۰ خانه = ۰/۱۲).'
            : 'On the 100-grid, the overlap of 4 turquoise columns (0.4) and 3 yellow rows (0.3) forms 12 green hundredths (0.12).'}
        </div>
      </div>
    );
  }

  if (visualType === 'geometry_rect') {
    return (
      <div className="my-4 rounded-card bg-lavender-50 border border-lavender-200 p-4 flex justify-center">
        <svg width="250" height="136" viewBox="0 0 250 136" fill="none">
          <rect
            x="44"
            y="30"
            width="154"
            height="84"
            rx="8"
            fill="#DCF7EB"
            stroke="#5240AD"
            strokeWidth="2.8"
          />
          <text x="121" y="21" textAnchor="middle" fill="#14222B" fontSize="13" fontWeight="600">
            {lang === 'fa' ? `طول = ${fmtNum(widthCm, 'fa')} متر` : `Length = ${widthCm} m`}
          </text>
          <text x="208" y="75" textAnchor="start" fill="#5240AD" fontSize="13" fontWeight="600">
            {lang === 'fa' ? `${fmtNum(heightCm, 'fa')} متر` : `${heightCm} m`}
          </text>
        </svg>
      </div>
    );
  }

  return null;
};

export const EmptyStateIllustration: React.FC<{ variant?: 'search' | 'classroom' | 'chart' }> = ({
  variant = 'search',
}) => (
  <svg width="144" height="102" viewBox="0 0 180 124" fill="none" aria-hidden="true" className="mx-auto">
    <rect x="24" y="14" width="132" height="96" rx="18" fill="#EBF6FB" stroke="#BCE3F2" strokeWidth="2" />
    {variant === 'search' && (
      <>
        <rect x="44" y="36" width="62" height="8" rx="4" fill="#BCE3F2" />
        <rect x="44" y="52" width="84" height="8" rx="4" fill="#FFFFFF" />
        <rect x="44" y="68" width="46" height="8" rx="4" fill="#FDE396" />
        <circle cx="132" cy="84" r="16" fill="#FFFFFF" stroke="#0D92A6" strokeWidth="2.5" />
        <path d="M144 96L155 107" stroke="#F36D2F" strokeWidth="3.5" strokeLinecap="round" />
      </>
    )}
    {variant === 'classroom' && (
      <>
        <rect x="46" y="32" width="88" height="46" rx="8" fill="#FFFFFF" stroke="#0D92A6" strokeWidth="2" />
        <line x1="60" y1="48" x2="116" y2="48" stroke="#A6ECF5" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="60" x2="96" y2="60" stroke="#FDE396" strokeWidth="3" strokeLinecap="round" />
        <circle cx="66" cy="94" r="8" fill="#D5CDFB" />
        <circle cx="90" cy="94" r="8" fill="#14B3C9" />
        <circle cx="114" cy="94" r="8" fill="#FFD2B8" />
      </>
    )}
    {variant === 'chart' && (
      <>
        <rect x="52" y="66" width="14" height="24" rx="4" fill="#14B3C9" />
        <rect x="78" y="46" width="14" height="44" rx="4" fill="#F36D2F" />
        <rect x="104" y="56" width="14" height="34" rx="4" fill="#826FE0" />
        <line x1="42" y1="90" x2="138" y2="90" stroke="#154C66" strokeWidth="2.2" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const AvatarSymbolGraphic: React.FC<{
  symbol: 'telescope' | 'compass' | 'owl' | 'prism' | 'planet' | 'crown';
  bgColor?: string;
  size?: number;
}> = ({ symbol, bgColor = '#1B6282', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden="true" className="shrink-0">
    <rect width="72" height="72" rx="20" fill={bgColor} />
    <circle cx="36" cy="36" r="26" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="1.8" />
    {symbol === 'compass' && (
      <>
        <polygon points="36,15 43,36 36,40 29,36" fill="#F5B524" />
        <polygon points="36,57 43,36 36,32 29,36" fill="#DCF7FB" />
        <circle cx="36" cy="36" r="4.5" fill="#FFFFFF" />
      </>
    )}
    {symbol === 'telescope' && (
      <>
        <path d="M22 44L46 24L52 31L27 50Z" fill="#F5B524" />
        <line x1="34" y1="44" x2="26" y2="56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="44" x2="42" y2="56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="20" r="3.5" fill="#FFFBEB" />
      </>
    )}
    {symbol === 'prism' && (
      <>
        <polygon points="36,16 54,50 18,50" fill="#DCF7FB" fillOpacity="0.3" stroke="#FFFFFF" strokeWidth="2.5" />
        <polygon points="36,16 54,50 36,43" fill="#F5B524" fillOpacity="0.88" />
      </>
    )}
    {symbol === 'owl' && (
      <>
        <rect x="22" y="22" width="28" height="30" rx="14" fill="#FFFBEB" />
        <circle cx="30" cy="34" r="5" fill="#0F384C" />
        <circle cx="42" cy="34" r="5" fill="#0F384C" />
        <polygon points="36,37 32,43 40,43" fill="#F36D2F" />
      </>
    )}
    {symbol === 'planet' && (
      <>
        <circle cx="36" cy="36" r="13" fill="#F5B524" />
        <ellipse
          cx="36"
          cy="36"
          rx="24"
          ry="7"
          transform="rotate(-20 36 36)"
          stroke="#FFFFFF"
          strokeWidth="2.6"
        />
      </>
    )}
    {symbol === 'crown' && (
      <polygon points="18,48 22,26 36,36 50,26 54,48" fill="#F5B524" stroke="#FFFFFF" strokeWidth="2" />
    )}
  </svg>
);

export const CelebrationIllustration: React.FC = () => (
  <svg width="172" height="128" viewBox="0 0 172 128" fill="none" aria-hidden="true" className="mx-auto">
    <circle cx="86" cy="64" r="50" fill="#DCF7EB" />
    <circle cx="86" cy="64" r="35" fill="#1B8A5D" />
    <path
      d="M71 65L82 76L103 53"
      stroke="#FFFFFF"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="32" r="6" fill="#F5B524" />
    <circle cx="140" cy="28" r="7" fill="#14B3C9" />
    <circle cx="144" cy="92" r="5" fill="#F36D2F" />
    <circle cx="28" cy="90" r="5" fill="#826FE0" />
  </svg>
);

export const BadgeGraphic: React.FC<{
  icon: 'compass' | 'sparkles' | 'geometry' | 'streak' | 'fractions' | 'star';
  unlocked?: boolean;
  size?: number;
}> = ({ icon, unlocked = true, size = 56 }) => {
  const plate = unlocked ? '#FEF3C7' : '#ECE8FD';
  const stroke = unlocked ? '#F5B524' : '#826FE0';
  const accent = unlocked ? '#F36D2F' : '#6550C9';
  const sub = unlocked ? '#14B3C9' : '#B8CCF4';

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="4" y="4" width="56" height="56" rx="18" fill={plate} stroke={stroke} strokeWidth="2.2" />
      <circle cx="32" cy="32" r="19" fill="#FFFFFF" fillOpacity="0.82" />
      {icon === 'streak' && (
        <path
          d="M33 15C38 22 43 26 42 35C41 42 36 47 31 47C25 47 21 42 22 35C23 30 27 28 28 23C30 26 31 27 33 15Z"
          fill={accent}
        />
      )}
      {icon === 'compass' && (
        <>
          <polygon points="32,16 38,32 32,36 26,32" fill={accent} />
          <polygon points="32,48 38,32 32,28 26,32" fill={sub} />
          <circle cx="32" cy="32" r="3.5" fill="#154C66" />
        </>
      )}
      {icon === 'geometry' && (
        <polygon points="32,17 46,43 18,43" fill={sub} fillOpacity="0.35" stroke={accent} strokeWidth="2.8" />
      )}
      {icon === 'fractions' && (
        <>
          <rect x="20" y="20" width="24" height="8" rx="3" fill={accent} />
          <line x1="18" y1="32" x2="46" y2="32" stroke="#154C66" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="20" y="36" width="24" height="8" rx="3" fill={sub} />
        </>
      )}
      {(icon === 'star' || icon === 'sparkles') && (
        <polygon
          points="32,15 36.5,25.5 48,26.8 39.2,34.5 41.8,46 32,40 22.2,46 24.8,34.5 16,26.8 27.5,25.5"
          fill={unlocked ? '#F5B524' : '#826FE0'}
          stroke={accent}
          strokeWidth="1.6"
        />
      )}
    </svg>
  );
};

export const TeacherWorkspaceIllustration: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    viewBox="0 0 280 156"
    fill="none"
    aria-hidden="true"
    className={`w-full max-w-[260px] h-auto ${className}`}
  >
    <rect x="6" y="8" width="268" height="140" rx="20" fill="#154C66" stroke="#14B3C9" strokeOpacity="0.45" strokeWidth="1.5" />
    {/* Mini Analytics Card */}
    <rect x="24" y="24" width="136" height="106" rx="14" fill="#FFFFFF" />
    <rect x="38" y="38" width="64" height="8" rx="4" fill="#154C66" />
    <rect x="38" y="88" width="18" height="28" rx="4" fill="#14B3C9" />
    <rect x="64" y="72" width="18" height="44" rx="4" fill="#1B8A5D" />
    <rect x="90" y="60" width="18" height="56" rx="4" fill="#F36D2F" />
    <rect x="116" y="50" width="18" height="66" rx="4" fill="#F5B524" />
    {/* Mini Roster / Task Cards */}
    <rect x="174" y="24" width="84" height="48" rx="12" fill="#ECE8FD" />
    <circle cx="194" cy="48" r="10" fill="#826FE0" />
    <rect x="210" y="41" width="36" height="6" rx="3" fill="#46359E" />
    <rect x="210" y="51" width="24" height="5" rx="2.5" fill="#826FE0" />
    <rect x="174" y="82" width="84" height="48" rx="12" fill="#DCF7EB" />
    <circle cx="194" cy="106" r="10" fill="#1B8A5D" />
    <path d="M190 106L193 109L199 102" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="210" y="99" width="36" height="6" rx="3" fill="#146947" />
    <rect x="210" y="109" width="28" height="5" rx="2.5" fill="#1B8A5D" />
  </svg>
);
