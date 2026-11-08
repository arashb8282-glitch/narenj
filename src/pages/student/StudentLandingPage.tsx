import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Coins,
  Compass,
  Flame,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { StudentHeroIllustration, TopicIllustration } from '../../components/shared/Illustrations';
import { AssignmentCard } from '../../components/student/AssignmentCard';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  ErrorState,
  PageSkeleton,
  ProgressBar,
  SectionHeader,
  SkillStatusPill,
} from '../../components/ui/Primitives';
import {
  DEMO_STUDENT_PROFILE,
  INITIAL_RECOMMENDATIONS,
  TOPICS,
} from '../../data/mockData';
import { PageSimState } from '../../data/types';
import { bi, fmtNum } from '../../utils/format';

export const StudentLandingPage: React.FC = () => {
  const {
    lang,
    pageSimState,
    setPageSimState,
    assignments,
    skills,
    unfinishedSession,
    badges,
    coins,
  } = usePrototype();
  const navigate = useNavigate();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  // Quick inline state switcher pills for UX reviewers
  const statePills: { id: PageSimState; fa: string; en: string }[] = [
    { id: 'normal', fa: 'عادی (پیش‌فرض)', en: 'Default' },
    { id: 'multiple', fa: 'چند تکلیف', en: 'Multiple Tasks' },
    { id: 'overdue', fa: 'تکلیف دیرشده', en: 'Overdue Task' },
    { id: 'empty', fa: 'بدون تکلیف', en: 'No Tasks' },
    { id: 'first_visit', fa: 'اولین ورود', en: 'First Visit' },
    { id: 'no_recommendations', fa: 'بدون پیشنهاد', en: 'No Recs' },
    { id: 'loading', fa: 'بارگذاری', en: 'Loading' },
    { id: 'error', fa: 'خطا', en: 'Error' },
  ];

  // Determine assignments displayed based on simulated state
  const studentAssignments = assignments.filter(
    (a) => a.classId === 'cls-6a' && a.status !== 'cancelled' && a.status !== 'completed'
  );

  const primaryAssignment =
    pageSimState === 'overdue'
      ? assignments.find((a) => a.status === 'overdue') ?? studentAssignments[0]
      : studentAssignments[0];

  const unfinishedSkill = unfinishedSession
    ? skills.find((s) => s.id === unfinishedSession.skillId)
    : null;

  const latestBadge = badges.filter((b) => b.unlocked)[2] ?? badges[0];

  return (
    <AppShell roleOverride="student">
      {/* UX Review State Strip */}
      <div className="mb-5 p-2.5 rounded-card bg-surface border border-border flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink-600 px-1">
          {bi(lang, 'بررسی حالت‌های UX صفحه دانش‌آموز:', 'Inspect Student Landing UX States:')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {statePills.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => setPageSimState(sp.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                pageSimState === sp.id
                  ? 'bg-brand-700 text-white'
                  : 'bg-canvas text-ink-600 hover:text-ink-900 border border-border'
              }`}
            >
              {bi(lang, sp.fa, sp.en)}
            </button>
          ))}
        </div>
      </div>

      {pageSimState === 'loading' && <PageSkeleton />}

      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'بارگذاری اطلاعات صفحه خانه انجام نشد', 'Could not load your home dashboard')}
          description={bi(
            lang,
            'ارتباط با سرور به طور موقت قطع شده است. پیشرفت قبلی شما محفوظ است.',
            'Connection timed out. Your saved practice progress remains safe.'
          )}
          retryLabel={bi(lang, 'تلاش مجدد', 'Try Again')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && (
        <div className="space-y-7">
          {/* 1. Personalized Greeting + Educational Illustration */}
          <section className="bg-surface rounded-cardLg border border-border p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DemoBadge lang={lang} />
                <Badge tone="brand">
                  {bi(
                    lang,
                    `${DEMO_STUDENT_PROFILE.gradeLabelFa} • ریاضی`,
                    `${DEMO_STUDENT_PROFILE.gradeLabelEn} • Mathematics`
                  )}
                </Badge>
              </div>
              <h1 className="typo-page-title">
                {pageSimState === 'first_visit'
                  ? bi(
                      lang,
                      'سلام آوا! به روشنا خوش آمدی',
                      'Welcome to Roshana, Ava!'
                    )
                  : bi(
                      lang,
                      'سلام آوا! آماده‌ای یک گام جلوتر بروی؟',
                      'Hi Ava! Ready for your next step today?'
                    )}
              </h1>
              <p className="typo-body text-ink-600 max-w-2xl">
                {pageSimState === 'first_visit'
                  ? bi(
                      lang,
                      'اینجا هر روز مشخص است که چه مهارتی را تمرین کنی. می‌توانی از تکلیف معلم شروع کنی یا خودت از کتابخانه مهارت‌ها یک مبحث انتخاب کنی.',
                      'Here you can always see what to practice next—start from a teacher assignment or explore the Skill Library.'
                    )
                  : bi(
                      lang,
                      'مهم‌ترین کار امروزت در کارت زیر مشخص شده است. هر زمان بخواهی می‌توانی تمرین را ذخیره کنی و بعداً ادامه دهی.',
                      'Your top priority is highlighted right below. You can pause and resume safely at any question.'
                    )}
              </p>
            </div>
            <div className="w-56 sm:w-64 shrink-0">
              <StudentHeroIllustration />
            </div>
          </section>

          {/* 2 & 3. Primary Next Assignment CTA */}
          <section aria-labelledby="next-action-heading">
            <SectionHeader
              title={bi(lang, 'تکلیف بعدی شما', 'Your Next Assignment')}
              subtitle={bi(
                lang,
                'تعیین‌شده توسط معلم کلاس ششم الف (وضعیت‌های تکلیف پیشنهادی‌اند)',
                'Assigned by your Grade 6A teacher (assignment statuses are proposed demo labels)'
              )}
              action={
                <Link
                  to="/student/skills"
                  className="text-sm font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>{bi(lang, 'مرور همه مهارت‌ها', 'Browse Skill Library')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              }
            />

            {pageSimState === 'empty' || pageSimState === 'first_visit' || !primaryAssignment ? (
              <EmptyState
                variant="classroom"
                title={bi(
                  lang,
                  'در حال حاضر تکلیف فعالی از سوی معلم نداری',
                  'No active teacher assignments right now'
                )}
                description={bi(
                  lang,
                  'فرصت خوبی است که یکی از مهارت‌های پیشنهادی یا مبحث دلخواهت را از کتابخانه مهارت‌ها انتخاب کنی.',
                  'Great time to pick a recommended skill or explore a topic in the Skill Library.'
                )}
                action={
                  <Button
                    variant="primary"
                    onClick={() => navigate('/student/skills')}
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    {bi(lang, 'انتخاب مهارت از کتابخانه', 'Explore Skill Library')}
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                <AssignmentCard assignment={primaryAssignment} lang={lang} featured />

                {pageSimState === 'multiple' && studentAssignments.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {studentAssignments.slice(1, 3).map((asn) => (
                      <AssignmentCard key={asn.id} assignment={asn} lang={lang} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 4. Resume Unfinished Practice Session */}
          {pageSimState !== 'first_visit' && unfinishedSession && unfinishedSkill && (
            <section aria-label={bi(lang, 'ادامه تمرین نیمه‌تمام', 'Resume Unfinished Practice')}>
              <Card padding="md" className="bg-brand-50/75 border-brand-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <TopicIllustration kind="decimals" size={52} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="brand">
                          {bi(lang, 'تمرین ذخیره‌شده نیمه‌تمام', 'Saved Unfinished Session')}
                        </Badge>
                        <span className="typo-caption">
                          {bi(lang, unfinishedSession.savedAtFa, unfinishedSession.savedAtEn)}
                        </span>
                      </div>
                      <h3 className="typo-card-title mt-1">
                        {bi(lang, unfinishedSkill.titleFa, unfinishedSkill.titleEn)}
                      </h3>
                      <p className="typo-caption">
                        {lang === 'fa'
                          ? `ذخیره خودکار در سؤال ${fmtNum(unfinishedSession.questionIndex + 1, 'fa')} از ${fmtNum(unfinishedSession.totalQuestions, 'fa')}`
                          : `Auto-saved at Question ${unfinishedSession.questionIndex + 1} of ${unfinishedSession.totalQuestions}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `/student/practice/${unfinishedSkill.id}?q=${unfinishedSession.questionIndex}`
                      )
                    }
                    icon={<PlayCircle className="w-4 h-4 text-brand-700" />}
                  >
                    {lang === 'fa'
                      ? `ادامه از سؤال ${fmtNum(unfinishedSession.questionIndex + 1, 'fa')}`
                      : `Resume from Q${unfinishedSession.questionIndex + 1}`}
                  </Button>
                </div>
              </Card>
            </section>
          )}

          {/* 5. Recommended Skills with Explicit Reasons */}
          <section aria-labelledby="rec-heading">
            <SectionHeader
              title={bi(lang, 'پیشنهادهای مهارتی برای تو', 'Recommended Skills for You')}
              subtitle={bi(
                lang,
                'هر پیشنهاد همراه با دلیل آموزشی نمایش داده می‌شود (داده نمونه ثابت — بدون الگوریتم هوشمند مصوب)',
                'Each skill includes an explicit learning reason (fixed demo data — recommendation logic unapproved)'
              )}
              action={
                <Link
                  to="/student/recommendations"
                  className="text-sm font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>{bi(lang, 'مشاهده همه پیشنهادها', 'All Recommendations')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              }
            />

            {pageSimState === 'no_recommendations' || pageSimState === 'first_visit' ? (
              <Card padding="md" className="text-center py-8">
                <Compass className="w-8 h-8 text-brand-600 mx-auto mb-2" aria-hidden="true" />
                <h3 className="typo-card-title">
                  {bi(
                    lang,
                    'هنوز پیشنهاد شخصی‌سازی‌شده‌ای ثبت نشده است',
                    'No personalized recommendations yet'
                  )}
                </h3>
                <p className="typo-caption max-w-md mx-auto mt-1 mb-4">
                  {bi(
                    lang,
                    'با تمرین اولین مهارت از کتابخانه، پیشنهادهای مرتبط در اینجا نمایش داده می‌شوند.',
                    'Practice your first skill from the Skill Library to see tailored follow-up suggestions here.'
                  )}
                </p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/student/skills')}>
                  {bi(lang, 'رفتن به کتابخانه مهارت‌ها', 'Go to Skill Library')}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_RECOMMENDATIONS.map((rec) => {
                  const sk = skills.find((s) => s.id === rec.skillId);
                  const top = TOPICS.find((t) => t.id === rec.topicId);
                  if (!sk || !top) return null;
                  return (
                    <Card key={rec.id} padding="md" className="flex flex-col justify-between gap-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="typo-caption font-semibold text-brand-700">
                            {bi(lang, top.titleFa, top.titleEn)}
                          </span>
                          <SkillStatusPill status={sk.status} lang={lang} />
                        </div>
                        <h3 className="typo-card-title">{bi(lang, sk.titleFa, sk.titleEn)}</h3>
                        <div className="p-3 rounded-control bg-canvas border border-border text-xs text-ink-900 leading-relaxed">
                          <strong className="text-brand-700 block mb-0.5">
                            {bi(lang, 'چرا این مهارت؟', 'Why this skill?')}
                          </strong>
                          {bi(lang, rec.reasonFa, rec.reasonEn)}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/student/practice/${sk.id}?from=recommendation`)}
                        icon={<Sparkles className="w-4 h-4 text-brand-700" />}
                      >
                        {bi(lang, 'شروع تمرین', 'Start Practice')}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* 6 & 7. Progress Summary, Weekly Goal, Recent Activity, Latest Achievement + Secondary Coins */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Weekly Goal & Progress Summary */}
            <Card padding="md" className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="typo-card-title">
                    {bi(lang, 'هدف تمرین هفتگی من', 'My Weekly Practice Goal')}
                  </h3>
                  <DemoBadge lang={lang} />
                </div>
                <p className="typo-caption mb-4">
                  {lang === 'fa'
                    ? `${fmtNum(DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes, 'fa')} از ${fmtNum(DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes, 'fa')} دقیقه هدف هفتگی تکمیل شده است.`
                    : `${DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes} of ${DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes} weekly minutes completed.`}
                </p>
                <ProgressBar
                  value={
                    pageSimState === 'first_visit'
                      ? 0
                      : Math.round(
                          (DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes /
                            DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes) *
                            100
                        )
                  }
                  lang={lang}
                  label={bi(lang, 'پیشرفت زمانی هفته', 'Weekly Time Goal')}
                  tone="success"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div className="p-3 rounded-control bg-canvas">
                  <div className="flex items-center gap-1.5 text-xs text-ink-600">
                    <Flame className="w-4 h-4 text-accent-700" aria-hidden="true" />
                    <span>{bi(lang, 'پیوستگی تمرین', 'Practice Streak')}</span>
                  </div>
                  <div className="text-lg font-bold text-ink-900 mt-1">
                    {pageSimState === 'first_visit'
                      ? fmtNum(0, lang)
                      : fmtNum(DEMO_STUDENT_PROFILE.streakDays, lang)}{' '}
                    {bi(lang, 'روز', 'days')}
                  </div>
                </div>
                <div className="p-3 rounded-control bg-canvas">
                  <div className="flex items-center gap-1.5 text-xs text-ink-600">
                    <CheckCircle2 className="w-4 h-4 text-success-600" aria-hidden="true" />
                    <span>{bi(lang, 'مهارت‌های مسلط (نمونه)', 'Mastered (Demo)')}</span>
                  </div>
                  <div className="text-lg font-bold text-ink-900 mt-1">
                    {pageSimState === 'first_visit'
                      ? fmtNum(0, lang)
                      : fmtNum(skills.filter((s) => s.status === 'mastered').length, lang)}{' '}
                    {bi(lang, 'مهارت', 'skills')}
                  </div>
                </div>
              </div>

              <Link
                to="/student/analytics"
                className="text-sm font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                <span>{bi(lang, 'مشاهده گزارش کامل پیشرفت من', 'View Full Progress Report')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </Card>

            {/* Recent Activity */}
            <Card padding="md" className="lg:col-span-4 flex flex-col justify-between gap-3">
              <div>
                <h3 className="typo-card-title mb-3">
                  {bi(lang, 'فعالیت‌های اخیر', 'Recent Practice Activity')}
                </h3>
                {pageSimState === 'first_visit' ? (
                  <p className="typo-caption py-6 text-center">
                    {bi(lang, 'هنوز فعالیتی ثبت نشده است.', 'No activity recorded yet.')}
                  </p>
                ) : (
                  <ul className="divide-y divide-border text-sm">
                    {skills
                      .filter((s) => s.lastPracticedFa)
                      .slice(0, 3)
                      .map((sk) => (
                        <li key={sk.id} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-ink-900 truncate">
                              {bi(lang, sk.titleFa, sk.titleEn)}
                            </div>
                            <div className="typo-caption text-xs">
                              {bi(lang, sk.lastPracticedFa ?? '', sk.lastPracticedEn ?? '')}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/student/practice/${sk.id}`)}
                          >
                            {bi(lang, 'تمرین', 'Practice')}
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </Card>

            {/* Latest Achievement & Secondary Coin Balance */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <Card padding="md" className="flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="typo-caption block">
                      {bi(lang, 'آخرین دستاورد', 'Latest Achievement')}
                    </span>
                    <h3 className="typo-card-title mt-0.5">
                      {bi(lang, latestBadge.titleFa, latestBadge.titleEn)}
                    </h3>
                  </div>
                  <div className="p-2 rounded-full bg-accent-100 text-accent-700">
                    <Award className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
                <p className="typo-caption my-2">
                  {bi(lang, latestBadge.criteriaFa, latestBadge.criteriaEn)}
                </p>
                <Link
                  to="/student/achievements"
                  className="text-xs font-semibold text-brand-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>{bi(lang, 'مشاهده تالار افتخار', 'View Honor Roll')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </Card>

              {/* 7. Secondary Coin Balance — explicitly quiet and subordinate */}
              <Card padding="sm" className="bg-canvas/75">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-accent-700" aria-hidden="true" />
                    <div>
                      <span className="text-xs text-ink-600 block">
                        {bi(lang, 'موجودی سکه (انگیزشی)', 'Coin Balance')}
                      </span>
                      <strong className="text-sm text-ink-900">
                        {fmtNum(coins, lang)} {bi(lang, 'سکه', 'coins')}
                      </strong>
                    </div>
                  </div>
                  <Link
                    to="/student/store"
                    className="text-xs font-semibold text-brand-700 hover:underline"
                  >
                    {bi(lang, 'فروشگاه آواتار', 'Avatar Store')}
                  </Link>
                </div>
              </Card>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
};
