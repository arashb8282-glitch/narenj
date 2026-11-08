import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Play } from 'lucide-react';
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
  PageHeader,
  ProgressBar,
  SectionHeader,
} from '../../components/ui/Primitives';
import { TOPICS } from '../../data/mockData';
import { bi, fmtNum } from '../../utils/format';

export const TopicDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { lang, skills } = usePrototype();
  const navigate = useNavigate();
  const BackArrow = lang === 'fa' ? ArrowRight : ArrowLeft;

  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
  const topicSkills = skills.filter((s) => s.topicId === topic.id);
  const avgProgress = Math.round(
    topicSkills.reduce((sum, s) => sum + s.demoProgress, 0) / Math.max(1, topicSkills.length)
  );
  const suggestedSkill =
    topicSkills.find((s) => s.status === 'in_progress') ??
    topicSkills.find((s) => s.status === 'needs_review') ??
    topicSkills[0];

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'کتابخانه مهارت‌ها', 'Skill Library'), to: '/student/skills' },
          { label: bi(lang, topic.titleFa, topic.titleEn) },
        ]}
        title={bi(lang, topic.titleFa, topic.titleEn)}
        subtitle={bi(lang, topic.descriptionFa, topic.descriptionEn)}
        badge={<DemoBadge lang={lang} />}
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate('/student/skills')}
            icon={<BackArrow className="w-4 h-4" />}
          >
            {bi(lang, 'بازگشت به کتابخانه مهارت‌ها', 'Back to Skill Library')}
          </Button>
        }
      />

      {/* Topic Summary & Recommended Entry Banner */}
      <Card padding="lg" className="mb-6 bg-surface">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <TopicIllustration kind={topic.illustrationKey} size={72} />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">
                  {bi(lang, `ریاضی • پایه ${fmtNum(topic.grade, 'fa')}`, `Math • Grade ${topic.grade}`)}
                </Badge>
                <Badge tone="neutral">
                  {fmtNum(topicSkills.length, lang)} {bi(lang, 'مهارت تمرینی', 'Practice Skills')}
                </Badge>
              </div>
              <p className="typo-body text-ink-600 max-w-2xl">
                {bi(
                  lang,
                  'این صفحه برای مقایسه UX «صفحه مستقل مبحث» با «مرور درختی درون کتابخانه» طراحی شده است تا تیم محصول وضوح تمرکز دانش‌آموز را ارزیابی کند.',
                  'Dedicated Topic Detail view built to evaluate focused topic exploration vs. inline Skill Library tree.'
                )}
              </p>
            </div>
          </div>

          <div className="lg:w-72 shrink-0 space-y-3 p-4 rounded-card bg-brand-50 border border-brand-200">
            <ProgressBar
              value={avgProgress}
              lang={lang}
              label={bi(lang, 'پیشرفت کل مبحث (داده نمونه)', 'Topic Progress (Demo)')}
            />
            {suggestedSkill && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(`/student/practice/${suggestedSkill.id}`)}
                icon={<Play className="w-4 h-4 fill-current" />}
              >
                {bi(
                  lang,
                  `ادامه: ${suggestedSkill.titleFa}`,
                  `Practice: ${suggestedSkill.titleEn}`
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Skills grouped by Subtopic (if present) or flat */}
      {topicSkills.length === 0 ? (
        <EmptyState
          title={bi(lang, 'مهارتی در این مبحث ثبت نشده است', 'No skills in this topic')}
          description={bi(
            lang,
            'می‌توانید به کتابخانه مهارت‌ها برگردید و مبحث دیگری را انتخاب کنید.',
            'Return to the Skill Library to choose another topic.'
          )}
          action={
            <Button onClick={() => navigate('/student/skills')} icon={<BookOpen className="w-4 h-4" />}>
              {bi(lang, 'کتابخانه مهارت‌ها', 'Skill Library')}
            </Button>
          }
        />
      ) : topic.subtopics && topic.subtopics.length > 0 ? (
        <div className="space-y-6">
          {topic.subtopics.map((sub) => {
            const subSkills = topicSkills.filter((s) => s.subtopicId === sub.id);
            if (subSkills.length === 0) return null;
            return (
              <section key={sub.id}>
                <SectionHeader
                  title={bi(lang, sub.titleFa, sub.titleEn)}
                  subtitle={bi(
                    lang,
                    `${fmtNum(subSkills.length, 'fa')} مهارت در این زیرمبحث`,
                    `${subSkills.length} skills in this subtopic`
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subSkills.map((sk) => (
                    <SkillCard key={sk.id} skill={sk} lang={lang} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section>
          <SectionHeader
            title={bi(lang, 'فهرست مهارت‌های مبحث', 'Skills in This Topic')}
            subtitle={bi(
              lang,
              'این مبحث بدون سطح زیرمبحث میانی تعریف شده است تا سلسله‌مراتب خالی ایجاد نشود.',
              'This topic contains direct skills with no empty intermediate subtopic level.'
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicSkills.map((sk) => (
              <SkillCard key={sk.id} skill={sk} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
};
