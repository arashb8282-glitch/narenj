import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Assignment,
  BadgeItem,
  ClassGroup,
  GeneratedQuiz,
  PageSimState,
  Role,
  Skill,
  StoreItem,
  TimetableEntry,
} from '../data/types';
import {
  DEMO_STUDENT_PROFILE,
  INITIAL_ASSIGNMENTS,
  INITIAL_BADGES,
  INITIAL_CLASSES,
  INITIAL_QUIZZES,
  INITIAL_SKILLS,
  INITIAL_STORE_ITEMS,
  INITIAL_TIMETABLE,
} from '../data/mockData';
import { Language } from '../utils/format';

export interface ToastMessage {
  id: string;
  textFa: string;
  textEn: string;
  tone: 'success' | 'warning' | 'danger' | 'info';
}

export interface UnfinishedSession {
  skillId: string;
  questionIndex: number;
  totalQuestions: number;
  savedAtFa: string;
  savedAtEn: string;
}

export interface AssignmentWizardPreselection {
  skillIds: string[];
  classId: string;
  recipientType: 'whole_class' | 'selected_students';
  recipientStudentIds: string[];
  contextLabelFa?: string;
  contextLabelEn?: string;
}

interface PrototypeContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeClassId: string;
  setActiveClassId: (classId: string) => void;
  activeClass: ClassGroup;
  classes: ClassGroup[];
  pageSimState: PageSimState;
  setPageSimState: (state: PageSimState) => void;
  skills: Skill[];
  updateSkillProgress: (skillId: string, deltaProgress: number, answeredCount: number, completed?: boolean) => void;
  assignments: Assignment[];
  addAssignment: (assignment: Assignment) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  unfinishedSession: UnfinishedSession | null;
  setUnfinishedSession: (session: UnfinishedSession | null) => void;
  coins: number;
  badges: BadgeItem[];
  storeItems: StoreItem[];
  purchaseStoreItem: (itemId: string) => boolean;
  equipStoreItem: (itemId: string) => void;
  quizzes: GeneratedQuiz[];
  addQuiz: (quiz: GeneratedQuiz) => void;
  timetable: TimetableEntry[];
  addTimetableEntry: (entry: TimetableEntry) => void;
  teacherSelectedSkillIds: string[];
  toggleTeacherSelectedSkill: (skillId: string) => void;
  clearTeacherSelectedSkills: () => void;
  wizardPreselection: AssignmentWizardPreselection | null;
  setWizardPreselection: (pre: AssignmentWizardPreselection | null) => void;
  toasts: ToastMessage[];
  showToast: (textFa: string, textEn: string, tone?: ToastMessage['tone']) => void;
  dismissToast: (id: string) => void;
  resetDemoData: () => void;
}

const PrototypeContext = createContext<PrototypeContextValue | undefined>(undefined);

const INITIAL_UNFINISHED: UnfinishedSession = {
  skillId: 'sk-mult-decimals',
  questionIndex: 3, // Q4 (0-indexed 3)
  totalQuestions: 8,
  savedAtFa: 'امروز ساعت ۱۶:۴۰',
  savedAtEn: 'Today at 16:40',
};

export const PrototypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('fa');
  const [activeRole, setActiveRole] = useState<Role>('student');
  const [activeClassId, setActiveClassId] = useState<string>('cls-6a');
  const [pageSimState, setPageSimState] = useState<PageSimState>('normal');

  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [unfinishedSession, setUnfinishedSession] = useState<UnfinishedSession | null>(INITIAL_UNFINISHED);
  const [coins, setCoins] = useState<number>(DEMO_STUDENT_PROFILE.initialCoins);
  const [badges] = useState<BadgeItem[]>(INITIAL_BADGES);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(INITIAL_STORE_ITEMS);
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>(INITIAL_QUIZZES);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(INITIAL_TIMETABLE);

  const [teacherSelectedSkillIds, setTeacherSelectedSkillIds] = useState<string[]>([]);
  const [wizardPreselection, setWizardPreselection] = useState<AssignmentWizardPreselection | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'fa' ? 'en' : 'fa'));

  const showToast = (
    textFa: string,
    textEn: string,
    tone: ToastMessage['tone'] = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, textFa, textEn, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSkillProgress = (
    skillId: string,
    deltaProgress: number,
    answeredCount: number,
    completed = false
  ) => {
    setSkills((prev) =>
      prev.map((sk) => {
        if (sk.id !== skillId) return sk;
        const nextProgress = completed
          ? Math.max(sk.demoProgress, 90)
          : Math.min(100, Math.max(15, sk.demoProgress + deltaProgress));
        const nextStatus: Skill['status'] = completed
          ? 'mastered'
          : nextProgress > 0
            ? 'in_progress'
            : sk.status;
        return {
          ...sk,
          demoProgress: nextProgress,
          status: nextStatus,
          questionsAnswered: Math.max(sk.questionsAnswered, answeredCount),
          lastPracticedFa: 'چند لحظه پیش',
          lastPracticedEn: 'Just now',
        };
      })
    );

    if (completed) {
      setCoins((c) => c + 15);
      setAssignments((prev) =>
        prev.map((a) =>
          a.skillIds.includes(skillId) && a.status !== 'completed'
            ? { ...a, status: 'completed', studentProgressPercent: 100, completedCount: Math.min(a.recipientCount, a.completedCount + 1) }
            : a
        )
      );
    }
  };

  const addAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
  };

  const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const purchaseStoreItem = (itemId: string): boolean => {
    const target = storeItems.find((i) => i.id === itemId);
    if (!target || target.owned || coins < target.priceCoins) {
      return false;
    }
    setCoins((prev) => prev - target.priceCoins);
    setStoreItems((prev) =>
      prev.map((item) => ({
        ...item,
        owned: item.id === itemId ? true : item.owned,
        equipped: item.id === itemId ? true : false,
      }))
    );
    return true;
  };

  const equipStoreItem = (itemId: string) => {
    setStoreItems((prev) =>
      prev.map((item) => ({
        ...item,
        equipped: item.id === itemId,
      }))
    );
  };

  const addQuiz = (quiz: GeneratedQuiz) => {
    setQuizzes((prev) => [quiz, ...prev]);
  };

  const addTimetableEntry = (entry: TimetableEntry) => {
    setTimetable((prev) => [...prev, entry]);
  };

  const toggleTeacherSelectedSkill = (skillId: string) => {
    setTeacherSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const clearTeacherSelectedSkills = () => setTeacherSelectedSkillIds([]);

  const resetDemoData = () => {
    setSkills(INITIAL_SKILLS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setUnfinishedSession(INITIAL_UNFINISHED);
    setCoins(DEMO_STUDENT_PROFILE.initialCoins);
    setStoreItems(INITIAL_STORE_ITEMS);
    setQuizzes(INITIAL_QUIZZES);
    setTimetable(INITIAL_TIMETABLE);
    setTeacherSelectedSkillIds([]);
    setWizardPreselection(null);
    setPageSimState('normal');
    showToast(
      'داده‌های نمونه به حالت اولیه بازنشانی شد.',
      'Demo data has been reset to initial state.',
      'info'
    );
  };

  const activeClass =
    INITIAL_CLASSES.find((c) => c.id === activeClassId) ?? INITIAL_CLASSES[0];

  return (
    <PrototypeContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        activeRole,
        setActiveRole,
        activeClassId,
        setActiveClassId,
        activeClass,
        classes: INITIAL_CLASSES,
        pageSimState,
        setPageSimState,
        skills,
        updateSkillProgress,
        assignments,
        addAssignment,
        updateAssignmentStatus,
        unfinishedSession,
        setUnfinishedSession,
        coins,
        badges,
        storeItems,
        purchaseStoreItem,
        equipStoreItem,
        quizzes,
        addQuiz,
        timetable,
        addTimetableEntry,
        teacherSelectedSkillIds,
        toggleTeacherSelectedSkill,
        clearTeacherSelectedSkills,
        wizardPreselection,
        setWizardPreselection,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  );
};

export function usePrototype(): PrototypeContextValue {
  const ctx = useContext(PrototypeContext);
  if (!ctx) {
    throw new Error('usePrototype must be used inside PrototypeProvider');
  }
  return ctx;
}
