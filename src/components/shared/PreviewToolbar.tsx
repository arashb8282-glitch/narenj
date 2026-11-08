import React from 'react';
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

  const handleRoleSwitch = (nextRole: Role) => {
    setActiveRole(nextRole);
    setPageSimState('normal');
    if (nextRole === 'student') {
      navigate('/student');
    } else if (nextRole === 'teacher') {
      navigate('/teacher');
    } else {
      navigate('/roles-placeholder');
    }
  };

  // Contextual UX state options per page
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
      return [
        ...base,
        { value: 'empty', fa: 'حالت خالی (Empty State)', en: 'Empty State' },
      ];
    }
    return base;
  };

  const stateOptions = getStateOptions();

  return (
    <div
      role="region"
      aria-label={bi(lang, 'نوار ابزار پیش‌نمایش پروتوتایپ', 'Prototype Preview Toolbar')}
      className="bg-[#17242C] text-white border-b border-white/15 px-3 sm:px-6 py-2 text-xs z-40"
    >
      <div className="max-w-shell mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left/Start: DEMO DATA badge + preview notice */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-500 text-ink-900 font-bold tracking-wide text-[11px]">
            DEMO DATA
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-white/80">
            <Eye className="w-3.5 h-3.5 text-accent-500" aria-hidden="true" />
            {bi(
              lang,
              'ابزار ارزیابی UX پروتوتایپ (در محصول نهایی نمایش داده نمی‌شود)',
              'UX Evaluation Preview Bar (Not part of final product UI)'
            )}
          </span>
        </div>

        {/* Center/End: Role Switcher + State Simulator + Lang + Sign-in + Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Switcher */}
          <div
            role="group"
            aria-label={bi(lang, 'تغییر نقش پیش‌نمایش', 'Preview Role Switcher')}
            className="inline-flex items-center bg-white/10 rounded-[6px] p-0.5"
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`px-2.5 py-1 rounded-[5px] font-semibold transition-colors ${
                activeRole === 'student' && !location.pathname.startsWith('/sign-in')
                  ? 'bg-brand-600 text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {bi(lang, 'دانش‌آموز (آوا)', 'Student (Ava)')}
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('teacher')}
              className={`px-2.5 py-1 rounded-[5px] font-semibold transition-colors ${
                activeRole === 'teacher' && !location.pathname.startsWith('/sign-in')
                  ? 'bg-brand-600 text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {bi(lang, 'معلم (خانم احمدی)', 'Teacher (Ms. Ahmadi)')}
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('placeholder')}
              className={`px-2 py-1 rounded-[5px] font-medium transition-colors hidden sm:inline-block ${
                activeRole === 'placeholder'
                  ? 'bg-brand-600 text-white'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {bi(lang, 'والد / مدیر', 'Parent / Admin')}
            </button>
          </div>

          {/* Sign-In Screen shortcut */}
          <button
            type="button"
            onClick={() => navigate('/sign-in')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] border transition-colors ${
              location.pathname === '/sign-in'
                ? 'bg-white text-ink-900 border-white font-semibold'
                : 'border-white/20 text-white/85 hover:bg-white/10'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{bi(lang, 'صفحه ورود', 'Sign In')}</span>
          </button>

          {/* UX State Simulator */}
          {!location.pathname.startsWith('/sign-in') && (
            <div className="inline-flex items-center gap-1 bg-white/10 rounded-[6px] px-2 py-0.5 border border-white/15">
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

          {/* FA / EN Language & RTL/LTR Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={bi(lang, 'تغییر زبان به انگلیسی (LTR)', 'Switch language to Persian (RTL)')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-white/10 hover:bg-white/20 border border-white/15 font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-accent-500" aria-hidden="true" />
            <span className="ltr-token">{lang === 'fa' ? 'FA (RTL) | EN' : 'EN (LTR) | FA'}</span>
          </button>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={resetDemoData}
            title={bi(lang, 'بازنشانی داده‌های نمونه', 'Reset Demo Data')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] text-white/80 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden xl:inline">{bi(lang, 'بازنشانی', 'Reset')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
