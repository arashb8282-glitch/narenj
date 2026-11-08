import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PrototypeProvider, usePrototype } from './PrototypeContext';
import { SignInPage } from '../pages/auth/SignInPage';
import { StudentLandingPage } from '../pages/student/StudentLandingPage';
import { StudentSkillLibraryPage } from '../pages/student/StudentSkillLibraryPage';
import { TopicDetailPage } from '../pages/student/TopicDetailPage';
import { PracticeSessionPage } from '../pages/student/PracticeSessionPage';
import { StudentAnalyticsPage } from '../pages/student/StudentAnalyticsPage';
import { StudentRecommendationsPage } from '../pages/student/StudentRecommendationsPage';
import { StudentAchievementsPage } from '../pages/student/StudentAchievementsPage';
import { StudentStorePage } from '../pages/student/StudentStorePage';
import { TeacherLandingPage } from '../pages/teacher/TeacherLandingPage';
import { ClassManagementPage } from '../pages/teacher/ClassManagementPage';
import { TeacherSkillLibraryPage } from '../pages/teacher/TeacherSkillLibraryPage';
import { TeacherAssignmentsPage } from '../pages/teacher/TeacherAssignmentsPage';
import { TeacherAnalyticsPage } from '../pages/teacher/TeacherAnalyticsPage';
import { QuizGeneratorPage } from '../pages/teacher/QuizGeneratorPage';
import { TimetablePage } from '../pages/teacher/TimetablePage';
import { RolesPlaceholderPage } from '../pages/shared/RolesPlaceholderPage';

const RouteEffects: React.FC = () => {
  const location = useLocation();
  const { setPageSimState, setActiveRole } = usePrototype();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setPageSimState('normal');
    if (location.pathname.startsWith('/teacher')) {
      setActiveRole('teacher');
    } else if (location.pathname.startsWith('/student')) {
      setActiveRole('student');
    } else if (location.pathname.startsWith('/roles-placeholder')) {
      setActiveRole('placeholder');
    }
  }, [location.pathname, setPageSimState, setActiveRole]);

  return null;
};

const useHashMode =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' ||
    window.location.hostname.endsWith('github.io') ||
    window.location.pathname.endsWith('.html'));

const RouterComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (useHashMode) {
    return (
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {children}
      </HashRouter>
    );
  }
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {children}
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <PrototypeProvider>
      <RouterComponent>
        <RouteEffects />
        <Routes>
          <Route path="/" element={<Navigate to="/student" replace />} />
          <Route path="/sign-in" element={<SignInPage />} />

          {/* Student Experience */}
          <Route path="/student" element={<StudentLandingPage />} />
          <Route path="/student/skills" element={<StudentSkillLibraryPage />} />
          <Route path="/student/topics/:topicId" element={<TopicDetailPage />} />
          <Route path="/student/practice/:skillId" element={<PracticeSessionPage />} />
          <Route path="/student/analytics" element={<StudentAnalyticsPage />} />
          <Route path="/student/recommendations" element={<StudentRecommendationsPage />} />
          <Route path="/student/achievements" element={<StudentAchievementsPage />} />
          <Route path="/student/store" element={<StudentStorePage />} />

          {/* Teacher Experience */}
          <Route path="/teacher" element={<TeacherLandingPage />} />
          <Route path="/teacher/classes" element={<ClassManagementPage />} />
          <Route path="/teacher/skills" element={<TeacherSkillLibraryPage />} />
          <Route path="/teacher/assignments" element={<TeacherAssignmentsPage />} />
          <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
          <Route path="/teacher/quiz-generator" element={<QuizGeneratorPage />} />
          <Route path="/teacher/timetable" element={<TimetablePage />} />

          {/* Parent & School Admin Placeholder */}
          <Route path="/roles-placeholder" element={<RolesPlaceholderPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </RouterComponent>
    </PrototypeProvider>
  );
};
