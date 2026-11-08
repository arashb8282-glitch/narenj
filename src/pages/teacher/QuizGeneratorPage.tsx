import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileQuestion,
  Lock,
  RefreshCw,
  Save,
  Send,
  Sliders,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { QuestionVisualDiagram } from '../../components/shared/Illustrations';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  PageHeader,
  SectionHeader,
  SelectField,
} from '../../components/ui/Primitives';
import { QUESTION_BANK, TOPICS } from '../../data/mockData';
import { bi, fmtNum } from '../../utils/format';

export const QuizGeneratorPage: React.FC = () => {
  const {
    lang,
    activeClass,
    skills,
    teacherSelectedSkillIds,
    quizzes,
    addQuiz,
    showToast,
  } = usePrototype();

  const [quizTitle, setQuizTitle] = useState<string>(
    'آزمونک هفتگی: جمع کسرها و ضرب اعشاری'
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    teacherSelectedSkillIds.length > 0
      ? teacherSelectedSkillIds
      : ['sk-add-fractions', 'sk-mult-decimals']
  );
  const [questionCount, setQuestionCount] = useState<string>('4');
  const [difficulty, setDifficulty] = useState<'balanced' | 'basic' | 'challenge'>('balanced');
  const [previewGenerated, setPreviewGenerated] = useState<boolean>(true);
  const [seedOffset, setSeedOffset] = useState<number>(0);

  const generatedQuestions = useMemo(() => {
    const pool = QUESTION_BANK.filter((q) => selectedSkillIds.includes(q.skillId));
    const source = pool.length > 0 ? pool : QUESTION_BANK;
    const count = Math.min(source.length, Number(questionCount) || 4);
    const rotated = [
      ...source.slice(seedOffset % source.length),
      ...source.slice(0, seedOffset % source.length),
    ];
    return rotated.slice(0, count);
  }, [selectedSkillIds, questionCount, seedOffset]);

  const handleSaveOrPublish = (status: 'draft' | 'published') => {
    if (selectedSkillIds.length === 0) return;
    addQuiz({
      id: `qz-${Date.now()}`,
      titleFa: quizTitle || 'آزمون جدید از بانک سؤال',
      titleEn: quizTitle || 'Generated Question Bank Quiz',
      classId: activeClass.id,
      skillIds: selectedSkillIds,
      questionIds: generatedQuestions.map((q) => q.id),
      difficulty,
      status,
      createdAtFa: 'هم‌اکنون (نسخه نمایشی)',
      createdAtEn: 'Just now (Demo)',
    });
    showToast(
      status === 'published'
        ? `آزمون برای «${activeClass.nameFa}» منتشر شد.`
        : 'پیش‌نویس آزمون با موفقیت ذخیره شد.',
      status === 'published'
        ? `Quiz published for ${activeClass.nameEn}.`
        : 'Quiz draft saved.',
      'success'
    );
  };

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'آزمون‌ساز', 'Quiz Generator') },
        ]}
        title={bi(lang, 'آزمون‌ساز از بانک سؤال روشنا (P1)', 'Question Bank Quiz Generator (P1)')}
        subtitle={bi(
          lang,
          'تولید آزمون کلاسی با انتخاب مهارت‌ها و چینش خودکار سؤال‌ها از بانک استاندارد سامانه (بدون امکان تایپ یا ویرایش متن سؤال).',
          'Assemble quizzes strictly from approved Question Bank items—no manual question authoring or editing.'
        )}
        badge={
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="تنظیمات نمایشی — پارامترهای نهایی آزمون‌ساز باز است"
            labelEn="Demo Settings — Policy Open"
          />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Configuration Column */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
              <h2 className="typo-card-title flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-700" />
                <span>{bi(lang, 'پیکربندی آزمون', 'Quiz Configuration')}</span>
              </h2>
              <Badge tone="accent">{bi(lang, 'تنظیمات نمایشی', 'Demo Settings')}</Badge>
            </div>

            <div>
              <label htmlFor="quiz-title-input" className="block text-xs font-semibold text-ink-600 mb-1">
                {bi(lang, 'عنوان آزمون برای کلاس فعال', 'Quiz Title')}
              </label>
              <input
                id="quiz-title-input"
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 bg-surface border border-border rounded-control text-sm"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-ink-600 mb-2">
                {bi(lang, 'انتخاب مهارت‌ها از بانک سؤال (ریاضی ششم)', 'Select Skills from Bank')}
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto p-2 rounded-control bg-canvas border border-border">
                {skills
                  .filter((s) => s.grade === 6)
                  .map((sk) => {
                    const checked = selectedSkillIds.includes(sk.id);
                    const top = TOPICS.find((t) => t.id === sk.topicId);
                    return (
                      <label
                        key={sk.id}
                        className={`p-2.5 rounded-control border text-xs flex items-start gap-2.5 cursor-pointer ${
                          checked
                            ? 'bg-brand-100 border-brand-700 text-brand-700 font-semibold'
                            : 'bg-surface border-border text-ink-900'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setSelectedSkillIds((prev) =>
                              prev.includes(sk.id)
                                ? prev.filter((id) => id !== sk.id)
                                : [...prev, sk.id]
                            )
                          }
                          className="mt-0.5 w-4 h-4 rounded"
                        />
                        <div>
                          <div>{bi(lang, sk.titleFa, sk.titleEn)}</div>
                          {top && (
                            <span className="text-[11px] text-ink-600 font-normal">
                              {bi(lang, top.titleFa, top.titleEn)}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField
                id="quiz-q-count"
                label={bi(lang, 'تعداد سؤال (نمایشی)', 'Question Count (Demo)')}
                value={questionCount}
                onChange={setQuestionCount}
                options={[
                  { value: '3', label: bi(lang, '۳ سؤال نمونه', '3 Questions') },
                  { value: '4', label: bi(lang, '۴ سؤال نمونه', '4 Questions') },
                  { value: '6', label: bi(lang, '۶ سؤال نمونه', '6 Questions') },
                ]}
              />
              <SelectField
                id="quiz-diff"
                label={bi(lang, 'ترکیب دشواری (نمایشی)', 'Difficulty Mix (Demo)')}
                value={difficulty}
                onChange={(v) => setDifficulty(v as 'balanced' | 'basic' | 'challenge')}
                options={[
                  { value: 'balanced', label: bi(lang, 'متوازن استاندارد', 'Balanced') },
                  { value: 'basic', label: bi(lang, 'مفهومی و پایه', 'Foundational') },
                  { value: 'challenge', label: bi(lang, 'چالشی و ترکیبی', 'Challenge') },
                ]}
              />
            </div>

            <div className="p-3 rounded-control bg-canvas border border-border text-xs text-ink-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <span>
                {bi(
                  lang,
                  'سؤال‌ها فقط از بانک سؤال روشنا فراخوانی می‌شوند؛ امکان افزودن دستی یا تغییر متن سؤال وجود ندارد.',
                  'Questions are pulled strictly from the Question Bank; authoring/editing is disabled.'
                )}
              </span>
            </div>

            <Button
              variant="primary"
              className="w-full"
              disabled={selectedSkillIds.length === 0}
              onClick={() => {
                setPreviewGenerated(true);
                setSeedOffset((n) => n + 1);
                showToast(
                  'پیش‌نمایش جدید از بانک سؤال چیده شد.',
                  'Generated fresh preview from Question Bank.',
                  'info'
                );
              }}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              {bi(lang, 'تولید / جایگزینی پیش‌نمایش آزمون', 'Generate Quiz Preview')}
            </Button>
          </Card>

          {/* Saved / Published Quizzes List */}
          <Card padding="md" className="space-y-3">
            <h3 className="typo-card-title">
              {bi(lang, 'آزمون‌های ثبت‌شده کلاس', 'Saved & Published Quizzes')}
            </h3>
            <div className="space-y-2.5">
              {quizzes.map((qz) => (
                <div
                  key={qz.id}
                  className="p-3 rounded-control bg-canvas border border-border flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-semibold text-ink-900">
                      {bi(lang, qz.titleFa, qz.titleEn)}
                    </div>
                    <span className="text-ink-600">
                      {bi(lang, qz.createdAtFa, qz.createdAtEn)} •{' '}
                      {fmtNum(qz.questionIds.length, lang)} {bi(lang, 'سؤال', 'questions')}
                    </span>
                  </div>
                  <Badge tone={qz.status === 'published' ? 'success' : 'neutral'}>
                    {qz.status === 'published'
                      ? bi(lang, 'منتشرشده', 'Published')
                      : bi(lang, 'پیش‌نویس', 'Draft')}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Generated Preview Column */}
        <div className="lg:col-span-7 space-y-4">
          <SectionHeader
            title={bi(
              lang,
              `پیش‌نمایش سؤال‌های انتخاب‌شده برای «${activeClass.nameFa}»`,
              `Generated Preview for ${activeClass.nameEn}`
            )}
            subtitle={bi(
              lang,
              `${fmtNum(generatedQuestions.length, 'fa')} سؤال استاندارد فقط‌خواندنی از بانک سؤال`,
              `${generatedQuestions.length} read-only questions from Question Bank`
            )}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSaveOrPublish('draft')}
                  icon={<Save className="w-4 h-4" />}
                >
                  {bi(lang, 'ذخیره پیش‌نویس', 'Save Draft')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSaveOrPublish('published')}
                  icon={<Send className="w-4 h-4 rtl-flip" />}
                >
                  {bi(lang, 'انتشار آزمون', 'Publish Quiz')}
                </Button>
              </div>
            }
          />

          {previewGenerated &&
            generatedQuestions.map((q, idx) => {
              const sk = skills.find((s) => s.id === q.skillId);
              return (
                <Card key={q.id} padding="md" className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-brand-700 inline-flex items-center gap-1.5">
                      <FileQuestion className="w-4 h-4" />
                      {bi(lang, `سؤال ${fmtNum(idx + 1, 'fa')}`, `Question ${idx + 1}`)}
                      {sk && ` • ${bi(lang, sk.titleFa, sk.titleEn)}`}
                    </span>
                    <Badge tone="neutral">{q.difficulty}</Badge>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-ink-900">
                    {bi(lang, q.promptFa, q.promptEn)}
                  </p>

                  <QuestionVisualDiagram
                    visualType={q.visualType}
                    lang={lang}
                    widthCm={q.visualMeta?.widthCm}
                    heightCm={q.visualMeta?.heightCm}
                  />

                  <div className="p-2.5 rounded-control bg-success-100/55 border border-success-600/30 text-xs text-ink-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                    <span>
                      <strong>{bi(lang, 'کلید پاسخ بانک سؤال: ', 'Answer key: ')}</strong>
                      {bi(lang, q.correctDisplayFa, q.correctDisplayEn)}
                    </span>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>
    </AppShell>
  );
};
