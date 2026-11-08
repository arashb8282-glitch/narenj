import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flame, Play, Sparkles, UserCheck } from 'lucide-react';
import { Assignment } from '../../data/types';
import { Language, bi, fmtNum } from '../../utils/format';
import { AssignmentStatusPill, Button, Card, ProgressBar } from '../ui/Primitives';

export const AssignmentCard: React.FC<{
  assignment: Assignment;
  lang: Language;
  featured?: boolean;
}> = ({ assignment, lang, featured = false }) => {
  const navigate = useNavigate();
  const primarySkillId = assignment.skillIds[0] ?? 'sk-add-fractions';
  const progress = assignment.studentProgressPercent ?? 0;

  const isOverdue = assignment.status === 'overdue';
  const isCompleted = assignment.status === 'completed';
  const isResume = assignment.status === 'in_progress' || progress > 0;

  const ctaText = isCompleted
    ? bi(lang, 'مرور دوباره تکلیف', 'Review Practice')
    : isResume
      ? bi(lang, 'ادامه تمرین تکلیف', 'Resume Assignment')
      : bi(lang, 'شروع تمرین تکلیف', 'Start Assignment');

  const surfaceTone = isOverdue
    ? 'coral'
    : isCompleted
      ? 'mint'
      : featured
        ? 'apricot'
        : 'sky';

  const accentTop = isOverdue
    ? 'coral'
    : isCompleted
      ? 'success'
      : featured
        ? 'orange'
        : 'turquoise';

  return (
    <Card
      padding={featured ? 'lg' : 'md'}
      surfaceTone={surfaceTone}
      accentTop={accentTop}
      className={featured ? 'shadow-card-hover' : ''}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {featured && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isOverdue
                    ? 'bg-coral-600 text-white'
                    : 'bg-orange-500 text-white'
                }`}
              >
                {isOverdue ? (
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {isOverdue
                  ? bi(lang, 'اولویت فوری (تکلیف دیرشده)', 'Urgent Priority (Overdue)')
                  : bi(lang, 'مهم‌ترین اقدام بعدی شما', 'Your Next Priority')}
              </span>
            )}
            <AssignmentStatusPill status={assignment.status} lang={lang} />
            <span className="px-2.5 py-0.5 rounded-full bg-surface/90 border border-border text-xs font-semibold text-ink-600">
              {fmtNum(assignment.skillIds.length, lang)} {bi(lang, 'مهارت', 'skill(s)')}
            </span>
          </div>

          <h2 className={featured ? 'typo-section-title text-xl sm:text-2xl' : 'typo-card-title'}>
            {bi(lang, assignment.titleFa, assignment.titleEn)}
          </h2>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-ink-600">
            <span className="inline-flex items-center gap-1.5 bg-surface/80 px-2.5 py-1 rounded-full border border-border/70">
              <UserCheck className="w-4 h-4 text-brand-700 shrink-0" aria-hidden="true" />
              <span>
                {bi(lang, 'معلم:', 'Teacher:')}{' '}
                <strong className="text-ink-900">
                  {bi(lang, assignment.teacherNameFa, assignment.teacherNameEn)}
                </strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-surface/80 px-2.5 py-1 rounded-full border border-border/70">
              <Calendar
                className={`w-4 h-4 shrink-0 ${isOverdue ? 'text-coral-600' : 'text-orange-600'}`}
                aria-hidden="true"
              />
              <span>
                {bi(lang, 'موعد تحویل:', 'Due:')}{' '}
                <strong className={isOverdue ? 'text-coral-700' : 'text-ink-900'}>
                  {bi(lang, assignment.dueDateFa, assignment.dueDateEn)}
                </strong>
              </span>
            </span>
          </div>

          {assignment.instructionsFa && (
            <div className="text-sm text-ink-800 bg-surface/95 border border-border-strong rounded-control px-3.5 py-2.5 leading-relaxed">
              <strong className="text-brand-900">
                {bi(lang, 'یادداشت معلم: ', 'Teacher note: ')}
              </strong>
              {bi(lang, assignment.instructionsFa, assignment.instructionsEn)}
            </div>
          )}
        </div>

        <div className="lg:w-72 shrink-0 flex flex-col gap-3.5 justify-between bg-surface p-4 rounded-card border border-border-strong shadow-xs">
          <ProgressBar
            value={progress}
            lang={lang}
            size="md"
            label={bi(lang, 'پیشرفت تکلیف (نمونه)', 'Assignment Progress (Demo)')}
            tone={isCompleted ? 'success' : isOverdue ? 'coral' : 'orange'}
          />
          <Button
            variant={isCompleted ? 'secondary' : featured ? 'cta' : 'primary'}
            size={featured ? 'lg' : 'md'}
            className="w-full"
            onClick={() => navigate(`/student/practice/${primarySkillId}?from=assignment`)}
            icon={<Play className="w-4 h-4 fill-current" />}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </Card>
  );
};
