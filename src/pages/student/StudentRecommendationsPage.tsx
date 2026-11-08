import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Play, Sparkles } from 'lucide-react';
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

export const StudentRecommendationsPage: React.FC = () => {
  const { lang, skills } = usePrototype();
  const navigate = useNavigate();

  const categoryLabels = {
    spaced_review: {
      fa: 'مرور به‌موقع برای جلوگیری از فراموشی',
      en: 'Timely Spaced Review',
    },
    continue_path: {
      fa: 'ادامه طبیعی مسیر مبحث فعلی',
      en: 'Next Step in Active Topic',
    },
    prerequisite: {
      fa: 'تکمیل تمرین نیمه‌تمام و پیش‌نیاز',
      en: 'Unfinished & Prerequisite Skill',
    },
  };

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
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

          return (
            <Card key={rec.id} padding="md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4 flex-1">
                  <TopicIllustration kind={topic.illustrationKey} size={60} />
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand" icon={<Compass className="w-3.5 h-3.5" />}>
                        {bi(lang, cat.fa, cat.en)}
                      </Badge>
                      <span className="typo-caption">
                        {bi(lang, topic.titleFa, topic.titleEn)}
                      </span>
                      <SkillStatusPill status={sk.status} lang={lang} />
                    </div>

                    <h2 className="typo-card-title text-lg">
                      {bi(lang, sk.titleFa, sk.titleEn)}
                    </h2>

                    <div className="p-3.5 rounded-control bg-brand-50/70 border border-brand-200 text-sm text-ink-900">
                      <strong className="text-brand-700 inline-flex items-center gap-1 mb-1">
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                        {bi(lang, 'دلیل این پیشنهاد:', 'Why this recommendation:')}
                      </strong>
                      <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                        {bi(lang, rec.reasonFa, rec.reasonEn)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:w-52 shrink-0 flex flex-col gap-2">
                  <span className="typo-caption text-center">
                    {fmtNum(sk.estimatedMinutes, lang)}{' '}
                    {bi(lang, 'دقیقه زمان تخمینی', 'min estimated')}
                  </span>
                  <Button
                    variant="primary"
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
