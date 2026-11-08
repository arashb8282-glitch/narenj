import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  Badge,
  Card,
  DemoBadge,
  PageHeader,
  ProgressBar,
  SectionHeader,
} from '../../components/ui/Primitives';
import { bi, fmtNum } from '../../utils/format';

export const StudentAchievementsPage: React.FC = () => {
  const { lang, badges } = usePrototype();

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'دستاوردها و تالار افتخار', 'Achievements & Honor Roll') },
        ]}
        title={bi(lang, 'دستاوردها و تالار افتخار (P2)', 'Achievements & Honor Roll (P2)')}
        subtitle={bi(
          lang,
          'نمایش نشان‌های انگیزشی همراه با معیار شفاف دریافت؛ این بخش جنبه تکمیلی دارد و جایگزین هدف یادگیری نمی‌شود.',
          'Exploratory P2 badges with clear earning criteria and locked progress states.'
        )}
        badge={<DemoBadge lang={lang} />}
      />

      <div className="space-y-8">
        <section>
          <SectionHeader
            title={bi(lang, 'نشان‌های دریافت‌شده', 'Earned Badges')}
            subtitle={bi(
              lang,
              `${fmtNum(unlockedBadges.length, 'fa')} نشان فعال در کارنامه شما`,
              `${unlockedBadges.length} unlocked badges`
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unlockedBadges.map((b) => (
              <Card key={b.id} padding="md" className="border-accent-200 bg-surface">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-card bg-accent-100 text-accent-700 flex items-center justify-center">
                    <Award className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <Badge tone="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                    {bi(lang, 'دریافت‌شده', 'Unlocked')}
                  </Badge>
                </div>
                <h3 className="typo-card-title">{bi(lang, b.titleFa, b.titleEn)}</h3>
                <p className="typo-caption mt-1 mb-3">{bi(lang, b.criteriaFa, b.criteriaEn)}</p>
                {b.earnedDateFa && (
                  <div className="pt-2.5 border-t border-border text-xs text-ink-600">
                    {bi(lang, `تاریخ دریافت: ${b.earnedDateFa}`, `Earned: ${b.earnedDateEn}`)}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            title={bi(lang, 'نشان‌های قفل‌شده (در مسیر دریافت)', 'Locked Badges & Criteria')}
            subtitle={bi(
              lang,
              'معیار دقیق باز شدن هر نشان برای دانش‌آموز شفاف است.',
              'Each locked badge displays its exact earning criteria.'
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lockedBadges.map((b) => (
              <Card key={b.id} padding="md" className="bg-canvas/60 border-border">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-card bg-surface border border-border text-ink-400 flex items-center justify-center">
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <Badge tone="neutral">{bi(lang, 'قفل‌شده', 'Locked')}</Badge>
                </div>
                <h3 className="typo-card-title text-ink-900">{bi(lang, b.titleFa, b.titleEn)}</h3>
                <p className="typo-caption mt-1 mb-4">{bi(lang, b.criteriaFa, b.criteriaEn)}</p>
                <ProgressBar
                  value={Math.round((b.progressCurrent / b.progressTarget) * 100)}
                  lang={lang}
                  label={
                    lang === 'fa'
                      ? `${fmtNum(b.progressCurrent, 'fa')} از ${fmtNum(b.progressTarget, 'fa')}`
                      : `${b.progressCurrent} of ${b.progressTarget}`
                  }
                />
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};
