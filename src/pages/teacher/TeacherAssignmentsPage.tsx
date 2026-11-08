import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
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
import { getTopicTheme } from '../../utils/theme';

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

  const [activeTab, setActiveTab] = useState<'list' | 'wizard'>(
    searchParams.get('wizard') === '1' || Boolean(wizardPreselection) ? 'wizard' : 'list'
  );

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
    { num: 1, fa: '۱. مهارت‌ها', en: '1. Skills' },
    { num: 2, fa: '۲. گیرندگان', en: '2. Recipients' },
    { num: 3, fa: '۳. موعد و راهنما', en: '3. Due Date' },
    { num: 4, fa: '۴. پیش‌نمایش', en: '4. Review' },
    { num: 5, fa: '۵. انتشار', en: '5. Publish' },
  ];

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        icon={<CheckSquare className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'مدیریت تکالیف', 'Assignments') },
        ]}
        title={bi(lang, 'مدیریت و تخصیص تکالیف', 'Assignments & Creation Wizard')}
        subtitle={bi(
          lang,
          'ایجاد تکلیف ۵ مرحله‌ای برای کل کلاس یا گروهی از دانش‌آموزان و پیگیری وضعیت تکمیل.',
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
                label: bi(lang, '+ ایجاد تکلیف جدید', '+ New Assignment'),
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
          <Card
            padding="md"
            surfaceTone="sky"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
          >
            <SelectField
              id="asn-status-filter"
              label={bi(lang, 'فیلتر وضعیت پیشنهادی تکلیف', 'Filter by Proposed Status')}
              value={statusFilter}
              onChange={setStatusFilter}
              className="sm:min-w-[260px]"
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
              variant="cta"
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
                  variant="cta"
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
            <div className="space-y-3.5">
              {filteredAssignments.map((asn) => {
                const pct = Math.round(
                  (asn.completedCount / Math.max(1, asn.recipientCount)) * 100
                );
                const isOverdue = asn.status === 'overdue';
                const isCompleted = asn.status === 'completed';
                return (
                  <Card
                    key={asn.id}
                    padding="md"
                    surfaceTone={isOverdue ? 'coral' : isCompleted ? 'mint' : 'white'}
                    accentTop={
                      isOverdue
                        ? 'coral'
                        : isCompleted
                          ? 'success'
                          : asn.status === 'assigned'
                            ? 'orange'
                            : 'turquoise'
                    }
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <AssignmentStatusPill status={asn.status} lang={lang} />
                          <Badge tone={asn.recipientType === 'whole_class' ? 'turquoise' : 'lavender'}>
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
                          <span className="typo-caption font-semibold inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-700" />
                            {bi(lang, asn.dueDateFa, asn.dueDateEn)}
                          </span>
                        </div>
                        <h3 className="typo-card-title text-lg">
                          {bi(lang, asn.titleFa, asn.titleEn)}
                        </h3>
                        <p className="typo-caption">
                          {bi(lang, asn.instructionsFa, asn.instructionsEn)}
                        </p>
                      </div>

                      <div className="lg:w-80 shrink-0 flex flex-col sm:flex-row lg:items-center gap-3 p-3.5 rounded-card bg-surface border border-border">
                        <div className="flex-1">
                          <ProgressBar
                            value={pct}
                            lang={lang}
                            tone={isOverdue ? 'coral' : isCompleted ? 'success' : 'turquoise'}
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
            <div className="p-3.5 rounded-card bg-surface-apricot border border-orange-200 text-xs sm:text-sm text-orange-700 font-bold flex flex-wrap items-center justify-between gap-2">
              <span>
                {bi(
                  lang,
                  wizardPreselection.contextLabelFa,
                  wizardPreselection.contextLabelEn ?? ''
                )}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setWizardPreselection(null)}>
                {bi(lang, 'پاک‌کردن پیش‌فرض', 'Clear Preset')}
              </Button>
            </div>
          )}

          {/* Colorful 5-Step Stepper */}
          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stepLabels.map((s) => {
              const active = step === s.num;
              const done = step > s.num || publishSuccessDone;
              return (
                <li
                  key={s.num}
                  className={`p-3 rounded-card border-2 text-xs font-bold flex items-center gap-2 transition-colors ${
                    active
                      ? 'border-turquoise-500 bg-surface-sky text-brand-900 shadow-xs'
                      : done
                        ? 'border-success-500/45 bg-surface-mint text-success-700'
                        : 'border-border bg-surface text-ink-600'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-success-600" />
                  ) : (
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                        active ? 'bg-turquoise-500 text-brand-950' : 'bg-canvas border border-border'
                      }`}
                    >
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
              className="p-4 rounded-card bg-coral-100 border border-coral-200 text-coral-700 text-sm font-semibold flex items-start gap-2.5"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{wizError}</span>
            </div>
          )}

          {/* Step 1: Select Skills */}
          {step === 1 && (
            <Card padding="lg" accentTop="turquoise" className="space-y-4">
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
                <Badge tone="turquoise">
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
                    const theme = getTopicTheme(sk.topicId);
                    return (
                      <label
                        key={sk.id}
                        className={`p-3.5 rounded-card border-2 cursor-pointer flex items-start gap-3 transition-colors ${
                          checked
                            ? 'border-turquoise-500 bg-surface-sky'
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
                          <div className="font-bold text-ink-900">
                            {bi(lang, sk.titleFa, sk.titleEn)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ink-600 mt-1">
                            <span className={`ltr-token px-2 py-0.5 rounded-full font-bold text-[11px] ${theme.chipClass}`}>
                              {sk.code}
                            </span>
                            <span>
                              {bi(lang, `پایه ${fmtNum(sk.grade, 'fa')}`, `Grade ${sk.grade}`)}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
              </div>

              <div className="flex justify-end pt-3 border-t border-border">
                <Button variant="cta" onClick={() => validateAndAdvance(2)}>
                  {bi(lang, 'ادامه به گام ۲: انتخاب گیرندگان', 'Next: Select Recipients')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Select Class or Individual Students */}
          {step === 2 && (
            <Card padding="lg" accentTop="lavender" className="space-y-5">
              <div>
                <h2 className="typo-section-title">
                  {bi(lang, 'گام ۲: انتخاب کلاس یا دانش‌آموزان گیرنده', 'Step 2: Select Recipients')}
                </h2>
                <p className="typo-caption">
                  {bi(
                    lang,
                    'تکلیف را برای تمام دانش‌آموزان کلاس یا فقط گروه منتخبی ارسال کنید.',
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
                      className={`min-h-[44px] px-3 rounded-control border-2 text-xs sm:text-sm font-bold ${
                        wizRecipientType === 'whole_class'
                          ? 'border-turquoise-500 bg-surface-sky text-brand-900'
                          : 'border-border bg-surface text-ink-600'
                      }`}
                    >
                      {bi(lang, 'کل کلاس', 'Whole Class')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizRecipientType('selected_students')}
                      className={`min-h-[44px] px-3 rounded-control border-2 text-xs sm:text-sm font-bold ${
                        wizRecipientType === 'selected_students'
                          ? 'border-lavender-500 bg-surface-lavender text-lavender-700'
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
                        ? `${fmtNum(wizStudentIds.length, 'fa')} دانش‌آموز انتخاب شده است`
                        : `${wizStudentIds.length} students selected`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWizStudentIds([])}
                      className="text-brand-700 font-bold hover:underline"
                    >
                      {bi(lang, 'پاک‌کردن تیک‌ها', 'Uncheck All')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2.5 rounded-card bg-surface-lavender/50 border border-lavender-200">
                    {classStudents.map((stu) => {
                      const checked = wizStudentIds.includes(stu.id);
                      return (
                        <label
                          key={stu.id}
                          className={`p-2.5 rounded-control border text-xs font-medium flex items-center gap-2 cursor-pointer ${
                            checked
                              ? 'bg-lavender-100 border-lavender-500 text-lavender-700 font-bold'
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
                <Button variant="cta" onClick={() => validateAndAdvance(3)}>
                  {bi(lang, 'ادامه به گام ۳: موعد تحویل', 'Next: Due Date & Instructions')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Due Date & Instructions */}
          {step === 3 && (
            <Card padding="lg" accentTop="orange" className="space-y-5">
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

              {duplicateActiveAssignment && (
                <div className="p-4 rounded-card bg-surface-apricot border border-orange-200 flex items-start gap-3 text-xs sm:text-sm text-ink-900">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-orange-700 block">
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
                    className="w-full min-h-[44px] px-3 py-2 bg-surface border border-border-strong rounded-control text-sm ltr-token"
                  />
                  <button
                    type="button"
                    onClick={() => setWizDueIso('2026-10-01')}
                    className="mt-1.5 text-xs font-semibold text-orange-700 hover:underline"
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
                    className="w-full min-h-[44px] px-3 py-2 bg-surface border border-border-strong rounded-control text-sm ltr-token"
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
                  className="w-full p-3 bg-surface border border-border-strong rounded-control text-sm text-ink-900 focus:border-turquoise-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  {bi(lang, 'بازگشت به گام ۲', 'Back')}
                </Button>
                <Button variant="cta" onClick={() => validateAndAdvance(4)}>
                  {bi(lang, 'ادامه به گام ۴: پیش‌نمایش خلاصه', 'Next: Review Summary')}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Pre-Publish Summary */}
          {step === 4 && (
            <Card padding="lg" accentTop="success" className="space-y-5">
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
                    'خلاصه دقیق «چه مهارت‌هایی، برای چه کسانی و تا چه زمانی» را بررسی کنید.',
                    'Confirm which skills, for whom, and by when before publishing.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-card bg-surface-sky border border-turquoise-200 space-y-1.5">
                  <span className="text-xs font-bold text-turquoise-700 block">
                    {bi(lang, '۱. چه مهارت‌هایی؟', '1. Which Skills?')}
                  </span>
                  <ul className="text-sm font-bold text-ink-900 space-y-1">
                    {skills
                      .filter((s) => wizSkillIds.includes(s.id))
                      .map((sk) => (
                        <li key={sk.id} className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-turquoise-700 shrink-0" />
                          <span>{bi(lang, sk.titleFa, sk.titleEn)}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="p-4 rounded-card bg-surface-lavender border border-lavender-200 space-y-1.5">
                  <span className="text-xs font-bold text-lavender-700 block">
                    {bi(lang, '۲. برای چه کسانی؟', '2. For Whom?')}
                  </span>
                  <div className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-lavender-700" />
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

                <div className="p-4 rounded-card bg-surface-apricot border border-orange-200 space-y-1.5">
                  <span className="text-xs font-bold text-orange-700 block">
                    {bi(lang, '۳. تا چه زمانی؟', '3. By When?')}
                  </span>
                  <div className="text-sm font-bold text-ink-900 ltr-token">
                    {wizDueIso} • {wizDueTime}
                  </div>
                  <p className="text-xs text-ink-600">
                    {bi(lang, 'وضعیت اولیه: تخصیص‌یافته (پیشنهادی)', 'Initial status: Assigned')}
                  </p>
                </div>
              </div>

              {wizInstructions && (
                <div className="p-3.5 rounded-control bg-surface-cream border border-accent-200 text-sm">
                  <strong className="text-brand-900">
                    {bi(lang, 'پیام معلم به دانش‌آموز: ', 'Teacher instructions: ')}
                  </strong>
                  <span className="text-ink-800">{wizInstructions}</span>
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-xs text-ink-600 cursor-pointer p-2.5 rounded-control bg-canvas border border-border">
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

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-3 border-t border-border">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  {bi(lang, 'بازگشت و ویرایش', 'Back to Edit')}
                </Button>
                <Button
                  variant="cta"
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
            <Card padding="lg" surfaceTone="mint" accentTop="success" className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-success-500 text-white flex items-center justify-center mx-auto shadow-xs">
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
                  variant="cta"
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

      {/* Assignment Detail Drawer */}
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
              <div className="p-3 rounded-card bg-surface-mint border border-success-200">
                <div className="text-lg font-bold text-success-700">
                  {fmtNum(inspectedAssignment.completedCount, lang)}
                </div>
                <div className="text-xs text-ink-600">{bi(lang, 'تکمیل‌شده', 'Completed')}</div>
              </div>
              <div className="p-3 rounded-card bg-surface-sky border border-turquoise-200">
                <div className="text-lg font-bold text-turquoise-700">
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

            <div className="p-4 rounded-card bg-surface-apricot border border-orange-200 space-y-2 text-xs text-ink-900">
              <strong className="text-orange-700 block">
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
