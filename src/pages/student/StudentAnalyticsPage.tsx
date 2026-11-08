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
import { getTopicTheme } from '../../utils/theme';

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
        icon={<BarChart3 className="w-6 h-6" />}
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
          <Card padding="md" surfaceTone="sky">
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
              <div className="flex items-center sm:justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    setPageSimState(
                      pageSimState === 'insufficient_data' ? 'normal' : 'insufficient_data'
                    )
                  }
                >
                  {pageSimState === 'insufficient_data'
                    ? bi(lang, 'بازگشت به داده عادی', 'Show Normal Demo Data')
                    : bi(lang, 'تست حالت داده ناکافی', 'Test Insufficient Data')}
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
                  variant="cta"
                  onClick={() => navigate(`/student/practice/${nextActionSkill.id}`)}
                >
                  {bi(lang, 'شروع یک جلسه تمرین', 'Start a Practice Session')}
                </Button>
              }
            />
          ) : (
            <>
              {/* Summary StatCards with Distinct Semantic Color Coding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  tone="turquoise"
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
                  tone="lavender"
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
                  tone="success"
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
                  tone="orange"
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
              <Card padding="md" surfaceTone="apricot" accentTop="orange">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {bi(
                          lang,
                          'گام پیشنهادی بعدی بر اساس عملکرد شما',
                          'Suggested Next Learning Step'
                        )}
                      </span>
                    </div>
                    <h2 className="typo-card-title text-lg">
                      {bi(lang, nextActionSkill.titleFa, nextActionSkill.titleEn)}
                    </h2>
                    <p className="typo-caption text-ink-800">
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
                    variant="cta"
                    onClick={() => navigate(`/student/practice/${nextActionSkill.id}`)}
                    icon={<Play className="w-4 h-4 fill-current" />}
                  >
                    {bi(lang, 'شروع تمرین این مهارت', 'Practice This Skill')}
                  </Button>
                </div>
              </Card>

              {/* Multi-color Accessible Weekly Chart */}
              <ChartPanel
                lang={lang}
                title={bi(
                  lang,
                  'نمودار دقایق تمرین روزانه و درصد دقت',
                  'Daily Practice Minutes & Accuracy'
                )}
                subtitle={bi(
                  lang,
                  'ستون فیروزه‌ای زمان تمرین (دقیقه) و ستون نارنجی درصد پاسخ درست همان روز را نشان می‌دهد.',
                  'Turquoise bars show practice minutes; warm orange bars indicate accuracy percentage.'
                )}
                primaryColorClass="bg-turquoise-500"
                secondaryColorClass="bg-orange-500"
                legendItems={[
                  { label: bi(lang, 'دقایق تمرین', 'Minutes'), colorClass: 'bg-turquoise-500' },
                  { label: bi(lang, 'درصد دقت (نمونه)', 'Accuracy %'), colorClass: 'bg-orange-500' },
                ]}
                maxVal={30}
                bars={STUDENT_WEEKLY_MINUTES_SERIES.map((d) => ({
                  label: bi(lang, d.dayFa, d.dayEn),
                  primaryValue: d.minutes,
                  secondaryValue: d.accuracy,
                  unitSuffix: lang === 'fa' ? ' د' : 'm',
                }))}
              />

              {/* Constructive Skill-Level Performance Breakdown (Desktop Table + Mobile Cards) */}
              <section>
                <SectionHeader
                  accentColor="success"
                  title={bi(lang, 'جزئیات عملکرد به تفکیک مهارت', 'Skill-by-Skill Breakdown')}
                  subtitle={bi(
                    lang,
                    'به‌جای برچسب‌های کلی و قضاوتی (مانند «ضعیف»)، وضعیت هر مهارت با توضیح آموزشی شفاف بیان شده است.',
                    'Uses constructive, explainable learning guidance rather than vague labels like "weak".'
                  )}
                />

                {/* Desktop Table */}
                <Card padding="none" className="hidden md:block overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                      <thead className="bg-surface-sky border-b border-border text-xs font-bold text-brand-900">
                        <tr>
                          <th className="py-3.5 px-4 text-start">{bi(lang, 'مهارت', 'Skill')}</th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'وضعیت پیشنهادی', 'Proposed Status')}
                          </th>
                          <th className="py-3.5 px-4 text-start w-52">
                            {bi(lang, 'پیشرفت نمایشی', 'Demo Progress')}
                          </th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'توضیح آموزشی', 'Learning Insight')}
                          </th>
                          <th className="py-3.5 px-4 text-end">{bi(lang, 'اقدام', 'Action')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {grade6Skills.map((sk) => {
                          const theme = getTopicTheme(sk.topicId);
                          const barTone =
                            sk.status === 'mastered'
                              ? 'success'
                              : sk.status === 'needs_review'
                                ? 'coral'
                                : theme.progressTone;
                          return (
                            <tr key={sk.id} className="hover:bg-surface-sky/40 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-ink-900">
                                <div>{bi(lang, sk.titleFa, sk.titleEn)}</div>
                                <span className={`ltr-token inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.chipClass}`}>
                                  {sk.code}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <SkillStatusPill status={sk.status} lang={lang} />
                              </td>
                              <td className="py-3.5 px-4">
                                <ProgressBar value={sk.demoProgress} lang={lang} tone={barTone} showValue />
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
                                  variant={sk.status === 'needs_review' ? 'cta' : 'secondary'}
                                  size="sm"
                                  onClick={() => navigate(`/student/practice/${sk.id}`)}
                                >
                                  {sk.status === 'not_started'
                                    ? bi(lang, 'شروع', 'Start')
                                    : bi(lang, 'ادامه / مرور', 'Practice')}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Intentional Mobile Card List (390px / 430px) */}
                <div className="md:hidden space-y-3">
                  {grade6Skills.map((sk) => {
                    const theme = getTopicTheme(sk.topicId);
                    const barTone =
                      sk.status === 'mastered'
                        ? 'success'
                        : sk.status === 'needs_review'
                          ? 'coral'
                          : theme.progressTone;
                    return (
                      <Card
                        key={sk.id}
                        padding="md"
                        surfaceTone={sk.status === 'needs_review' ? 'coral' : 'white'}
                        accentTop={sk.status === 'needs_review' ? 'coral' : theme.accentTop}
                        className="space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`ltr-token text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.chipClass}`}>
                            {sk.code}
                          </span>
                          <SkillStatusPill status={sk.status} lang={lang} />
                        </div>
                        <h3 className="typo-card-title">{bi(lang, sk.titleFa, sk.titleEn)}</h3>
                        <ProgressBar
                          value={sk.demoProgress}
                          lang={lang}
                          tone={barTone}
                          label={bi(lang, 'پیشرفت نمونه', 'Demo Progress')}
                        />
                        <p className="text-xs text-ink-600">
                          {sk.attentionNoteFa
                            ? bi(lang, sk.attentionNoteFa, sk.attentionNoteEn ?? '')
                            : sk.status === 'mastered'
                              ? bi(
                                  lang,
                                  'پاسخ‌گویی پایدار و دقیق در پرسش‌های اخیر',
                                  'Consistent accuracy in recent questions'
                                )
                              : bi(lang, 'آماده شروع و کشف مفهوم جدید', 'Ready to start exploring')}
                        </p>
                        <Button
                          variant={sk.status === 'needs_review' ? 'cta' : 'secondary'}
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/student/practice/${sk.id}`)}
                        >
                          {sk.status === 'not_started'
                            ? bi(lang, 'شروع تمرین', 'Start Practice')
                            : bi(lang, 'ادامه / مرور مهارت', 'Practice Skill')}
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
};
