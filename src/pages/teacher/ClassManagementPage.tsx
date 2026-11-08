import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  CircleDashed,
  Eye,
  Key,
  Users,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  Avatar,
  Badge,
  Button,
  Card,
  DemoBadge,
  Drawer,
  EmptyState,
  ErrorState,
  PageHeader,
  PageSkeleton,
  Pagination,
  SearchInput,
  SelectField,
} from '../../components/ui/Primitives';
import { STUDENT_ROSTER } from '../../data/mockData';
import { StudentRosterItem } from '../../data/types';
import { bi, fmtNum, fmtPercent } from '../../utils/format';

export const ClassManagementPage: React.FC = () => {
  const {
    lang,
    classes,
    activeClass,
    activeClassId,
    setActiveClassId,
    skills,
    pageSimState,
    setPageSimState,
    setWizardPreselection,
  } = usePrototype();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get('filter') ?? 'all'
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [inspectedStudent, setInspectedStudent] = useState<StudentRosterItem | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const rosterForClass = useMemo(() => {
    if (pageSimState === 'empty' || activeClass.isNewEmpty) return [];
    return STUDENT_ROSTER.filter((s) => {
      if (s.classId !== activeClassId) return false;
      if (statusFilter !== 'all' && s.activityStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          s.nameFa.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q) ||
          s.username.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeClassId, activeClass.isNewEmpty, statusFilter, searchQuery, pageSimState]);

  const totalPages = Math.max(1, Math.ceil(rosterForClass.length / pageSize));
  const pagedStudents = rosterForClass.slice((page - 1) * pageSize, page * pageSize);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = pagedStudents.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleAssignToSelected = (studentIds: string[], skillId?: string) => {
    setWizardPreselection({
      skillIds: skillId ? [skillId] : [],
      classId: activeClassId,
      recipientType: 'selected_students',
      recipientStudentIds: studentIds,
      contextLabelFa: `تخصیص هدفمند به ${fmtNum(studentIds.length, 'fa')} دانش‌آموز انتخاب‌شده از ${activeClass.nameFa}`,
      contextLabelEn: `Targeted assignment for ${studentIds.length} selected student(s) in ${activeClass.nameEn}`,
    });
    navigate('/teacher/assignments?wizard=1');
  };

  const renderActivityBadge = (status: StudentRosterItem['activityStatus']) => {
    if (status === 'active') {
      return (
        <Badge tone="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
          {bi(lang, 'فعال این هفته', 'Active This Week')}
        </Badge>
      );
    }
    if (status === 'overdue_task') {
      return (
        <Badge tone="coral" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
          {bi(lang, 'دارای تکلیف دیرشده', 'Overdue Assignment')}
        </Badge>
      );
    }
    return (
      <Badge tone="neutral" icon={<CircleDashed className="w-3.5 h-3.5" />}>
        {bi(lang, 'بدون فعالیت ثبت‌شده', 'No Activity')}
      </Badge>
    );
  };

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        icon={<Users className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'کلاس‌ها و دانش‌آموزان', 'Classes & Students') },
        ]}
        title={bi(lang, 'مدیریت کلاس‌ها و فهرست دانش‌آموزان', 'Class Management & Student Roster')}
        subtitle={bi(
          lang,
          'بررسی وضعیت فعالیت آموزشی دانش‌آموزان و انتخاب چندنفره برای تخصیص تمرین هدفمند.',
          'Monitor student activity and multi-select learners for targeted practice assignments.'
        )}
        badge={<DemoBadge lang={lang} />}
      />

      {pageSimState === 'loading' && <PageSkeleton />}

      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'بارگذاری فهرست کلاس انجام نشد', 'Failed to load class roster')}
          description={bi(
            lang,
            'ارتباط با سرور فهرست دانش‌آموزان برقرار نشد.',
            'Could not load student list.'
          )}
          retryLabel={bi(lang, 'تلاش مجدد', 'Retry')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && (
        <div className="space-y-5">
          {/* Class Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {classes.map((cls) => {
              const selected = cls.id === activeClassId;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => {
                    setActiveClassId(cls.id);
                    setSelectedStudentIds([]);
                    setPage(1);
                  }}
                  className={`motion-card text-start p-4 rounded-card border-2 transition-all ${
                    selected
                      ? 'border-turquoise-500 bg-surface-sky shadow-card'
                      : 'border-border bg-surface hover:border-turquoise-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-ink-900">
                      {bi(lang, cls.nameFa, cls.nameEn)}
                    </span>
                    <Badge tone={cls.isNewEmpty ? 'neutral' : selected ? 'turquoise' : 'brand'}>
                      {fmtNum(cls.studentCount, lang)} {bi(lang, 'نفر', 'students')}
                    </Badge>
                  </div>
                  <div className="text-xs text-ink-600 mb-2.5">
                    {bi(lang, cls.scheduleSummaryFa, cls.scheduleSummaryEn)}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs text-brand-800 font-semibold">
                    <Key className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                    <span>{bi(lang, 'کد کلاس:', 'Code:')}</span>
                    <span className="ltr-token font-bold">{cls.classCode}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search, Activity Filter & Multi-select Action Bar */}
          <Card padding="md" surfaceTone="white" accentTop="turquoise">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              <div className="md:col-span-6">
                <SearchInput
                  id="roster-search"
                  label={bi(lang, 'جست‌وجوی نام دانش‌آموز', 'Search student name')}
                  value={searchQuery}
                  onChange={(v) => {
                    setSearchQuery(v);
                    setPage(1);
                  }}
                  placeholder={bi(
                    lang,
                    'نام یا نام کاربری دانش‌آموز (مثلاً: آوا، نیما)...',
                    'Search student name or username...'
                  )}
                />
              </div>
              <div className="md:col-span-4">
                <SelectField
                  id="roster-status-filter"
                  label={bi(lang, 'وضعیت فعالیت و تکلیف', 'Activity & Assignment Status')}
                  value={statusFilter}
                  onChange={(v) => {
                    setStatusFilter(v);
                    setPage(1);
                  }}
                  options={[
                    { value: 'all', label: bi(lang, 'همه دانش‌آموزان کلاس', 'All Students') },
                    { value: 'active', label: bi(lang, 'فعال در هفته جاری', 'Active This Week') },
                    {
                      value: 'overdue_task',
                      label: bi(lang, 'دارای تکلیف دیرشده', 'Overdue Assignment'),
                    },
                    {
                      value: 'inactive',
                      label: bi(lang, 'بدون فعالیت ثبت‌شده', 'No Recorded Activity'),
                    },
                  ]}
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  variant="cta"
                  className="w-full"
                  disabled={selectedStudentIds.length === 0}
                  onClick={() => handleAssignToSelected(selectedStudentIds)}
                  icon={<CheckSquare className="w-4 h-4" />}
                >
                  {selectedStudentIds.length > 0
                    ? bi(
                        lang,
                        `تخصیص (${fmtNum(selectedStudentIds.length, 'fa')})`,
                        `Assign (${selectedStudentIds.length})`
                      )
                    : bi(lang, 'تخصیص گروهی', 'Assign Selected')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Sticky Bulk Selection Banner */}
          {selectedStudentIds.length > 0 && (
            <div className="p-4 rounded-card bg-brand-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-card">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Users className="w-4 h-4 text-turquoise-500" aria-hidden="true" />
                <span>
                  {lang === 'fa'
                    ? `${fmtNum(selectedStudentIds.length, 'fa')} دانش‌آموز برای تخصیص تکلیف هدفمند انتخاب شده‌اند.`
                    : `${selectedStudentIds.length} students selected for targeted assignment.`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/15"
                  onClick={() => setSelectedStudentIds([])}
                >
                  {bi(lang, 'لغو انتخاب', 'Clear')}
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  onClick={() => handleAssignToSelected(selectedStudentIds)}
                >
                  {bi(lang, 'ادامه در ویزارد تکلیف', 'Continue to Wizard')}
                </Button>
              </div>
            </div>
          )}

          {/* Empty Class or Empty Filter Result */}
          {rosterForClass.length === 0 ? (
            <EmptyState
              variant="classroom"
              title={
                activeClass.isNewEmpty || pageSimState === 'empty'
                  ? bi(
                      lang,
                      'هیچ دانش‌آموزی در این کلاس ثبت نشده است (حالت کلاس خالی)',
                      'No students enrolled in this class yet (Empty Class State)'
                    )
                  : bi(
                      lang,
                      'دانش‌آموزی با این فیلتر یافت نشد',
                      'No students match the selected filter'
                    )
              }
              description={
                activeClass.isNewEmpty || pageSimState === 'empty'
                  ? bi(
                      lang,
                      'پس از افزوده شدن دانش‌آموزان توسط مدرسه یا پیوستن با کد کلاس، فهرست آن‌ها در اینجا نمایش داده می‌شود.',
                      'Students will appear here once provisioned by the school or joined via Class Code.'
                    )
                  : bi(
                      lang,
                      'عبارت جست‌وجو یا فیلتر وضعیت فعالیت را تغییر دهید.',
                      'Try clearing search or changing the status filter.'
                    )
              }
              action={
                activeClass.isNewEmpty ? (
                  <Button variant="cta" onClick={() => setActiveClassId('cls-6a')}>
                    {bi(lang, 'تغییر به کلاس ششم الف (۲۴ نفر)', 'Switch to Class 6A (24 students)')}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setPageSimState('normal');
                    }}
                  >
                    {bi(lang, 'نمایش همه دانش‌آموزان', 'Show All Students')}
                  </Button>
                )
              }
            />
          ) : (
            <>
              {/* Desktop Structured Table */}
              <Card padding="none" className="hidden md:block overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-surface-sky border-b border-border text-xs font-bold text-brand-900">
                      <tr>
                        <th className="py-3.5 px-4 w-10 text-start">
                          <input
                            type="checkbox"
                            aria-label={bi(lang, 'انتخاب همه دانش‌آموزان این صفحه', 'Select all on page')}
                            checked={
                              pagedStudents.length > 0 &&
                              pagedStudents.every((s) => selectedStudentIds.includes(s.id))
                            }
                            onChange={toggleAllVisible}
                            className="w-4 h-4 rounded border-border text-brand-700 cursor-pointer"
                          />
                        </th>
                        <th className="py-3.5 px-4 text-start">
                          {bi(lang, 'نام دانش‌آموز', 'Student')}
                        </th>
                        <th className="py-3.5 px-4 text-start">
                          {bi(lang, 'وضعیت فعالیت', 'Activity Status')}
                        </th>
                        <th className="py-3.5 px-4 text-start">
                          {bi(lang, 'تکالیف تکمیل‌شده', 'Assignments Done')}
                        </th>
                        <th className="py-3.5 px-4 text-start">
                          {bi(lang, 'زمان تمرین هفته', 'Weekly Practice')}
                        </th>
                        <th className="py-3.5 px-4 text-start">
                          {bi(lang, 'دقت نمونه', 'Demo Accuracy')}
                        </th>
                        <th className="py-3.5 px-4 text-end">
                          {bi(lang, 'اقدام', 'Actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pagedStudents.map((stu) => {
                        const checked = selectedStudentIds.includes(stu.id);
                        return (
                          <tr
                            key={stu.id}
                            className={
                              checked
                                ? 'bg-turquoise-50'
                                : 'hover:bg-surface-sky/35 transition-colors'
                            }
                          >
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                aria-label={bi(lang, stu.nameFa, stu.nameEn)}
                                checked={checked}
                                onChange={() => toggleStudent(stu.id)}
                                className="w-4 h-4 rounded border-border text-brand-700 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar name={bi(lang, stu.nameFa, stu.nameEn)} size="sm" />
                                <div>
                                  <div className="font-bold text-ink-900">
                                    {bi(lang, stu.nameFa, stu.nameEn)}
                                  </div>
                                  <div className="text-xs text-ink-600">
                                    {bi(lang, stu.lastActiveFa, stu.lastActiveEn)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{renderActivityBadge(stu.activityStatus)}</td>
                            <td className="py-3 px-4 font-semibold">
                              {fmtNum(stu.completedAssignments, lang)} /{' '}
                              {fmtNum(stu.totalAssignments, lang)}
                            </td>
                            <td className="py-3 px-4 text-ink-600">
                              {stu.practicedMinutesWeek === 0
                                ? bi(lang, '۰ دقیقه', '0 min')
                                : `${fmtNum(stu.practicedMinutesWeek, lang)} ${bi(lang, 'دقیقه', 'min')}`}
                            </td>
                            <td className="py-3 px-4">
                              {stu.demoAccuracyPercent === null ? (
                                <span className="text-ink-400">—</span>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
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
                            <td className="py-3 px-4 text-end">
                              <div className="inline-flex items-center gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setInspectedStudent(stu)}
                                  icon={<Eye className="w-4 h-4" />}
                                >
                                  {bi(lang, 'خلاصه', 'Details')}
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleAssignToSelected([stu.id], stu.needsSupportSkillId)
                                  }
                                >
                                  {bi(lang, 'تخصیص مهارت', 'Assign')}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 pb-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    lang={lang}
                  />
                </div>
              </Card>

              {/* Intentional Mobile Roster Cards (390px / 430px) */}
              <div className="md:hidden space-y-3">
                {pagedStudents.map((stu) => {
                  const checked = selectedStudentIds.includes(stu.id);
                  return (
                    <Card
                      key={stu.id}
                      padding="md"
                      surfaceTone={
                        checked
                          ? 'sky'
                          : stu.activityStatus === 'overdue_task'
                            ? 'coral'
                            : 'white'
                      }
                      accentTop={
                        stu.activityStatus === 'overdue_task'
                          ? 'coral'
                          : stu.activityStatus === 'active'
                            ? 'success'
                            : 'brand'
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <label className="flex items-center gap-2.5 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStudent(stu.id)}
                            className="w-4 h-4 rounded border-border text-brand-700 shrink-0"
                          />
                          <Avatar name={bi(lang, stu.nameFa, stu.nameEn)} size="sm" />
                          <div className="min-w-0">
                            <div className="font-bold text-ink-900 truncate">
                              {bi(lang, stu.nameFa, stu.nameEn)}
                            </div>
                            <div className="text-xs text-ink-600">
                              {bi(lang, stu.lastActiveFa, stu.lastActiveEn)}
                            </div>
                          </div>
                        </label>
                        {renderActivityBadge(stu.activityStatus)}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-surface/90 p-2.5 rounded-control border border-border">
                        <div>
                          <span className="text-ink-600 block">
                            {bi(lang, 'تکالیف', 'Tasks')}
                          </span>
                          <strong className="text-ink-900">
                            {fmtNum(stu.completedAssignments, lang)}/{fmtNum(stu.totalAssignments, lang)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-ink-600 block">
                            {bi(lang, 'زمان هفته', 'Time')}
                          </span>
                          <strong className="text-ink-900">
                            {fmtNum(stu.practicedMinutesWeek, lang)} {bi(lang, 'د', 'm')}
                          </strong>
                        </div>
                        <div>
                          <span className="text-ink-600 block">
                            {bi(lang, 'دقت نمونه', 'Accuracy')}
                          </span>
                          <strong className="text-brand-800">
                            {stu.demoAccuracyPercent === null
                              ? '—'
                              : fmtPercent(stu.demoAccuracyPercent, lang)}
                          </strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setInspectedStudent(stu)}
                          icon={<Eye className="w-4 h-4" />}
                        >
                          {bi(lang, 'خلاصه عملکرد', 'Details')}
                        </Button>
                        <Button
                          variant="cta"
                          size="sm"
                          onClick={() =>
                            handleAssignToSelected([stu.id], stu.needsSupportSkillId)
                          }
                        >
                          {bi(lang, 'تخصیص مهارت', 'Assign Skill')}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
                <Card padding="sm">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    lang={lang}
                  />
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* Instructional Student Summary Drawer */}
      <Drawer
        open={Boolean(inspectedStudent)}
        onClose={() => setInspectedStudent(null)}
        title={
          inspectedStudent
            ? bi(
                lang,
                `خلاصه عملکرد آموزشی: ${inspectedStudent.nameFa}`,
                `Instructional Summary: ${inspectedStudent.nameEn}`
              )
            : ''
        }
      >
        {inspectedStudent && (
          <div className="space-y-5">
            <DemoBadge lang={lang} />
            <div className="p-4 rounded-card bg-surface-sky border border-turquoise-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="typo-caption">{bi(lang, 'کلاس:', 'Class:')}</span>
                <strong className="text-sm">
                  {bi(lang, activeClass.nameFa, activeClass.nameEn)}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="typo-caption">{bi(lang, 'شناسه مدرسه:', 'School Username:')}</span>
                <span className="ltr-token text-xs font-bold">{inspectedStudent.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="typo-caption">{bi(lang, 'آخرین فعالیت:', 'Last Active:')}</span>
                <span className="text-sm font-semibold">
                  {bi(lang, inspectedStudent.lastActiveFa, inspectedStudent.lastActiveEn)}
                </span>
              </div>
            </div>

            {inspectedStudent.needsSupportSkillId ? (
              <div className="p-4 rounded-card bg-surface-coral border border-coral-200 space-y-2.5">
                <h4 className="text-sm font-bold text-coral-700">
                  {bi(lang, 'مهارت نیازمند حمایت آموزشی', 'Skill Needing Support')}
                </h4>
                <p className="text-xs text-ink-900 leading-relaxed">
                  {bi(
                    lang,
                    inspectedStudent.supportReasonFa ?? '',
                    inspectedStudent.supportReasonEn ?? ''
                  )}
                </p>
                {(() => {
                  const sk = skills.find((s) => s.id === inspectedStudent.needsSupportSkillId);
                  return sk ? (
                    <div className="pt-1">
                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => {
                          setInspectedStudent(null);
                          handleAssignToSelected([inspectedStudent.id], sk.id);
                        }}
                      >
                        {bi(
                          lang,
                          `تخصیص تمرین جبرانی «${sk.titleFa}»`,
                          `Assign Remedial: ${sk.titleEn}`
                        )}
                      </Button>
                    </div>
                  ) : null;
                })()}
              </div>
            ) : (
              <Card padding="sm" surfaceTone="mint">
                <p className="text-sm text-ink-800">
                  {inspectedStudent.activityStatus === 'inactive'
                    ? bi(
                        lang,
                        'این دانش‌آموز هنوز جلسه‌ای در هفته جاری ثبت نکرده است. می‌توانید یک تکلیف آغازین برای او ارسال کنید.',
                        'No practice recorded this week. Consider assigning a starter skill.'
                      )
                    : bi(
                        lang,
                        'پیشرفت این دانش‌آموز در تکالیف جاری پایدار است و خطای پرتکراری ثبت نشده است.',
                        'Steady progress across active skills with no repeated error alerts.'
                      )}
                </p>
              </Card>
            )}

            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                const id = inspectedStudent.id;
                setInspectedStudent(null);
                handleAssignToSelected([id]);
              }}
            >
              {bi(lang, 'تخصیص مهارت جدید به این دانش‌آموز', 'Assign New Skill to This Student')}
            </Button>
          </div>
        )}
      </Drawer>
    </AppShell>
  );
};
