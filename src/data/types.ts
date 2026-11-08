export type Role = 'student' | 'teacher' | 'placeholder';

export type SkillStatus = 'not_started' | 'in_progress' | 'mastered' | 'needs_review';

export type AssignmentStatus =
  | 'upcoming'
  | 'assigned'
  | 'in_progress'
  | 'overdue'
  | 'completed'
  | 'completed_late'
  | 'cancelled';

export interface QuestionItem {
  id: string;
  skillId: string;
  type: 'multiple_choice' | 'numeric_input';
  promptFa: string;
  promptEn: string;
  hintFa: string;
  hintEn: string;
  visualType?: 'fraction_bars' | 'decimal_grid' | 'geometry_rect' | 'number_line';
  visualMeta?: {
    aLabel?: string;
    bLabel?: string;
    widthCm?: number;
    heightCm?: number;
  };
  options?: {
    id: string;
    labelFa: string;
    labelEn: string;
  }[];
  correctAnswer: string; // option id or numeric string
  correctDisplayFa: string;
  correctDisplayEn: string;
  explanationFa: string;
  explanationEn: string;
  solvingStepsFa: string[];
  solvingStepsEn: string[];
  difficulty: 'basic' | 'medium' | 'challenge';
}

export interface Skill {
  id: string;
  code: string;
  grade: number;
  topicId: string;
  subtopicId?: string; // Optional! Some topics intentionally have no subtopics
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  status: SkillStatus; // Proposed demo status
  demoProgress: number; // 0-100 illustrative demo progress
  questionsAnswered: number;
  totalQuestions: number;
  estimatedMinutes: number;
  lastPracticedFa?: string;
  lastPracticedEn?: string;
  attentionNoteFa?: string;
  attentionNoteEn?: string;
}

export interface Subtopic {
  id: string;
  titleFa: string;
  titleEn: string;
}

export interface Topic {
  id: string;
  subjectId: 'math';
  grade: number;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  illustrationKey: 'fractions' | 'decimals' | 'geometry' | 'ratios' | 'data';
  subtopics?: Subtopic[]; // Present only when subtopics exist
}

export interface Assignment {
  id: string;
  titleFa: string;
  titleEn: string;
  skillIds: string[];
  classId: string;
  recipientType: 'whole_class' | 'selected_students';
  recipientStudentIds?: string[];
  recipientCount: number;
  teacherNameFa: string;
  teacherNameEn: string;
  dueDateFa: string;
  dueDateEn: string;
  dueIso: string;
  instructionsFa: string;
  instructionsEn: string;
  status: AssignmentStatus; // Proposed demo status
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  studentProgressPercent?: number;
}

export interface Recommendation {
  id: string;
  skillId: string;
  topicId: string;
  category: 'prerequisite' | 'continue_path' | 'spaced_review';
  reasonFa: string;
  reasonEn: string;
}

export interface StudentRosterItem {
  id: string;
  classId: string;
  nameFa: string;
  nameEn: string;
  username: string;
  activityStatus: 'active' | 'inactive' | 'overdue_task';
  lastActiveFa: string;
  lastActiveEn: string;
  completedAssignments: number;
  totalAssignments: number;
  practicedMinutesWeek: number;
  demoAccuracyPercent: number | null; // null if no activity
  needsSupportSkillId?: string;
  supportReasonFa?: string;
  supportReasonEn?: string;
}

export interface ClassGroup {
  id: string;
  nameFa: string;
  nameEn: string;
  grade: number;
  classCode: string;
  scheduleSummaryFa: string;
  scheduleSummaryEn: string;
  studentCount: number;
  isNewEmpty?: boolean;
}

export interface BadgeItem {
  id: string;
  titleFa: string;
  titleEn: string;
  criteriaFa: string;
  criteriaEn: string;
  unlocked: boolean;
  earnedDateFa?: string;
  earnedDateEn?: string;
  progressCurrent: number;
  progressTarget: number;
  iconKey: 'compass' | 'sparkles' | 'geometry' | 'streak' | 'fractions' | 'star';
}

export interface StoreItem {
  id: string;
  titleFa: string;
  titleEn: string;
  categoryFa: string;
  categoryEn: string;
  priceCoins: number;
  owned: boolean;
  equipped?: boolean;
  previewColor: string;
  previewSymbol: 'telescope' | 'compass' | 'owl' | 'prism' | 'planet' | 'crown';
  descriptionFa: string;
  descriptionEn: string;
}

export interface GeneratedQuiz {
  id: string;
  titleFa: string;
  titleEn: string;
  classId: string;
  skillIds: string[];
  questionIds: string[];
  difficulty: 'balanced' | 'basic' | 'challenge';
  status: 'draft' | 'published';
  createdAtFa: string;
  createdAtEn: string;
}

export interface TimetableEntry {
  id: string;
  dayIndex: 0 | 1 | 2 | 3 | 4; // Saturday (0) to Wednesday (4)
  timeSlot: string;
  entryType: 'scheduled_class' | 'assignment_deadline' | 'quiz_deadline';
  classId: string;
  titleFa: string;
  titleEn: string;
  topicId?: string;
  assignmentId?: string;
  noteFa?: string;
  noteEn?: string;
}

export type PageSimState =
  | 'normal'
  | 'loading'
  | 'error'
  | 'empty'
  | 'overdue'
  | 'multiple'
  | 'first_visit'
  | 'no_recommendations'
  | 'insufficient_data';
