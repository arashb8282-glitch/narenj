import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Info, Plus, Users } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  Modal,
  PageHeader,
  SelectField,
} from '../../components/ui/Primitives';
import { bi } from '../../utils/format';

const WEEK_DAYS = [
  { index: 0 as const, fa: 'شنبه', en: 'Saturday' },
  { index: 1 as const, fa: 'یکشنبه', en: 'Sunday' },
  { index: 2 as const, fa: 'دوشنبه', en: 'Monday' },
  { index: 3 as const, fa: 'سه‌شنبه', en: 'Tuesday' },
  { index: 4 as const, fa: 'چهارشنبه', en: 'Wednesday' },
];

export const TimetablePage: React.FC = () => {
  const {
    lang,
    classes,
    activeClassId,
    setActiveClassId,
    timetable,
    addTimetableEntry,
    showToast,
  } = usePrototype();

  const [classFilter, setClassFilter] = useState<string>('all');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [newDay, setNewDay] = useState<string>('2');
  const [newTitle, setNewTitle] = useState<string>('مرور کلاسی کسرها با فعالیت گروهی');

  const handleAddDemoPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTimetableEntry({
      id: `tt-${Date.now()}`,
      dayIndex: Number(newDay) as 0 | 1 | 2 | 3 | 4,
      timeSlot: '۰۹:۴۵ تا ۱۰:۳۰',
      entryType: 'scheduled_class',
      classId: activeClassId,
      titleFa: newTitle,
      titleEn: newTitle,
      topicId: 'top-fractions',
    });
    setAddModalOpen(false);
    showToast(
      'آیتم برنامه تدریس به‌صورت نمایشی به تقویم هفتگی افزوده شد.',
      'Demo teaching plan note added to weekly view.',
      'success'
    );
  };

  return (
    <AppShell roleOverride="teacher">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه معلم', 'Teacher Home'), to: '/teacher' },
          { label: bi(lang, 'برنامه تدریس و تقویم', 'Timetable & Teaching Plan') },
        ]}
        title={bi(lang, 'برنامه تدریس و تقویم آموزشی هفتگی (P1)', 'Weekly Timetable & Teaching Plan (P1)')}
        subtitle={bi(
          lang,
          'نمایش یکپارچه جلسات کلاسی زمان‌بندی‌شده در کنار موعد تکالیف و آزمون‌ها با تمایز بصری شفاف.',
          'Weekly view distinguishing scheduled class sessions from assignment and quiz deadlines.'
        )}
        badge={
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="کنترل ویرایش نمایشی — مجوزهای برنامه تدریس باز است"
            labelEn="Demo Edit — Permissions Open"
          />
        }
        actions={
          <Button
            variant="secondary"
            onClick={() => setAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            {bi(lang, 'افزودن آیتم برنامه (نمایشی)', 'Add Plan Note (Demo)')}
          </Button>
        }
      />

      {/* Legend + Filter Strip */}
      <Card padding="sm" className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 text-brand-700">
            <span className="w-3.5 h-3.5 rounded bg-brand-700 inline-block" />
            {bi(lang, 'کلاس زمان‌بندی‌شده (جلسه تدریس)', 'Scheduled Class Session')}
          </span>
          <span className="inline-flex items-center gap-2 text-warning-600">
            <span className="w-3.5 h-3.5 rounded border-2 border-dashed border-warning-600 bg-accent-100 inline-block" />
            {bi(lang, 'موعد تحویل تکلیف یا آزمون', 'Assignment / Quiz Deadline')}
          </span>
        </div>

        <SelectField
          id="tt-class-filter"
          label={bi(lang, 'فیلتر کلاس', 'Filter Class')}
          hideLabel
          value={classFilter}
          onChange={(v) => {
            setClassFilter(v);
            if (v !== 'all') setActiveClassId(v);
          }}
          options={[
            { value: 'all', label: bi(lang, 'همه کلاس‌های من', 'All My Classes') },
            ...classes.map((c) => ({
              value: c.id,
              label: bi(lang, c.nameFa, c.nameEn),
            })),
          ]}
        />
      </Card>

      {/* Weekly 5-Day School Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {WEEK_DAYS.map((day) => {
          const entries = timetable.filter(
            (e) =>
              e.dayIndex === day.index &&
              (classFilter === 'all' || e.classId === classFilter)
          );

          return (
            <Card key={day.index} padding="sm" className="flex flex-col gap-3 min-h-[280px]">
              <div className="pb-2.5 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-ink-900">{bi(lang, day.fa, day.en)}</h2>
                <Badge tone="neutral">{entries.length}</Badge>
              </div>

              <div className="space-y-2.5 flex-1">
                {entries.map((entry) => {
                  const isClass = entry.entryType === 'scheduled_class';
                  return (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-card text-xs space-y-1.5 ${
                        isClass
                          ? 'bg-brand-50 border-s-4 border border-brand-700 text-ink-900'
                          : 'bg-accent-100/65 border-2 border-dashed border-warning-600/60 text-ink-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[11px] font-semibold">
                        <span className={isClass ? 'text-brand-700' : 'text-warning-600'}>
                          {isClass ? (
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {bi(lang, 'جلسه درس', 'Class')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {bi(lang, 'موعد تحویل', 'Deadline')}
                            </span>
                          )}
                        </span>
                        <span className="text-ink-600">{entry.timeSlot}</span>
                      </div>

                      <div className="font-semibold leading-snug">
                        {bi(lang, entry.titleFa, entry.titleEn)}
                      </div>

                      <div className="pt-1 flex flex-wrap gap-2">
                        {isClass ? (
                          <Link
                            to="/teacher/skills"
                            className="text-[11px] font-semibold text-brand-700 hover:underline"
                          >
                            {bi(lang, 'مشاهده مهارت‌های مبحث', 'Topic Skills')}
                          </Link>
                        ) : (
                          <Link
                            to="/teacher/assignments"
                            className="text-[11px] font-semibold text-warning-600 hover:underline"
                          >
                            {bi(lang, 'مشاهده جزئیات تکلیف', 'View Task')}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Demo Edit Modal with Explicit Open-Permission Notice */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={bi(lang, 'افزودن یادداشت برنامه تدریس (صرفاً نمایشی)', 'Add Teaching Plan Note (Demo Only)')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              {bi(lang, 'انصراف', 'Cancel')}
            </Button>
            <Button variant="primary" onClick={handleAddDemoPlan}>
              {bi(lang, 'افزودن نمایشی به تقویم', 'Add Demo Entry')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddDemoPlan} className="space-y-4">
          <div className="p-3 rounded-control bg-brand-50 border border-brand-200 text-xs text-ink-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
            <span>
              {bi(
                lang,
                'توجه: اینکه برنامه هفتگی توسط مدیر مدرسه قفل شود یا معلم اجازه ویرایش مستقیم داشته باشد، هنوز در نیازمندی‌های محصول نهایی نشده است.',
                'Note: Whether timetables are school-admin locked or teacher-editable remains an open product decision.'
              )}
            </span>
          </div>

          <SelectField
            id="demo-tt-day"
            label={bi(lang, 'روز هفته', 'Day of Week')}
            value={newDay}
            onChange={setNewDay}
            options={WEEK_DAYS.map((d) => ({
              value: String(d.index),
              label: bi(lang, d.fa, d.en),
            }))}
          />

          <div>
            <label htmlFor="demo-tt-title" className="block text-xs font-semibold text-ink-600 mb-1">
              {bi(lang, 'مبحث یا برنامه جلسه', 'Planned Session Topic')}
            </label>
            <input
              id="demo-tt-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 border border-border rounded-control text-sm"
            />
          </div>
        </form>
      </Modal>
    </AppShell>
  );
};
