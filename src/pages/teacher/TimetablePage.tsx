import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Info, Plus, Users } from 'lucide-react';
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
import { bi, fmtNum } from '../../utils/format';

const WEEK_DAYS = [
  { index: 0 as const, fa: 'شنبه', en: 'Saturday', accent: 'turquoise' as const },
  { index: 1 as const, fa: 'یکشنبه', en: 'Sunday', accent: 'lavender' as const },
  { index: 2 as const, fa: 'دوشنبه', en: 'Monday', accent: 'orange' as const },
  { index: 3 as const, fa: 'سه‌شنبه', en: 'Tuesday', accent: 'success' as const },
  { index: 4 as const, fa: 'چهارشنبه', en: 'Wednesday', accent: 'accent' as const },
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
        icon={<CalendarDays className="w-6 h-6" />}
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
            variant="cta"
            onClick={() => setAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            {bi(lang, 'افزودن یادداشت برنامه (نمایشی)', 'Add Plan Note (Demo)')}
          </Button>
        }
      />

      {/* Legend + Filter Strip */}
      <Card
        padding="md"
        surfaceTone="sky"
        className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
          <span className="inline-flex items-center gap-2 text-brand-900 bg-surface px-3 py-1.5 rounded-full border border-turquoise-200">
            <span className="w-3.5 h-3.5 rounded bg-turquoise-500 inline-block" />
            {bi(lang, 'کلاس زمان‌بندی‌شده (جلسه تدریس)', 'Scheduled Class Session')}
          </span>
          <span className="inline-flex items-center gap-2 text-orange-700 bg-surface px-3 py-1.5 rounded-full border border-orange-200">
            <span className="w-3.5 h-3.5 rounded border-2 border-dashed border-orange-500 bg-orange-100 inline-block" />
            {bi(lang, 'موعد تحویل تکلیف یا آزمون', 'Assignment / Quiz Deadline')}
          </span>
        </div>

        <SelectField
          id="tt-class-filter"
          label={bi(lang, 'فیلتر کلاس', 'Filter Class')}
          hideLabel
          className="sm:min-w-[220px]"
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

      {/* Weekly 5-Day School Grid — 1 col on mobile, 2 on tablet, 5 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {WEEK_DAYS.map((day) => {
          const entries = timetable.filter(
            (e) =>
              e.dayIndex === day.index &&
              (classFilter === 'all' || e.classId === classFilter)
          );

          return (
            <Card
              key={day.index}
              padding="sm"
              accentTop={day.accent}
              className="flex flex-col gap-3 min-h-[220px] lg:min-h-[300px]"
            >
              <div className="pb-2.5 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-ink-900">{bi(lang, day.fa, day.en)}</h2>
                <Badge tone={day.accent}>{fmtNum(entries.length, lang)}</Badge>
              </div>

              <div className="space-y-2.5 flex-1">
                {entries.map((entry) => {
                  const isClass = entry.entryType === 'scheduled_class';
                  return (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-card text-xs space-y-1.5 ${
                        isClass
                          ? 'bg-surface-sky border-s-4 border border-turquoise-500 text-ink-900'
                          : 'bg-surface-apricot border-2 border-dashed border-orange-500/70 text-ink-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                        <span className={isClass ? 'text-turquoise-700' : 'text-orange-700'}>
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

                      <div className="font-bold leading-snug">
                        {bi(lang, entry.titleFa, entry.titleEn)}
                      </div>

                      <div className="pt-1 flex flex-wrap gap-2">
                        {isClass ? (
                          <Link
                            to="/teacher/skills"
                            className="text-[11px] font-bold text-brand-800 hover:underline"
                          >
                            {bi(lang, 'مهارت‌های مبحث', 'Topic Skills')}
                          </Link>
                        ) : (
                          <Link
                            to="/teacher/assignments"
                            className="text-[11px] font-bold text-orange-700 hover:underline"
                          >
                            {bi(lang, 'جزئیات تکلیف', 'View Task')}
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

      {/* Demo Edit Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={bi(lang, 'افزودن یادداشت برنامه تدریس (صرفاً نمایشی)', 'Add Teaching Plan Note (Demo Only)')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              {bi(lang, 'انصراف', 'Cancel')}
            </Button>
            <Button variant="cta" onClick={handleAddDemoPlan}>
              {bi(lang, 'افزودن نمایشی به تقویم', 'Add Demo Entry')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddDemoPlan} className="space-y-4">
          <div className="p-3 rounded-control bg-surface-sky border border-turquoise-200 text-xs text-ink-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-turquoise-700 shrink-0 mt-0.5" />
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
              className="w-full min-h-[44px] px-3 py-2 border border-border-strong rounded-control text-sm"
            />
          </div>
        </form>
      </Modal>
    </AppShell>
  );
};
