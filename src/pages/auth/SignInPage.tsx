import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { RoshanaBrandMark, StudentHeroIllustration } from '../../components/shared/Illustrations';
import { Badge, Button, Card, DemoBadge, Modal } from '../../components/ui/Primitives';
import { bi } from '../../utils/format';

export const SignInPage: React.FC = () => {
  const { lang, setActiveRole, showToast } = usePrototype();
  const navigate = useNavigate();

  const [username, setUsername] = useState('ava.rezaei');
  const [password, setPassword] = useState('school1405');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [joinClassOpen, setJoinClassOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState('RSH-6A24');
  const [joinSuccess, setJoinSuccess] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg(
        bi(
          lang,
          'لطفاً نام کاربری و رمز عبور دریافت‌شده از مدرسه را وارد کنید.',
          'Please enter both school username and password.'
        )
      );
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      const clean = username.trim().toLowerCase();
      if (clean === 'wrong.user' || password === 'wrong') {
        setErrorMsg(
          bi(
            lang,
            'نام کاربری یا رمز عبور نادرست است. اگر رمز خود را فراموش کرده‌اید از راهنمای بازیابی کمک بگیرید.',
            'Invalid username or password. Use the recovery guide if you need help.'
          )
        );
        return;
      }

      // Role detection happens automatically post-authentication (no role picker in sign-in!)
      if (clean.includes('ahmadi') || clean.includes('teacher') || clean.startsWith('t.')) {
        setActiveRole('teacher');
        showToast(
          'خوش آمدید خانم احمدی! به پیشخوان معلم هدایت شدید.',
          'Welcome Ms. Ahmadi! Redirected to Teacher Landing.',
          'success'
        );
        navigate('/teacher');
      } else {
        setActiveRole('student');
        showToast(
          'سلام آوا! به محیط یادگیری روشنا خوش آمدی.',
          'Welcome back, Ava! Redirected to Student Landing.',
          'success'
        );
        navigate('/student');
      }
    }, 550);
  };

  const handleJoinClassCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCodeInput.trim()) return;
    setJoinSuccess(true);
  };

  return (
    <AppShell roleOverride="minimal">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Brand & Visual Panel */}
          <div className="lg:col-span-6 bg-surface rounded-cardLg border border-border p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <RoshanaBrandMark size={44} />
                  <div>
                    <span className="text-xl font-bold text-brand-700 block">
                      {bi(lang, 'روشنا', 'Roshana')}
                    </span>
                    <span className="typo-caption">
                      {bi(
                        lang,
                        'پلتفرم یادگیری و تمرین هدفمند مهارت‌ها',
                        'Learning & Skills Practice Platform'
                      )}
                    </span>
                  </div>
                </div>
                <DemoBadge lang={lang} />
              </div>

              <h1 className="typo-page-title pt-2">
                {bi(
                  lang,
                  'هر روز یک مهارت تازه را با اطمینان یاد بگیر',
                  'Master one skill at a time with clarity and confidence'
                )}
              </h1>
              <p className="typo-body text-ink-600">
                {bi(
                  lang,
                  'پس از ورود با حساب مدرسه، سامانه به‌صورت خودکار شما را به صفحه ویژه دانش‌آموز یا معلم هدایت می‌کند. ثبت‌نام عمومی آزاد در نسخه MVP وجود ندارد.',
                  'Sign in with your school-issued credentials. Your role is detected automatically without a manual role-selection step.'
                )}
              </p>
            </div>

            <div className="my-6 flex justify-center">
              <StudentHeroIllustration />
            </div>

            {/* Separate Class Code Path (Section 6.1 requirement) */}
            <div className="rounded-card bg-brand-50 border border-brand-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-brand-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>{bi(lang, 'کد کلاس دارید؟', 'Have a Class Code?')}</span>
                </div>
                <p className="text-xs text-ink-600 mt-0.5">
                  {bi(
                    lang,
                    'مسیر پیوستن به کلاس مستقل از فرم ورود اصلی است (جزئیات سیاستی در حال نهایی‌سازی).',
                    'Joining a class via Class Code is separate from primary sign-in.'
                  )}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setJoinSuccess(false);
                  setJoinClassOpen(true);
                }}
              >
                {bi(lang, 'پیوستن به کلاس', 'Join a Class')}
              </Button>
            </div>
          </div>

          {/* Sign-In Form + Prototype Evaluator Quick-Fill */}
          <div className="lg:col-span-6 flex flex-col gap-5 justify-between">
            <Card padding="lg">
              <div className="mb-5">
                <h2 className="typo-section-title">
                  {bi(lang, 'ورود به حساب کاربری مدرسه', 'Sign in with School Account')}
                </h2>
                <p className="typo-caption mt-1">
                  {bi(
                    lang,
                    'نام کاربری و رمز عبوری که از طرف مدرسه دریافت کرده‌اید را وارد کنید.',
                    'Enter the username and password provided by your school.'
                  )}
                </p>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 p-3.5 rounded-control bg-danger-100 border border-danger-600/40 text-danger-600 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="signin-username"
                    className="block text-sm font-semibold text-ink-900 mb-1.5"
                  >
                    {bi(lang, 'نام کاربری', 'Username')}
                  </label>
                  <div className="relative">
                    <User
                      className="w-4 h-4 text-ink-600 absolute top-1/2 -translate-y-1/2 start-3.5"
                      aria-hidden="true"
                    />
                    <input
                      id="signin-username"
                      type="text"
                      dir="ltr"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ava.rezaei"
                      className="w-full min-h-[44px] ps-10 pe-3.5 py-2 bg-surface border border-border rounded-control text-sm text-ink-900 focus:border-brand-600 focus:outline-none ltr-token"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="signin-password"
                      className="text-sm font-semibold text-ink-900"
                    >
                      {bi(lang, 'رمز عبور', 'Password')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setRecoveryOpen(true)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {bi(lang, 'رمز عبور را فراموش کرده‌ام', 'Forgot password / Help')}
                      </span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock
                      className="w-4 h-4 text-ink-600 absolute top-1/2 -translate-y-1/2 start-3.5"
                      aria-hidden="true"
                    />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full min-h-[44px] ps-10 pe-11 py-2 bg-surface border border-border rounded-control text-sm text-ink-900 focus:border-brand-600 focus:outline-none ltr-token"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword
                          ? bi(lang, 'پنهان کردن رمز عبور', 'Hide password')
                          : bi(lang, 'نمایش رمز عبور', 'Show password')
                      }
                      className="absolute top-1/2 -translate-y-1/2 end-2.5 p-1.5 rounded text-ink-600 hover:bg-canvas"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full mt-2"
                  icon={<KeyRound className="w-4 h-4" />}
                >
                  {bi(lang, 'ورود به روشنا', 'Sign in to Roshana')}
                </Button>
              </form>
            </Card>

            {/* Prototype-Only Helper Card — explicitly separated from real product form */}
            <Card padding="md" className="bg-canvas border-dashed border-2 border-border">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-bold text-ink-900 inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-700" aria-hidden="true" />
                  {bi(
                    lang,
                    'میان‌بر تست پروتوتایپ (خارج از فرم واقعی محصول)',
                    'Prototype Quick-Fill Helper (For UX Review Only)'
                  )}
                </span>
                <Badge tone="accent">DEMO</Badge>
              </div>
              <p className="text-xs text-ink-600 mb-3">
                {bi(
                  lang,
                  'در محصول واقعی کاربر نقش انتخاب نمی‌کند و نقش از حساب کاربری تشخیص داده می‌شود. برای تست سریع روی یکی از حساب‌های نمونه زیر کلیک کنید:',
                  'In production, role is inferred from credentials. Click a preset below to test auto-routing or error handling:'
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setUsername('ava.rezaei');
                    setPassword('school1405');
                    setErrorMsg(null);
                  }}
                >
                  {bi(lang, 'حساب دانش‌آموز (ava.rezaei)', 'Student (ava.rezaei)')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setUsername('m.ahmadi');
                    setPassword('teacher1405');
                    setErrorMsg(null);
                  }}
                >
                  {bi(lang, 'حساب معلم (m.ahmadi)', 'Teacher (m.ahmadi)')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUsername('wrong.user');
                    setPassword('wrong');
                    setErrorMsg(null);
                  }}
                >
                  {bi(lang, 'شبیه‌سازی خطای رمز', 'Test Invalid Login')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Password Recovery Modal (Prototype policy notice) */}
      <Modal
        open={recoveryOpen}
        onClose={() => setRecoveryOpen(false)}
        title={bi(lang, 'راهنمای بازیابی حساب مدرسه', 'Account Recovery Guide')}
        footer={
          <Button variant="primary" onClick={() => setRecoveryOpen(false)}>
            {bi(lang, 'متوجه شدم', 'Got it')}
          </Button>
        }
      >
        <div className="space-y-3 text-sm text-ink-900">
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="سیاست بازیابی رمز در حال نهایی‌سازی"
            labelEn="Recovery Policy Pending Approval"
          />
          <p className="leading-relaxed">
            {bi(
              lang,
              'از آنجا که حساب دانش‌آموزان توسط مدرسه صادر می‌شود و ممکن است دانش‌آموزان ۹ تا ۱۵ سال ایمیل یا شماره همراه شخصی نداشته باشند، فرایند دقیق بازنشانی رمز (توسط معلم یا مسئول فناوری مدرسه) در حال تصویب نهایی است.',
              'Because student accounts are school-provisioned and students aged 9–15 may not have personal email/SMS, self-service vs. teacher-assisted password reset policy is currently under review.'
            )}
          </p>
          <div className="p-3.5 rounded-control bg-brand-50 border border-brand-200 text-xs text-ink-900">
            {bi(
              lang,
              'پیشنهاد UX فعلی: دانش‌آموز از معلم کلاس یا مدیر مدرسه درخواست «صدور رمز موقت» می‌کند.',
              'Proposed UX path: Student asks their class teacher or school admin for a temporary reset code.'
            )}
          </div>
        </div>
      </Modal>

      {/* Separate Join a Class Modal */}
      <Modal
        open={joinClassOpen}
        onClose={() => setJoinClassOpen(false)}
        title={bi(lang, 'پیوستن به کلاس با کد کلاس', 'Join a Class with Class Code')}
        footer={
          <Button variant="secondary" onClick={() => setJoinClassOpen(false)}>
            {bi(lang, 'بستن', 'Close')}
          </Button>
        }
      >
        <form onSubmit={handleJoinClassCheck} className="space-y-4">
          <DemoBadge
            lang={lang}
            variant="unapproved"
            labelFa="جریان نمونه — قواعد نهایی Class Code باز است"
            labelEn="Exploratory Flow — Class Code Rules Open"
          />
          <p className="text-sm text-ink-600 leading-relaxed">
            {bi(
              lang,
              'کد کلاس توسط معلم در اختیار دانش‌آموز قرار می‌گیرد. اینکه کد کلاس پیش از ورود یا پس از ورود به حساب مدرسه ثبت شود، یکی از تصمیم‌های باز محصول است که در این پروتوتایپ برای ارزیابی قرار داده شده است.',
              'Teachers share a Class Code with students. Exact rules for pre-login vs. post-login class joining are still open for product sign-off.'
            )}
          </p>
          <div>
            <label htmlFor="class-code-input" className="block text-sm font-semibold mb-1.5">
              {bi(lang, 'کد کلاس (نمونه: RSH-6A24)', 'Class Code (Sample: RSH-6A24)')}
            </label>
            <input
              id="class-code-input"
              type="text"
              dir="ltr"
              value={classCodeInput}
              onChange={(e) => {
                setClassCodeInput(e.target.value.toUpperCase());
                setJoinSuccess(false);
              }}
              className="w-full min-h-[44px] px-3.5 py-2 border border-border rounded-control text-center font-bold tracking-wider ltr-token"
            />
          </div>
          {joinSuccess ? (
            <div className="p-3.5 rounded-control bg-success-100 border border-success-600/40 text-success-600 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>
                  {bi(
                    lang,
                    'کلاس «ششم الف — خانم احمدی» شناسایی شد (نمونه نمایشی).',
                    'Found "Grade 6 Class A — Ms. Ahmadi" (Demo).'
                  )}
                </strong>
                <p className="text-xs text-ink-900 mt-1">
                  {bi(
                    lang,
                    'اکنون با نام کاربری مدرسه وارد شوید تا کلاس به پروفایل شما متصل شود.',
                    'Sign in with your school username next to complete class enrollment.'
                  )}
                </p>
              </div>
            </div>
          ) : (
            <Button type="submit" variant="primary" className="w-full">
              {bi(lang, 'بررسی کد کلاس', 'Verify Class Code')}
            </Button>
          )}
        </form>
      </Modal>
    </AppShell>
  );
};
