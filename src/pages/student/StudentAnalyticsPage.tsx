import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, CheckCircle2, Clock, Play, Sparkles, TrendingUp } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  Button,
  Card,
  ChartPanel,
  DemoBadge,
  EmptyState,
  ErrorState,
  PageHeader,
  PageSkeleton,
  ProgressBar,
  SectionHeader,
  SelectField,
  SkillStatusPill,
  StatCard,
} from '../../components/ui/Primitives';
import { STUDENT_WEEKLY_MINUTES_SERIES, TOPICS } from '../../data/mockData';
import { bi, fmtNum, fmtPercent } from '../../utils/format';

export const StudentAnalyticsPage: React.FC = () => {
  const { lang, skills, pageSimState, setPageSimState } = usePrototype();
  const navigate = useNavigate();

  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [rangeFilter, setRangeFilter] = useState<string>('7d');

  const grade6Skills = skills.filter(
    (s) => s.grade === 6 && (topicFilter === 'all' || s.topicId === topicFilter)
  );

  const nextActionSkill =
    grade6Skills.find((s) => s.status === 'needs_review') ??
    grade6Skills.find((s) => s.status === 'in_progress') ??
    skills[0];

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'پیشرفت من', 'My Progress') },
        ]}
        title={bi(lang, 'پیشرفت من در ریاضی', 'My Mathematics Progress')}
        subtitle={bi(
          lang,
          'مشاهده زمان تمرین، وضعیت مهارت‌ها و گام پیشنهادی بعدی بر پایه فعالیت‌های ثبت‌شده (تمام اعداد نمونه هستند).',
          'Review practice time, skill progress, and your clearest next learning step (all values are DEMO DATA).'
        )}
        badge={<DemoBadge lang={lang} />}
      />

      {pageSimState === 'loading' && <PageSkeleton />}

      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'خطا در بارگذاری گزارش پیشرفت', 'Could not load progress analytics')}
          description={bi(
            lang,
            'دریافت اطلاعات نمودارها با خطا روبه‌رو شد.',
            'Failed to load chart data.'
          )}
          retryLabel={bi(lang, 'تلاش مجدد', 'Retry')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <Card padding="sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <SelectField
                id="stu-analytics-topic"
                label={bi(lang, 'فیلتر مبحث ریاضی', 'Topic Filter')}
                value={topicFilter}
                onChange={setTopicFilter}
                options={[
                  { value: 'all', label: bi(lang, 'همه مباحث پایه ششم', 'All Grade 6 Topics') },
                  ...TOPICS.filter((t) => t.grade === 6).map((t) => ({
                    value: t.id,
                    label: bi(lang, t.titleFa, t.titleEn),
                  })),
                ]}
              />
              <SelectField
                id="stu-analytics-range"
                label={bi(lang, 'بازه زمانی', 'Time Range')}
                value={rangeFilter}
                onChange={setRangeFilter}
                options={[
                  { value: '7d', label: bi(lang, '۷ روز گذشته', 'Last 7 Days') },
                  { value: '30d', label: bi(lang, '۳۰ روز گذشته', 'Last 30 Days') },
                  { value: 'term', label: bi(lang, 'از ابتدای سال تحصیلی', 'Current Term') },
                ]}
              />
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setPageSimState(
                      pageSimState === 'insufficient_data' ? 'normal' : 'insufficient_data'
                    )
                  }
                >
                  {pageSimState === 'insufficient_data'
                    ? bi(lang, 'بازگشت به داده عادی', 'Show Normal Demo Data')
                    : bi(lang, 'شبیه‌سازی حالت داده ناکافی', 'Test Insufficient Data State')}
                </Button>
              </div>
            </div>
          </Card>

          {pageSimState === 'insufficient_data' ? (
            <EmptyState
              variant="chart"
              title={bi(
                lang,
                'هنوز داده کافی برای رسم نمودار در این بازه ثبت نشده است',
                'Not enough practice sessions yet to plot trends'
              )}
              description={bi(
                lang,
                'با تکمیل حداقل ۲ جلسه تمرین در هفته، نمودار زمان و دقت پاسخ‌گویی شما در این بخش شکل می‌گیرد.',
                'Complete at least 2 practice sessions so Roshana can summarize your weekly trend.'
              )}
              action={
                <Button
                  variant="primary"
                  onClick={() => navigate(`/student/practice/${nextActionSkill.id}`)}
                >
                  {bi(lang, 'شروع یک جلسه تمرین', 'Start a Practice Session')}
                </Button>
              }
            />
          ) : (
            <>
              {/* Summary StatCards with Explicit Definitions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label={bi(lang, 'زمان تمرین این هفته', 'Practice Time (7d)')}
                  value={`${fmtNum(rangeFilter === '30d' ? 245 : 65, lang)} ${bi(lang, 'دقیقه', 'min')}`}
                  definition={bi(
                    lang,
                    'مجموع زمان فعال صرف‌شده روی سؤال‌ها (بدون احتساب توقف‌ها).',
                    'Active question-solving duration excluding idle pauses.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<Clock className="w-5 h-5" />}
                />
                <StatCard
                  label={bi(lang, 'پرسش‌های پاسخ‌داده‌شده', 'Questions Answered')}
                  value={fmtNum(rangeFilter === '30d' ? 118 : 34, lang)}
                  definition={bi(
                    lang,
                    'تعداد کل سؤال‌هایی که پاسخ نهایی برای آن‌ها ثبت شده است.',
                    'Total questions submitted across practiced skills.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<BarChart3 className="w-5 h-5" />}
                />
                <StatCard
                  label={bi(lang, 'میانگین دقت پاسخ‌ها', 'Response Accuracy')}
                  value={fmtPercent(80, lang)}
                  definition={bi(
                    lang,
                    'نسبت پاسخ‌های درست در تلاش اول به کل سؤال‌های پاسخ‌داده‌شده.',
                    'Ratio of first-attempt correct answers to total submitted answers.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <StatCard
                  label={bi(lang, 'مهارت‌های تمرین‌شده', 'Skills Practiced')}
                  value={`${fmtNum(5, lang)} ${bi(lang, 'از ۹ مهارت', 'of 9 skills')}`}
                  definition={bi(
                    lang,
                    'تعداد مهارت‌های پایه ششم که حداقل یک بار تمرین شده‌اند.',
                    'Grade 6 skills with at least one recorded session.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                />
              </div>

              {/* Actionable Next Step Banner */}
              <Card padding="md" className="bg-brand-50 border-brand-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span>{bi(lang, 'گام پیشنهادی بعدی بر اساس عملکرد شما', 'Suggested Next Learning Step')}</span>
                    </div>
                    <h2 className="typo-card-title text-lg">
                      {bi(lang, nextActionSkill.titleFa, nextActionSkill.titleEn)}
                    </h2>
                    <p className="typo-caption text-ink-900">
                      {bi(
                        lang,
                        nextActionSkill.attentionNoteFa ??
                          'ادامه این مهارت باعث تثبیت مفاهیم تمرین‌شده اخیر می‌شود.',
                        nextActionSkill.attentionNoteEn ??
                          'Continuing this skill reinforces your recent practice.'
                      )}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/student/practice/${nextActionSkill.id}`)}
                    icon={<Play className="w-4 h-4 fill-current" />}
                  >
                    {bi(lang, 'شروع تمرین این مهارت', 'Practice This Skill')}
                  </Button>
                </div>
              </Card>

              {/* Accessible Weekly Chart */}
              <ChartPanel
                lang={lang}
                title={bi(
                  lang,
                  'نمودار دقایق تمرین روزانه و درصد دقت',
                  'Daily Practice Minutes & Accuracy'
                )}
                subtitle={bi(
                  lang,
                  'ستون آبی زمان تمرین (دقیقه) و ستون کهربایی درصد پاسخ درست در همان روز را نشان می‌دهد.',
                  'Teal bars show practice minutes; amber bars indicate accuracy percentage.'
                )}
                legendItems={[
                  { label: bi(lang, 'دقایق تمرین', 'Minutes'), colorClass: 'bg-brand-600' },
                  { label: bi(lang, 'درصد دقت (نمونه)', 'Accuracy %'), colorClass: 'bg-accent-500' },
                ]}
                maxVal={30}
                bars={STUDENT_WEEKLY_MINUTES_SERIES.map((d) => ({
                  label: bi(lang, d.dayFa, d.dayEn),
                  primaryValue: d.minutes,
                  secondaryValue: d.accuracy,
                  unitSuffix: lang === 'fa' ? ' د' : 'm',
                }))}
              />

              {/* Constructive Skill-Level Performance List (Zero vague "weak" labels!) */}
              <section>
                <SectionHeader
                  title={bi(lang, 'جزئیات عملکرد به تفکیک مهارت', 'Skill-by-Skill Breakdown')}
                  subtitle={bi(
                    lang,
                    'به‌جای برچسب‌های کلی و قضاوتی (مانند «ضعیف»)، وضعیت هر مهارت با توضیح آموزشی شفاف بیان شده است.',
                    'Uses constructive, explainable learning guidance rather than vague labels like "weak".'
                  )}
                />
                <Card padding="none" className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                      <thead className="bg-canvas border-b border-border text-xs text-ink-600">
                        <tr>
                          <th className="py-3.5 px-4 text-start">{bi(lang, 'مهارت', 'Skill')}</th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'وضعیت پیشنهادی', 'Proposed Status')}
                          </th>
                          <th className="py-3.5 px-4 text-start w-48">
                            {bi(lang, 'پیشرفت نمایشی', 'Demo Progress')}
                          </th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'توضیح آموزشی', 'Learning Insight')}
                          </th>
                          <th className="py-3.5 px-4 text-end">{bi(lang, 'اقدام', 'Action')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {grade6Skills.map((sk) => (
                          <tr key={sk.id} className="hover:bg-canvas/50">
                            <td className="py-3.5 px-4 font-semibold text-ink-900">
                              <div>{bi(lang, sk.titleFa, sk.titleEn)}</div>
                              <span className="ltr-token text-xs text-ink-600 font-normal">
                                {sk.code}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <SkillStatusPill status={sk.status} lang={lang} />
                            </td>
                            <td className="py-3.5 px-4">
                              <ProgressBar value={sk.demoProgress} lang={lang} showValue />
                            </td>
                            <td className="py-3.5 px-4 text-xs text-ink-600 max-w-xs">
                              {sk.attentionNoteFa
                                ? bi(lang, sk.attentionNoteFa, sk.attentionNoteEn ?? '')
                                : sk.status === 'mastered'
                                  ? bi(
                                      lang,
                                      'پاسخ‌گویی پایدار و دقیق در پرسش‌های اخیر',
                                      'Consistent accuracy in recent questions'
                                    )
                                  : bi(
                                      lang,
                                      'آماده شروع و کشف مفهوم جدید',
                                      'Ready to start exploring'
                                    )}
                            </td>
                            <td className="py-3.5 px-4 text-end">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/student/practice/${sk.id}`)}
                              >
                                {sk.status === 'not_started'
                                  ? bi(lang, 'شروع', 'Start')
                                  : bi(lang, 'ادامه / مرور', 'Practice')}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
};
