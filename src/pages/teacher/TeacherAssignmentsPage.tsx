import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Eye,
  PlusCircle,
  Send,
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
  Drawer,
  EmptyState,
  ErrorState,
  PageHeader,
  PageSkeleton,
  ProgressBar,
  SearchInput,
  SelectField,
  Tabs,
} from '../../components/ui/Primitives';
import { DEMO_TEACHER_PROFILE, STUDENT_ROSTER } from '../../data/mockData';
import { Assignment, AssignmentStatus } from '../../data/types';
import { bi, fmtNum } from '../../utils/format';

export const TeacherAssignmentsPage: React.FC = () => {
  const {
    lang,
    classes,
    activeClass,
    activeClassId,
    skills,
    assignments,
    addAssignment,
    updateAssignmentStatus,
    wizardPreselection,
    setWizardPreselection,
    clearTeacherSelectedSkills,
    pageSimState,
    setPageSimState,
    showToast,
  } = usePrototype();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab between Assignments List & 5-Step Wizard
  const [activeTab, setActiveTab] = useState<'list' | 'wizard'>(
    searchParams.get('wizard') === '1' || Boolean(wizardPreselection) ? 'wizard' : 'list'
  );

  // List filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inspectedAssignment, setInspectedAssignment] = useState<Assignment | null>(null);

  // 5-Step Wizard State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [wizSkillSearch, setWizSkillSearch] = useState('');
  const [wizSkillIds, setWizSkillIds] = useState<string[]>(
    wizardPreselection?.skillIds?.length ? wizardPreselection.skillIds : ['sk-add-fractions']
  );
  const [wizClassId, setWizClassId] = useState<string>(
    wizardPreselection?.classId ?? activeClassId
  );
  const [wizRecipientType, setWizRecipientType] = useState<'whole_class' | 'selected_students'>(
    wizardPreselection?.recipientType ?? 'whole_class'
  );
  const [wizStudentIds, setWizStudentIds] = useState<string[]>(
    wizardPreselection?.recipientStudentIds ?? []
  );
  const [wizDueIso, setWizDueIso] = useState<string>('2026-11-12');
  const [wizDueTime, setWizDueTime] = useState<string>('19:00');
  const [wizInstructions, setWizInstructions] = useState<string>(
    'لطفاً پیش از انتخاب گزینه، راه‌حل خلاصه را در دفتر تمرین بنویسید.'
  );
  const [wizError, setWizError] = useState<string | null>(null);
  const [simulatePublishError, setSimulatePublishError] = useState<boolean>(false);
  const [publishSuccessDone, setPublishSuccessDone] = useState<boolean>(false);

  useEffect(() => {
    if (wizardPreselection) {
      setActiveTab('wizard');
      if (wizardPreselection.skillIds.length > 0) {
        setWizSkillIds(wizardPreselection.skillIds);
      }
      setWizClassId(wizardPreselection.classId);
      setWizRecipientType(wizardPreselection.recipientType);
      setWizStudentIds(wizardPreselection.recipientStudentIds);
      setStep(wizardPreselection.skillIds.length > 0 ? 2 : 1);
      setPublishSuccessDone(false);
    }
  }, [wizardPreselection]);

  const targetClassObj = classes.find((c) => c.id === wizClassId) ?? activeClass;
  const classStudents = useMemo(
    () => STUDENT_ROSTER.filter((s) => s.classId === wizClassId),
    [wizClassId]
  );

  // Duplicate check: is any selected skill already active for this class?
  const duplicateActiveAssignment = useMemo(() => {
    return assignments.find(
      (a) =>
        a.classId === wizClassId &&
        (a.status === 'in_progress' || a.status === 'assigned') &&
        a.skillIds.some((id) => wizSkillIds.includes(id))
    );
  }, [assignments, wizClassId, wizSkillIds]);

  const validateAndAdvance = (nextStep: 1 | 2 | 3 | 4 | 5) => {
    setWizError(null);

    if (step === 1 && nextStep > 1 && wizSkillIds.length === 0) {
      setWizError(
        bi(
          lang,
          'لطفاً حداقل یک مهارت آموزشی برای تکلیف انتخاب کنید.',
          'Please select at least one skill for this assignment.'
        )
      );
      return;
    }

    if (step === 2 && nextStep > 2) {
      if (wizRecipientType === 'whole_class' && targetClassObj.studentCount === 0) {
        setWizError(
          bi(
            lang,
            'کلاس انتخابی فاقد دانش‌آموز است. کلاسی با دانش‌آموز فعال انتخاب کنید.',
            'Selected class has 0 students. Please choose a class with enrolled students.'
          )
        );
        return;
      }
      if (wizRecipientType === 'selected_students' && wizStudentIds.length === 0) {
        setWizError(
          bi(
            lang,
            'گیرنده‌ای انتخاب نشده است؛ حداقل یک دانش‌آموز را تیک بزنید یا گزینه «کل کلاس» را برگزینید.',
            'No recipients selected. Choose at least one student or select Whole Class.'
          )
        );
        return;
      }
    }

    if (step === 3 && nextStep > 3) {
      // Today is 2026-11-08
      if (!wizDueIso || wizDueIso < '2026-11-08') {
        setWizError(
          bi(
            lang,
            'تاریخ سررسید نامعتبر است؛ موعد تحویل نمی‌تواند در گذشته (پیش از امروز ۱۷ آبان ۱۴۰۵ / 2026-11-08) باشد.',
            'Invalid due date: Deadline cannot be earlier than today (2026-11-08).'
          )
        );
        return;
      }
    }

    setStep(nextStep);
  };

  const handlePublish = () => {
    setWizError(null);
    if (simulatePublishError) {
      setWizError(
        bi(
          lang,
          'خطای شبیه‌سازی‌شده انتشار: ذخیره تکلیف روی سرور انجام نشد. اطلاعات شما حفظ شده است؛ دوباره تلاش کنید.',
          'Simulated publish failure: Could not reach server. Your draft is intact—please retry.'
        )
      );
      return;
    }

    const chosenSkills = skills.filter((s) => wizSkillIds.includes(s.id));
    const recipientCount =
      wizRecipientType === 'whole_class' ? targetClassObj.studentCount : wizStudentIds.length;

    const newAsn: Assignment = {
      id: `asn-${Date.now()}`,
      titleFa:
        chosenSkills.length === 1
          ? `تمرین: ${chosenSkills[0].titleFa}`
          : `مجموعه تمرین (${fmtNum(chosenSkills.length, 'fa')} مهارت): ${chosenSkills[0].titleFa}`,
      titleEn:
        chosenSkills.length === 1
          ? `Practice: ${chosenSkills[0].titleEn}`
          : `Skill Set (${chosenSkills.length}): ${chosenSkills[0].titleEn}`,
      skillIds: wizSkillIds,
      classId: wizClassId,
      recipientType: wizRecipientType,
      recipientStudentIds: wizRecipientType === 'selected_students' ? wizStudentIds : undefined,
      recipientCount,
      teacherNameFa: DEMO_TEACHER_PROFILE.nameFa,
      teacherNameEn: DEMO_TEACHER_PROFILE.nameEn,
      dueDateFa: `${wizDueIso} • ساعت ${wizDueTime}`,
      dueDateEn: `${wizDueIso} • ${wizDueTime}`,
      dueIso: wizDueIso,
      instructionsFa: wizInstructions,
      instructionsEn: wizInstructions,
      status: 'assigned',
      completedCount: 0,
      inProgressCount: 0,
      notStartedCount: recipientCount,
      studentProgressPercent: 0,
    };

    addAssignment(newAsn);
    clearTeacherSelectedSkills();
    setWizardPreselection(null);
    setPublishSuccessDone(true);
    setStep(5);
    showToast(
      'تکلیف جدید با موفقیت منتشر شد و در پیشخوان دانش‌آموزان قابل مشاهده است.',
      'Assignment published and now visible in Student view!',
      'success'
    );
  };

  const filteredAssignments = useMemo(() => {
    if (pageSimState === 'empty') return [];
    return assignments.filter((a) => {
      if (a.classId !== activeClassId) return false;
      if (statusFilter !== 'all' && a.status !== (statusFilter as AssignmentStatus)) return false;
      return true;
    });
  }, [assignments, activeClassId, statusFilter, pageSimState]);

  const stepLabels = [
    { num: 1, fa: '۱. انتخاب مهارت‌ها', en: '1. Select Skills' },
    { num: 2, fa: '۲. انتخاب گیرندگان', en: '2. Recipients' },
    { num: 3, fa: '۳. موعد و راهنما', en: '3. Due Date & Notes' },
    { num: 4, fa: '۴. پیش‌نمایش', en: '4. Review Summary' },
    { num: 5, fa: '۵. انتشار', en: '5. Publish' },
  ];

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'تکالیف', 'Assignments') },
        ]}
        title={bi(lang, 'مدیریت و تخصیص تکالیف', 'Assignments & Creation Wizard')}
        subtitle={bi(
          lang,
          'ایجاد تکلیف مرحله‌به‌مرحله برای کلاس یا گروهی از دانش‌آموزان و پیگیری وضعیت‌های پیشنهادی تکمیل.',
          'Create targeted or whole-class assignments via the 5-step wizard and track completion statuses.'
        )}
        badge={
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="وضعیت‌های تکلیف پیشنهادی‌اند"
            labelEn="Proposed Assignment Statuses"
          />
        }
        actions={
          <Tabs
            activeId={activeTab}
            onChange={(id) => {
              setActiveTab(id as 'list' | 'wizard');
              if (id === 'wizard') {
                setPublishSuccessDone(false);
                setStep(1);
                setSearchParams({ wizard: '1' });
              } else {
                setSearchParams({});
              }
            }}
            tabs={[
              {
                id: 'list',
                label: bi(lang, 'فهرست تکالیف کلاس', 'Class Assignments'),
                count: fmtNum(
                  assignments.filter((a) => a.classId === activeClassId).length,
                  lang
                ),
              },
              {
                id: 'wizard',
                label: bi(lang, '+ ایجاد تکلیف جدید (۵ گام)', '+ New Assignment Wizard'),
              },
            ]}
          />
        }
      />

      {pageSimState === 'loading' && <PageSkeleton />}
      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'بارگذاری تکالیف انجام نشد', 'Failed to load assignments')}
          description={bi(lang, 'لطفاً اتصال را بررسی و دوباره تلاش کنید.', 'Please retry.')}
          retryLabel={bi(lang, 'تلاش مجدد', 'Retry')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && activeTab === 'list' && (
        <div className="space-y-4">
          <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3">
            <SelectField
              id="asn-status-filter"
              label={bi(lang, 'فیلتر وضعیت پیشنهادی تکلیف', 'Filter by Proposed Status')}
              value={statusFilter}
              onChange={setStatusFilter}
              className="min-w-[240px]"
              options={[
                { value: 'all', label: bi(lang, 'همه وضعیت‌ها', 'All Statuses') },
                { value: 'upcoming', label: bi(lang, 'پیش‌رو (Upcoming)', 'Upcoming') },
                { value: 'assigned', label: bi(lang, 'تخصیص‌یافته (Assigned)', 'Assigned') },
                { value: 'in_progress', label: bi(lang, 'در حال انجام (In Progress)', 'In Progress') },
                { value: 'overdue', label: bi(lang, 'دیرشده (Overdue)', 'Overdue') },
                { value: 'completed', label: bi(lang, 'تکمیل‌شده (Completed)', 'Completed') },
                {
                  value: 'completed_late',
                  label: bi(lang, 'تکمیل با تأخیر (Completed Late)', 'Completed Late'),
                },
                { value: 'cancelled', label: bi(lang, 'لغوشده (Cancelled)', 'Cancelled') },
              ]}
            />
            <Button
              variant="primary"
              onClick={() => {
                setPublishSuccessDone(false);
                setStep(1);
                setActiveTab('wizard');
              }}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              {bi(lang, 'تخصیص تکلیف جدید', 'Create New Assignment')}
            </Button>
          </Card>

          {filteredAssignments.length === 0 ? (
            <EmptyState
              variant="classroom"
              title={bi(lang, 'تکلیفی برای این کلاس یا وضعیت یافت نشد', 'No assignments found')}
              description={bi(
                lang,
                'می‌توانید فیلتر وضعیت را تغییر دهید یا از ویزارد ۵ مرحله‌ای یک تکلیف تازه بسازید.',
                'Change the status filter or create a new assignment using the 5-step wizard.'
              )}
              action={
                <Button
                  variant="primary"
                  onClick={() => {
                    setStatusFilter('all');
                    setPageSimState('normal');
                    setActiveTab('wizard');
                  }}
                >
                  {bi(lang, 'شروع ویزارد ایجاد تکلیف', 'Open Assignment Wizard')}
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map((asn) => {
                const pct = Math.round(
                  (asn.completedCount / Math.max(1, asn.recipientCount)) * 100
                );
                return (
                  <Card key={asn.id} padding="md">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <AssignmentStatusPill status={asn.status} lang={lang} />
                          <Badge tone="neutral">
                            {asn.recipientType === 'whole_class'
                              ? bi(
                                  lang,
                                  `کل کلاس (${fmtNum(asn.recipientCount, 'fa')} نفر)`,
                                  `Whole Class (${asn.recipientCount})`
                                )
                              : bi(
                                  lang,
                                  `گروه هدفمند (${fmtNum(asn.recipientCount, 'fa')} نفر)`,
                                  `Selected Students (${asn.recipientCount})`
                                )}
                          </Badge>
                          <span className="typo-caption inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {bi(lang, asn.dueDateFa, asn.dueDateEn)}
                          </span>
                        </div>
                        <h3 className="typo-card-title">{bi(lang, asn.titleFa, asn.titleEn)}</h3>
                        <p className="typo-caption">{bi(lang, asn.instructionsFa, asn.instructionsEn)}</p>
                      </div>

                      <div className="lg:w-72 shrink-0 flex items-center gap-3">
                        <div className="flex-1">
                          <ProgressBar
                            value={pct}
                            lang={lang}
                            label={
                              lang === 'fa'
                                ? `${fmtNum(asn.completedCount, 'fa')} از ${fmtNum(asn.recipientCount, 'fa')} تکمیل`
                                : `${asn.completedCount}/${asn.recipientCount} done`
                            }
                          />
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setInspectedAssignment(asn)}
                          icon={<Eye className="w-4 h-4" />}
                        >
                          {bi(lang, 'جزئیات', 'Details')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5-Step Assignment Wizard */}
      {pageSimState !== 'loading' && pageSimState !== 'error' && activeTab === 'wizard' && (
        <div className="space-y-5">
          {wizardPreselection?.contextLabelFa && (
            <div className="p-3.5 rounded-card bg-brand-50 border border-brand-200 text-xs sm:text-sm text-brand-700 font-semibold flex items-center justify-between gap-2">
              <span>
                {bi(
                  lang,
                  wizardPreselection.contextLabelFa,
                  wizardPreselection.contextLabelEn ?? ''
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWizardPreselection(null)}
              >
                {bi(lang, 'پاک‌کردن پیش‌فرض', 'Clear Preset')}
              </Button>
            </div>
          )}

          {/* Stepper Indicator */}
          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stepLabels.map((s) => {
              const active = step === s.num;
              const done = step > s.num || publishSuccessDone;
              return (
                <li
                  key={s.num}
                  className={`p-3 rounded-card border text-xs font-semibold flex items-center gap-2 ${
                    active
                      ? 'border-brand-700 bg-brand-100 text-brand-700'
                      : done
                        ? 'border-success-600/40 bg-success-100/50 text-success-600'
                        : 'border-border bg-surface text-ink-600'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-surface border border-current flex items-center justify-center text-[11px] shrink-0">
                      {fmtNum(s.num, lang)}
                    </span>
                  )}
                  <span className="truncate">{bi(lang, s.fa, s.en)}</span>
                </li>
              );
            })}
          </ol>

          {wizError && (
            <div
              role="alert"
              className="p-4 rounded-card bg-danger-100 border border-danger-600/40 text-danger-600 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{wizError}</span>
            </div>
          )}

          {/* Step 1: Select Skills */}
          {step === 1 && (
            <Card padding="lg" className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="typo-section-title">
                    {bi(lang, 'گام ۱: انتخاب مهارت‌های تکلیف', 'Step 1: Select Skills')}
                  </h2>
                  <p className="typo-caption">
                    {bi(
                      lang,
                      'یک یا چند مهارت استاندارد از بانک روشنا انتخاب کنید.',
                      'Choose one or more skills from the Roshana curriculum bank.'
                    )}
                  </p>
                </div>
                <Badge tone="brand">
                  {fmtNum(wizSkillIds.length, lang)} {bi(lang, 'مهارت انتخاب‌شده', 'selected')}
                </Badge>
              </div>

              <SearchInput
                id="wiz-skill-search"
                label={bi(lang, 'جست‌وجوی مهارت', 'Search skill')}
                value={wizSkillSearch}
                onChange={setWizSkillSearch}
                placeholder={bi(lang, 'فیلتر سریع عنوان مهارت...', 'Filter skills...')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                {skills
                  .filter(
                    (s) =>
                      !wizSkillSearch.trim() ||
                      s.titleFa.includes(wizSkillSearch) ||
                      s.titleEn.toLowerCase().includes(wizSkillSearch.toLowerCase())
                  )
                  .map((sk) => {
                    const checked = wizSkillIds.includes(sk.id);
                    return (
                      <label
                        key={sk.id}
                        className={`p-3.5 rounded-card border cursor-pointer flex items-start gap-3 transition-colors ${
                          checked
                            ? 'border-brand-700 bg-brand-50'
                            : 'border-border bg-surface hover:bg-canvas'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setWizSkillIds((prev) =>
                              prev.includes(sk.id)
                                ? prev.filter((id) => id !== sk.id)
                                : [...prev, sk.id]
                            )
                          }
                          className="mt-1 w-4 h-4 rounded text-brand-700"
                        />
                        <div className="text-sm">
                          <div className="font-semibold text-ink-900">
                            {bi(lang, sk.titleFa, sk.titleEn)}
                          </div>
                          <div className="text-xs text-ink-600 mt-0.5">
                            <span className="ltr-token">{sk.code}</span> •{' '}
                            {bi(lang, `پایه ${fmtNum(sk.grade, 'fa')}`, `Grade ${sk.grade}`)}
                          </div>
                        </div>
                      </label>
                    );
                  })}
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <Button variant="primary" onClick={() => validateAndAdvance(2)}>
                  {bi(lang, 'ادامه به گام ۲: انتخاب گیرندگان', 'Next: Select Recipients')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Select Class or Individual Students */}
          {step === 2 && (
            <Card padding="lg" className="space-y-5">
              <div>
                <h2 className="typo-section-title">
                  {bi(lang, 'گام ۲: انتخاب کلاس یا دانش‌آموزان گیرنده', 'Step 2: Select Recipients')}
                </h2>
                <p className="typo-caption">
                  {bi(
                    lang,
                    'می‌توانید تکلیف را برای تمام دانش‌آموزان کلاس یا فقط گروه منتخبی (مثلاً برای تمرین جبرانی) ارسال کنید.',
                    'Assign to the entire class or pick individual students for differentiated practice.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  id="wiz-class-select"
                  label={bi(lang, 'انتخاب کلاس هدف', 'Target Class')}
                  value={wizClassId}
                  onChange={(v) => {
                    setWizClassId(v);
                    setWizStudentIds([]);
                  }}
                  options={classes.map((c) => ({
                    value: c.id,
                    label: `${bi(lang, c.nameFa, c.nameEn)} (${fmtNum(c.studentCount, lang)} ${bi(lang, 'نفر', 'students')})`,
                  }))}
                />

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-ink-600 block">
                    {bi(lang, 'نوع گیرندگان', 'Recipient Mode')}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWizRecipientType('whole_class')}
                      className={`min-h-[42px] px-3 rounded-control border text-xs sm:text-sm font-semibold ${
                        wizRecipientType === 'whole_class'
                          ? 'border-brand-700 bg-brand-100 text-brand-700'
                          : 'border-border bg-surface text-ink-600'
                      }`}
                    >
                      {bi(lang, 'کل کلاس', 'Whole Class')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizRecipientType('selected_students')}
                      className={`min-h-[42px] px-3 rounded-control border text-xs sm:text-sm font-semibold ${
                        wizRecipientType === 'selected_students'
                          ? 'border-brand-700 bg-brand-100 text-brand-700'
                          : 'border-border bg-surface text-ink-600'
                      }`}
                    >
                      {bi(lang, 'انتخاب فردی دانش‌آموزان', 'Specific Students')}
                    </button>
                  </div>
                </div>
              </div>

              {wizRecipientType === 'selected_students' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-ink-600">
                    <span>
                      {lang === 'fa'
                        ? `${fmtNum(wizStudentIds.length, 'fa')} دانش‌آموز انتخاب شده است (برای تست خطای عدم انتخاب، همه را بردارید)`
                        : `${wizStudentIds.length} students selected (uncheck all to test empty-recipient validation)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWizStudentIds([])}
                      className="text-brand-700 font-semibold hover:underline"
                    >
                      {bi(lang, 'پاک‌کردن تیک‌ها', 'Uncheck All')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 rounded-card bg-canvas border border-border">
                    {classStudents.map((stu) => {
                      const checked = wizStudentIds.includes(stu.id);
                      return (
                        <label
                          key={stu.id}
                          className={`p-2.5 rounded-control border text-xs font-medium flex items-center gap-2 cursor-pointer ${
                            checked
                              ? 'bg-brand-100 border-brand-700 text-brand-700 font-semibold'
                              : 'bg-surface border-border text-ink-900'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setWizStudentIds((prev) =>
                                prev.includes(stu.id)
                                  ? prev.filter((id) => id !== stu.id)
                                  : [...prev, stu.id]
                              )
                            }
                            className="w-4 h-4 rounded"
                          />
                          <span>{bi(lang, stu.nameFa, stu.nameEn)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-border">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  {bi(lang, 'بازگشت به گام ۱', 'Back')}
                </Button>
                <Button variant="primary" onClick={() => validateAndAdvance(3)}>
                  {bi(lang, 'ادامه به گام ۳: موعد تحویل', 'Next: Due Date & Instructions')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Due Date & Instructions + Duplicate Warning & Invalid Date test */}
          {step === 3 && (
            <Card padding="lg" className="space-y-5">
              <div>
                <h2 className="typo-section-title">
                  {bi(lang, 'گام ۳: تعیین موعد تحویل و راهنمای دانش‌آموز', 'Step 3: Due Date & Instructions')}
                </h2>
                <p className="typo-caption">
                  {bi(
                    lang,
                    'تاریخ و ساعت مهلت تمرین و پیام راهنما را مشخص کنید.',
                    'Set the submission deadline and optional teacher guidance.'
                  )}
                </p>
              </div>

              {/* Duplicate Assignment Warning State */}
              {duplicateActiveAssignment && (
                <div className="p-4 rounded-card bg-warning-100/70 border border-warning-600/40 flex items-start gap-3 text-xs sm:text-sm text-ink-900">
                  <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-warning-600 block">
                      {bi(
                        lang,
                        'هشدار تکلیف تکراری فعال در همین کلاس:',
                        'Duplicate Active Assignment Warning:'
                      )}
                    </strong>
                    <span>
                      {bi(
                        lang,
                        `مهارت انتخابی هم‌اکنون در تکلیف فعال «${duplicateActiveAssignment.titleFa}» برای این کلاس باز است. در صورت ادامه، یک تکلیف جدید مستقل ثبت می‌شود.`,
                        `A selected skill is already active in "${duplicateActiveAssignment.titleEn}". Proceeding will create an additional assignment.`
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wiz-due-date" className="block text-xs font-semibold text-ink-600 mb-1">
                    {bi(lang, 'تاریخ سررسید (امروز: 2026-11-08)', 'Due Date (Today: 2026-11-08)')}
                  </label>
                  <input
                    id="wiz-due-date"
                    type="date"
                    dir="ltr"
                    value={wizDueIso}
                    onChange={(e) => {
                      setWizDueIso(e.target.value);
                      setWizError(null);
                    }}
                    className="w-full min-h-[42px] px-3 py-2 bg-surface border border-border rounded-control text-sm ltr-token"
                  />
                  <button
                    type="button"
                    onClick={() => setWizDueIso('2026-10-01')}
                    className="mt-1.5 text-xs text-brand-700 hover:underline"
                  >
                    {bi(lang, 'تست سریع خطای تاریخ گذشته (نامعتبر)', 'Test invalid past date')}
                  </button>
                </div>

                <div>
                  <label htmlFor="wiz-due-time" className="block text-xs font-semibold text-ink-600 mb-1">
                    {bi(lang, 'ساعت پایان مهلت', 'Due Time')}
                  </label>
                  <input
                    id="wiz-due-time"
                    type="time"
                    dir="ltr"
                    value={wizDueTime}
                    onChange={(e) => setWizDueTime(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 bg-surface border border-border rounded-control text-sm ltr-token"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="wiz-notes" className="block text-xs font-semibold text-ink-600 mb-1">
                  {bi(lang, 'دستورالعمل و نکته آموزشی برای دانش‌آموزان (اختیاری)', 'Instructions for Students')}
                </label>
                <textarea
                  id="wiz-notes"
                  rows={3}
                  value={wizInstructions}
                  onChange={(e) => setWizInstructions(e.target.value)}
                  className="w-full p-3 bg-surface border border-border rounded-control text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  {bi(lang, 'بازگشت به گام ۲', 'Back')}
                </Button>
                <Button variant="primary" onClick={() => validateAndAdvance(4)}>
                  {bi(lang, 'ادامه به گام ۴: پیش‌نمایش خلاصه', 'Next: Review Summary')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Pre-Publish Summary («چه مهارت‌هایی، برای چه کسانی و تا چه زمانی») */}
          {step === 4 && (
            <Card padding="lg" className="space-y-5">
              <div>
                <h2 className="typo-section-title">
                  {bi(
                    lang,
                    'گام ۴: پیش‌نمایش و جمع‌بندی نهایی پیش از انتشار',
                    'Step 4: Pre-Publish Review Summary'
                  )}
                </h2>
                <p className="typo-caption">
                  {bi(
                    lang,
                    'پیش از انتشار نهایی، خلاصه دقیق «چه مهارت‌هایی، برای چه کسانی و تا چه زمانی» را بررسی کنید.',
                    'Confirm which skills, for whom, and by when before publishing.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-card bg-brand-50 border border-brand-200 space-y-1.5">
                  <span className="text-xs font-bold text-brand-700 block">
                    {bi(lang, '۱. چه مهارت‌هایی؟', '1. Which Skills?')}
                  </span>
                  <ul className="text-sm font-semibold text-ink-900 space-y-1">
                    {skills
                      .filter((s) => wizSkillIds.includes(s.id))
                      .map((sk) => (
                        <li key={sk.id} className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-brand-700 shrink-0" />
                          <span>{bi(lang, sk.titleFa, sk.titleEn)}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="p-4 rounded-card bg-brand-50 border border-brand-200 space-y-1.5">
                  <span className="text-xs font-bold text-brand-700 block">
                    {bi(lang, '۲. برای چه کسانی؟', '2. For Whom?')}
                  </span>
                  <div className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-700" />
                    <span>{bi(lang, targetClassObj.nameFa, targetClassObj.nameEn)}</span>
                  </div>
                  <p className="text-xs text-ink-600">
                    {wizRecipientType === 'whole_class'
                      ? bi(
                          lang,
                          `تمام اعضای کلاس (${fmtNum(targetClassObj.studentCount, 'fa')} دانش‌آموز)`,
                          `Entire class (${targetClassObj.studentCount} students)`
                        )
                      : bi(
                          lang,
                          `${fmtNum(wizStudentIds.length, 'fa')} دانش‌آموز منتخب`,
                          `${wizStudentIds.length} selected students`
                        )}
                  </p>
                </div>

                <div className="p-4 rounded-card bg-brand-50 border border-brand-200 space-y-1.5">
                  <span className="text-xs font-bold text-brand-700 block">
                    {bi(lang, '۳. تا چه زمانی؟', '3. By When?')}
                  </span>
                  <div className="text-sm font-semibold text-ink-900 ltr-token">
                    {wizDueIso} • {wizDueTime}
                  </div>
                  <p className="text-xs text-ink-600">
                    {bi(lang, 'وضعیت اولیه: تخصیص‌یافته (پیشنهادی)', 'Initial status: Assigned')}
                  </p>
                </div>
              </div>

              {wizInstructions && (
                <div className="p-3.5 rounded-control bg-canvas border border-border text-sm">
                  <strong className="text-ink-900">
                    {bi(lang, 'پیام معلم به دانش‌آموز: ', 'Teacher instructions: ')}
                  </strong>
                  <span className="text-ink-600">{wizInstructions}</span>
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-xs text-ink-600 cursor-pointer p-2.5 rounded bg-canvas border border-border">
                <input
                  type="checkbox"
                  checked={simulatePublishError}
                  onChange={(e) => {
                    setSimulatePublishError(e.target.checked);
                    setWizError(null);
                  }}
                  className="rounded"
                />
                <span>
                  {bi(
                    lang,
                    'شبیه‌سازی خطای شبکه در لحظه انتشار (جهت تست پایداری UX)',
                    'Simulate network failure on Publish (UX test)'
                  )}
                </span>
              </label>

              <div className="flex justify-between pt-3 border-t border-border">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  {bi(lang, 'بازگشت و ویرایش', 'Back to Edit')}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePublish}
                  icon={<Send className="w-4 h-4 rtl-flip" />}
                >
                  {bi(lang, 'گام ۵: تأیید و انتشار تکلیف', 'Publish Assignment')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 5: Published Confirmation */}
          {step === 5 && publishSuccessDone && (
            <Card padding="lg" className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-success-100 text-success-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="typo-section-title">
                {bi(lang, 'تکلیف با موفقیت برای دانش‌آموزان منتشر شد!', 'Assignment Published Successfully!')}
              </h2>
              <p className="typo-body text-ink-600 max-w-lg mx-auto">
                {bi(
                  lang,
                  'اکنون این تکلیف در فهرست تکالیف کلاس ثبت شده و اگر از نوار پیش‌نمایش بالا به نمای «دانش‌آموز (آوا)» بروید، بلافاصله قابل مشاهده است.',
                  'Added to class assignments—and immediately visible if you switch the Preview Role Switcher to Student (Ava).'
                )}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    setActiveTab('list');
                    setSearchParams({});
                  }}
                >
                  {bi(lang, 'مشاهده در فهرست تکالیف کلاس', 'View in Class Assignments')}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPublishSuccessDone(false);
                    setStep(1);
                  }}
                >
                  {bi(lang, 'ایجاد یک تکلیف دیگر', 'Create Another Assignment')}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Assignment Detail & Open-Policy Status Drawer */}
      <Drawer
        open={Boolean(inspectedAssignment)}
        onClose={() => setInspectedAssignment(null)}
        title={
          inspectedAssignment
            ? bi(lang, inspectedAssignment.titleFa, inspectedAssignment.titleEn)
            : ''
        }
      >
        {inspectedAssignment && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <AssignmentStatusPill status={inspectedAssignment.status} lang={lang} />
              <DemoBadge lang={lang} />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-card bg-success-100/60 border border-success-600/30">
                <div className="text-lg font-bold text-success-600">
                  {fmtNum(inspectedAssignment.completedCount, lang)}
                </div>
                <div className="text-xs text-ink-600">{bi(lang, 'تکمیل‌شده', 'Completed')}</div>
              </div>
              <div className="p-3 rounded-card bg-brand-50 border border-brand-200">
                <div className="text-lg font-bold text-brand-700">
                  {fmtNum(inspectedAssignment.inProgressCount, lang)}
                </div>
                <div className="text-xs text-ink-600">{bi(lang, 'در حال انجام', 'In Progress')}</div>
              </div>
              <div className="p-3 rounded-card bg-canvas border border-border">
                <div className="text-lg font-bold text-ink-900">
                  {fmtNum(inspectedAssignment.notStartedCount, lang)}
                </div>
                <div className="text-xs text-ink-600">{bi(lang, 'شروع‌نشده', 'Not Started')}</div>
              </div>
            </div>

            {/* Unresolved Product Policy Notice on Editing/Cancelling Started Assignments */}
            <div className="p-4 rounded-card bg-warning-100/55 border border-warning-600/35 space-y-2 text-xs text-ink-900">
              <strong className="text-warning-600 block">
                {bi(
                  lang,
                  'تصمیم باز محصول (سیاست ویرایش/لغو پس از شروع دانش‌آموز):',
                  'Open Product Policy (Editing/Cancelling After Student Start):'
                )}
              </strong>
              <p className="leading-relaxed">
                {bi(
                  lang,
                  'قواعد دقیق اینکه اگر دانش‌آموزی تمرین را شروع کرده باشد با لغو یا تغییر موعد تکلیف چه اتفاقی برای پیشرفت او می‌افتد، هنوز مصوب نشده است. کنترل زیر صرفاً نمایشی است:',
                  'Exact behavior when cancelling or modifying an assignment already started by students is pending product approval. The status switch below is demo-only:'
                )}
              </p>
              {inspectedAssignment.status !== 'cancelled' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    updateAssignmentStatus(inspectedAssignment.id, 'cancelled');
                    setInspectedAssignment({ ...inspectedAssignment, status: 'cancelled' });
                    showToast(
                      'وضعیت تکلیف به‌صورت نمایشی به «لغوشده» تغییر یافت.',
                      'Demo status updated to Cancelled.',
                      'warning'
                    );
                  }}
                >
                  {bi(lang, 'تغییر نمایشی به «لغوشده»', 'Demo: Mark Cancelled')}
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </AppShell>
  );
};
