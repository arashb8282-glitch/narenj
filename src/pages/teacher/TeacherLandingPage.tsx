import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckSquare,
  Clock,
  FileQuestion,
  PlusCircle,
  Sparkles,
  Users,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { TeacherWorkspaceIllustration } from '../../components/shared/Illustrations';
import {
  AssignmentStatusPill,
  Badge,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  ErrorState,
  PageSkeleton,
  ProgressBar,
  SectionHeader,
  StatCard,
} from '../../components/ui/Primitives';
import { DEMO_TEACHER_PROFILE, STUDENT_ROSTER, TOPICS } from '../../data/mockData';
import { bi, fmtNum, fmtPercent } from '../../utils/format';

export const TeacherLandingPage: React.FC = () => {
  const {
    lang,
    activeClass,
    assignments,
    timetable,
    pageSimState,
    setPageSimState,
    setWizardPreselection,
  } = usePrototype();
  const navigate = useNavigate();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const classAssignments = assignments.filter((a) => a.classId === activeClass.id);
  const classStudents = STUDENT_ROSTER.filter((s) => s.classId === activeClass.id);
  const strugglingStudents = classStudents.filter(
    (s) => s.needsSupportSkillId === 'sk-add-fractions'
  );
  const inactiveStudents = classStudents.filter((s) => s.activityStatus === 'inactive');

  const handleQuickRemedial = () => {
    setWizardPreselection({
      skillIds: ['sk-eq-fractions', 'sk-add-fractions'],
      classId: activeClass.id,
      recipientType: 'selected_students',
      recipientStudentIds:
        strugglingStudents.length > 0
          ? strugglingStudents.map((s) => s.id)
          : ['stu-03', 'stu-07', 'stu-12', 'stu-19'],
      contextLabelFa: 'تکلیف جبرانی از هشدار آموزشی پیشخوان معلم',
      contextLabelEn: 'Remedial practice triggered from Teacher Dashboard alert',
    });
    navigate('/teacher/assignments?wizard=1');
  };

  return (
    <AppShell roleOverride="teacher">
      {pageSimState === 'loading' && <PageSkeleton />}

      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'خطا در بارگذاری اطلاعات پیشخوان معلم', 'Could not load teacher dashboard')}
          description={bi(
            lang,
            'دریافت آمار کلاس فعال موقتاً با مشکل مواجه شد.',
            'Failed to load active class summary.'
          )}
          retryLabel={bi(lang, 'تلاش مجدد', 'Retry')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && (
        <div className="space-y-7">
          {/* Teacher Hero Workspace Banner */}
          <section className="rounded-cardLg bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white p-5 sm:p-6 shadow-card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent-500 text-ink-900 text-[11px] font-bold">
                    DEMO DATA
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-turquoise-500/20 border border-turquoise-500/40 text-xs font-bold text-turquoise-100">
                    <Users className="w-3.5 h-3.5 text-turquoise-500" />
                    {bi(
                      lang,
                      `کلاس فعال: ${activeClass.nameFa} (${fmtNum(activeClass.studentCount, 'fa')} نفر)`,
                      `Active: ${activeClass.nameEn} (${activeClass.studentCount} students)`
                    )}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-[1.8rem] font-bold text-white leading-tight">
                  {bi(
                    lang,
                    `پیشخوان آموزشی — ${DEMO_TEACHER_PROFILE.nameFa}`,
                    `Teacher Workspace — ${DEMO_TEACHER_PROFILE.nameEn}`
                  )}
                </h1>
                <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
                  {bi(
                    lang,
                    'نمای یکپارچه وضعیت کلاس فعال، هشدارهای آموزشی توضیح‌پذیر و ابزارهای سریع تخصیص تکلیف و آزمون.',
                    'Unified view of active class health, explainable learning alerts, and immediate instructional actions.'
                  )}
                </p>
              </div>
              <div className="w-48 sm:w-56 shrink-0 hidden sm:block">
                <TeacherWorkspaceIllustration />
              </div>
            </div>
          </section>

          {/* 4 Distinct Color-Coded Quick Action Cards */}
          <section aria-label={bi(lang, 'اقدام‌های سریع معلم', 'Quick Actions')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setWizardPreselection(null);
                  navigate('/teacher/assignments?wizard=1');
                }}
                className="motion-card text-start p-4 rounded-card bg-orange-500 hover:bg-orange-600 text-white shadow-sm flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-card bg-white/20 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base">
                    {bi(lang, 'تخصیص مهارت جدید', 'Assign Skills')}
                  </div>
                  <div className="text-xs text-white/85">
                    {bi(lang, 'کل کلاس یا گروه هدفمند', 'Whole class or group')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/quiz-generator')}
                className="motion-card text-start p-4 rounded-card bg-surface-lavender border border-lavender-200 hover:border-lavender-500 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-card bg-lavender-100 text-lavender-700 flex items-center justify-center shrink-0">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-ink-900">
                    {bi(lang, 'ساخت آزمون بانک سؤال', 'Generate Quiz')}
                  </div>
                  <div className="text-xs text-ink-600">
                    {bi(lang, 'آنلاین یا برگه چاپی', 'Online or printable')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/analytics')}
                className="motion-card text-start p-4 rounded-card bg-surface-mint border border-success-200 hover:border-success-500 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-card bg-success-100 text-success-700 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-ink-900">
                    {bi(lang, 'تحلیل عملکرد کلاس', 'Class Analytics')}
                  </div>
                  <div className="text-xs text-ink-600">
                    {bi(lang, 'روند تسلط و دقت پاسخ', 'Mastery & accuracy')}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/timetable')}
                className="motion-card text-start p-4 rounded-card bg-surface-sky border border-turquoise-200 hover:border-turquoise-500 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-card bg-turquoise-100 text-brand-800 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-ink-900">
                    {bi(lang, 'برنامه تدریس هفتگی', 'Weekly Timetable')}
                  </div>
                  <div className="text-xs text-ink-600">
                    {bi(lang, 'جلسات و موعد تکالیف', 'Sessions & due dates')}
                  </div>
                </div>
              </button>
            </div>
          </section>

          {activeClass.isNewEmpty ? (
            <EmptyState
              variant="classroom"
              title={bi(
                lang,
                `«${activeClass.nameFa}» یک کلاس تازه است و هنوز دانش‌آموزی در آن ثبت نشده است`,
                `"${activeClass.nameEn}" is a newly created class with 0 students`
              )}
              description={bi(
                lang,
                'می‌توانید از بخش کلاس‌ها کد کلاس نمایشی را مشاهده کنید یا از نوار بالا «کلاس ششم الف (۲۴ نفر)» را انتخاب نمایید.',
                'Inspect Class Management for roster setup, or switch Active Class in the top bar back to Class 6A.'
              )}
              action={
                <Button variant="cta" onClick={() => navigate('/teacher/classes')}>
                  {bi(lang, 'مدیریت کلاس‌ها و دانش‌آموزان', 'Open Class Management')}
                </Button>
              }
            />
          ) : (
            <>
              {/* 1. Today's Classes + Explainable Learning Alerts */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <Card
                  padding="md"
                  surfaceTone="sky"
                  accentTop="turquoise"
                  className="lg:col-span-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <Badge tone="turquoise" icon={<Clock className="w-3.5 h-3.5" />}>
                        {bi(lang, 'برنامه امروز کلاس فعال', "Today's Class Schedule")}
                      </Badge>
                      <span className="ltr-token text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface border border-turquoise-200 text-brand-900">
                        {activeClass.classCode}
                      </span>
                    </div>
                    <h2 className="typo-section-title">
                      {bi(lang, activeClass.nameFa, activeClass.nameEn)}
                    </h2>
                    <p className="typo-caption mt-1">
                      {bi(lang, activeClass.scheduleSummaryFa, activeClass.scheduleSummaryEn)}
                    </p>
                    <div className="mt-4 p-3.5 rounded-card bg-surface border border-border-strong text-sm">
                      <span className="text-xs font-bold text-orange-600 inline-flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {bi(lang, 'مبحث در دست تدریس:', 'Current Planned Topic:')}
                      </span>
                      <strong className="block text-ink-900">
                        {bi(lang, TOPICS[0].titleFa, TOPICS[0].titleEn)}
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-turquoise-200">
                    <span className="typo-caption font-semibold text-brand-900">
                      {fmtNum(activeClass.studentCount, lang)}{' '}
                      {bi(lang, 'دانش‌آموز ثبت‌نام‌شده', 'enrolled students')}
                    </span>
                    <Link
                      to="/teacher/classes"
                      className="text-xs font-bold text-brand-800 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{bi(lang, 'فهرست دانش‌آموزان', 'Student Roster')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>

                {/* Explainable Learning Alerts */}
                <Card
                  padding="md"
                  surfaceTone="coral"
                  accentTop="coral"
                  className="lg:col-span-7 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="typo-section-title">
                      {bi(lang, 'موارد نیازمند توجه آموزشی', 'Actions Requiring Attention')}
                    </h2>
                    <Badge tone="coral" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                      {fmtNum(2, lang)} {bi(lang, 'هشدار توضیح‌پذیر', 'Explainable Alerts')}
                    </Badge>
                  </div>

                  <div className="p-4 rounded-card bg-surface border border-coral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-ink-900">
                        {bi(
                          lang,
                          'چالش در مخرج مشترک (مهارت: جمع کسرها با مخرج نامساوی)',
                          'Common Denominator Errors (Adding Fractions)'
                        )}
                      </h3>
                      <p className="text-xs text-ink-600 leading-relaxed">
                        {lang === 'fa'
                          ? `مبنای هشدار (داده نمونه): ${fmtNum(strugglingStudents.length || 4, 'fa')} دانش‌آموز در ۳ پرسش متوالی صورت و مخرج را بدون هم‌مخرج‌کردن جمع کرده‌اند.`
                          : `Basis (Demo): ${strugglingStudents.length || 4} students added numerators/denominators directly across 3 consecutive questions.`}
                      </p>
                    </div>
                    <Button
                      variant="cta"
                      size="sm"
                      className="shrink-0"
                      onClick={handleQuickRemedial}
                    >
                      {bi(lang, 'تخصیص تمرین جبرانی', 'Assign Remedial')}
                    </Button>
                  </div>

                  <div className="p-4 rounded-card bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-ink-900">
                        {lang === 'fa'
                          ? `${fmtNum(inactiveStudents.length, 'fa')} دانش‌آموز بدون فعالیت ثبت‌شده در هفته جاری`
                          : `${inactiveStudents.length} students with no recorded practice this week`}
                      </h3>
                      <p className="text-xs text-ink-600">
                        {bi(
                          lang,
                          'در فهرست کلاس می‌توانید وضعیت تکلیف آن‌ها را بررسی و پیگیری کنید.',
                          'Filter inactive students in the roster to follow up.'
                        )}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0"
                      onClick={() => navigate('/teacher/classes?filter=inactive')}
                    >
                      {bi(lang, 'مشاهده در فهرست کلاس', 'View Students')}
                    </Button>
                  </div>
                </Card>
              </section>

              {/* 2. Class Progress Summary Metrics with Semantic Tones */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  tone="success"
                  label={bi(lang, 'نرخ تکمیل تکالیف فعال کلاس', 'Active Assignment Completion')}
                  value={fmtPercent(72, lang)}
                  definition={bi(
                    lang,
                    'سهم دانش‌آموزانی که تکالیف سررسیدشده هفته جاری را به پایان رسانده‌اند.',
                    'Share of students completing due assignments this week.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<CheckSquare className="w-5 h-5" />}
                />
                <StatCard
                  tone="turquoise"
                  label={bi(lang, 'میانگین دقت پاسخ‌گویی کلاس', 'Class First-Try Accuracy')}
                  value={fmtPercent(76, lang)}
                  definition={bi(
                    lang,
                    'میانگین درصد پاسخ درست در تلاش اول در مهارت‌های تمرین‌شده کلاس.',
                    'Mean first-attempt accuracy across practiced class skills.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<BarChart3 className="w-5 h-5" />}
                />
                <StatCard
                  tone="lavender"
                  label={bi(lang, 'دانش‌آموزان فعال در ۷ روز اخیر', 'Active Students (7d)')}
                  value={`${fmtNum(classStudents.length - inactiveStudents.length, lang)} / ${fmtNum(classStudents.length, lang)}`}
                  definition={bi(
                    lang,
                    'دانش‌آموزانی که حداقل به ۵ پرسش در هفته جاری پاسخ داده‌اند.',
                    'Students submitting at least 5 answers over the past 7 days.'
                  )}
                  demoTag="DEMO DATA"
                  icon={<Users className="w-5 h-5" />}
                />
              </section>

              {/* 3. Deadlines + Upcoming Teaching Plan */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-3">
                  <SectionHeader
                    accentColor="orange"
                    title={bi(lang, 'موعد تکالیف و وضعیت تکمیل', 'Assignment Deadlines & Completion')}
                    action={
                      <Link
                        to="/teacher/assignments"
                        className="text-xs font-bold text-brand-800 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{bi(lang, 'همه تکالیف', 'All Assignments')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    }
                  />
                  <div className="space-y-3">
                    {classAssignments.slice(0, 3).map((asn) => {
                      const pct = Math.round(
                        (asn.completedCount / Math.max(1, asn.recipientCount)) * 100
                      );
                      const isOverdue = asn.status === 'overdue';
                      const isDone = asn.status === 'completed';
                      return (
                        <Card
                          key={asn.id}
                          padding="md"
                          surfaceTone={isOverdue ? 'coral' : isDone ? 'mint' : 'white'}
                          accentTop={isOverdue ? 'coral' : isDone ? 'success' : 'turquoise'}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <AssignmentStatusPill status={asn.status} lang={lang} />
                                <span className="typo-caption font-medium">
                                  {bi(lang, `موعد: ${asn.dueDateFa}`, `Due: ${asn.dueDateEn}`)}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold text-ink-900">
                                {bi(lang, asn.titleFa, asn.titleEn)}
                              </h3>
                            </div>
                            <div className="sm:w-52 shrink-0 space-y-1.5">
                              <ProgressBar
                                value={pct}
                                lang={lang}
                                tone={isOverdue ? 'coral' : isDone ? 'success' : 'turquoise'}
                                label={
                                  lang === 'fa'
                                    ? `تکمیل: ${fmtNum(asn.completedCount, 'fa')} از ${fmtNum(asn.recipientCount, 'fa')}`
                                    : `${asn.completedCount}/${asn.recipientCount} done`
                                }
                              />
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3">
                  <SectionHeader
                    accentColor="lavender"
                    title={bi(lang, 'برنامه تدریس پیش‌رو', 'Upcoming Teaching Plan')}
                    action={
                      <Link
                        to="/teacher/timetable"
                        className="text-xs font-bold text-lavender-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{bi(lang, 'تقویم کامل', 'Full Timetable')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    }
                  />
                  <Card padding="md" surfaceTone="lavender" accentTop="lavender" className="space-y-2.5">
                    {timetable
                      .filter((t) => t.classId === activeClass.id)
                      .slice(0, 4)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-control bg-surface border border-border space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              tone={
                                item.entryType === 'scheduled_class' ? 'turquoise' : 'orange'
                              }
                            >
                              {item.entryType === 'scheduled_class'
                                ? bi(lang, 'جلسه کلاسی', 'Scheduled Class')
                                : bi(lang, 'موعد تکلیف/آزمون', 'Deadline')}
                            </Badge>
                            <span className="text-xs font-semibold text-ink-600">
                              {item.timeSlot}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-ink-900">
                            {bi(lang, item.titleFa, item.titleEn)}
                          </div>
                        </div>
                      ))}
                  </Card>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </AppShell>
  );
};
