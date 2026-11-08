import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Play, UserCheck } from 'lucide-react';
import { Assignment } from '../../data/types';
import { Language, bi } from '../../utils/format';
import { AssignmentStatusPill, Button, Card, ProgressBar } from '../ui/Primitives';

export const AssignmentCard: React.FC<{
  assignment: Assignment;
  lang: Language;
  featured?: boolean;
}> = ({ assignment, lang, featured = false }) => {
  const navigate = useNavigate();
  const primarySkillId = assignment.skillIds[0] ?? 'sk-add-fractions';
  const progress = assignment.studentProgressPercent ?? 0;

  const isResume = assignment.status === 'in_progress' || progress > 0;
  const ctaText =
    assignment.status === 'completed'
      ? bi(lang, 'مرور مجدد تکلیف', 'Review Practice')
      : isResume
        ? bi(lang, 'ادامه تمرین تکلیف', 'Resume Assignment')
        : bi(lang, 'شروع تمرین تکلیف', 'Start Assignment');

  return (
    <Card
      padding={featured ? 'lg' : 'md'}
      className={
        featured
          ? 'border-2 border-brand-700 bg-gradient-to-br from-surface via-surface to-brand-50/70'
          : ''
      }
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-700 text-white text-xs font-semibold">
                {bi(lang, 'مهم‌ترین اقدام بعدی شما', 'Your Next Priority')}
              </span>
            )}
            <AssignmentStatusPill status={assignment.status} lang={lang} />
          </div>

          <h2 className={featured ? 'typo-section-title text-xl sm:text-2xl' : 'typo-card-title'}>
            {bi(lang, assignment.titleFa, assignment.titleEn)}
          </h2>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-ink-600">
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-brand-700" aria-hidden="true" />
              <span>
                {bi(lang, 'معلم:', 'Teacher:')}{' '}
                <strong className="text-ink-900">
                  {bi(lang, assignment.teacherNameFa, assignment.teacherNameEn)}
                </strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-700" aria-hidden="true" />
              <span>
                {bi(lang, 'موعد تحویل:', 'Due:')}{' '}
                <strong
                  className={
                    assignment.status === 'overdue' ? 'text-danger-600' : 'text-ink-900'
                  }
                >
                  {bi(lang, assignment.dueDateFa, assignment.dueDateEn)}
                </strong>
              </span>
            </span>
          </div>

          {assignment.instructionsFa && (
            <p className="text-sm text-ink-600 bg-surface/90 border border-border rounded-control px-3.5 py-2">
              <strong className="text-ink-900">{bi(lang, 'یادداشت معلم: ', 'Teacher note: ')}</strong>
              {bi(lang, assignment.instructionsFa, assignment.instructionsEn)}
            </p>
          )}
        </div>

        <div className="lg:w-64 shrink-0 flex flex-col gap-3 justify-between bg-surface p-4 rounded-card border border-border">
          <ProgressBar
            value={progress}
            lang={lang}
            label={bi(lang, 'پیشرفت شما (داده نمونه)', 'Your Progress (Demo)')}
            tone={assignment.status === 'completed' ? 'success' : 'brand'}
          />
          <Button
            variant="primary"
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
