import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, PlayCircle } from 'lucide-react';
import { Skill } from '../../data/types';
import { Language, bi, fmtNum } from '../../utils/format';
import { Button, Card, ProgressBar, SkillStatusPill } from '../ui/Primitives';

export const SkillCard: React.FC<{
  skill: Skill;
  lang: Language;
  topicTitle?: string;
  compact?: boolean;
}> = ({ skill, lang, topicTitle, compact = false }) => {
  const navigate = useNavigate();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const isStarted = skill.status === 'in_progress' || skill.status === 'needs_review';
  const ctaLabel = isStarted
    ? bi(lang, 'ادامه تمرین', 'Resume Practice')
    : skill.status === 'mastered'
      ? bi(lang, 'مرور دوباره', 'Practice Again')
      : bi(lang, 'شروع تمرین', 'Start Practice');

  return (
    <Card padding="md" className="flex flex-col justify-between gap-4 hover:border-brand-600/60 transition-colors">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="ltr-token text-xs font-semibold px-2 py-0.5 rounded bg-canvas border border-border text-ink-600">
              {skill.code}
            </span>
            {topicTitle && <span className="typo-caption">{topicTitle}</span>}
          </div>
          <SkillStatusPill status={skill.status} lang={lang} />
        </div>

        <h3 className="typo-card-title">{bi(lang, skill.titleFa, skill.titleEn)}</h3>

        {!compact && (
          <p className="typo-body text-ink-600 text-sm">{bi(lang, skill.descriptionFa, skill.descriptionEn)}</p>
        )}

        {skill.attentionNoteFa && (
          <div className="p-2.5 rounded-control bg-warning-100/55 border border-warning-600/25 text-xs text-ink-900">
            {bi(lang, skill.attentionNoteFa, skill.attentionNoteEn ?? skill.attentionNoteFa)}
          </div>
        )}
      </div>

      <div className="space-y-3 pt-2 border-t border-border/70">
        <ProgressBar
          value={skill.demoProgress}
          lang={lang}
          label={bi(lang, 'پیشرفت تمرینی (نمونه نمایشی)', 'Demo Practice Progress')}
          tone={skill.status === 'mastered' ? 'success' : skill.status === 'needs_review' ? 'warning' : 'brand'}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-600">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {fmtNum(skill.estimatedMinutes, lang)} {bi(lang, 'دقیقه زمان تخمینی', 'min est.')}
            </span>
          </span>

          <Button
            variant={skill.status === 'in_progress' ? 'primary' : 'secondary'}
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
