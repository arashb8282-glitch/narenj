import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, Globe, KeyRound, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { PageSimState, Role } from '../../data/types';
import { bi } from '../../utils/format';

export const PreviewToolbar: React.FC = () => {
  const {
    lang,
    toggleLang,
    activeRole,
    setActiveRole,
    pageSimState,
    setPageSimState,
    resetDemoData,
  } = usePrototype();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const handleRoleSwitch = (nextRole: Role) => {
    setActiveRole(nextRole);
    setPageSimState('normal');
    setMobileToolsOpen(false);
    if (nextRole === 'student') {
      navigate('/student');
    } else if (nextRole === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/roles-placeholder');
    }
  };

  const getStateOptions = (): { value: PageSimState; fa: string; en: string }[] => {
    const p = location.pathname;
    const base: { value: PageSimState; fa: string; en: string }[] = [
      { value: 'normal', fa: 'وضعیت عادی (پیش‌فرض)', en: 'Default State' },
      { value: 'loading', fa: 'در حال بارگذاری (Skeleton)', en: 'Loading (Skeleton)' },
      { value: 'error', fa: 'خطای ارتباط / بارگذاری', en: 'Load / Network Error' },
    ];
    if (p === '/student') {
      return [
        ...base,
        { value: 'multiple', fa: 'چند تکلیف هم‌زمان', en: 'Multiple Assignments' },
        { value: 'overdue', fa: 'تکلیف دیرشده', en: 'Overdue Assignment' },
        { value: 'empty', fa: 'بدون تکلیف فعال', en: 'No Active Assignments' },
        { value: 'first_visit', fa: 'اولین ورود دانش‌آموز', en: 'First-Time Visit' },
        { value: 'no_recommendations', fa: 'بدون پیشنهاد مهارتی', en: 'No Recommendations' },
      ];
    }
    if (p.includes('/analytics')) {
      return [
        ...base,
        { value: 'insufficient_data', fa: 'داده ناکافی / کلاس تازه', en: 'Insufficient Data' },
      ];
    }
    if (p.includes('/classes') || p.includes('/skills') || p.includes('/assignments')) {
      return [...base, { value: 'empty', fa: 'حالت خالی (Empty State)', en: 'Empty State' }];
    }
    return base;
  };

  const stateOptions = getStateOptions();

  return (
    <div
      role="region"
      aria-label={bi(lang, 'نوار ابزار پیش‌نمایش پروتوتایپ', 'Prototype Preview Toolbar')}
      className="bg-brand-950 text-white border-b border-white/10 px-3 sm:px-6 py-1.5 text-xs z-40"
    >
      <div className="max-w-shell mx-auto flex items-center justify-between gap-2">
        {/* Start: DEMO DATA badge + desktop preview notice */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent-500 text-ink-900 font-bold tracking-wide text-[10px] sm:text-[11px]">
            DEMO DATA
          </span>
          <span className="hidden xl:inline-flex items-center gap-1 text-white/75">
            <Eye className="w-3.5 h-3.5 text-turquoise-500" aria-hidden="true" />
            {bi(
              lang,
              'ابزار ارزیابی UX پروتوتایپ (جدا از رابط نهایی)',
              'Prototype UX Toolbar (Outside final product UI)'
            )}
          </span>
        </div>

        {/* End: Compact Role Switcher + Desktop Controls + Mobile Expand Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Role Switcher */}
          <div
            role="group"
            aria-label={bi(lang, 'تغییر نقش پیش‌نمایش', 'Preview Role Switcher')}
            className="inline-flex items-center bg-white/10 rounded-full p-0.5 border border-white/10"
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`px-2.5 py-0.5 sm:py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                activeRole === 'student' && !location.pathname.startsWith('/sign-in')
                  ? 'bg-turquoise-500 text-brand-950 font-bold'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              {bi(lang, 'دانش‌آموز', 'Student')}
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('teacher')}
              className={`px-2.5 py-0.5 sm:py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                activeRole === 'teacher' && !location.pathname.startsWith('/sign-in')
                  ? 'bg-orange-500 text-white font-bold'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              {bi(lang, 'معلم', 'Teacher')}
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('placeholder')}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors hidden md:inline-block whitespace-nowrap ${
                activeRole === 'placeholder'
                  ? 'bg-lavender-500 text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {bi(lang, 'والد / مدیر', 'Parent / Admin')}
            </button>
          </div>

          {/* Sign-In Screen shortcut (Desktop) */}
          <button
            type="button"
            onClick={() => navigate('/sign-in')}
            className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border transition-colors whitespace-nowrap ${
              location.pathname === '/sign-in'
                ? 'bg-white text-brand-950 border-white font-semibold'
                : 'border-white/20 text-white/85 hover:bg-white/10'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{bi(lang, 'صفحه ورود', 'Sign In')}</span>
          </button>

          {/* UX State Simulator (Desktop) */}
          {!location.pathname.startsWith('/sign-in') && (
            <div className="hidden md:inline-flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-0.5 border border-white/15">
              <SlidersHorizontal className="w-3.5 h-3.5 text-accent-500 shrink-0" aria-hidden="true" />
              <label htmlFor="ux-state-select" className="sr-only">
                {bi(lang, 'وضعیت نمایشی صفحه', 'Simulated Page State')}
              </label>
              <select
                id="ux-state-select"
                value={pageSimState}
                onChange={(e) => setPageSimState(e.target.value as PageSimState)}
                className="bg-transparent text-white text-xs py-0.5 focus:outline-none cursor-pointer"
              >
                {stateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-ink-900 bg-white">
                    {bi(lang, opt.fa, opt.en)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* FA / EN Language Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={bi(lang, 'تغییر زبان به انگلیسی (LTR)', 'Switch language to Persian (RTL)')}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 font-semibold shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-turquoise-500" aria-hidden="true" />
            <span className="ltr-token text-[11px]">
              {lang === 'fa' ? 'FA | EN' : 'EN | FA'}
            </span>
          </button>

          {/* Desktop Reset */}
          <button
            type="button"
            onClick={resetDemoData}
            title={bi(lang, 'بازنشانی داده‌های نمونه', 'Reset Demo Data')}
            className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">{bi(lang, 'بازنشانی', 'Reset')}</span>
          </button>

          {/* Mobile Tools Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileToolsOpen((o) => !o)}
            aria-label={bi(lang, 'ابزارهای شبیه‌ساز UX', 'UX Simulator Tools')}
            className="md:hidden inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 border border-white/15 text-accent-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Mobile UX State Panel (only when tapped) */}
      {mobileToolsOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
          {!location.pathname.startsWith('/sign-in') && (
            <select
              aria-label={bi(lang, 'وضعیت نمایشی صفحه', 'Simulated Page State')}
              value={pageSimState}
              onChange={(e) => {
                setPageSimState(e.target.value as PageSimState);
                setMobileToolsOpen(false);
              }}
              className="flex-1 min-h-[34px] bg-white/10 border border-white/20 rounded-control px-2.5 text-white text-xs"
            >
              {stateOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-ink-900 bg-white">
                  {bi(lang, opt.fa, opt.en)}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => {
              setMobileToolsOpen(false);
              navigate('/sign-in');
            }}
            className="px-2.5 py-1.5 rounded-control bg-white/10 text-white text-xs"
          >
            {bi(lang, 'صفحه ورود', 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('placeholder')}
            className="px-2.5 py-1.5 rounded-control bg-white/10 text-white text-xs"
          >
            {bi(lang, 'والد/مدیر', 'Parent/Admin')}
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              setMobileToolsOpen(false);
            }}
            className="px-2.5 py-1.5 rounded-control bg-white/10 text-accent-200 text-xs"
          >
            {bi(lang, 'بازنشانی', 'Reset')}
          </button>
        </div>
      )}
    </div>
  );
};
