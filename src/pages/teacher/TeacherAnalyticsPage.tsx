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
  Avatar,
  Badge,
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

  const topicBreakdown = [
    {
      id: 'top-fractions',
      fa: 'کسرها و اعداد گویا',
      en: 'Fractions & Rational Numbers',
      accuracy: 68,
      completion: 75,
      tone: 'orange' as const,
      chip: 'bg-orange-100 text-orange-700',
    },
    {
      id: 'top-decimals',
      fa: 'اعداد اعشاری و محاسبات',
      en: 'Decimals & Operations',
      accuracy: 84,
      completion: 88,
      tone: 'turquoise' as const,
      chip: 'bg-turquoise-100 text-brand-900',
    },
    {
      id: 'top-ratios',
      fa: 'نسبت، تناسب و درصد',
      en: 'Ratios, Proportions & Percent',
      accuracy: 79,
      completion: 71,
      tone: 'lavender' as const,
      chip: 'bg-lavender-100 text-lavender-700',
    },
    {
      id: 'top-geometry',
      fa: 'هندسه و اندازه‌گیری',
      en: 'Geometry & Measurement',
      accuracy: 72,
      completion: 67,
      tone: 'success' as const,
      chip: 'bg-success-100 text-success-700',
    },
  ];

  const visibleStudents = classStudents
    .filter((s) => studentFilter === 'all' || s.id === studentFilter)
    .slice(0, 10);

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        icon={<BarChart3 className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'تحلیل عملکرد آموزشی', 'Performance Analytics') },
        ]}
        title={bi(lang, 'تحلیل عملکرد کلاس و دانش‌آموزان', 'Teacher Performance Analytics')}
        subtitle={bi(
          lang,
          'تبدیل داده‌های عملکردی به اقدام آموزشی بعدی با شاخص‌های تعریف‌شده و نمودارهای چندرنگ خوانا (بدون ادعای SmartScore مصوب).',
          'Move directly from explainable class metrics and multi-color charts to targeted remedial assignments.'
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
          {/* 4-Filter Bar */}
          <Card padding="md" surfaceTone="sky" accentTop="turquoise">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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

            {/* Quick Edge-State Toggles */}
            <div className="mt-3.5 pt-3 border-t border-turquoise-200 flex items-center justify-between gap-2 text-xs overflow-x-auto">
              <span className="text-brand-900 font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                <Info className="w-3.5 h-3.5 text-turquoise-700" />
                {bi(lang, 'حالت‌های مرزی تحلیل:', 'Edge States:')}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveClassId('cls-6a');
                    setTopicFilter('all');
                    setPageSimState('normal');
                  }}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-turquoise-100 border border-border font-semibold whitespace-nowrap"
                >
                  {bi(lang, 'داده کامل ششم الف', 'Full Class 6A')}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveClassId('cls-7a')}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-turquoise-100 border border-border font-semibold whitespace-nowrap"
                >
                  {bi(lang, 'کلاس جدید (هفتم الف)', 'New Class')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveClassId('cls-6a');
                    setTopicFilter('top-data');
                  }}
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-turquoise-100 border border-border font-semibold whitespace-nowrap"
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
                  className="px-2.5 py-1 rounded-full bg-surface hover:bg-turquoise-100 border border-border font-semibold whitespace-nowrap"
                >
                  {bi(lang, 'داده ناکافی', 'Insufficient Data')}
                </button>
              </div>
            </div>
          </Card>

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
                <Button variant="cta" onClick={() => setActiveClassId('cls-6a')}>
                  {bi(lang, 'مشاهده تحلیل کلاس ششم الف', 'Switch to Class 6A')}
                </Button>
              }
            />
          ) : isNoAnswersTopic ? (
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
                  variant="cta"
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
                <Button variant="cta" onClick={() => setPageSimState('normal')}>
                  {bi(lang, 'بازگشت به نمای عادی ۳۰ روزه', 'Show Normal 30d Data')}
                </Button>
              }
            />
          ) : (
            <>
              {/* 4 Multi-Color Semantic Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  tone="success"
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
                  tone="turquoise"
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
                  tone="orange"
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
                  tone="lavender"
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
                  accentColor="coral"
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
                  <Card
                    padding="md"
                    surfaceTone="coral"
                    accentTop="coral"
                    className="flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="coral" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                          {bi(lang, '۴ دانش‌آموز نیازمند حمایت', '4 Students Need Support')}
                        </Badge>
                        <span className="ltr-token text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface text-coral-700">
                          M6-FR-02
                        </span>
                      </div>
                      <h3 className="typo-card-title text-lg">
                        {bi(
                          lang,
                          'جمع کسرها با مخرج نامساوی',
                          'Adding Fractions with Unlike Denominators'
                        )}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-900 bg-surface p-3.5 rounded-control border border-coral-200 leading-relaxed">
                        <strong className="text-coral-700">
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
                      variant="cta"
                      onClick={() =>
                        handleAssignRemedial(
                          'sk-eq-fractions',
                          ['stu-03', 'stu-07', 'stu-12', 'stu-19'],
                          'تشخیص کسرهای مساوی و هم‌مخرج کردن'
                        )
                      }
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      {bi(lang, 'تخصیص تمرین جبرانی به این ۴ نفر', 'Assign Remedial Practice (4)')}
                    </Button>
                  </Card>

                  <Card
                    padding="md"
                    surfaceTone="lavender"
                    accentTop="lavender"
                    className="flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="lavender">
                          {bi(lang, '۵ دانش‌آموز نیازمند مرور', '5 Students Need Review')}
                        </Badge>
                        <span className="ltr-token text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface text-lavender-700">
                          M6-GM-01
                        </span>
                      </div>
                      <h3 className="typo-card-title text-lg">
                        {bi(lang, 'محیط و مساحت اشکال هندسی', 'Perimeter & Area of Shapes')}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-900 bg-surface p-3.5 rounded-control border border-lavender-200 leading-relaxed">
                        <strong className="text-lavender-700">
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
                      variant="primary"
                      onClick={() =>
                        handleAssignRemedial(
                          'sk-perimeter-area',
                          ['stu-01', 'stu-06', 'stu-11', 'stu-16', 'stu-21'],
                          'محیط و مساحت اشکال هندسی'
                        )
                      }
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      {bi(lang, 'تخصیص تمرین جبرانی به این ۵ نفر', 'Assign Remedial Practice (5)')}
                    </Button>
                  </Card>
                </div>
              </section>

              {/* Charts Grid: Weekly Dual-Bar Chart + Multi-Color Topic Mastery Breakdown */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <ChartPanel
                    lang={lang}
                    title={bi(
                      lang,
                      'روند هفتگی نرخ تکمیل و دقت کلاس',
                      'Weekly Completion & Accuracy Trend'
                    )}
                    subtitle={bi(
                      lang,
                      'مقایسه ۴ هفته اخیر کلاس فعال با رنگ‌های متمایز (مقادیر نمونه).',
                      '4-week illustrative trend for the active class.'
                    )}
                    primaryColorClass="bg-brand-700"
                    secondaryColorClass="bg-orange-500"
                    legendItems={[
                      { label: bi(lang, 'نرخ تکمیل (%)', 'Completion %'), colorClass: 'bg-brand-700' },
                      { label: bi(lang, 'میانگین دقت (%)', 'Accuracy %'), colorClass: 'bg-orange-500' },
                    ]}
                    maxVal={100}
                    bars={TEACHER_CLASS_TREND_SERIES.map((w) => ({
                      label: bi(lang, w.weekFa, w.weekEn),
                      primaryValue: w.completionRate,
                      secondaryValue: w.avgAccuracy,
                      unitSuffix: lang === 'fa' ? '٪' : '%',
                    }))}
                  />
                </div>

                <Card
                  padding="md"
                  surfaceTone="white"
                  accentTop="orange"
                  className="lg:col-span-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="typo-card-title">
                        {bi(lang, 'عملکرد کلاس به تفکیک مبحث ریاضی', 'Accuracy by Math Topic')}
                      </h3>
                      <DemoBadge lang={lang} />
                    </div>
                    <p className="typo-caption mb-4">
                      {bi(
                        lang,
                        'هر مبحث با رنگ اختصاصی خود در سراسر پلتفرم مشخص شده است.',
                        'Each curriculum domain uses its consistent semantic color.'
                      )}
                    </p>
                    <div className="space-y-4">
                      {topicBreakdown.map((tb) => (
                        <div key={tb.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className={`font-bold px-2.5 py-0.5 rounded-full ${tb.chip}`}>
                              {bi(lang, tb.fa, tb.en)}
                            </span>
                            <span className="font-bold text-ink-900">
                              {bi(lang, 'دقت:', 'Acc:')} {fmtPercent(tb.accuracy, lang)}
                            </span>
                          </div>
                          <ProgressBar
                            value={tb.accuracy}
                            lang={lang}
                            tone={tb.tone}
                            showValue={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex flex-wrap gap-2 text-[11px] font-semibold text-ink-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      {bi(lang, 'کسرها', 'Fractions')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-turquoise-500" />
                      {bi(lang, 'اعشاری', 'Decimals')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-lavender-500" />
                      {bi(lang, 'نسبت و درصد', 'Ratios')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
                      {bi(lang, 'هندسه', 'Geometry')}
                    </span>
                  </div>
                </Card>
              </section>

              {/* Student Performance Breakdown (Desktop Table + Mobile Cards) */}
              <section>
                <SectionHeader
                  accentColor="turquoise"
                  title={bi(lang, 'عملکرد دانش‌آموزان کلاس', 'Student Performance Breakdown')}
                  subtitle={bi(
                    lang,
                    'امکان تخصیص مستقیم مهارت تقویتی از ردیف یا کارت هر دانش‌آموز.',
                    'Trigger individual remedial practice directly from any student row or card.'
                  )}
                />

                {/* Desktop Table */}
                <Card padding="none" className="hidden md:block overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start">
                      <thead className="bg-surface-sky border-b border-border text-xs font-bold text-brand-900">
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
                        {visibleStudents.map((stu) => (
                          <tr key={stu.id} className="hover:bg-surface-sky/35 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5 font-bold text-ink-900">
                                <Avatar name={bi(lang, stu.nameFa, stu.nameEn)} size="sm" />
                                <span>{bi(lang, stu.nameFa, stu.nameEn)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {fmtNum(stu.completedAssignments, lang)} /{' '}
                              {fmtNum(stu.totalAssignments, lang)}
                            </td>
                            <td className="py-3 px-4">
                              {fmtNum(stu.practicedMinutesWeek, lang)}{' '}
                              {bi(lang, 'دقیقه', 'min')}
                            </td>
                            <td className="py-3 px-4">
                              {stu.demoAccuracyPercent === null ? (
                                <span className="text-xs text-ink-400">
                                  {bi(lang, 'بدون داده', 'No data')}
                                </span>
                              ) : (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    stu.demoAccuracyPercent >= 80
                                      ? 'bg-success-100 text-success-700'
                                      : stu.demoAccuracyPercent >= 65
                                        ? 'bg-turquoise-100 text-brand-900'
                                        : 'bg-coral-100 text-coral-700'
                                  }`}
                                >
                                  {fmtPercent(stu.demoAccuracyPercent, lang)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-xs text-ink-600 max-w-xs">
                              {stu.supportReasonFa
                                ? bi(lang, stu.supportReasonFa, stu.supportReasonEn ?? '')
                                : stu.activityStatus === 'inactive'
                                  ? bi(lang, 'بدون فعالیت در هفته جاری', 'No activity this week')
                                  : bi(lang, 'پیشرفت منظم و پایدار', 'On track')}
                            </td>
                            <td className="py-3 px-4 text-end">
                              <Button
                                variant={stu.needsSupportSkillId ? 'cta' : 'secondary'}
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

                {/* Intentional Mobile Student Performance Cards */}
                <div className="md:hidden space-y-3">
                  {visibleStudents.map((stu) => (
                    <Card
                      key={stu.id}
                      padding="md"
                      surfaceTone={stu.needsSupportSkillId ? 'coral' : 'white'}
                      accentTop={stu.needsSupportSkillId ? 'coral' : 'turquoise'}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={bi(lang, stu.nameFa, stu.nameEn)} size="sm" />
                          <strong className="text-sm text-ink-900">
                            {bi(lang, stu.nameFa, stu.nameEn)}
                          </strong>
                        </div>
                        {stu.demoAccuracyPercent !== null && (
                          <Badge
                            tone={
                              stu.demoAccuracyPercent >= 80
                                ? 'success'
                                : stu.demoAccuracyPercent >= 65
                                  ? 'turquoise'
                                  : 'coral'
                            }
                          >
                            {bi(lang, 'دقت:', 'Acc:')} {fmtPercent(stu.demoAccuracyPercent, lang)}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-surface p-2.5 rounded-control border border-border">
                        <div>
                          <span className="text-ink-600">{bi(lang, 'تکالیف: ', 'Tasks: ')}</span>
                          <strong>
                            {fmtNum(stu.completedAssignments, lang)}/{fmtNum(stu.totalAssignments, lang)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-ink-600">{bi(lang, 'زمان هفته: ', 'Time: ')}</span>
                          <strong>
                            {fmtNum(stu.practicedMinutesWeek, lang)} {bi(lang, 'دقیقه', 'm')}
                          </strong>
                        </div>
                      </div>

                      <p className="text-xs text-ink-600">
                        {stu.supportReasonFa
                          ? bi(lang, stu.supportReasonFa, stu.supportReasonEn ?? '')
                          : stu.activityStatus === 'inactive'
                            ? bi(lang, 'بدون فعالیت در هفته جاری', 'No activity this week')
                            : bi(lang, 'پیشرفت منظم و پایدار', 'On track')}
                      </p>

                      <Button
                        variant={stu.needsSupportSkillId ? 'cta' : 'secondary'}
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          handleAssignRemedial(
                            stu.needsSupportSkillId ?? 'sk-add-fractions',
                            [stu.id],
                            skills.find((k) => k.id === stu.needsSupportSkillId)?.titleFa ??
                              'جمع کسرها'
                          )
                        }
                      >
                        {bi(lang, 'تخصیص تمرین هدفمند', 'Assign Targeted Practice')}
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
};
