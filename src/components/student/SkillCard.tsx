import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Clock, PlayCircle, Sparkles } from 'lucide-react';
import { Skill } from '../../data/types';
import { Language, bi, fmtNum } from '../../utils/format';
import { getTopicTheme } from '../../utils/theme';
import { Button, Card, ProgressBar, SkillStatusPill } from '../ui/Primitives';

export const SkillCard: React.FC<{
  skill: Skill;
  lang: Language;
  topicTitle?: string;
  compact?: boolean;
}> = ({ skill, lang, topicTitle, compact = false }) => {
  const navigate = useNavigate();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;
  const theme = getTopicTheme(skill.topicId);

  const isStarted = skill.status === 'in_progress' || skill.status === 'needs_review';
  const ctaLabel = isStarted
    ? bi(lang, 'ادامه تمرین', 'Resume Practice')
    : skill.status === 'mastered'
      ? bi(lang, 'مرور دوباره', 'Practice Again')
      : bi(lang, 'شروع تمرین', 'Start Practice');

  const cardSurface =
    skill.status === 'needs_review'
      ? 'coral'
      : skill.status === 'mastered'
        ? 'mint'
        : 'white';

  const cardAccent =
    skill.status === 'needs_review'
      ? 'coral'
      : skill.status === 'mastered'
        ? 'success'
        : theme.accentTop;

  const progressTone =
    skill.status === 'mastered'
      ? 'success'
      : skill.status === 'needs_review'
        ? 'coral'
        : skill.status === 'in_progress'
          ? 'turquoise'
          : 'brand';

  const buttonVariant =
    skill.status === 'needs_review'
      ? 'cta'
      : skill.status === 'in_progress'
        ? 'primary'
        : skill.status === 'not_started'
          ? 'turquoise'
          : 'secondary';

  return (
    <Card
      padding="md"
      surfaceTone={cardSurface}
      accentTop={cardAccent}
      interactive
      className="flex flex-col justify-between gap-4"
    >
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`ltr-token text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.chipClass}`}>
              {skill.code}
            </span>
            {topicTitle && (
              <span className="typo-caption font-semibold truncate">{topicTitle}</span>
            )}
          </div>
          <SkillStatusPill status={skill.status} lang={lang} />
        </div>

        <h3 className="typo-card-title leading-snug">{bi(lang, skill.titleFa, skill.titleEn)}</h3>

        {!compact && (
          <p className="typo-body text-ink-600 text-sm">
            {bi(lang, skill.descriptionFa, skill.descriptionEn)}
          </p>
        )}

        {skill.teacherAssigned && !skill.attentionNoteFa && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-700">
            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{bi(lang, 'تعیین‌شده توسط معلم کلاس', 'Assigned by your teacher')}</span>
          </div>
        )}

        {skill.attentionNoteFa && (
          <div className="flex items-start gap-2 p-2.5 rounded-control bg-surface/90 border border-coral-200 text-xs font-medium text-coral-700">
            <AlertCircle className="w-4 h-4 text-coral-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{bi(lang, skill.attentionNoteFa, skill.attentionNoteEn ?? skill.attentionNoteFa)}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-border/80">
        <ProgressBar
          value={skill.demoProgress}
          lang={lang}
          label={bi(lang, 'پیشرفت تمرینی (داده نمونه)', 'Practice Progress (Demo)')}
          tone={progressTone}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600">
            <Clock className="w-3.5 h-3.5 text-brand-700" aria-hidden="true" />
            <span>
              {fmtNum(skill.estimatedMinutes, lang)} {bi(lang, 'دقیقه تخمینی', 'min est.')}
            </span>
          </span>

          <Button
            variant={buttonVariant}
            size="sm"
            onClick={() => navigate(`/student/practice/${skill.id}`)}
            icon={<PlayCircle className="w-4 h-4" />}
            iconEnd={<ArrowIcon className="w-3.5 h-3.5" />}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};
