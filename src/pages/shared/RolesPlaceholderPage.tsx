import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldAlert, Users } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { EmptyStateIllustration } from '../../components/shared/Illustrations';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  PageHeader,
} from '../../components/ui/Primitives';
import { bi } from '../../utils/format';

export const RolesPlaceholderPage: React.FC = () => {
  const { lang, setActiveRole } = usePrototype();
  const navigate = useNavigate();

  return (
    <AppShell roleOverride="minimal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <PageHeader
          lang={lang}
          icon={<Users className="w-6 h-6" />}
          title={bi(
            lang,
            'نقش‌های والدین و مدیر مدرسه (Placeholder)',
            'Parent & School Administrator Roles (Placeholder)'
          )}
          subtitle={bi(
            lang,
            'مطابق بخش ۶.۱۵ بریف روشنا، این دو نقش در تعریف کلان محصول حضور دارند اما نیازمندی‌ها، صفحات و سطوح دسترسی آن‌ها هنوز نهایی نشده است.',
            'Per Section 6.15 of the Roshana brief, Parent and School Admin roles require further specification and permission approval.'
          )}
          badge={
            <DemoBadge
              lang={lang}
              variant="unapproved"
              labelFa="نیازمند تکمیل نیازمندی‌ها و مجوزها"
              labelEn="Pending Requirements & Permissions"
            />
          }
        />

        <Card padding="lg" accentTop="lavender" className="space-y-6">
          <div className="text-center">
            <EmptyStateIllustration variant="classroom" />
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
              <ShieldAlert className="w-4 h-4" />
              <span>
                {bi(
                  lang,
                  'نیازمند تکمیل نیازمندی‌ها و مجوزهای دسترسی',
                  'Requirements & Data Access Permissions Pending'
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-card bg-surface-lavender border border-lavender-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="typo-card-title flex items-center gap-2">
                  <Users className="w-5 h-5 text-lavender-700" />
                  <span>{bi(lang, 'پنل والدین (Parent)', 'Parent View')}</span>
                </h2>
                <Badge tone="lavender">{bi(lang, 'خارج از دامنه فعلی', 'Pending Spec')}</Badge>
              </div>
              <p className="typo-caption leading-relaxed">
                {bi(
                  lang,
                  'مرز دقیق نمایش داده‌های فردی دانش‌آموز، نحوه اتصال حساب والد به فرزند و سیاست حریم خصوصی هنوز تصویب نشده است؛ بنابراین در این پروتوتایپ هیچ داده یا دسترسی ساختگی برای والدین فرض نشده است.',
                  'Individual student data visibility, parent-child account linking, and privacy rules are not yet approved; no speculative views are invented here.'
                )}
              </p>
            </div>

            <div className="p-5 rounded-card bg-surface-sky border border-turquoise-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="typo-card-title flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-800" />
                  <span>{bi(lang, 'پنل مدیر مدرسه (School Admin)', 'School Administrator')}</span>
                </h2>
                <Badge tone="turquoise">{bi(lang, 'خارج از دامنه فعلی', 'Pending Spec')}</Badge>
              </div>
              <p className="typo-caption leading-relaxed">
                {bi(
                  lang,
                  'فرآیند بارگذاری دسته‌جمعی حساب‌های دانش‌آموزان، تعریف کلاس‌ها، مدیریت معلمان و گزارش‌های سطح مدرسه نیازمند تصویب نهایی مجوزهاست.',
                  'School-level roster provisioning, teacher management, and cross-class reporting permissions remain open.'
                )}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-wrap justify-center gap-3">
            <Button
              variant="cta"
              onClick={() => {
                setActiveRole('student');
                navigate('/student');
              }}
            >
              {bi(lang, 'بازگشت به تجربه دانش‌آموز (آوا)', 'Inspect Student Experience')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setActiveRole('teacher');
                navigate('/teacher');
              }}
            >
              {bi(lang, 'بازگشت به تجربه معلم (خانم احمدی)', 'Inspect Teacher Experience')}
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
};
