import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FolderTree,
  LayoutGrid,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { TopicIllustration } from '../../components/shared/Illustrations';
import { SkillCard } from '../../components/student/SkillCard';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  ErrorState,
  PageHeader,
  PageSkeleton,
  ProgressBar,
  SearchInput,
  SelectField,
  Tabs,
} from '../../components/ui/Primitives';
import { TOPICS } from '../../data/mockData';
import { SkillStatus } from '../../data/types';
import { bi, fmtNum } from '../../utils/format';
import { getTopicTheme } from '../../utils/theme';

export const StudentSkillLibraryPage: React.FC = () => {
  const { lang, skills, pageSimState, setPageSimState } = usePrototype();
  const navigate = useNavigate();
  const ArrowIcon = lang === 'fa' ? ArrowLeft : ArrowRight;

  const [browsePattern, setBrowsePattern] = useState<'tree' | 'topic_cards'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('6');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'top-fractions': true,
    'top-decimals': true,
    'top-geometry': false,
  });

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const filteredTopics = useMemo(() => {
    if (pageSimState === 'empty') return [];

    return TOPICS.filter((top) => {
      if (gradeFilter !== 'all' && String(top.grade) !== gradeFilter) return false;

      const topicSkills = skills.filter((sk) => {
        if (sk.topicId !== top.id) return false;
        if (statusFilter !== 'all' && sk.status !== (statusFilter as SkillStatus)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const inSkill =
            sk.titleFa.toLowerCase().includes(q) ||
            sk.titleEn.toLowerCase().includes(q) ||
            sk.descriptionFa.toLowerCase().includes(q) ||
            sk.code.toLowerCase().includes(q);
          const inTopic =
            top.titleFa.toLowerCase().includes(q) || top.titleEn.toLowerCase().includes(q);
          return inSkill || inTopic;
        }
        return true;
      });

      return topicSkills.length > 0;
    });
  }, [gradeFilter, statusFilter, searchQuery, skills, pageSimState]);

  const getFilteredSkillsForTopic = (topicId: string) =>
    skills.filter((sk) => {
      if (sk.topicId !== topicId) return false;
      if (statusFilter !== 'all' && sk.status !== (statusFilter as SkillStatus)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const top = TOPICS.find((t) => t.id === topicId);
        return (
          sk.titleFa.toLowerCase().includes(q) ||
          sk.titleEn.toLowerCase().includes(q) ||
          sk.descriptionFa.toLowerCase().includes(q) ||
          sk.code.toLowerCase().includes(q) ||
          Boolean(
            top &&
              (top.titleFa.toLowerCase().includes(q) || top.titleEn.toLowerCase().includes(q))
          )
        );
      }
      return true;
    });

  const resetFilters = () => {
    setSearchQuery('');
    setGradeFilter('6');
    setStatusFilter('all');
    setPageSimState('normal');
  };

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
        icon={<BookOpen className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'کتابخانه مهارت‌ها', 'Skill Library') },
        ]}
        title={bi(lang, 'کتابخانه مهارت‌ها', 'Skill Library')}
        subtitle={bi(
          lang,
          'مباحث رنگ‌بندی‌شده ریاضی را مرور کن و هر مهارتی را که دوست داری برای تمرین انتخاب کن.',
          'Explore color-coded Mathematics topics and select any skill for independent practice.'
        )}
        badge={
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="برچسب‌های وضعیت تسلط پیشنهادی‌اند"
            labelEn="Mastery Statuses Proposed"
          />
        }
      />

      {pageSimState === 'loading' && <PageSkeleton />}

      {pageSimState === 'error' && (
        <ErrorState
          title={bi(lang, 'خطا در دریافت فهرست مهارت‌ها', 'Failed to load Skill Library')}
          description={bi(
            lang,
            'بارگذاری ساختار مباحث با خطا روبه‌رو شد. دوباره تلاش کنید.',
            'Could not retrieve curriculum tree. Please try again.'
          )}
          retryLabel={bi(lang, 'تلاش مجدد', 'Retry')}
          onRetry={() => setPageSimState('normal')}
        />
      )}

      {pageSimState !== 'loading' && pageSimState !== 'error' && (
        <div className="space-y-5">
          {/* Subject Roadmap + UX Browse Pattern Switcher */}
          <Card padding="sm" surfaceTone="sky">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-brand-800 me-1">
                  {bi(lang, 'درس:', 'Subject:')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-800 text-white text-xs font-bold shadow-xs">
                  {bi(lang, 'ریاضی (فعال در MVP)', 'Mathematics (Active MVP)')}
                </span>
                <span
                  title={bi(lang, 'برنامه‌ریزی‌شده برای فازهای بعدی', 'Planned for future phases')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface/80 text-ink-400 border border-border text-xs cursor-not-allowed"
                >
                  <Lock className="w-3 h-3" aria-hidden="true" />
                  {bi(lang, 'علوم تجربی (فاز بعدی)', 'Science (Later Phase)')}
                </span>
                <span
                  title={bi(lang, 'برنامه‌ریزی‌شده برای فازهای بعدی', 'Planned for future phases')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface/80 text-ink-400 border border-border text-xs cursor-not-allowed"
                >
                  <Lock className="w-3 h-3" aria-hidden="true" />
                  {bi(lang, 'ادبیات و زبان (فاز بعدی)', 'Language (Later Phase)')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-800 hidden sm:inline">
                  {bi(lang, 'الگوی مرور:', 'Browse Mode:')}
                </span>
                <Tabs
                  activeId={browsePattern}
                  onChange={(id) => setBrowsePattern(id as 'tree' | 'topic_cards')}
                  tabs={[
                    {
                      id: 'tree',
                      label: bi(lang, '۱. مرور درختی در صفحه', '1. Inline Topic Tree'),
                    },
                    {
                      id: 'topic_cards',
                      label: bi(lang, '۲. کارت‌های مبحث', '2. Topic Cards'),
                    },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Filter & Search Bar */}
          <Card padding="md" surfaceTone="white" accentTop="turquoise">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              <div className="md:col-span-6">
                <SearchInput
                  id="student-skill-search"
                  label={bi(lang, 'جست‌وجوی مهارت یا مبحث', 'Search skills or topics')}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={bi(
                    lang,
                    'نام مهارت، مبحث یا کد (مثلاً: کسر، مساحت، M6-FR)...',
                    'Skill title, topic, or code (e.g., Fractions, Area, M6-FR)...'
                  )}
                />
              </div>
              <div className="md:col-span-3">
                <SelectField
                  id="student-grade-filter"
                  label={bi(lang, 'پایه تحصیلی', 'Grade')}
                  value={gradeFilter}
                  onChange={setGradeFilter}
                  options={[
                    { value: 'all', label: bi(lang, 'همه پایه‌ها (۵ تا ۷)', 'All Grades (5–7)') },
                    { value: '5', label: bi(lang, 'پایه پنجم', 'Grade 5') },
                    { value: '6', label: bi(lang, 'پایه ششم (پایه آوا)', 'Grade 6 (Ava)') },
                    { value: '7', label: bi(lang, 'پایه هفتم', 'Grade 7') },
                  ]}
                />
              </div>
              <div className="md:col-span-3">
                <SelectField
                  id="student-status-filter"
                  label={bi(lang, 'وضعیت تمرین (پیشنهادی)', 'Practice Status (Demo)')}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: bi(lang, 'همه وضعیت‌ها', 'All Statuses') },
                    { value: 'in_progress', label: bi(lang, 'در حال تمرین', 'In Progress') },
                    { value: 'needs_review', label: bi(lang, 'نیازمند مرور', 'Needs Review') },
                    { value: 'not_started', label: bi(lang, 'شروع‌نشده', 'Not Started') },
                    { value: 'mastered', label: bi(lang, 'مسلط (نمونه)', 'Mastered (Demo)') },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Empty State */}
          {filteredTopics.length === 0 ? (
            <EmptyState
              variant="search"
              title={bi(
                lang,
                'مهارتی مطابق با جست‌وجو یا فیلتر انتخابی پیدا نشد',
                'No skills match your current search or filter'
              )}
              description={bi(
                lang,
                'عبارت جست‌وجو را کوتاه‌تر کن یا فیلتر پایه و وضعیت را به حالت پیش‌فرض برگردان.',
                'Try clearing the search query or resetting the grade and status filters.'
              )}
              action={
                <Button
                  variant="cta"
                  onClick={resetFilters}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  {bi(lang, 'پاک‌کردن فیلترها و نمایش پایه ششم', 'Reset Filters')}
                </Button>
              }
            />
          ) : browsePattern === 'tree' ? (
            /* UX Pattern 1: Color-coded Expandable Topic & Optional Subtopic Tree */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-600 px-1">
                <FolderTree className="w-4 h-4 text-turquoise-600 shrink-0" aria-hidden="true" />
                <span>
                  {bi(
                    lang,
                    'الگوی مرور ۱: باز کردن درخت «مبحث / زیرمبحث (در صورت وجود) / مهارت» در همین صفحه، همراه با لینک صفحه مستقل مبحث.',
                    'Pattern 1: Expand Topic / Subtopic (only where present) / Skill inline, with optional Topic Detail link.'
                  )}
                </span>
              </div>

              {filteredTopics.map((topic) => {
                const topicSkills = getFilteredSkillsForTopic(topic.id);
                const isOpen = Boolean(expandedTopics[topic.id] || searchQuery.trim());
                const avgProg = Math.round(
                  topicSkills.reduce((acc, s) => acc + s.demoProgress, 0) /
                    Math.max(1, topicSkills.length)
                );
                const theme = getTopicTheme(topic.id);

                return (
                  <Card
                    key={topic.id}
                    padding="none"
                    accentTop={theme.accentTop}
                    className="overflow-hidden"
                  >
                    {/* Topic Accordion Header */}
                    <div className="p-4 sm:p-5 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        aria-expanded={isOpen}
                        className="flex items-start sm:items-center gap-3.5 text-start flex-1 min-w-0"
                      >
                        <TopicIllustration kind={topic.illustrationKey} size={56} />
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="typo-section-title text-lg">
                              {bi(lang, topic.titleFa, topic.titleEn)}
                            </h2>
                            <Badge tone={theme.badgeTone}>
                              {fmtNum(topicSkills.length, lang)} {bi(lang, 'مهارت', 'skills')}
                            </Badge>
                            <span className="text-xs font-semibold text-ink-600">
                              {bi(
                                lang,
                                `پایه ${fmtNum(topic.grade, 'fa')}`,
                                `Grade ${topic.grade}`
                              )}
                            </span>
                          </div>
                          <p className="typo-caption line-clamp-2">
                            {bi(lang, topic.descriptionFa, topic.descriptionEn)}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="w-36 hidden md:block">
                          <ProgressBar
                            value={avgProg}
                            lang={lang}
                            tone={theme.progressTone}
                            label={bi(lang, 'میانگین نمونه', 'Demo Avg')}
                          />
                        </div>
                        <Link
                          to={`/student/topics/${topic.id}`}
                          className={`text-xs font-bold hover:underline px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${theme.chipClass}`}
                        >
                          <span>{bi(lang, 'صفحه مبحث', 'Topic Page')}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          aria-label={bi(lang, 'باز و بسته کردن مبحث', 'Toggle topic')}
                          className="p-2 rounded-control border border-border-strong bg-canvas hover:bg-turquoise-50 text-ink-900"
                        >
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Topic Accordion Body */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 bg-canvas/80 border-t border-border space-y-5">
                        {topic.subtopics && topic.subtopics.length > 0 ? (
                          topic.subtopics.map((sub) => {
                            const subSkills = topicSkills.filter((s) => s.subtopicId === sub.id);
                            if (subSkills.length === 0) return null;
                            return (
                              <div key={sub.id} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-brand-700" />
                                  <h3 className="text-sm font-bold text-brand-900">
                                    {bi(lang, sub.titleFa, sub.titleEn)}
                                  </h3>
                                  <span className="text-xs text-ink-600">
                                    ({fmtNum(subSkills.length, lang)})
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {subSkills.map((sk) => (
                                    <SkillCard key={sk.id} skill={sk} lang={lang} />
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {topicSkills.map((sk) => (
                              <SkillCard key={sk.id} skill={sk} lang={lang} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            /* UX Pattern 2: Colorful Dedicated Topic Cards */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-600 px-1">
                <LayoutGrid className="w-4 h-4 text-orange-500 shrink-0" aria-hidden="true" />
                <span>
                  {bi(
                    lang,
                    'الگوی مرور ۲: ابتدا کارت مبحث را انتخاب کن تا مهارت‌های آن در «صفحه مستقل جزئیات مبحث» باز شوند.',
                    'Pattern 2: Select a color-coded Topic card to open its dedicated Topic Detail page.'
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTopics.map((topic) => {
                  const topicSkills = getFilteredSkillsForTopic(topic.id);
                  const avgProg = Math.round(
                    topicSkills.reduce((acc, s) => acc + s.demoProgress, 0) /
                      Math.max(1, topicSkills.length)
                  );
                  const theme = getTopicTheme(topic.id);
                  return (
                    <Card
                      key={topic.id}
                      padding="md"
                      surfaceTone={theme.surfaceTone}
                      accentTop={theme.accentTop}
                      interactive
                      className="flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <TopicIllustration kind={topic.illustrationKey} size={58} />
                          <Badge tone={theme.badgeTone}>
                            {fmtNum(topicSkills.length, lang)} {bi(lang, 'مهارت', 'skills')}
                          </Badge>
                        </div>
                        <h2 className="typo-card-title text-lg">
                          {bi(lang, topic.titleFa, topic.titleEn)}
                        </h2>
                        <p className="typo-body text-sm text-ink-600">
                          {bi(lang, topic.descriptionFa, topic.descriptionEn)}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-border/80">
                        <ProgressBar
                          value={avgProg}
                          lang={lang}
                          tone={theme.progressTone}
                          label={bi(lang, 'پیشرفت مبحث (نمونه)', 'Topic Progress (Demo)')}
                        />
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => navigate(`/student/topics/${topic.id}`)}
                          iconEnd={<ArrowIcon className="w-4 h-4" />}
                        >
                          {bi(lang, 'مشاهده مهارت‌های مبحث', 'Open Topic Skills')}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
};
