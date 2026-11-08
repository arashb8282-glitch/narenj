import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Compass, Play, Sparkles } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { TopicIllustration } from '../../components/shared/Illustrations';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  PageHeader,
  SkillStatusPill,
} from '../../components/ui/Primitives';
import { INITIAL_RECOMMENDATIONS, TOPICS } from '../../data/mockData';
import { bi, fmtNum } from '../../utils/format';
import { getTopicTheme } from '../../utils/theme';

export const StudentRecommendationsPage: React.FC = () => {
  const { lang, skills } = usePrototype();
  const navigate = useNavigate();

  const categoryLabels = {
    spaced_review: {
      fa: 'مرور به‌موقع برای تثبیت یادگیری',
      en: 'Timely Spaced Review',
      tone: 'orange' as const,
    },
    continue_path: {
      fa: 'گام بعدی مسیر مبحث فعلی',
      en: 'Next Step in Active Topic',
      tone: 'turquoise' as const,
    },
    prerequisite: {
      fa: 'تکمیل تمرین نیمه‌تمام و پیش‌نیاز',
      en: 'Unfinished & Prerequisite Skill',
      tone: 'lavender' as const,
    },
  };

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
        icon={<Compass className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'پیشنهادهای یادگیری', 'Recommendations') },
        ]}
        title={bi(lang, 'پیشنهادهای یادگیری برای آوا', 'Recommended Skills for Ava')}
        subtitle={bi(
          lang,
          'در این نسخه پروتوتایپ، پیشنهادها ثابت و نمایشی هستند تا ساختار کارت‌ها و شفافیت «دلیل پیشنهاد» ارزیابی شود.',
          'Fixed demo recommendations showcasing transparent rationale cards (no live recommendation engine in MVP prototype).'
        )}
        badge={
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="داده ثابت Demo — الگوریتم پیشنهاد هنوز تصویب نشده"
            labelEn="Fixed Demo — Logic Unapproved"
          />
        }
      />

      <div className="space-y-4">
        {INITIAL_RECOMMENDATIONS.map((rec) => {
          const sk = skills.find((s) => s.id === rec.skillId);
          const topic = TOPICS.find((t) => t.id === rec.topicId);
          if (!sk || !topic) return null;
          const cat = categoryLabels[rec.category];
          const theme = getTopicTheme(topic.id);

          return (
            <Card
              key={rec.id}
              padding="md"
              surfaceTone={theme.surfaceTone}
              accentTop={theme.accentTop}
              interactive
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <TopicIllustration kind={topic.illustrationKey} size={62} />
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={cat.tone} icon={<Compass className="w-3.5 h-3.5" />}>
                        {bi(lang, cat.fa, cat.en)}
                      </Badge>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.chipClass}`}>
                        {bi(lang, topic.titleFa, topic.titleEn)}
                      </span>
                      <SkillStatusPill status={sk.status} lang={lang} />
                    </div>

                    <h2 className="typo-card-title text-lg">
                      {bi(lang, sk.titleFa, sk.titleEn)}
                    </h2>

                    <div className="p-3.5 rounded-control bg-surface/95 border border-border-strong text-sm text-ink-900">
                      <strong className="text-brand-800 inline-flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-4 h-4 text-orange-500" aria-hidden="true" />
                        {bi(lang, 'چرا این مهارت به تو پیشنهاد شده؟', 'Why this recommendation:')}
                      </strong>
                      <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                        {bi(lang, rec.reasonFa, rec.reasonEn)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:w-56 shrink-0 flex flex-col gap-2.5 p-3.5 rounded-card bg-surface border border-border">
                  <span className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-600">
                    <Clock className="w-3.5 h-3.5 text-brand-700" />
                    {fmtNum(sk.estimatedMinutes, lang)}{' '}
                    {bi(lang, 'دقیقه زمان تخمینی', 'min estimated')}
                  </span>
                  <Button
                    variant="cta"
                    onClick={() => navigate(`/student/practice/${sk.id}?from=recommendations`)}
                    icon={<Play className="w-4 h-4 fill-current" />}
                  >
                    {bi(lang, 'شروع تمرین مهارت', 'Start Practice')}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
};
