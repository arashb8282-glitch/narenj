import type { AccentTone, BadgeTone, SurfaceTone } from '../components/ui/Primitives';

export type TopicPaletteKey = 'turquoise' | 'orange' | 'lavender' | 'emerald' | 'sunny' | 'coral';

export interface TopicThemeStyles {
  palette: TopicPaletteKey;
  surfaceTone: SurfaceTone;
  accentTop: AccentTone;
  chipClass: string;
  badgeTone: BadgeTone;
  progressTone: 'brand' | 'turquoise' | 'orange' | 'success' | 'accent' | 'lavender' | 'coral';
  softBg: string;
  softBorder: string;
  accentBar: string;
  badgeBg: string;
  badgeText: string;
  iconPlateBg: string;
  ringHover: string;
}

const PALETTE_MAP: Record<TopicPaletteKey, TopicThemeStyles> = {
  orange: {
    palette: 'orange',
    surfaceTone: 'apricot',
    accentTop: 'orange',
    chipClass: 'bg-orange-100 text-orange-700 border border-orange-200',
    badgeTone: 'orange',
    progressTone: 'orange',
    softBg: 'bg-orange-50/85',
    softBorder: 'border-orange-200',
    accentBar: 'bg-orange-500',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    iconPlateBg: '#FFEADB',
    ringHover: 'hover:border-orange-500',
  },
  turquoise: {
    palette: 'turquoise',
    surfaceTone: 'sky',
    accentTop: 'turquoise',
    chipClass: 'bg-turquoise-100 text-turquoise-700 border border-turquoise-200',
    badgeTone: 'turquoise',
    progressTone: 'turquoise',
    softBg: 'bg-turquoise-50/85',
    softBorder: 'border-turquoise-200',
    accentBar: 'bg-turquoise-500',
    badgeBg: 'bg-turquoise-100',
    badgeText: 'text-turquoise-700',
    iconPlateBg: '#DCF7FB',
    ringHover: 'hover:border-turquoise-500',
  },
  lavender: {
    palette: 'lavender',
    surfaceTone: 'lavender',
    accentTop: 'lavender',
    chipClass: 'bg-lavender-100 text-lavender-700 border border-lavender-200',
    badgeTone: 'lavender',
    progressTone: 'lavender',
    softBg: 'bg-lavender-50/85',
    softBorder: 'border-lavender-200',
    accentBar: 'bg-lavender-500',
    badgeBg: 'bg-lavender-100',
    badgeText: 'text-lavender-700',
    iconPlateBg: '#ECE8FD',
    ringHover: 'hover:border-lavender-500',
  },
  emerald: {
    palette: 'emerald',
    surfaceTone: 'mint',
    accentTop: 'success',
    chipClass: 'bg-success-100 text-success-700 border border-success-200',
    badgeTone: 'success',
    progressTone: 'success',
    softBg: 'bg-success-50/85',
    softBorder: 'border-success-200',
    accentBar: 'bg-success-500',
    badgeBg: 'bg-success-100',
    badgeText: 'text-success-700',
    iconPlateBg: '#DCF7EB',
    ringHover: 'hover:border-success-500',
  },
  sunny: {
    palette: 'sunny',
    surfaceTone: 'cream',
    accentTop: 'accent',
    chipClass: 'bg-accent-100 text-accent-800 border border-accent-200',
    badgeTone: 'accent',
    progressTone: 'accent',
    softBg: 'bg-accent-50/90',
    softBorder: 'border-accent-200',
    accentBar: 'bg-accent-500',
    badgeBg: 'bg-accent-100',
    badgeText: 'text-accent-800',
    iconPlateBg: '#FEF3C7',
    ringHover: 'hover:border-accent-600',
  },
  coral: {
    palette: 'coral',
    surfaceTone: 'coral',
    accentTop: 'coral',
    chipClass: 'bg-coral-100 text-coral-700 border border-coral-200',
    badgeTone: 'coral',
    progressTone: 'coral',
    softBg: 'bg-coral-50/85',
    softBorder: 'border-coral-200',
    accentBar: 'bg-coral-500',
    badgeBg: 'bg-coral-100',
    badgeText: 'text-coral-700',
    iconPlateBg: '#FFE4E8',
    ringHover: 'hover:border-coral-500',
  },
};

export function getTopicTheme(topicId?: string): TopicThemeStyles {
  switch (topicId) {
    case 'top-fractions':
    case 'top-g5-fractions':
      return PALETTE_MAP.orange;
    case 'top-decimals':
      return PALETTE_MAP.turquoise;
    case 'top-ratios':
      return PALETTE_MAP.lavender;
    case 'top-geometry':
      return PALETTE_MAP.emerald;
    case 'top-data':
      return PALETTE_MAP.sunny;
    case 'top-g7-algebra':
      return PALETTE_MAP.coral;
    default:
      return PALETTE_MAP.turquoise;
  }
}
