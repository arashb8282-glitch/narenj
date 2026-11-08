import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Coins,
  Compass,
  FileQuestion,
  Home,
  LogOut,
  Menu,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { DEMO_STUDENT_PROFILE, DEMO_TEACHER_PROFILE } from '../../data/mockData';
import { bi, fmtNum } from '../../utils/format';
import { AvatarSymbolGraphic, RoshanaBrandMark } from './Illustrations';
import { PreviewToolbar } from './PreviewToolbar';
import { Avatar, ToastContainer } from '../ui/Primitives';

interface NavItem {
  to: string;
  end?: boolean;
  labelFa: string;
  labelEn: string;
  icon: React.ReactNode;
  badgeFa?: string;
  badgeEn?: string;
}

const STUDENT_NAV: NavItem[] = [
  { to: '/student', end: true, labelFa: 'خانه', labelEn: 'Home', icon: <Home className="w-5 h-5" /> },
  {
    to: '/student/skills',
    labelFa: 'کتابخانه مهارت‌ها',
    labelEn: 'Skill Library',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    to: '/student/recommendations',
    labelFa: 'پیشنهادها',
    labelEn: 'Recommendations',
    icon: <Compass className="w-5 h-5" />,
    badgeFa: '۳',
    badgeEn: '3',
  },
  {
    to: '/student/analytics',
    labelFa: 'پیشرفت من',
    labelEn: 'My Progress',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    to: '/student/achievements',
    labelFa: 'دستاوردها',
    labelEn: 'Achievements',
    icon: <Award className="w-5 h-5" />,
  },
  {
    to: '/student/store',
    labelFa: 'فروشگاه',
    labelEn: 'Store',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
];

const TEACHER_NAV: NavItem[] = [
  { to: '/teacher', end: true, labelFa: 'خانه', labelEn: 'Home', icon: <Home className="w-5 h-5" /> },
  {
    to: '/teacher/classes',
    labelFa: 'کلاس‌ها و دانش‌آموزان',
    labelEn: 'Classes & Students',
    icon: <Users className="w-5 h-5" />,
  },
  {
    to: '/teacher/skills',
    labelFa: 'کتابخانه مهارت‌ها',
    labelEn: 'Skill Library',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    to: '/teacher/assignments',
    labelFa: 'تکالیف',
    labelEn: 'Assignments',
    icon: <CheckSquare className="w-5 h-5" />,
  },
  {
    to: '/teacher/quiz-generator',
    labelFa: 'آزمون‌ساز',
    labelEn: 'Quiz Generator',
    icon: <FileQuestion className="w-5 h-5" />,
  },
  {
    to: '/teacher/timetable',
    labelFa: 'برنامه تدریس',
    labelEn: 'Timetable & Plan',
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    to: '/teacher/analytics',
    labelFa: 'تحلیل عملکرد',
    labelEn: 'Performance Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
];

export const AppShell: React.FC<{
  children: React.ReactNode;
  roleOverride?: 'student' | 'teacher' | 'minimal';
  focusedMode?: boolean;
}> = ({ children, roleOverride, focusedMode = false }) => {
  const {
    lang,
    activeRole,
    activeClassId,
    setActiveClassId,
    classes,
    coins,
    storeItems,
    toasts,
    dismissToast,
  } = usePrototype();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const effectiveRole =
    roleOverride === 'minimal'
      ? 'minimal'
      : roleOverride ?? (location.pathname.startsWith('/teacher') ? 'teacher' : activeRole);

  const navItems = effectiveRole === 'teacher' ? TEACHER_NAV : STUDENT_NAV;
  const equippedItem = storeItems.find((i) => i.equipped) ?? storeItems[0];

  if (effectiveRole === 'minimal') {
    return (
      <div className="min-h-screen flex flex-col bg-canvas">
        <PreviewToolbar />
        <main className="flex-1">{children}</main>
        <ToastContainer toasts={toasts} lang={lang} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-900">
      <PreviewToolbar />

      {/* Product Topbar */}
      {!focusedMode && (
        <header className="sticky top-0 z-30 h-[68px] bg-surface border-b border-border px-3 sm:px-6">
          <div className="max-w-shell mx-auto h-full flex items-center justify-between gap-2 sm:gap-3">
            {/* Start: Mobile menu button + Brand Logo + Role Tag */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={bi(lang, 'باز کردن منوی ناوبری', 'Open navigation menu')}
                className="lg:hidden p-2 rounded-control border border-border hover:bg-canvas text-ink-900 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to={effectiveRole === 'teacher' ? '/teacher' : '/student'}
                className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
              >
                <RoshanaBrandMark size={34} />
                <div>
                  <span className="text-base sm:text-lg font-bold text-brand-700 tracking-tight block leading-none whitespace-nowrap">
                    {bi(lang, 'روشنا', 'Roshana')}
                  </span>
                  <span className="hidden sm:block text-[11px] text-ink-600 font-medium mt-0.5 whitespace-nowrap">
                    {effectiveRole === 'teacher'
                      ? bi(lang, 'پنل آموزشی معلم', 'Teacher Workspace')
                      : bi(lang, 'محیط یادگیری دانش‌آموز', 'Student Learning')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Center/End Controls: Active Class Context for Teacher OR Grade/Coins for Student */}
            <div className="flex items-center gap-1.5 sm:gap-4 min-w-0">
              {effectiveRole === 'teacher' ? (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-brand-50 border border-brand-200 rounded-control px-2 sm:px-2.5 py-1.5 min-w-0">
                  <Users className="w-4 h-4 text-brand-700 hidden md:block shrink-0" aria-hidden="true" />
                  <label htmlFor="topbar-class-select" className="text-xs font-semibold text-brand-700 hidden md:inline whitespace-nowrap">
                    {bi(lang, 'کلاس فعال:', 'Active Class:')}
                  </label>
                  <select
                    id="topbar-class-select"
                    value={activeClassId}
                    onChange={(e) => setActiveClassId(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-ink-900 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-none truncate"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {bi(lang, cls.nameFa, cls.nameEn)} (
                        {fmtNum(cls.studentCount, lang)}{' '}
                        {bi(lang, 'نفر', 'students')})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    {bi(lang, 'پایه ششم • ریاضی (MVP)', 'Grade 6 • Mathematics (MVP)')}
                  </span>

                  {/* Secondary Coin Indicator — intentionally calm and non-competing */}
                  <Link
                    to="/student/store"
                    title={bi(lang, 'موجودی سکه (عنصر انگیزشی ثانویه)', 'Coin balance (secondary reward)')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-canvas hover:bg-accent-100 border border-border text-xs font-semibold text-ink-900 transition-colors whitespace-nowrap"
                  >
                    <Coins className="w-3.5 h-3.5 text-accent-700 shrink-0" aria-hidden="true" />
                    <span>
                      {fmtNum(coins, lang)} {bi(lang, 'سکه', 'coins')}
                    </span>
                  </Link>
                </>
              )}

              {/* User Profile Summary */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 ps-1.5 sm:ps-2 border-s border-border shrink-0">
                <div className="hidden sm:block">
                  {effectiveRole === 'student' ? (
                    <AvatarSymbolGraphic
                      symbol={equippedItem.previewSymbol}
                      bgColor={equippedItem.previewColor}
                      size={36}
                    />
                  ) : (
                    <Avatar
                      name={bi(lang, DEMO_TEACHER_PROFILE.nameFa, DEMO_TEACHER_PROFILE.nameEn)}
                      role="teacher"
                      size="md"
                    />
                  )}
                </div>
                <div className="hidden md:block text-start">
                  <div className="text-sm font-semibold text-ink-900 leading-tight whitespace-nowrap">
                    {effectiveRole === 'teacher'
                      ? bi(lang, DEMO_TEACHER_PROFILE.nameFa, DEMO_TEACHER_PROFILE.nameEn)
                      : bi(lang, DEMO_STUDENT_PROFILE.nameFa, DEMO_STUDENT_PROFILE.nameEn)}
                  </div>
                  <div className="text-[11px] text-ink-600 whitespace-nowrap">
                    {effectiveRole === 'teacher'
                      ? bi(lang, DEMO_TEACHER_PROFILE.subjectFa, DEMO_TEACHER_PROFILE.subjectEn)
                      : bi(lang, DEMO_STUDENT_PROFILE.classNameFa, DEMO_STUDENT_PROFILE.classNameEn)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/sign-in')}
                  title={bi(lang, 'خروج به صفحه ورود', 'Sign out to Sign-In screen')}
                  aria-label={bi(lang, 'خروج', 'Sign out')}
                  className="p-2 rounded-control text-ink-600 hover:text-danger-600 hover:bg-danger-100/50 transition-colors"
                >
                  <LogOut className="w-4 h-4 rtl-flip" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Body Container: Desktop Sidebar + Main Content */}
      <div className="flex-1 w-full max-w-shell mx-auto flex">
        {!focusedMode && (
          <aside
            aria-label={bi(lang, 'منوی اصلی', 'Primary Navigation')}
            className="hidden lg:flex lg:flex-col w-[256px] shrink-0 bg-surface border-e border-border py-5 px-3.5 justify-between"
          >
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-control text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-100 text-brand-700 border border-brand-200/80'
                        : 'text-ink-600 hover:bg-canvas hover:text-ink-900 border border-transparent'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    <span>{bi(lang, item.labelFa, item.labelEn)}</span>
                  </span>
                  {item.badgeFa && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-accent-100 text-accent-700 font-semibold">
                      {bi(lang, item.badgeFa, item.badgeEn ?? item.badgeFa)}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 p-3.5 rounded-card bg-canvas border border-border text-xs text-ink-600 space-y-1.5">
              <div className="font-semibold text-ink-900">
                {bi(lang, 'دامنه نسخه آزمایشی (MVP)', 'MVP Prototype Scope')}
              </div>
              <p className="leading-relaxed">
                {effectiveRole === 'teacher'
                  ? bi(
                      lang,
                      'سؤال‌ها از بانک سؤال استاندارد انتخاب می‌شوند. ساخت یا ویرایش متن سؤال در MVP وجود ندارد.',
                      'Questions come from the standard Question Bank. Question authoring/editing is out of MVP scope.'
                    )
                  : bi(
                      lang,
                      'تمرکز فعلی روی درس ریاضی است. علوم و ادبیات در فازهای بعدی اضافه می‌شوند.',
                      'Current MVP focuses on Mathematics. Science and Language are planned for later phases.'
                    )}
              </p>
            </div>
          </aside>
        )}

        {/* Mobile Slide-Over Navigation Drawer */}
        {!focusedMode && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex bg-ink-900/45" role="dialog" aria-modal="true">
            <div className="w-72 max-w-[85vw] bg-surface h-full p-4 flex flex-col justify-between border-e border-border">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <RoshanaBrandMark size={32} />
                    <span className="font-bold text-brand-700">
                      {bi(lang, 'روشنا', 'Roshana')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation"
                    className="p-1.5 rounded-control hover:bg-canvas text-ink-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between gap-3 px-3.5 py-3 rounded-control text-sm font-semibold ${
                          isActive
                            ? 'bg-brand-100 text-brand-700'
                            : 'text-ink-600 hover:bg-canvas hover:text-ink-900'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{bi(lang, item.labelFa, item.labelEn)}</span>
                      </span>
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="pt-3 border-t border-border text-xs text-ink-600">
                {bi(lang, 'نسخه پروتوتایپ تعاملی ۰.۱', 'Interactive UX Prototype v0.1')}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Page Content */}
        <main
          className={`flex-1 min-w-0 ${
            focusedMode ? 'px-4 sm:px-6 py-5' : 'px-4 sm:px-6 lg:px-8 py-6 sm:py-7'
          }`}
        >
          {children}
        </main>
      </div>

      <ToastContainer toasts={toasts} lang={lang} onDismiss={dismissToast} />
    </div>
  );
};
