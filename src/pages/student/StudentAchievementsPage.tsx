import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { BadgeGraphic } from '../../components/shared/Illustrations';
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
        icon={<Award className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'دستاوردها و مدال‌ها', 'Achievements') },
        ]}
        title={bi(lang, 'دستاوردها و تالار افتخار (P2)', 'Achievements & Honor Roll (P2)')}
        subtitle={bi(
          lang,
          'نمایش مدال‌های انگیزشی همراه با معیار شفاف دریافت؛ این بخش جنبه تشویقی دارد و جایگزین هدف اصلی یادگیری نمی‌شود.',
          'Exploratory P2 badges with clear earning criteria and locked progress states.'
        )}
        badge={<DemoBadge lang={lang} />}
      />

      <div className="space-y-8">
        <section>
          <SectionHeader
            accentColor="accent"
            title={bi(lang, 'مدال‌های بازشده من', 'Earned Badges')}
            subtitle={bi(
              lang,
              `${fmtNum(unlockedBadges.length, 'fa')} مدال فعال در کارنامه شما`,
              `${unlockedBadges.length} unlocked badges`
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unlockedBadges.map((b) => (
              <Card
                key={b.id}
                padding="md"
                surfaceTone="cream"
                accentTop="accent"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <BadgeGraphic icon={b.iconKey} unlocked size={58} />
                    <Badge tone="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      {bi(lang, 'دریافت‌شده', 'Unlocked')}
                    </Badge>
                  </div>
                  <h3 className="typo-card-title text-lg">{bi(lang, b.titleFa, b.titleEn)}</h3>
                  <p className="typo-caption mt-1.5 mb-3">{bi(lang, b.criteriaFa, b.criteriaEn)}</p>
                </div>
                {b.earnedDateFa && (
                  <div className="pt-2.5 border-t border-accent-200 text-xs font-semibold text-accent-800">
                    {bi(lang, `تاریخ دریافت: ${b.earnedDateFa}`, `Earned: ${b.earnedDateEn}`)}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            accentColor="lavender"
            title={bi(lang, 'مدال‌های قفل‌شده (در مسیر دریافت)', 'Locked Badges & Criteria')}
            subtitle={bi(
              lang,
              'معیار دقیق باز شدن هر مدال برای دانش‌آموز کاملاً شفاف است.',
              'Each locked badge displays its exact earning criteria.'
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lockedBadges.map((b) => (
              <Card
                key={b.id}
                padding="md"
                surfaceTone="lavender"
                accentTop="lavender"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <BadgeGraphic icon={b.iconKey} unlocked={false} size={56} />
                    <Badge tone="lavender" icon={<Lock className="w-3.5 h-3.5" />}>
                      {bi(lang, 'در مسیر باز شدن', 'In Progress')}
                    </Badge>
                  </div>
                  <h3 className="typo-card-title text-ink-900">
                    {bi(lang, b.titleFa, b.titleEn)}
                  </h3>
                  <p className="typo-caption mt-1.5 mb-4">{bi(lang, b.criteriaFa, b.criteriaEn)}</p>
                </div>
                <ProgressBar
                  value={Math.round((b.progressCurrent / b.progressTarget) * 100)}
                  lang={lang}
                  tone="lavender"
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
