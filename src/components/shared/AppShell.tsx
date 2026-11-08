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
  Flame,
  Home,
  LogOut,
  Menu,
  MoreHorizontal,
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
  shortFa: string;
  shortEn: string;
  icon: React.ReactNode;
  badgeFa?: string;
  badgeEn?: string;
  accentDot: string;
}

const STUDENT_NAV: NavItem[] = [
  {
    to: '/student',
    end: true,
    labelFa: 'خانه من',
    labelEn: 'Home',
    shortFa: 'خانه',
    shortEn: 'Home',
    icon: <Home className="w-5 h-5" />,
    accentDot: 'bg-turquoise-500',
  },
  {
    to: '/student/skills',
    labelFa: 'کتابخانه مهارت‌ها',
    labelEn: 'Skill Library',
    shortFa: 'مهارت‌ها',
    shortEn: 'Skills',
    icon: <BookOpen className="w-5 h-5" />,
    accentDot: 'bg-orange-500',
  },
  {
    to: '/student/recommendations',
    labelFa: 'پیشنهادهای یادگیری',
    labelEn: 'Recommendations',
    shortFa: 'پیشنهادها',
    shortEn: 'For You',
    icon: <Compass className="w-5 h-5" />,
    badgeFa: '۳',
    badgeEn: '3',
    accentDot: 'bg-lavender-500',
  },
  {
    to: '/student/analytics',
    labelFa: 'پیشرفت من',
    labelEn: 'My Progress',
    shortFa: 'پیشرفت',
    shortEn: 'Progress',
    icon: <BarChart3 className="w-5 h-5" />,
    accentDot: 'bg-success-500',
  },
  {
    to: '/student/achievements',
    labelFa: 'دستاوردها و مدال‌ها',
    labelEn: 'Achievements',
    shortFa: 'دستاوردها',
    shortEn: 'Badges',
    icon: <Award className="w-5 h-5" />,
    accentDot: 'bg-accent-500',
  },
  {
    to: '/student/store',
    labelFa: 'فروشگاه آواتار',
    labelEn: 'Rewards Store',
    shortFa: 'فروشگاه',
    shortEn: 'Store',
    icon: <ShoppingBag className="w-5 h-5" />,
    accentDot: 'bg-coral-500',
  },
];

const TEACHER_NAV: NavItem[] = [
  {
    to: '/teacher',
    end: true,
    labelFa: 'پیشخوان معلم',
    labelEn: 'Dashboard',
    shortFa: 'پیشخوان',
    shortEn: 'Home',
    icon: <Home className="w-5 h-5" />,
    accentDot: 'bg-turquoise-500',
  },
  {
    to: '/teacher/classes',
    labelFa: 'کلاس‌ها و دانش‌آموزان',
    labelEn: 'Classes & Students',
    shortFa: 'کلاس‌ها',
    shortEn: 'Classes',
    icon: <Users className="w-5 h-5" />,
    accentDot: 'bg-orange-500',
  },
  {
    to: '/teacher/skills',
    labelFa: 'کتابخانه مهارت‌ها',
    labelEn: 'Skill Library',
    shortFa: 'مهارت‌ها',
    shortEn: 'Skills',
    icon: <BookOpen className="w-5 h-5" />,
    accentDot: 'bg-lavender-500',
  },
  {
    to: '/teacher/assignments',
    labelFa: 'مدیریت تکالیف',
    labelEn: 'Assignments',
    shortFa: 'تکالیف',
    shortEn: 'Tasks',
    icon: <CheckSquare className="w-5 h-5" />,
    accentDot: 'bg-accent-500',
  },
  {
    to: '/teacher/analytics',
    labelFa: 'تحلیل عملکرد',
    labelEn: 'Analytics',
    shortFa: 'تحلیل',
    shortEn: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    accentDot: 'bg-success-500',
  },
  {
    to: '/teacher/quiz-generator',
    labelFa: 'آزمون‌ساز بانک سؤال',
    labelEn: 'Quiz Generator',
    shortFa: 'آزمون‌ساز',
    shortEn: 'Quiz',
    icon: <FileQuestion className="w-5 h-5" />,
    accentDot: 'bg-coral-500',
  },
  {
    to: '/teacher/timetable',
    labelFa: 'برنامه تدریس هفتگی',
    labelEn: 'Timetable & Plan',
    shortFa: 'تقویم',
    shortEn: 'Plan',
    icon: <CalendarDays className="w-5 h-5" />,
    accentDot: 'bg-turquoise-500',
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
    activeClass,
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
  const mobileBottomPrimary = navItems.slice(0, 4);
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
        <header className="sticky top-0 z-30 h-[62px] sm:h-[68px] bg-surface/95 backdrop-blur-sm border-b border-border px-3 sm:px-6">
          <div className="max-w-shell mx-auto h-full flex items-center justify-between gap-2 sm:gap-4">
            {/* Start: Mobile menu button + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label={bi(lang, 'باز کردن منوی کامل', 'Open full navigation menu')}
                className="lg:hidden p-2 rounded-control border border-border-strong bg-canvas hover:bg-turquoise-50 text-brand-900 shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                to={effectiveRole === 'teacher' ? '/teacher' : '/student'}
                className="flex items-center gap-2.5 group shrink-0"
              >
                <RoshanaBrandMark size={36} />
                <div>
                  <span className="text-base sm:text-lg font-bold text-brand-900 tracking-tight block leading-none whitespace-nowrap">
                    {bi(lang, 'روشنا', 'Roshana')}
                  </span>
                  <span className="hidden sm:block text-[11px] font-semibold text-turquoise-700 mt-0.5 whitespace-nowrap">
                    {effectiveRole === 'teacher'
                      ? bi(lang, 'پنل حرفه‌ای معلم', 'Teacher Studio')
                      : bi(lang, 'محیط یادگیری دانش‌آموز', 'Student Learning')}
                  </span>
                </div>
              </Link>
            </div>

            {/* End: Contextual Chips + User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              {effectiveRole === 'teacher' ? (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-turquoise-50 border-2 border-turquoise-200 rounded-control px-2.5 py-1.5 min-w-0">
                  <Users
                    className="w-4 h-4 text-turquoise-700 hidden md:block shrink-0"
                    aria-hidden="true"
                  />
                  <label
                    htmlFor="topbar-class-select"
                    className="text-xs font-bold text-turquoise-700 hidden md:inline whitespace-nowrap"
                  >
                    {bi(lang, 'کلاس فعال:', 'Active Class:')}
                  </label>
                  <select
                    id="topbar-class-select"
                    value={activeClassId}
                    onChange={(e) => setActiveClassId(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-bold text-brand-900 focus:outline-none cursor-pointer max-w-[138px] sm:max-w-none truncate"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {bi(lang, cls.nameFa, cls.nameEn)} ({fmtNum(cls.studentCount, lang)}{' '}
                        {bi(lang, 'نفر', 'students')})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100 text-lavender-700 border border-lavender-200 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    {bi(lang, 'پایه ششم • ریاضی', 'Grade 6 • Math')}
                  </span>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold whitespace-nowrap">
                    <Flame className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" />
                    <span>
                      {fmtNum(DEMO_STUDENT_PROFILE.streakDays, lang)} {bi(lang, 'روز', 'd')}
                    </span>
                  </span>

                  <Link
                    to="/student/store"
                    title={bi(lang, 'موجودی سکه و فروشگاه آواتار', 'Coins & Avatar Store')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-100 hover:bg-accent-200 border border-accent-200 text-xs font-bold text-accent-800 transition-colors whitespace-nowrap"
                  >
                    <Coins className="w-3.5 h-3.5 text-accent-700 shrink-0" aria-hidden="true" />
                    <span>
                      {fmtNum(coins, lang)} {bi(lang, 'سکه', 'coins')}
                    </span>
                  </Link>
                </>
              )}

              {/* User Profile Summary */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 ps-1.5 sm:ps-3 border-s border-border shrink-0">
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
                  <div className="text-sm font-bold text-ink-900 leading-tight whitespace-nowrap">
                    {effectiveRole === 'teacher'
                      ? bi(lang, DEMO_TEACHER_PROFILE.nameFa, DEMO_TEACHER_PROFILE.nameEn)
                      : bi(lang, DEMO_STUDENT_PROFILE.nameFa, DEMO_STUDENT_PROFILE.nameEn)}
                  </div>
                  <div className="text-[11px] font-medium text-ink-600 whitespace-nowrap">
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
                  className="p-2 rounded-control text-ink-600 hover:text-coral-600 hover:bg-coral-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 rtl-flip" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Body Container: Deep Teal Desktop Sidebar + Colorful Content Canvas */}
      <div className="flex-1 w-full max-w-shell mx-auto flex">
        {!focusedMode && (
          <aside
            aria-label={bi(lang, 'منوی اصلی', 'Primary Navigation')}
            className="hidden lg:flex lg:flex-col w-[264px] shrink-0 bg-brand-900 text-white py-6 px-4 justify-between border-e border-brand-800"
          >
            <div className="space-y-6">
              {/* Role Context Mini-Card inside Sidebar */}
              {effectiveRole === 'student' ? (
                <div className="p-3.5 rounded-card bg-brand-800/90 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-turquoise-200 font-semibold">
                      {bi(lang, 'هدف هفتگی آوا', 'Weekly Goal')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-accent-500 text-ink-900 font-bold text-[11px]">
                      {fmtNum(DEMO_STUDENT_PROFILE.weeklyGoalCurrentMinutes, lang)} /{' '}
                      {fmtNum(DEMO_STUDENT_PROFILE.weeklyGoalTargetMinutes, lang)}{' '}
                      {bi(lang, 'دقیقه', 'm')}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-brand-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-accent-500 to-turquoise-500"
                      style={{ width: '72%' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-card bg-brand-800/90 border border-white/10 space-y-1">
                  <span className="text-[11px] text-turquoise-200 font-semibold block">
                    {bi(lang, 'کلاس در حال بررسی', 'Active Class Context')}
                  </span>
                  <div className="text-sm font-bold text-white">
                    {bi(lang, activeClass.nameFa, activeClass.nameEn)}
                  </div>
                  <div className="text-xs text-white/75 flex items-center justify-between pt-1">
                    <span>
                      {fmtNum(activeClass.studentCount, lang)} {bi(lang, 'دانش‌آموز', 'students')}
                    </span>
                    <span className="ltr-token px-1.5 py-0.5 rounded bg-brand-950 text-turquoise-200 text-[11px]">
                      {activeClass.classCode}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-3 px-3.5 py-3 rounded-control text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-turquoise-500 text-brand-950 font-bold shadow-sm'
                          : 'text-white/85 hover:bg-brand-800 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isActive ? 'bg-brand-950' : item.accentDot
                            }`}
                          />
                          {item.icon}
                          <span>{bi(lang, item.labelFa, item.labelEn)}</span>
                        </span>
                        {item.badgeFa && (
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                              isActive
                                ? 'bg-brand-950 text-accent-200'
                                : 'bg-orange-500 text-white'
                            }`}
                          >
                            {bi(lang, item.badgeFa, item.badgeEn ?? item.badgeFa)}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="mt-6 p-3.5 rounded-card bg-brand-950/75 border border-white/10 text-xs text-white/75 space-y-1.5">
              <div className="font-bold text-accent-200">
                {bi(lang, 'دامنه نسخه آزمایشی (MVP)', 'MVP Prototype Scope')}
              </div>
              <p className="leading-relaxed">
                {effectiveRole === 'teacher'
                  ? bi(
                      lang,
                      'سؤال‌ها از بانک استاندارد روشنا انتخاب می‌شوند؛ ساخت یا ویرایش سؤال در MVP وجود ندارد.',
                      'Questions come from the approved Question Bank; manual authoring is disabled.'
                    )
                  : bi(
                      lang,
                      'تمرکز فعلی روی ریاضی است. علوم و ادبیات در فازهای بعدی اضافه می‌شوند.',
                      'MVP focuses on Mathematics. Science and Language follow in later phases.'
                    )}
              </p>
            </div>
          </aside>
        )}

        {/* Mobile Full Slide-Over Navigation Sheet */}
        {!focusedMode && mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden flex bg-brand-950/60 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-72 max-w-[85vw] bg-brand-900 text-white h-full p-4 flex flex-col justify-between border-e border-brand-800">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
                  <div className="flex items-center gap-2.5">
                    <RoshanaBrandMark size={34} inverted />
                    <div>
                      <span className="font-bold text-white block leading-none">
                        {bi(lang, 'روشنا', 'Roshana')}
                      </span>
                      <span className="text-[11px] text-turquoise-200">
                        {effectiveRole === 'teacher'
                          ? bi(lang, 'منوی معلم', 'Teacher Menu')
                          : bi(lang, 'منوی دانش‌آموز', 'Student Menu')}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation"
                    className="p-1.5 rounded-control hover:bg-brand-800 text-white/80"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between gap-3 px-3.5 py-3 rounded-control text-sm font-semibold ${
                          isActive
                            ? 'bg-turquoise-500 text-brand-950 font-bold'
                            : 'text-white/85 hover:bg-brand-800'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span>{bi(lang, item.labelFa, item.labelEn)}</span>
                      </span>
                      {item.badgeFa && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500 text-white font-bold">
                          {bi(lang, item.badgeFa, item.badgeEn ?? item.badgeFa)}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="pt-3 border-t border-white/15 text-xs text-white/70">
                {bi(lang, 'نسخه پروتوتایپ تعاملی روشنا', 'Roshana Interactive Prototype')}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Page Content */}
        <main
          className={`flex-1 min-w-0 ${
            focusedMode
              ? 'px-3.5 sm:px-6 py-4 sm:py-6 bg-gradient-to-b from-surface-sky/75 via-canvas to-canvas-warm/60'
              : 'px-3.5 sm:px-6 lg:px-8 pt-5 pb-8 lg:py-7'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Dedicated Mobile Bottom Tab Bar (< lg, hidden during Practice Session) */}
      {!focusedMode && (
        <nav
          aria-label={bi(lang, 'ناوبری سریع موبایل', 'Mobile Bottom Navigation')}
          className="lg:hidden sticky bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border-strong px-2 py-1.5"
          style={{ boxShadow: '0 -4px 16px rgba(9, 38, 53, 0.08)' }}
        >
          <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
            {mobileBottomPrimary.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center min-h-[50px] rounded-control px-1 py-1 text-[11px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-turquoise-100 text-brand-900 font-bold'
                      : 'text-ink-600 hover:text-brand-800'
                  }`
                }
              >
                {item.icon}
                <span className="mt-0.5 truncate max-w-full">
                  {bi(lang, item.shortFa, item.shortEn)}
                </span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center min-h-[50px] rounded-control px-1 py-1 text-[11px] font-semibold text-ink-600 hover:text-brand-800"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="mt-0.5">{bi(lang, 'بیشتر', 'More')}</span>
            </button>
          </div>
        </nav>
      )}

      <ToastContainer toasts={toasts} lang={lang} onDismiss={dismissToast} />
    </div>
  );
};
