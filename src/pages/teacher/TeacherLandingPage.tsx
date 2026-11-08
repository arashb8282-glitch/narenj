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
  Users,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  AssignmentStatusPill,
  Badge,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  ErrorState,
  PageHeader,
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
      <PageHeader
        lang={lang}
        title={bi(
          lang,
          `پیشخوان آموزشی — ${DEMO_TEACHER_PROFILE.nameFa}`,
          `Teacher Workspace — ${DEMO_TEACHER_PROFILE.nameEn}`
        )}
        subtitle={bi(
          lang,
          'مشاهده سریع وضعیت کلاس فعال، هشدارهای آموزشی توضیح‌پذیر و اقدام مستقیم برای گام بعدی تدریس.',
          'Monitor active class status, explainable learning alerts, and take immediate instructional action.'
        )}
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" icon={<Users className="w-3.5 h-3.5" />}>
              {bi(
                lang,
                `کلاس فعال: ${activeClass.nameFa}`,
                `Active: ${activeClass.nameEn}`
              )}
            </Badge>
            <DemoBadge lang={lang} />
          </div>
        }
      />

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
          {/* Quick Actions Bar (4. Quick Actions) */}
          <section aria-label={bi(lang, 'اقدام‌های سریع معلم', 'Quick Actions')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="primary"
                size="lg"
                className="justify-start px-4"
                onClick={() => {
                  setWizardPreselection(null);
                  navigate('/teacher/assignments?wizard=1');
                }}
                icon={<PlusCircle className="w-5 h-5" />}
              >
                {bi(lang, 'تخصیص مهارت جدید', 'Assign Skills')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="justify-start px-4"
                onClick={() => navigate('/teacher/quiz-generator')}
                icon={<FileQuestion className="w-5 h-5 text-brand-700" />}
              >
                {bi(lang, 'ساخت آزمون از بانک سؤال', 'Generate Quiz')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="justify-start px-4"
                onClick={() => navigate('/teacher/analytics')}
                icon={<BarChart3 className="w-5 h-5 text-brand-700" />}
              >
                {bi(lang, 'مشاهده تحلیل عملکرد', 'View Analytics')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="justify-start px-4"
                onClick={() => navigate('/teacher/timetable')}
                icon={<CalendarDays className="w-5 h-5 text-brand-700" />}
              >
                {bi(lang, 'برنامه تدریس هفتگی', 'Open Timetable')}
              </Button>
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
                <Button variant="secondary" onClick={() => navigate('/teacher/classes')}>
                  {bi(lang, 'مدیریت کلاس‌ها و دانش‌آموزان', 'Open Class Management')}
                </Button>
              }
            />
          ) : (
            <>
              {/* 1. Today's Classes & Immediate Attention */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <Card padding="md" className="lg:col-span-5 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge tone="brand" icon={<Clock className="w-3.5 h-3.5" />}>
                        {bi(lang, 'برنامه امروز کلاس فعال', "Today's Class Schedule")}
                      </Badge>
                      <span className="ltr-token text-xs text-ink-600 font-semibold">
                        {activeClass.classCode}
                      </span>
                    </div>
                    <h2 className="typo-section-title">{bi(lang, activeClass.nameFa, activeClass.nameEn)}</h2>
                    <p className="typo-caption mt-1">
                      {bi(lang, activeClass.scheduleSummaryFa, activeClass.scheduleSummaryEn)}
                    </p>
                    <div className="mt-4 p-3.5 rounded-control bg-canvas border border-border text-sm">
                      <span className="text-xs font-semibold text-brand-700 block mb-0.5">
                        {bi(lang, 'مبحث در دست تدریس:', 'Current Planned Topic:')}
                      </span>
                      <strong>
                        {bi(lang, TOPICS[0].titleFa, TOPICS[0].titleEn)}
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="typo-caption">
                      {fmtNum(activeClass.studentCount, lang)}{' '}
                      {bi(lang, 'دانش‌آموز ثبت‌نام‌شده', 'enrolled students')}
                    </span>
                    <Link
                      to="/teacher/classes"
                      className="text-xs font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{bi(lang, 'مشاهده فهرست دانش‌آموزان', 'Student Roster')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>

                {/* Explainable Learning Alerts (2. Learning Alerts -> Next Action) */}
                <Card padding="md" className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="typo-section-title">
                      {bi(lang, 'موارد نیازمند توجه آموزشی', 'Actions Requiring Attention')}
                    </h2>
                    <Badge tone="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                      {fmtNum(2, lang)} {bi(lang, 'هشدار توضیح‌پذیر', 'Explainable Alerts')}
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-card bg-warning-100/50 border border-warning-600/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-ink-900">
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
                    <Button variant="primary" size="sm" onClick={handleQuickRemedial}>
                      {bi(lang, 'تخصیص تمرین جبرانی', 'Assign Remedial')}
                    </Button>
                  </div>

                  <div className="p-3.5 rounded-card bg-canvas border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-ink-900">
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
                      onClick={() => navigate('/teacher/classes?filter=inactive')}
                    >
                      {bi(lang, 'مشاهده در فهرست کلاس', 'View Students')}
                    </Button>
                  </div>
                </Card>
              </section>

              {/* 3. Class Progress Summary Metrics */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
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

              {/* 2 & 3. Deadlines + Upcoming Teaching Plan */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-3">
                  <SectionHeader
                    title={bi(lang, 'موعد تکالیف و وضعیت تکمیل', 'Assignment Deadlines & Completion')}
                    action={
                      <Link
                        to="/teacher/assignments"
                        className="text-xs font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
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
                      return (
                        <Card key={asn.id} padding="sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <AssignmentStatusPill status={asn.status} lang={lang} />
                                <span className="typo-caption">
                                  {bi(lang, `موعد: ${asn.dueDateFa}`, `Due: ${asn.dueDateEn}`)}
                                </span>
                              </div>
                              <h3 className="text-sm font-semibold text-ink-900">
                                {bi(lang, asn.titleFa, asn.titleEn)}
                              </h3>
                            </div>
                            <div className="sm:w-48 shrink-0 space-y-1.5">
                              <ProgressBar
                                value={pct}
                                lang={lang}
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
                    title={bi(lang, 'برنامه تدریس پیش‌رو', 'Upcoming Teaching Plan')}
                    action={
                      <Link
                        to="/teacher/timetable"
                        className="text-xs font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{bi(lang, 'تقویم کامل', 'Full Timetable')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    }
                  />
                  <Card padding="sm" className="divide-y divide-border">
                    {timetable
                      .filter((t) => t.classId === activeClass.id)
                      .slice(0, 4)
                      .map((item) => (
                        <div key={item.id} className="py-3 first:pt-1 last:pb-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              tone={
                                item.entryType === 'scheduled_class' ? 'brand' : 'warning'
                              }
                            >
                              {item.entryType === 'scheduled_class'
                                ? bi(lang, 'کلاس زمان‌بندی‌شده', 'Scheduled Class')
                                : bi(lang, 'موعد تکلیف/آزمون', 'Deadline')}
                            </Badge>
                            <span className="typo-caption text-xs">{item.timeSlot}</span>
                          </div>
                          <div className="text-sm font-semibold text-ink-900">
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
