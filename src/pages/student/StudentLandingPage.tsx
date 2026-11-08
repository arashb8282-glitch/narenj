import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coins,
  Compass,
  Flame,
  PlayCircle,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  BadgeGraphic,
  StudentHeroIllustration,
  TopicIllustration,
} from '../../components/shared/Illustrations';
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
import { getTopicTheme } from '../../utils/theme';

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

  const attentionSkills = skills.filter((s) => s.status === 'needs_review');
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const latestBadge = badges.filter((b) => b.unlocked)[2] ?? badges[0];

  const weeklyPercent =
    pageSimState === 'first_visit'
      ? 0
      : Math.round(
          (DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes /
            DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes) *
            100
        );

  return (
    <AppShell roleOverride="student">
      {/* UX Review State Strip — horizontally scrollable on mobile so it never bloats vertical height */}
      <div className="mb-5 p-2.5 rounded-card bg-surface border border-border flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-brand-800 px-1 whitespace-nowrap shrink-0">
          {bi(lang, 'حالت UX صفحه:', 'UX State:')}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {statePills.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => setPageSimState(sp.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                pageSimState === sp.id
                  ? 'bg-brand-800 text-white shadow-xs'
                  : 'bg-canvas text-ink-600 hover:text-brand-900 border border-border'
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
          {/* 1. Energetic Personalized Hero Banner + 4-Question Student Snapshot */}
          <section className="rounded-cardLg bg-gradient-to-br from-brand-900 via-brand-800 to-turquoise-700 text-white p-5 sm:p-7 shadow-card overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-500 text-ink-900 text-[11px] font-bold">
                    {bi(lang, 'داده نمونه (DEMO DATA)', 'DEMO DATA')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-turquoise-100">
                    {bi(
                      lang,
                      `${DEMO_STUDENT_PROFILE.gradeLabelFa} • ریاضی`,
                      `${DEMO_STUDENT_PROFILE.gradeLabelEn} • Mathematics`
                    )}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-[1.85rem] font-bold text-white leading-tight">
                  {pageSimState === 'first_visit'
                    ? bi(lang, 'سلام آوا! به روشنا خوش آمدی', 'Welcome to Roshana, Ava!')
                    : bi(
                        lang,
                        'سلام آوا! آماده‌ای امروز یک گام جلوتر بروی؟',
                        'Hi Ava! Ready for your next learning step?'
                      )}
                </h1>

                <p className="text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
                  {pageSimState === 'first_visit'
                    ? bi(
                        lang,
                        'اینجا هر روز مشخص است چه مهارتی را تمرین کنی. از تکلیف معلم شروع کن یا خودت از کتابخانه مهارت‌ها یک مبحث انتخاب کن.',
                        'Here you always know what to practice next—start from a teacher assignment or explore the Skill Library.'
                      )
                    : bi(
                        lang,
                        'اولویت اصلی امروزت در کارت نارنجی پایین مشخص شده است. هر زمان بخواهی می‌توانی تمرین را ذخیره کنی و بعداً ادامه دهی.',
                        'Your #1 priority is highlighted right below. You can pause and resume safely at any question.'
                      )}
                </p>

                {/* 4 Key Answers at a Glance: Next Action, Current Progress, Needs Attention, Achievements */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="rounded-control bg-white/12 border border-white/15 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-orange-200 font-semibold">
                      <Target className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{bi(lang, 'اقدام بعدی', 'Up Next')}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 truncate">
                      {pageSimState === 'empty' || pageSimState === 'first_visit'
                        ? bi(lang, 'انتخاب آزاد مهارت', 'Pick a Skill')
                        : bi(
                            lang,
                            `${fmtNum(studentAssignments.length, 'fa')} تکلیف فعال`,
                            `${studentAssignments.length} Active Task(s)`
                          )}
                    </div>
                  </div>

                  <div className="rounded-control bg-white/12 border border-white/15 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-success-100 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success-500 shrink-0" />
                      <span>{bi(lang, 'پیشرفت هفته', 'Weekly Goal')}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {fmtNum(weeklyPercent, lang)}٪{' '}
                      <span className="text-xs font-normal text-white/75">
                        ({fmtNum(pageSimState === 'first_visit' ? 0 : DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes, lang)} {bi(lang, 'دقیقه', 'm')})
                      </span>
                    </div>
                  </div>

                  <div className="rounded-control bg-white/12 border border-white/15 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-coral-100 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-coral-500 shrink-0" />
                      <span>{bi(lang, 'نیازمند توجه', 'Needs Review')}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {fmtNum(pageSimState === 'first_visit' ? 0 : attentionSkills.length, lang)}{' '}
                      {bi(lang, 'مهارت', 'skill(s)')}
                    </div>
                  </div>

                  <div className="rounded-control bg-white/12 border border-white/15 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-accent-200 font-semibold">
                      <Trophy className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>{bi(lang, 'دستاوردها', 'Achievements')}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {fmtNum(pageSimState === 'first_visit' ? 0 : unlockedBadgesCount, lang)}{' '}
                      {bi(lang, 'مدال', 'badges')} •{' '}
                      {fmtNum(pageSimState === 'first_visit' ? 0 : DEMO_STUDENT_PROFILE.streakDays, lang)}{' '}
                      {bi(lang, 'روز', 'd')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-48 sm:w-60 shrink-0 hidden sm:block">
                <StudentHeroIllustration />
              </div>
            </div>
          </section>

          {/* 2. Primary Next Assignment CTA */}
          <section aria-labelledby="next-action-heading">
            <SectionHeader
              accentColor="orange"
              title={bi(lang, 'گام اول امروز: تکلیف معلم', 'Step 1 Today: Teacher Assignment')}
              subtitle={bi(
                lang,
                'تعیین‌شده توسط معلم کلاس ششم الف (وضعیت‌های تکلیف پیشنهادی‌اند)',
                'Assigned by your Grade 6A teacher (assignment statuses are proposed demo labels)'
              )}
              action={
                <Link
                  to="/student/skills"
                  className="text-sm font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
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
                  'فرصت عالی برای انتخاب یکی از مهارت‌های پیشنهادی یا مبحث دلخواهت از کتابخانه مهارت‌هاست.',
                  'Great time to pick a recommended skill or explore a topic in the Skill Library.'
                )}
                action={
                  <Button
                    variant="cta"
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

          {/* 3. Unfinished Session + Skills Needing Attention Row */}
          {pageSimState !== 'first_visit' && (unfinishedSkill || attentionSkills.length > 0) && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {unfinishedSession && unfinishedSkill && (
                <Card padding="md" surfaceTone="sky" accentTop="turquoise">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-full">
                    <div className="flex items-start gap-3.5">
                      <TopicIllustration kind="decimals" size={52} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="turquoise">
                            {bi(lang, 'تمرین نیمه‌تمام ذخیره‌شده', 'Saved Unfinished Session')}
                          </Badge>
                          <span className="typo-caption">
                            {bi(lang, unfinishedSession.savedAtFa, unfinishedSession.savedAtEn)}
                          </span>
                        </div>
                        <h3 className="typo-card-title mt-1.5">
                          {bi(lang, unfinishedSkill.titleFa, unfinishedSkill.titleEn)}
                        </h3>
                        <p className="typo-caption mt-0.5">
                          {lang === 'fa'
                            ? `ذخیره خودکار در سؤال ${fmtNum(unfinishedSession.questionIndex + 1, 'fa')} از ${fmtNum(unfinishedSession.totalQuestions, 'fa')}`
                            : `Auto-saved at Question ${unfinishedSession.questionIndex + 1} of ${unfinishedSession.totalQuestions}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="turquoise"
                      size="sm"
                      className="shrink-0"
                      onClick={() =>
                        navigate(
                          `/student/practice/${unfinishedSkill.id}?q=${unfinishedSession.questionIndex}`
                        )
                      }
                      icon={<PlayCircle className="w-4 h-4" />}
                    >
                      {lang === 'fa'
                        ? `ادامه از سؤال ${fmtNum(unfinishedSession.questionIndex + 1, 'fa')}`
                        : `Resume Q${unfinishedSession.questionIndex + 1}`}
                    </Button>
                  </div>
                </Card>
              )}

              {attentionSkills[0] && (
                <Card padding="md" surfaceTone="coral" accentTop="coral">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-full">
                    <div className="flex items-start gap-3.5">
                      <div className="w-[52px] h-[52px] rounded-card bg-coral-100 border border-coral-200 flex items-center justify-center text-coral-600 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="coral">
                            {bi(lang, 'مهارت نیازمند مرور', 'Skill Needing Attention')}
                          </Badge>
                          <span className="ltr-token text-xs font-bold text-coral-700">
                            {attentionSkills[0].code}
                          </span>
                        </div>
                        <h3 className="typo-card-title mt-1.5">
                          {bi(lang, attentionSkills[0].titleFa, attentionSkills[0].titleEn)}
                        </h3>
                        <p className="typo-caption mt-0.5">
                          {bi(
                            lang,
                            attentionSkills[0].attentionNoteFa ?? 'مرور کوتاه ۵ دقیقه‌ای برای رفع اشتباه‌های رایج',
                            attentionSkills[0].attentionNoteEn ?? 'Short 5-min review to clear up recent mistakes'
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="cta"
                      size="sm"
                      className="shrink-0"
                      onClick={() => navigate(`/student/practice/${attentionSkills[0].id}`)}
                      icon={<PlayCircle className="w-4 h-4" />}
                    >
                      {bi(lang, 'شروع مرور', 'Review Now')}
                    </Button>
                  </div>
                </Card>
              )}
            </section>
          )}

          {/* 4. Recommended Skills with Topic Color Coding & Explicit Reasons */}
          <section aria-labelledby="rec-heading">
            <SectionHeader
              accentColor="lavender"
              title={bi(lang, 'پیشنهادهای یادگیری مخصوص تو', 'Recommended Skills for You')}
              subtitle={bi(
                lang,
                'هر پیشنهاد همراه با دلیل آموزشی مشخص نمایش داده می‌شود (داده نمونه ثابت — الگوریتم هوشمند هنوز مصوب نشده)',
                'Each skill includes an explicit learning reason (fixed demo data — recommendation logic unapproved)'
              )}
              action={
                <Link
                  to="/student/recommendations"
                  className="text-sm font-bold text-lavender-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>{bi(lang, 'همه پیشنهادها', 'All Recommendations')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              }
            />

            {pageSimState === 'no_recommendations' || pageSimState === 'first_visit' ? (
              <Card padding="md" surfaceTone="lavender" className="text-center py-8">
                <Compass className="w-8 h-8 text-lavender-600 mx-auto mb-2" aria-hidden="true" />
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
                <Button variant="primary" size="sm" onClick={() => navigate('/student/skills')}>
                  {bi(lang, 'رفتن به کتابخانه مهارت‌ها', 'Go to Skill Library')}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_RECOMMENDATIONS.map((rec) => {
                  const sk = skills.find((s) => s.id === rec.skillId);
                  const top = TOPICS.find((t) => t.id === rec.topicId);
                  if (!sk || !top) return null;
                  const theme = getTopicTheme(top.id);
                  return (
                    <Card
                      key={rec.id}
                      padding="md"
                      surfaceTone={theme.surfaceTone}
                      accentTop={theme.accentTop}
                      interactive
                      className="flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.chipClass}`}>
                            {bi(lang, top.titleFa, top.titleEn)}
                          </span>
                          <SkillStatusPill status={sk.status} lang={lang} />
                        </div>
                        <h3 className="typo-card-title">{bi(lang, sk.titleFa, sk.titleEn)}</h3>
                        <div className="p-3 rounded-control bg-surface/90 border border-border text-xs text-ink-900 leading-relaxed">
                          <strong className="text-brand-800 block mb-0.5">
                            {bi(lang, 'چرا این مهارت؟', 'Why this skill?')}
                          </strong>
                          {bi(lang, rec.reasonFa, rec.reasonEn)}
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/student/practice/${sk.id}?from=recommendation`)}
                        icon={<Sparkles className="w-4 h-4" />}
                      >
                        {bi(lang, 'شروع تمرین این مهارت', 'Start Skill Practice')}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* 5. Progress Summary, Recent Activity, Latest Achievement + Subordinate Coin Card */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Weekly Goal & Progress Summary (Fresh Mint) */}
            <Card
              padding="md"
              surfaceTone="mint"
              accentTop="success"
              className="lg:col-span-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="typo-card-title">
                    {bi(lang, 'هدف تمرین هفتگی من', 'My Weekly Practice Goal')}
                  </h3>
                  <DemoBadge lang={lang} />
                </div>
                <p className="typo-caption mb-4">
                  {lang === 'fa'
                    ? `${fmtNum(DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes, 'fa')} از ${fmtNum(DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes, 'fa')} دقیقه هدف هفتگی کامل شده است.`
                    : `${DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes} of ${DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes} weekly minutes completed.`}
                </p>
                <ProgressBar
                  value={weeklyPercent}
                  lang={lang}
                  size="md"
                  label={bi(lang, 'پیشرفت زمانی هفته', 'Weekly Time Goal')}
                  tone="success"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-success-200">
                <div className="p-3 rounded-control bg-surface border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-700">
                    <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
                    <span>{bi(lang, 'پیوستگی تمرین', 'Practice Streak')}</span>
                  </div>
                  <div className="text-lg font-bold text-ink-900 mt-1">
                    {pageSimState === 'first_visit'
                      ? fmtNum(0, lang)
                      : fmtNum(DEMO_STUDENT_PROFILE.streakDays, lang)}{' '}
                    {bi(lang, 'روز پیاپی', 'days')}
                  </div>
                </div>
                <div className="p-3 rounded-control bg-surface border border-border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-success-700">
                    <CheckCircle2 className="w-4 h-4 text-success-600" aria-hidden="true" />
                    <span>{bi(lang, 'مهارت‌های مسلط', 'Mastered (Demo)')}</span>
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
                className="text-sm font-bold text-success-700 hover:underline inline-flex items-center gap-1"
              >
                <span>{bi(lang, 'مشاهده کارنامه کامل پیشرفت', 'View Full Progress Report')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </Card>

            {/* Recent Activity (Vibrant Sky) */}
            <Card
              padding="md"
              surfaceTone="sky"
              accentTop="turquoise"
              className="lg:col-span-4 flex flex-col justify-between gap-3"
            >
              <div>
                <h3 className="typo-card-title mb-3">
                  {bi(lang, 'آخرین تمرین‌های انجام‌شده', 'Recent Practice Activity')}
                </h3>
                {pageSimState === 'first_visit' ? (
                  <p className="typo-caption py-6 text-center">
                    {bi(lang, 'هنوز فعالیتی ثبت نشده است.', 'No activity recorded yet.')}
                  </p>
                ) : (
                  <ul className="space-y-2.5 text-sm">
                    {skills
                      .filter((s) => s.lastPracticedFa)
                      .slice(0, 3)
                      .map((sk) => (
                        <li
                          key={sk.id}
                          className="p-2.5 rounded-control bg-surface border border-border flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-ink-900 truncate">
                              {bi(lang, sk.titleFa, sk.titleEn)}
                            </div>
                            <div className="typo-caption text-xs">
                              {bi(lang, sk.lastPracticedFa ?? '', sk.lastPracticedEn ?? '')}
                            </div>
                          </div>
                          <Button
                            variant="secondary"
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
              <Link
                to="/student/skills"
                className="text-xs font-bold text-turquoise-700 hover:underline inline-flex items-center gap-1"
              >
                <span>{bi(lang, 'انتخاب مهارت جدید', 'Pick another skill')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </Card>

            {/* Latest Achievement (Sunny Cream) & Subordinate Coin Balance */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <Card
                padding="md"
                surfaceTone="cream"
                accentTop="accent"
                className="flex-1 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-accent-800 block">
                      {bi(lang, 'آخرین مدال کسب‌شده', 'Latest Unlocked Badge')}
                    </span>
                    <h3 className="typo-card-title mt-0.5">
                      {bi(lang, latestBadge.titleFa, latestBadge.titleEn)}
                    </h3>
                  </div>
                  <BadgeGraphic icon={latestBadge.iconKey} unlocked size={48} />
                </div>
                <p className="typo-caption my-2">
                  {bi(lang, latestBadge.criteriaFa, latestBadge.criteriaEn)}
                </p>
                <Link
                  to="/student/achievements"
                  className="text-xs font-bold text-accent-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>{bi(lang, 'مشاهده همه مدال‌ها', 'View All Achievements')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </Card>

              {/* Secondary Coin Balance — intentionally calm and subordinate */}
              <Card padding="sm" className="bg-surface">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent-100 border border-accent-200 flex items-center justify-center">
                      <Coins className="w-4 h-4 text-accent-700" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-ink-600 block">
                        {bi(lang, 'سکه انگیزشی', 'Reward Coins')}
                      </span>
                      <strong className="text-sm text-ink-900">
                        {fmtNum(coins, lang)} {bi(lang, 'سکه', 'coins')}
                      </strong>
                    </div>
                  </div>
                  <Link
                    to="/student/store"
                    className="text-xs font-bold text-brand-700 hover:underline"
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
