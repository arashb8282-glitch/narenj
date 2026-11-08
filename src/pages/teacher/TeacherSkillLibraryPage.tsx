import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckSquare,
  Eye,
  FileQuestion,
  Info,
  Lock,
  Users,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { QuestionVisualDiagram } from '../../components/shared/Illustrations';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  Modal,
  PageHeader,
  SearchInput,
  SelectField,
} from '../../components/ui/Primitives';
import { QUESTION_BANK, TOPICS } from '../../data/mockData';
import { Skill } from '../../data/types';
import { bi, fmtNum } from '../../utils/format';
import { getTopicTheme } from '../../utils/theme';

export const TeacherSkillLibraryPage: React.FC = () => {
  const {
    lang,
    skills,
    activeClass,
    teacherSelectedSkillIds,
    toggleTeacherSelectedSkill,
    clearTeacherSelectedSkills,
    setWizardPreselection,
  } = usePrototype();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>(String(activeClass.grade));
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [previewSkill, setPreviewSkill] = useState<Skill | null>(null);

  const filteredSkills = useMemo(() => {
    return skills.filter((sk) => {
      if (gradeFilter !== 'all' && String(sk.grade) !== gradeFilter) return false;
      if (topicFilter !== 'all' && sk.topicId !== topicFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          sk.titleFa.toLowerCase().includes(q) ||
          sk.titleEn.toLowerCase().includes(q) ||
          sk.code.toLowerCase().includes(q) ||
          sk.descriptionFa.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [skills, gradeFilter, topicFilter, searchQuery]);

  const sampleQuestions = useMemo(() => {
    if (!previewSkill) return [];
    const matched = QUESTION_BANK.filter((q) => q.skillId === previewSkill.id);
    return matched.length > 0 ? matched : QUESTION_BANK.slice(0, 2);
  }, [previewSkill]);

  const handleCreateAssignmentFromSelection = () => {
    setWizardPreselection({
      skillIds: teacherSelectedSkillIds,
      classId: activeClass.id,
      recipientType: 'whole_class',
      recipientStudentIds: [],
      contextLabelFa: `انتخاب‌شده از کتابخانه مهارت‌ها برای ${activeClass.nameFa}`,
      contextLabelEn: `Selected from Skill Library for ${activeClass.nameEn}`,
    });
    navigate('/teacher/assignments?wizard=1');
  };

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        icon={<BookOpen className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'کتابخانه مهارت‌ها (معلم)', 'Skill Library (Teacher)') },
        ]}
        title={bi(lang, 'کتابخانه مهارت‌ها و بانک محتوای استاندارد', 'Teacher Skill Library')}
        subtitle={bi(
          lang,
          'مرور مهارت‌های رنگ‌بندی‌شده، مشاهده نمونه سؤال‌های استاندارد و انتخاب چند مهارت برای ایجاد تکلیف یا آزمون.',
          'Browse color-coded curriculum skills, inspect sample questions, and multi-select skills for Assignments or Quizzes.'
        )}
        badge={
          <Badge tone="turquoise" icon={<Users className="w-3.5 h-3.5" />}>
            {bi(lang, `کلاس فعال: ${activeClass.nameFa}`, `Context: ${activeClass.nameEn}`)}
          </Badge>
        }
      />

      {/* Product Rule Guardrail Banner: Read-Only Content Bank */}
      <div className="mb-5 p-4 rounded-card bg-surface-sky border border-turquoise-200 flex items-start gap-3 text-xs sm:text-sm text-ink-900">
        <Info className="w-5 h-5 text-turquoise-700 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <strong className="text-brand-900">
            {bi(lang, 'قانون قطعی محتوا در MVP: ', 'Confirmed MVP Content Rule: ')}
          </strong>
          {bi(
            lang,
            'معلم از مهارت‌ها و بانک سؤال آماده روشنا استفاده می‌کند. امکان ساخت سؤال جدید یا ویرایش متن سؤال‌های بانک وجود ندارد.',
            'Teachers select from platform-authored skills and questions. Creating or editing questions is intentionally disabled.'
          )}
        </div>
      </div>

      {/* Filters */}
      <Card padding="md" accentTop="turquoise" className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          <div className="md:col-span-6">
            <SearchInput
              id="tch-skill-search"
              label={bi(lang, 'جست‌وجوی مهارت', 'Search skill')}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={bi(
                lang,
                'عنوان مهارت یا کد استاندارد (مثلاً: جمع کسرها، M6-FR-02)...',
                'Search skill title or code...'
              )}
            />
          </div>
          <div className="md:col-span-3">
            <SelectField
              id="tch-grade-select"
              label={bi(lang, 'پایه تحصیلی', 'Grade')}
              value={gradeFilter}
              onChange={(v) => {
                setGradeFilter(v);
                setTopicFilter('all');
              }}
              options={[
                { value: 'all', label: bi(lang, 'همه پایه‌ها', 'All Grades') },
                { value: '5', label: bi(lang, 'پایه پنجم', 'Grade 5') },
                { value: '6', label: bi(lang, 'پایه ششم', 'Grade 6') },
                { value: '7', label: bi(lang, 'پایه هفتم', 'Grade 7') },
              ]}
            />
          </div>
          <div className="md:col-span-3">
            <SelectField
              id="tch-topic-select"
              label={bi(lang, 'مبحث ریاضی', 'Topic')}
              value={topicFilter}
              onChange={setTopicFilter}
              options={[
                { value: 'all', label: bi(lang, 'همه مباحث', 'All Topics') },
                ...TOPICS.filter(
                  (t) => gradeFilter === 'all' || String(t.grade) === gradeFilter
                ).map((t) => ({
                  value: t.id,
                  label: bi(lang, t.titleFa, t.titleEn),
                })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Multi-Select Tray */}
      {teacherSelectedSkillIds.length > 0 && (
        <div className="mb-5 p-4 rounded-card bg-brand-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-card">
          <div className="text-sm font-bold">
            {lang === 'fa'
              ? `${fmtNum(teacherSelectedSkillIds.length, 'fa')} مهارت برای «${activeClass.nameFa}» انتخاب شده است.`
              : `${teacherSelectedSkillIds.length} skill(s) selected for ${activeClass.nameEn}.`}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/15"
              onClick={clearTeacherSelectedSkills}
            >
              {bi(lang, 'پاک‌کردن انتخاب', 'Clear')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/teacher/quiz-generator')}
              icon={<FileQuestion className="w-4 h-4 text-brand-800" />}
            >
              {bi(lang, 'ارسال به آزمون‌ساز', 'Send to Quiz Generator')}
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={handleCreateAssignmentFromSelection}
              icon={<CheckSquare className="w-4 h-4" />}
            >
              {bi(lang, 'ایجاد تکلیف با این مهارت‌ها', 'Assign Selected Skills')}
            </Button>
          </div>
        </div>
      )}

      {/* Skills List */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          variant="search"
          title={bi(lang, 'مهارتی با این مشخصات یافت نشد', 'No skills match your filter')}
          description={bi(
            lang,
            'فیلتر پایه یا عبارت جست‌وجو را تغییر دهید.',
            'Adjust grade or topic filters to view available skills.'
          )}
          action={
            <Button
              variant="cta"
              onClick={() => {
                setSearchQuery('');
                setGradeFilter('all');
                setTopicFilter('all');
              }}
            >
              {bi(lang, 'نمایش همه مهارت‌ها', 'Reset Filters')}
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredSkills.map((sk) => {
            const top = TOPICS.find((t) => t.id === sk.topicId);
            const theme = getTopicTheme(sk.topicId);
            const isSelected = teacherSelectedSkillIds.includes(sk.id);
            return (
              <Card
                key={sk.id}
                padding="md"
                surfaceTone={isSelected ? 'sky' : 'white'}
                accentTop={isSelected ? 'turquoise' : theme.accentTop}
                className={isSelected ? 'ring-2 ring-turquoise-500/40' : ''}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      id={`chk-${sk.id}`}
                      checked={isSelected}
                      onChange={() => toggleTeacherSelectedSkill(sk.id)}
                      className="mt-1.5 w-4 h-4 rounded border-border text-brand-700 cursor-pointer shrink-0"
                    />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`ltr-token text-xs font-bold px-2.5 py-0.5 rounded-full ${theme.chipClass}`}>
                          {sk.code}
                        </span>
                        <Badge tone="neutral">
                          {bi(lang, `پایه ${fmtNum(sk.grade, 'fa')}`, `Grade ${sk.grade}`)}
                        </Badge>
                        {top && (
                          <span className="typo-caption font-semibold">
                            {bi(lang, top.titleFa, top.titleEn)}
                          </span>
                        )}
                      </div>
                      <label
                        htmlFor={`chk-${sk.id}`}
                        className="typo-card-title block cursor-pointer"
                      >
                        {bi(lang, sk.titleFa, sk.titleEn)}
                      </label>
                      <p className="typo-caption">
                        {bi(lang, sk.descriptionFa, sk.descriptionEn)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewSkill(sk)}
                      icon={<Eye className="w-4 h-4" />}
                    >
                      {bi(lang, 'نمونه سؤال‌ها', 'Sample Questions')}
                    </Button>
                    <Button
                      variant={isSelected ? 'turquoise' : 'primary'}
                      size="sm"
                      onClick={() => toggleTeacherSelectedSkill(sk.id)}
                    >
                      {isSelected
                        ? bi(lang, 'انتخاب‌شده ✓', 'Selected ✓')
                        : bi(lang, 'انتخاب مهارت', 'Select Skill')}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Read-Only Sample Question Inspection Modal */}
      <Modal
        open={Boolean(previewSkill)}
        onClose={() => setPreviewSkill(null)}
        maxWidthClass="max-w-2xl"
        title={
          previewSkill
            ? bi(
                lang,
                `نمونه سؤال‌های بانک سؤال: ${previewSkill.titleFa}`,
                `Sample Questions: ${previewSkill.titleEn}`
              )
            : ''
        }
        footer={
          previewSkill && (
            <>
              <Button variant="secondary" onClick={() => setPreviewSkill(null)}>
                {bi(lang, 'بستن پیش‌نمایش', 'Close')}
              </Button>
              <Button
                variant="cta"
                onClick={() => {
                  if (!teacherSelectedSkillIds.includes(previewSkill.id)) {
                    toggleTeacherSelectedSkill(previewSkill.id);
                  }
                  setPreviewSkill(null);
                }}
              >
                {bi(lang, 'افزودن این مهارت به سبد انتخاب', 'Select This Skill')}
              </Button>
            </>
          )
        }
      >
        {previewSkill && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-control bg-surface-sky border border-turquoise-200 text-xs text-ink-800">
              <span className="inline-flex items-center gap-1.5 font-bold text-brand-900">
                <Lock className="w-3.5 h-3.5 text-turquoise-700" />
                {bi(
                  lang,
                  'حالت فقط مشاهده (Read-only) — ویرایش یا افزودن سؤال در MVP وجود ندارد.',
                  'Read-only inspection — Question authoring/editing is not permitted.'
                )}
              </span>
              <DemoBadge lang={lang} />
            </div>

            {sampleQuestions.map((q, idx) => (
              <Card key={q.id} padding="md" surfaceTone="white" className="space-y-3">
                <div className="flex items-center justify-between text-xs text-ink-600">
                  <span className="font-bold text-brand-800">
                    {bi(lang, `نمونه سؤال ${fmtNum(idx + 1, 'fa')}`, `Sample Question ${idx + 1}`)}
                  </span>
                  <Badge tone="lavender">{q.difficulty}</Badge>
                </div>
                <p className="text-sm font-bold text-ink-900">
                  {bi(lang, q.promptFa, q.promptEn)}
                </p>
                <QuestionVisualDiagram
                  visualType={q.visualType}
                  lang={lang}
                  widthCm={q.visualMeta?.widthCm}
                  heightCm={q.visualMeta?.heightCm}
                />
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-control border ${
                          opt.id === q.correctAnswer
                            ? 'bg-success-100 border-success-600 font-bold text-success-700'
                            : 'bg-canvas border-border text-ink-900'
                        }`}
                      >
                        {bi(lang, opt.labelFa, opt.labelEn)}
                        {opt.id === q.correctAnswer && bi(lang, ' ✓ (پاسخ صحیح)', ' ✓ (Correct)')}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-ink-800 bg-surface-cream p-3 rounded-control border border-accent-200">
                  <strong className="text-brand-900">
                    {bi(lang, 'توضیح حل: ', 'Solution: ')}
                  </strong>
                  {bi(lang, q.explanationFa, q.explanationEn)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </AppShell>
  );
};
