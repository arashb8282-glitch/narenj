import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudOff,
  HelpCircle,
  Lightbulb,
  LogOut,
  RotateCcw,
  Save,
  Sparkles,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  CelebrationIllustration,
  QuestionVisualDiagram,
} from '../../components/shared/Illustrations';
import {
  AnswerInput,
  Badge,
  Button,
  Card,
  DemoBadge,
  FeedbackPanel,
  InfoTooltip,
  Modal,
  ProgressBar,
  QuestionOption,
} from '../../components/ui/Primitives';
import { QUESTION_BANK, TOPICS } from '../../data/mockData';
import { bi, fmtNum } from '../../utils/format';
import { getTopicTheme } from '../../utils/theme';

export const PracticeSessionPage: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    lang,
    skills,
    updateSkillProgress,
    setUnfinishedSession,
    showToast,
  } = usePrototype();

  const skill = skills.find((s) => s.id === skillId) ?? skills[0];
  const topic = TOPICS.find((t) => t.id === skill.topicId) ?? TOPICS[0];
  const theme = getTopicTheme(topic.id);

  const questions = useMemo(() => {
    const matched = QUESTION_BANK.filter((q) => q.skillId === skill.id);
    return matched.length > 0 ? matched : QUESTION_BANK.slice(0, 3);
  }, [skill.id]);

  const initialQ = Math.min(
    questions.length - 1,
    Math.max(0, Number(searchParams.get('q') ?? 0) || 0)
  );

  const [qIndex, setQIndex] = useState<number>(initialQ);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [numericAnswer, setNumericAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const [emptyError, setEmptyError] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [saveState, setSaveState] = useState<'saved' | 'saving'>('saved');

  const [feedback, setFeedback] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    studentDisplay: string;
  } | null>(() => {
    const preset = searchParams.get('feedback');
    if (preset === 'correct') {
      return {
        submitted: true,
        isCorrect: true,
        studentDisplay: questions[0].correctDisplayFa,
      };
    }
    if (preset === 'incorrect') {
      return {
        submitted: true,
        isCorrect: false,
        studentDisplay: '۲/۶',
      };
    }
    return null;
  });

  const [completed, setCompleted] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [demoScore, setDemoScore] = useState<number>(skill.demoProgress || 48);
  const [exitModalOpen, setExitModalOpen] = useState<boolean>(false);

  const currentQuestion = questions[qIndex] ?? questions[0];
  const BackArrow = lang === 'fa' ? ArrowRight : ArrowLeft;

  const normalizeDigits = (str: string) =>
    str
      .trim()
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

  const handleSubmitAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting || feedback?.submitted) return;

    setEmptyError(false);
    setNetworkError(false);

    const rawAnswer =
      currentQuestion.type === 'multiple_choice'
        ? selectedOption
        : normalizeDigits(numericAnswer);

    if (!rawAnswer) {
      setEmptyError(true);
      return;
    }

    setSubmitting(true);
    setSaveState('saving');

    window.setTimeout(() => {
      setSubmitting(false);
      setSaveState('saved');

      const isCorrect =
        rawAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

      let studentDisplay = rawAnswer;
      if (currentQuestion.type === 'multiple_choice' && currentQuestion.options) {
        const opt = currentQuestion.options.find((o) => o.id === rawAnswer);
        if (opt) studentDisplay = bi(lang, opt.labelFa, opt.labelEn);
      }

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setDemoScore((s) => Math.min(100, s + 12));
        updateSkillProgress(skill.id, 12, qIndex + 1, false);
      } else {
        setDemoScore((s) => Math.max(20, s - 4));
      }

      setFeedback({
        submitted: true,
        isCorrect,
        studentDisplay,
      });
    }, 360);
  };

  const handleNextQuestion = () => {
    if (qIndex + 1 >= questions.length) {
      setCompleted(true);
      setUnfinishedSession(null);
      updateSkillProgress(skill.id, 20, questions.length, true);
      showToast(
        'آفرین! جلسه تمرین به پایان رسید و ۱۵ سکه نمایشی دریافت کردی.',
        'Session completed! Progress saved.',
        'success'
      );
      return;
    }
    setQIndex((prev) => prev + 1);
    setSelectedOption('');
    setNumericAnswer('');
    setFeedback(null);
    setEmptyError(false);
    setNetworkError(false);
    setShowHint(false);
  };

  const handleConfirmSafeExit = () => {
    setUnfinishedSession({
      skillId: skill.id,
      questionIndex: qIndex,
      totalQuestions: questions.length,
      savedAtFa: 'چند لحظه پیش (ذخیره خودکار)',
      savedAtEn: 'Just now (auto-saved)',
    });
    setExitModalOpen(false);
    showToast(
      `پیشرفت شما در سؤال ${fmtNum(qIndex + 1, 'fa')} ذخیره شد. هر زمان بخواهید می‌توانید ادامه دهید.`,
      `Progress saved at question ${qIndex + 1}. You can resume anytime.`,
      'info'
    );
    navigate('/student');
  };

  const triggerQuickState = (mode: 'correct' | 'wrong' | 'net_err' | 'complete') => {
    setEmptyError(false);
    setNetworkError(false);
    setCompleted(false);
    if (mode === 'correct') {
      if (currentQuestion.type === 'multiple_choice') {
        setSelectedOption(currentQuestion.correctAnswer);
      } else {
        setNumericAnswer(currentQuestion.correctAnswer);
      }
      setFeedback({
        submitted: true,
        isCorrect: true,
        studentDisplay: bi(
          lang,
          currentQuestion.correctDisplayFa,
          currentQuestion.correctDisplayEn
        ),
      });
    } else if (mode === 'wrong') {
      const wrongOpt = currentQuestion.options?.find(
        (o) => o.id !== currentQuestion.correctAnswer
      );
      if (wrongOpt) setSelectedOption(wrongOpt.id);
      setFeedback({
        submitted: true,
        isCorrect: false,
        studentDisplay: wrongOpt
          ? bi(lang, wrongOpt.labelFa, wrongOpt.labelEn)
          : bi(lang, '۲/۶ (پاسخ نمونه نادرست)', '2/6 (Sample wrong answer)'),
      });
    } else if (mode === 'net_err') {
      setFeedback(null);
      setNetworkError(true);
    } else if (mode === 'complete') {
      setCompleted(true);
    }
  };

  const optionLettersFa = ['الف', 'ب', 'ج', 'د'];
  const optionLettersEn = ['A', 'B', 'C', 'D'];

  return (
    <AppShell roleOverride="student" focusedMode>
      <div className="max-w-3xl mx-auto">
        {/* Focused Practice Top Bar — compact & comfortable on 390px mobile */}
        <header className="bg-brand-900 text-white rounded-card px-3.5 sm:px-5 py-3 mb-3.5 shadow-card flex flex-wrap items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-turquoise-200">
              <span className="font-bold">{bi(lang, topic.titleFa, topic.titleEn)}</span>
              <span>•</span>
              <span className="ltr-token font-semibold">{skill.code}</span>
            </div>
            <h1 className="text-sm sm:text-lg font-bold text-white truncate">
              {bi(lang, skill.titleFa, skill.titleEn)}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Save-state indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90">
              <Save className="w-3.5 h-3.5 text-success-500" aria-hidden="true" />
              <span>
                {saveState === 'saving'
                  ? bi(lang, 'در حال ذخیره...', 'Saving...')
                  : bi(lang, 'ذخیره خودکار', 'Auto-saved')}
              </span>
            </span>

            {/* Illustrative Demo Score */}
            <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-accent-500 text-ink-900 text-xs font-bold">
              <span>
                {bi(lang, 'امتیاز نمونه:', 'Score:')}{' '}
                <strong>{fmtNum(demoScore, lang)}</strong>
              </span>
              <InfoTooltip
                text={bi(
                  lang,
                  'صرفاً عدد نمایشی جهت ارزیابی جایگاه بصری؛ فرمول SmartScore در روشنا هنوز تصویب نشده است.',
                  'Illustrative placeholder only; SmartScore formula is not yet approved.'
                )}
              />
            </div>

            {/* Safe Exit Button */}
            <button
              type="button"
              onClick={() => setExitModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4 rtl-flip" />
              <span>{bi(lang, 'خروج امن', 'Save & Exit')}</span>
            </button>
          </div>
        </header>

        {/* Compact horizontally scrollable UX State Trigger Bar */}
        <div className="mb-3.5 px-3 py-2 rounded-control bg-surface/90 border border-border flex items-center justify-between gap-2 text-xs overflow-x-auto">
          <span className="text-ink-600 font-semibold whitespace-nowrap shrink-0">
            {bi(lang, 'تست سریع بازخورد:', 'Quick-test:')}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => triggerQuickState('correct')}
              className="px-2.5 py-1 rounded-full bg-success-100 text-success-700 font-bold hover:opacity-90 whitespace-nowrap"
            >
              {bi(lang, 'پاسخ درست', 'Correct')}
            </button>
            <button
              type="button"
              onClick={() => triggerQuickState('wrong')}
              className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold hover:opacity-90 whitespace-nowrap"
            >
              {bi(lang, 'پاسخ نادرست + گام‌های حل', 'Wrong + Steps')}
            </button>
            <button
              type="button"
              onClick={() => triggerQuickState('net_err')}
              className="px-2.5 py-1 rounded-full bg-coral-100 text-coral-700 font-bold hover:opacity-90 whitespace-nowrap"
            >
              {bi(lang, 'خطای شبکه', 'Network Error')}
            </button>
            <button
              type="button"
              onClick={() => triggerQuickState('complete')}
              className="px-2.5 py-1 rounded-full bg-lavender-100 text-lavender-700 font-bold hover:opacity-90 whitespace-nowrap"
            >
              {bi(lang, 'پایان جلسه', 'Complete')}
            </button>
          </div>
        </div>

        {/* Session Completion State */}
        {completed ? (
          <Card
            padding="lg"
            surfaceTone="cream"
            accentTop="accent"
            className="text-center space-y-5 motion-feedback"
          >
            <CelebrationIllustration />
            <div className="space-y-1.5">
              <DemoBadge lang={lang} />
              <h2 className="typo-page-title pt-1">
                {bi(
                  lang,
                  'آفرین آوا! این جلسه تمرین با موفقیت به پایان رسید',
                  'Well done, Ava! Practice session completed'
                )}
              </h2>
              <p className="typo-body text-ink-600 max-w-lg mx-auto">
                {bi(
                  lang,
                  `مهارت «${skill.titleFa}» تمرین شد و خلاصه عملکردت در گزارش پیشرفت ثبت گردید.`,
                  `You completed "${skill.titleEn}" and your session progress has been saved.`
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              <div className="p-3.5 rounded-card bg-surface border border-border-strong">
                <span className="typo-caption block">
                  {bi(lang, 'پرسش‌های بررسی‌شده', 'Questions Completed')}
                </span>
                <strong className="text-2xl text-brand-900">
                  {fmtNum(questions.length, lang)}
                </strong>
              </div>
              <div className="p-3.5 rounded-card bg-surface-mint border border-success-200">
                <span className="typo-caption block text-success-700 font-semibold">
                  {bi(lang, 'پاسخ‌های درست جلسه', 'Correct in Session')}
                </span>
                <strong className="text-2xl text-success-700">
                  {fmtNum(Math.max(1, correctCount), lang)} {bi(lang, 'از', 'of')}{' '}
                  {fmtNum(questions.length, lang)}
                </strong>
              </div>
              <div className="p-3.5 rounded-card bg-accent-100 border border-accent-200">
                <span className="typo-caption block text-accent-800 font-semibold">
                  {bi(lang, 'پاداش انگیزشی (نمونه)', 'Demo Coins Earned')}
                </span>
                <strong className="text-2xl text-accent-800">
                  +{fmtNum(15, lang)} {bi(lang, 'سکه', 'coins')}
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
              <Button variant="cta" size="lg" onClick={() => navigate('/student')}>
                {bi(lang, 'بازگشت به خانه دانش‌آموز', 'Back to Student Home')}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/student/skills')}>
                {bi(lang, 'انتخاب مهارت بعدی', 'Choose Next Skill')}
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/student/analytics')}>
                {bi(lang, 'مشاهده پیشرفت من', 'View My Progress')}
              </Button>
            </div>
          </Card>
        ) : (
          /* Active Single-Question Focused Card */
          <Card padding="lg" surfaceTone="white" accentTop={theme.accentTop} className="shadow-card">
            {/* Progress Header with segmented dots + animated bar */}
            <div className="mb-5 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-ink-600">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-turquoise-100 text-brand-900">
                    {lang === 'fa'
                      ? `سؤال ${fmtNum(qIndex + 1, 'fa')} از ${fmtNum(questions.length, 'fa')}`
                      : `Question ${qIndex + 1} of ${questions.length}`}
                  </span>
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {questions.map((q, idx) => (
                      <span
                        key={q.id}
                        className={`h-2 rounded-full transition-all ${
                          idx < qIndex || (idx === qIndex && feedback?.submitted)
                            ? 'w-5 bg-success-500'
                            : idx === qIndex
                              ? 'w-6 bg-turquoise-500'
                              : 'w-2.5 bg-border-strong'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Badge tone="lavender">
                  {currentQuestion.type === 'multiple_choice'
                    ? bi(lang, 'چندگزینه‌ای', 'Multiple Choice')
                    : bi(lang, 'پاسخ عددی', 'Numeric Input')}
                </Badge>
              </div>
              <ProgressBar
                value={Math.round(
                  ((qIndex + (feedback?.submitted ? 1 : 0)) / questions.length) * 100
                )}
                lang={lang}
                size="md"
                tone="turquoise"
                showValue={false}
              />
            </div>

            {/* Question Stem & Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-5">
              <div className="p-4 sm:p-5 rounded-card bg-surface-sky/60 border border-turquoise-100 space-y-3">
                <h2 className="text-lg sm:text-xl font-bold text-ink-900 leading-relaxed">
                  {bi(lang, currentQuestion.promptFa, currentQuestion.promptEn)}
                </h2>

                <QuestionVisualDiagram
                  visualType={currentQuestion.visualType}
                  lang={lang}
                  widthCm={currentQuestion.visualMeta?.widthCm}
                  heightCm={currentQuestion.visualMeta?.heightCm}
                />
              </div>

              {/* Optional Gentle Hint */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-100 hover:bg-accent-200 border border-accent-200 text-xs font-bold text-accent-800 transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-accent-700" aria-hidden="true" />
                  <span>
                    {showHint
                      ? bi(lang, 'بستن راهنمای حل', 'Hide hint')
                      : bi(lang, 'نیاز به یک راهنمایی کوچک داری؟', 'Need a gentle hint?')}
                  </span>
                </button>
                {showHint && (
                  <div className="mt-2.5 p-3.5 rounded-card bg-surface-cream border border-accent-200 text-xs sm:text-sm text-ink-900 leading-relaxed motion-feedback">
                    {bi(lang, currentQuestion.hintFa, currentQuestion.hintEn)}
                  </div>
                )}
              </div>

              {/* Answer Controls — Single-column on mobile, 2-col on tablet/desktop */}
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  role="group"
                  aria-label="Options"
                >
                  {currentQuestion.options.map((opt, idx) => {
                    let fbState: 'correct' | 'wrong_selected' | 'idle' = 'idle';
                    if (feedback?.submitted) {
                      if (opt.id === currentQuestion.correctAnswer) fbState = 'correct';
                      else if (opt.id === selectedOption && !feedback.isCorrect)
                        fbState = 'wrong_selected';
                    }
                    return (
                      <QuestionOption
                        key={opt.id}
                        id={opt.id}
                        indexLabel={lang === 'fa' ? optionLettersFa[idx] : optionLettersEn[idx]}
                        label={bi(lang, opt.labelFa, opt.labelEn)}
                        selected={selectedOption === opt.id}
                        disabled={Boolean(feedback?.submitted)}
                        feedbackState={fbState}
                        onSelect={() => {
                          setSelectedOption(opt.id);
                          setEmptyError(false);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <AnswerInput
                  id="practice-numeric-input"
                  label={bi(lang, 'پاسخ عددی خود را وارد کن:', 'Enter your numeric answer:')}
                  value={numericAnswer}
                  disabled={Boolean(feedback?.submitted)}
                  onChange={(val) => {
                    setNumericAnswer(val);
                    setEmptyError(false);
                  }}
                  placeholder={bi(lang, 'مثلاً: ۴', 'e.g. 4')}
                />
              )}

              {/* Empty Answer Validation Message */}
              {emptyError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-control bg-orange-100 border border-orange-200 text-orange-700 text-sm font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {bi(
                      lang,
                      'پیش از ثبت پاسخ، یکی از گزینه‌ها را انتخاب کن یا عدد پاسخ را بنویس.',
                      'Please choose an option or enter a number before submitting.'
                    )}
                  </span>
                </div>
              )}

              {/* Simulated Network Error State */}
              {networkError && (
                <div
                  role="alert"
                  className="p-4 rounded-card bg-surface-coral border-2 border-coral-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 text-sm text-ink-900">
                    <CloudOff className="w-5 h-5 text-coral-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-coral-700">
                        {bi(
                          lang,
                          'ارسال پاسخ با اختلال اینترنت مواجه شد',
                          'Network error while submitting answer'
                        )}
                      </strong>
                      <span className="text-xs text-ink-600">
                        {bi(
                          lang,
                          'پاسخ انتخابی تو پاک نشده است؛ با زدن دکمه تلاش مجدد دوباره ثبت می‌شود.',
                          'Your selected answer is preserved; click Retry Submit.'
                        )}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="cta"
                    size="sm"
                    onClick={() => handleSubmitAnswer()}
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    {bi(lang, 'تلاش مجدد ثبت پاسخ', 'Retry Submit')}
                  </Button>
                </div>
              )}

              {/* Primary Submit Action — full-width comfortable button on mobile */}
              {!feedback?.submitted && (
                <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 border-t border-border">
                  <span className="typo-caption inline-flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {bi(
                      lang,
                      'فهرست نهایی تمام انواع سؤال در منابع محصول در حال تکمیل است.',
                      'Full inventory of question types is pending final specification.'
                    )}
                  </span>
                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full sm:w-auto"
                    loading={submitting}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                  >
                    {submitting
                      ? bi(lang, 'در حال بررسی پاسخ...', 'Checking...')
                      : bi(lang, 'ثبت و بررسی پاسخ', 'Submit Answer')}
                  </Button>
                </div>
              )}
            </form>

            {/* Rich Question Feedback Panel */}
            {feedback?.submitted && (
              <FeedbackPanel
                isCorrect={feedback.isCorrect}
                lang={lang}
                studentAnswerDisplay={feedback.studentDisplay}
                correctAnswerDisplay={bi(
                  lang,
                  currentQuestion.correctDisplayFa,
                  currentQuestion.correctDisplayEn
                )}
                explanation={bi(
                  lang,
                  currentQuestion.explanationFa,
                  currentQuestion.explanationEn
                )}
                solvingSteps={
                  lang === 'fa'
                    ? currentQuestion.solvingStepsFa
                    : currentQuestion.solvingStepsEn
                }
                onContinue={handleNextQuestion}
                isLastQuestion={qIndex + 1 >= questions.length}
              />
            )}
          </Card>
        )}

        {/* Footer Breadcrumb Escape */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-ink-600">
          <Link
            to={`/student/topics/${topic.id}`}
            className="hover:text-brand-800 hover:underline inline-flex items-center gap-1"
          >
            <BackArrow className="w-3.5 h-3.5" />
            <span>
              {bi(
                lang,
                `سایر مهارت‌های «${topic.titleFa}»`,
                `More skills in ${topic.titleEn}`
              )}
            </span>
          </Link>
          <span className="inline-flex items-center gap-1 text-brand-800">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
            {bi(lang, 'محیط تمرین متمرکز روشنا', 'Roshana Focused Practice Mode')}
          </span>
        </div>
      </div>

      {/* Safe Exit Confirmation Modal */}
      <Modal
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        title={bi(lang, 'خروج امن از جلسه تمرین', 'Safe Exit from Practice')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setExitModalOpen(false)}>
              {bi(lang, 'ادامه دادن همین تمرین', 'Stay & Continue')}
            </Button>
            <Button variant="cta" onClick={handleConfirmSafeExit}>
              {bi(lang, 'ذخیره و بازگشت به خانه', 'Save & Exit to Home')}
            </Button>
          </>
        }
      >
        <p className="typo-body text-ink-900">
          {bi(
            lang,
            `پیشرفت شما تا سؤال ${fmtNum(qIndex + 1, 'fa')} به‌صورت خودکار ذخیره شده است. هر زمان به صفحه خانه برگردید، می‌توانید با یک کلیک از همین نقطه ادامه دهید.`,
            `Your progress up to Question ${qIndex + 1} is saved. You can resume right where you left off from Student Home.`
          )}
        </p>
      </Modal>
    </AppShell>
  );
};
