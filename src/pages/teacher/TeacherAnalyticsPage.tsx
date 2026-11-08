import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Info,
  Sparkles,
  Users,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  Badge,
  Button,
  Card,
  ChartPanel,
  DemoBadge,
  EmptyState,
  ErrorState,
  PageHeader,
  PageSkeleton,
  SectionHeader,
  SelectField,
  StatCard,
} from '../../components/ui/Primitives';
import {
  STUDENT_ROSTER,
  TEACHER_CLASS_TREND_SERIES,
  TOPICS,
} from '../../data/mockData';
import { bi, fmtNum, fmtPercent } from '../../utils/format';

export const TeacherAnalyticsPage: React.FC = () => {
  const {
    lang,
    classes,
    activeClassId,
    setActiveClassId,
    activeClass,
    skills,
    pageSimState,
    setPageSimState,
    setWizardPreselection,
  } = usePrototype();
  const navigate = useNavigate();

  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [rangeFilter, setRangeFilter] = useState<string>('30d');

  const classStudents = useMemo(
    () => STUDENT_ROSTER.filter((s) => s.classId === activeClassId),
    [activeClassId]
  );

  // Topic `top-data` (Data & Graph Reading) has 0 recorded answers to demonstrate "no-answers-for-skill" state!
  const isNoAnswersTopic = topicFilter === 'top-data';

  const handleAssignRemedial = (skillId: string, strugglingIds: string[], titleFa: string) => {
    setWizardPreselection({
      skillIds: [skillId],
      classId: activeClassId,
      recipientType: 'selected_students',
      recipientStudentIds: strugglingIds,
      contextLabelFa: `تخصیص تمرین جبرانی مستقیم از صفحه تحلیل عملکرد برای «${titleFa}»`,
      contextLabelEn: `Remedial practice created from Analytics insight`,
    });
    navigate('/teacher/assignments?wizard=1');
  };

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'تحلیل عملکرد آموزشی', 'Performance Analytics') },
        ]}
        title={bi(lang, 'تحلیل عملکرد کلاس و دانش‌آموزان', 'Teacher Performance Analytics')}
        subtitle={bi(
          lang,
          'تبدیل داده‌های عملکردی به اقدام آموزشی بعدی با شاخص‌های تعریف‌شده و شفاف (بدون فرمول مخفی یا ادعای SmartScore مصوب).',
          'Move directly from explainable class metrics to targeted remedial assignments.'
        )}
        badge={<DemoBadge lang={lang} />}
      />

      {pageSimState === 'loading' && <PageSkeleton />}
      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'خطا در دریافت داده‌های تحلیلی', 'Could not load class analytics')}
          description={bi(lang, 'ارتباط با سرویس گزارش‌گیری برقرار نشد.', 'Failed to load data.')}
          retryLabel={bi(lang, 'تلاش مجدد', 'Retry')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && (
        <div className="space-y-6">
          {/* 4-Filter Bar: Class, Student, Subject/Topic, Time Range */}
          <Card padding="sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SelectField
                id="an-class"
                label={bi(lang, 'کلاس', 'Class')}
                value={activeClassId}
                onChange={(v) => {
                  setActiveClassId(v);
                  setStudentFilter('all');
                }}
                options={classes.map((c) => ({
                  value: c.id,
                  label: bi(lang, c.nameFa, c.nameEn),
                }))}
              />
              <SelectField
                id="an-student"
                label={bi(lang, 'دانش‌آموز', 'Student')}
                value={studentFilter}
                onChange={setStudentFilter}
                options={[
                  { value: 'all', label: bi(lang, 'همه دانش‌آموزان کلاس', 'All Class Students') },
                  ...classStudents.map((s) => ({
                    value: s.id,
                    label: bi(lang, s.nameFa, s.nameEn),
                  })),
                ]}
              />
              <SelectField
                id="an-topic"
                label={bi(lang, 'درس و مبحث (ریاضی MVP)', 'Subject / Topic')}
                value={topicFilter}
                onChange={setTopicFilter}
                options={[
                  { value: 'all', label: bi(lang, 'ریاضی — همه مباحث', 'Math — All Topics') },
                  ...TOPICS.filter((t) => t.grade === 6).map((t) => ({
                    value: t.id,
                    label:
                      t.id === 'top-data'
                        ? bi(
                            lang,
                            `${t.titleFa} (بدون پاسخ ثبت‌شده)`,
                            `${t.titleEn} (No answers yet)`
                          )
                        : bi(lang, t.titleFa, t.titleEn),
                  })),
                ]}
              />
              <SelectField
                id="an-range"
                label={bi(lang, 'بازه زمانی', 'Time Range')}
                value={rangeFilter}
                onChange={setRangeFilter}
                options={[
                  { value: '7d', label: bi(lang, '۷ روز گذشته', 'Last 7 Days') },
                  { value: '30d', label: bi(lang, '۳۰ روز گذشته', 'Last 30 Days') },
                  { value: 'term', label: bi(lang, 'نیم‌سال اول', 'Term 1') },
                ]}
              />
            </div>

            {/* Quick Edge-State Toggles for Reviewers */}
            <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-ink-600 inline-flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-brand-700" />
                {bi(
                  lang,
                  'میانبر بررسی حالت‌های مرزی گزارش معلم:',
                  'Quick-test Analytics Edge States:'
                )}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveClassId('cls-6a');
                    setTopicFilter('all');
                    setPageSimState('normal');
                  }}
                  className="px-2.5 py-1 rounded bg-canvas hover:bg-brand-50 border border-border font-semibold"
                >
                  {bi(lang, 'داده کامل ششم الف', 'Full Class 6A')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveClassId('cls-7a')}
                  className="px-2.5 py-1 rounded bg-canvas hover:bg-brand-50 border border-border font-semibold"
                >
                  {bi(lang, 'کلاس جدید (هفتم الف)', 'New Class State')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveClassId('cls-6a');
                    setTopicFilter('top-data');
                  }}
                  className="px-2.5 py-1 rounded bg-canvas hover:bg-brand-50 border border-border font-semibold"
                >
                  {bi(lang, 'مهارت بدون پاسخ', 'No-Answers Skill')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPageSimState(
                      pageSimState === 'insufficient_data' ? 'normal' : 'insufficient_data'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-canvas hover:bg-brand-50 border border-border font-semibold"
                >
                  {bi(lang, 'داده ناکافی', 'Insufficient Data')}
                </button>
              </div>
            </div>
          </Card>

          {/* State 1: New Class */}
          {activeClass.isNewEmpty ? (
            <EmptyState
              variant="classroom"
              title={bi(
                lang,
                'کلاس جدید: هنوز دانش‌آموز و فعالیتی برای تحلیل وجود ندارد',
                'New Class: No student practice data available yet'
              )}
              description={bi(
                lang,
                'پس از ورود دانش‌آموزان به کلاس هفتم الف و ثبت اولین تمرین‌ها، شاخص‌های عملکرد در اینجا محاسبه می‌شوند.',
                'Metrics appear once students join and submit practice answers.'
              )}
              action={
                <Button variant="secondary" onClick={() => setActiveClassId('cls-6a')}>
                  {bi(lang, 'مشاهده تحلیل کلاس ششم الف', 'Switch to Class 6A')}
                </Button>
              }
            />
          ) : isNoAnswersTopic ? (
            /* State 2: Skill/Topic with No Answers */
            <EmptyState
              variant="chart"
              title={bi(
                lang,
                'هیچ پاسخی برای مبحث «آمار و نمودارخوانی» ثبت نشده است',
                'No answers recorded yet for Data & Graph Reading'
              )}
              description={bi(
                lang,
                'دانش‌آموزان این کلاس هنوز پرسشی از این مبحث حل نکرده‌اند. می‌توانید مهارت مقدماتی آن را به‌عنوان تکلیف به کلاس تخصیص دهید.',
                'Students have not practiced this topic yet. You can assign its introductory skill now.'
              )}
              action={
                <Button
                  variant="primary"
                  onClick={() => {
                    setWizardPreselection({
                      skillIds: ['sk-mean-charts'],
                      classId: activeClassId,
                      recipientType: 'whole_class',
                      recipientStudentIds: [],
                      contextLabelFa: 'شروع مبحث آمار و نمودارخوانی برای کلاس فعال',
                      contextLabelEn: 'Assigning intro Data skill from Analytics',
                    });
                    navigate('/teacher/assignments?wizard=1');
                  }}
                >
                  {bi(lang, 'تخصیص مهارت آغازین این مبحث', 'Assign Starter Skill')}
                </Button>
              }
            />
          ) : pageSimState === 'insufficient_data' ? (
            /* State 3: Insufficient Data */
            <EmptyState
              variant="chart"
              title={bi(
                lang,
                'داده ناکافی برای استخراج روند آماری معتبر',
                'Insufficient data to compute reliable trends'
              )}
              description={bi(
                lang,
                'تعداد پاسخ‌های ثبت‌شده در بازه انتخابی کمتر از حد نصاب تحلیل (۵ پرسش به ازای هر مهارت) است.',
                'Fewer than 5 responses per skill recorded in this window.'
              )}
              action={
                <Button variant="secondary" onClick={() => setPageSimState('normal')}>
                  {bi(lang, 'بازگشت به نمای عادی ۳۰ روزه', 'Show Normal 30d Data')}
                </Button>
              }
            />
          ) : (
            <>
              {/* Metric Cards with Understandable Plain-Language Definitions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label={bi(lang, 'نرخ تکمیل تکالیف', 'Assignment Completion')}
                  value={fmtPercent(78, lang)}
                  definition={bi(
                    lang,
                    'تعریف شاخص: درصد تکالیف تحویل‌شده نسبت به کل تکالیف تخصیص‌یافته در بازه انتخابی.',
                    'Definition: Completed student assignments divided by total assigned.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                />
                <StatCard
                  label={bi(lang, 'میانگین دقت تلاش اول', 'First-Attempt Accuracy')}
                  value={fmtPercent(76, lang)}
                  definition={bi(
                    lang,
                    'تعریف شاخص: سهم پرسش‌هایی که دانش‌آموزان در اولین ثبت بدون خطا پاسخ داده‌اند.',
                    'Definition: Share of questions answered accurately on first submission.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<BarChart3 className="w-5 h-5" />}
                />
                <StatCard
                  label={bi(lang, 'میانه زمان تمرین هر دانش‌آموز', 'Median Weekly Practice')}
                  value={`${fmtNum(46, lang)} ${bi(lang, 'دقیقه', 'min')}`}
                  definition={bi(
                    lang,
                    'تعریف شاخص: مقدار میانی زمان تمرین هفتگی بین دانش‌آموزان فعال کلاس.',
                    'Definition: Median active weekly practice minutes per student.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<Clock className="w-5 h-5" />}
                />
                <StatCard
                  label={bi(lang, 'مشارکت فعال هفتگی', 'Active Participation')}
                  value={`${fmtNum(classStudents.filter((s) => s.activityStatus !== 'inactive').length, lang)} / ${fmtNum(classStudents.length, lang)}`}
                  definition={bi(
                    lang,
                    'تعریف شاخص: دانش‌آموزانی که در ۷ روز اخیر حداقل یک مهارت را تمرین کرده‌اند.',
                    'Definition: Students with at least 1 practice session in the last 7 days.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<Users className="w-5 h-5" />}
                />
              </div>

              {/* Skills Needing Attention -> Direct CTA: Assign Remedial Practice */}
              <section>
                <SectionHeader
                  title={bi(
                    lang,
                    'مهارت‌های نیازمند توجه آموزشی (همراه با مبنای تشخیص)',
                    'Skills Needing Attention (With Explainable Basis)'
                  )}
                  subtitle={bi(
                    lang,
                    'هر هشدار دقیقاً توضیح می‌دهد چرا این مهارت علامت‌گذاری شده و مستقیم به تخصیص تمرین جبرانی متصل می‌شود.',
                    'Every alert explains its empirical trigger and links directly to Assign Remedial Practice.'
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card padding="md" className="border-warning-600/40 bg-warning-100/35 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                          {bi(lang, '۴ دانش‌آموز نیازمند حمایت', '4 Students Need Support')}
                        </Badge>
                        <span className="ltr-token text-xs font-semibold text-ink-600">M6-FR-02</span>
                      </div>
                      <h3 className="typo-card-title">
                        {bi(
                          lang,
                          'جمع کسرها با مخرج نامساوی',
                          'Adding Fractions with Unlike Denominators'
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-900 bg-surface p-3 rounded-control border border-border leading-relaxed">
                        <strong className="text-brand-700">
                          {bi(lang, 'مبنای تشخیص (داده نمونه): ', 'Basis (Demo): ')}
                        </strong>
                        {bi(
                          lang,
                          '۴ دانش‌آموز (نیما کریمی، کیان جعفری، روشا اکبری، رادین کاظمی) بیش از ۳ بار در یافتن کوچک‌ترین مخرج مشترک خطا داشته‌اند و نرخ تکمیل آن‌ها زیر ۵۵٪ است.',
                          '4 students had 3+ consecutive errors finding common denominators with <55% completion.'
                        )}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleAssignRemedial(
                          'sk-eq-fractions',
                          ['stu-03', 'stu-07', 'stu-12', 'stu-19'],
                          'تشخیص کسرهای مساوی و هم‌مخرج کردن'
                        )
                      }
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      {bi(
                        lang,
                        'تخصیص تمرین جبرانی (Assign Remedial Practice)',
                        'Assign Remedial Practice'
                      )}
                    </Button>
                  </Card>

                  <Card padding="md" className="border-border bg-surface flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="brand">
                          {bi(lang, '۵ دانش‌آموز نیازمند مرور', '5 Students Need Review')}
                        </Badge>
                        <span className="ltr-token text-xs font-semibold text-ink-600">M6-GM-01</span>
                      </div>
                      <h3 className="typo-card-title">
                        {bi(lang, 'محیط و مساحت اشکال هندسی', 'Perimeter & Area of Shapes')}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-900 bg-canvas p-3 rounded-control border border-border leading-relaxed">
                        <strong className="text-brand-700">
                          {bi(lang, 'مبنای تشخیص (داده نمونه): ', 'Basis (Demo): ')}
                        </strong>
                        {bi(
                          lang,
                          'در ۳۸٪ از پاسخ‌های نادرست این مبحث، دانش‌آموزان به جای محیط مستطیل، مساحت (طول × عرض) را وارد کرده‌اند.',
                          'In 38% of incorrect responses, students computed area instead of perimeter.'
                        )}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleAssignRemedial(
                          'sk-perimeter-area',
                          ['stu-01', 'stu-06', 'stu-11', 'stu-16', 'stu-21'],
                          'محیط و مساحت اشکال هندسی'
                        )
                      }
                      icon={<Sparkles className="w-4 h-4 text-brand-700" />}
                    >
                      {bi(
                        lang,
                        'تخصیص تمرین جبرانی به این ۵ نفر',
                        'Assign Remedial Practice (5 Students)'
                      )}
                    </Button>
                  </Card>
                </div>
              </section>

              {/* Performance Trend Chart */}
              <ChartPanel
                lang={lang}
                title={bi(
                  lang,
                  'روند هفتگی نرخ تکمیل تکالیف و دقت کلاس',
                  'Weekly Completion & Accuracy Trend'
                )}
                subtitle={bi(
                  lang,
                  'مقایسه ۴ هفته اخیر کلاس فعال (تمام مقادیر نمونه نمایشی هستند).',
                  '4-week illustrative trend for the active class.'
                )}
                legendItems={[
                  { label: bi(lang, 'نرخ تکمیل (%)', 'Completion %'), colorClass: 'bg-brand-600' },
                  { label: bi(lang, 'میانگین دقت (%)', 'Accuracy %'), colorClass: 'bg-accent-500' },
                ]}
                maxVal={100}
                bars={[
                  ...TEACHER_CLASS_TREND_SERIES.map((w) => ({
                    label: bi(lang, w.weekFa, w.weekEn),
                    primaryValue: w.completionRate,
                    secondaryValue: w.avgAccuracy,
                    unitSuffix: lang === 'fa' ? '٪' : '%',
                  })),
                ]}
              />

              {/* Student Performance Table */}
              <section>
                <SectionHeader
                  title={bi(lang, 'جدول عملکرد دانش‌آموزان کلاس', 'Student Performance Table')}
                  subtitle={bi(
                    lang,
                    'امکان تخصیص مستقیم مهارت تقویتی از ردیف هر دانش‌آموز.',
                    'Trigger individual remedial practice directly from any student row.'
                  )}
                />
                <Card padding="none" className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                      <thead className="bg-canvas border-b border-border text-xs text-ink-600">
                        <tr>
                          <th className="py-3.5 px-4 text-start">{bi(lang, 'دانش‌آموز', 'Student')}</th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'تکالیف تکمیل‌شده', 'Completed')}
                          </th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'دقایق تمرین هفته', 'Minutes (7d)')}
                          </th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'دقت تلاش اول (نمونه)', 'Demo Accuracy')}
                          </th>
                          <th className="py-3.5 px-4 text-start">
                            {bi(lang, 'توضیح آموزشی', 'Instructional Note')}
                          </th>
                          <th className="py-3.5 px-4 text-end">{bi(lang, 'اقدام', 'Next Action')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {classStudents
                          .filter((s) => studentFilter === 'all' || s.id === studentFilter)
                          .slice(0, 10)
                          .map((stu) => (
                            <tr key={stu.id} className="hover:bg-canvas/50">
                              <td className="py-3 px-4 font-semibold text-ink-900">
                                {bi(lang, stu.nameFa, stu.nameEn)}
                              </td>
                              <td className="py-3 px-4">
                                {fmtNum(stu.completedAssignments, lang)} /{' '}
                                {fmtNum(stu.totalAssignments, lang)}
                              </td>
                              <td className="py-3 px-4">
                                {fmtNum(stu.practicedMinutesWeek, lang)}{' '}
                                {bi(lang, 'دقیقه', 'min')}
                              </td>
                              <td className="py-3 px-4 font-semibold">
                                {stu.demoAccuracyPercent === null
                                  ? bi(lang, 'بدون داده', 'No data')
                                  : fmtPercent(stu.demoAccuracyPercent, lang)}
                              </td>
                              <td className="py-3 px-4 text-xs text-ink-600">
                                {stu.supportReasonFa
                                  ? bi(lang, stu.supportReasonFa, stu.supportReasonEn ?? '')
                                  : stu.activityStatus === 'inactive'
                                    ? bi(lang, 'بدون فعالیت در هفته جاری', 'No activity this week')
                                    : bi(lang, 'پیشرفت منظم', 'On track')}
                              </td>
                              <td className="py-3 px-4 text-end">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleAssignRemedial(
                                      stu.needsSupportSkillId ?? 'sk-add-fractions',
                                      [stu.id],
                                      skills.find((k) => k.id === stu.needsSupportSkillId)?.titleFa ??
                                        'جمع کسرها'
                                    )
                                  }
                                >
                                  {bi(lang, 'تخصیص تمرین', 'Assign Skill')}
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
