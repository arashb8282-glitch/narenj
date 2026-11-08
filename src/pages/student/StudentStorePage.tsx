import React, { useState } from 'react';
import { AlertCircle, Check, Coins, Eye, ShoppingBag } from 'lucide-react';
import { usePrototype } from '../../app/PrototypeContext';
import { AppShell } from '../../components/shared/AppShell';
import { AvatarSymbolGraphic } from '../../components/shared/Illustrations';
import {
  Badge,
  Button,
  Card,
  DemoBadge,
  Modal,
  PageHeader,
} from '../../components/ui/Primitives';
import { DEMO_STUDENT_PROFILE } from '../../data/mockData';
import { StoreItem } from '../../data/types';
import { bi, fmtNum } from '../../utils/format';

export const StudentStorePage: React.FC = () => {
  const {
    lang,
    coins,
    storeItems,
    purchaseStoreItem,
    equipStoreItem,
    showToast,
  } = usePrototype();

  const equipped = storeItems.find((i) => i.equipped) ?? storeItems[0];
  const [previewItem, setPreviewItem] = useState<StoreItem>(equipped);
  const [confirmTarget, setConfirmTarget] = useState<StoreItem | null>(null);
  const [simulateTxError, setSimulateTxError] = useState<boolean>(false);
  const [txErrorText, setTxErrorText] = useState<string | null>(null);

  const handleConfirmPurchase = () => {
    if (!confirmTarget) return;
    if (simulateTxError) {
      setTxErrorText(
        bi(
          lang,
          'خطای شبیه‌سازی‌شده تراکنش: ارتباط موقتاً قطع شد و هیچ سکه‌ای از حساب شما کسر نشد.',
          'Simulated transaction error: Connection interrupted. No coins were deducted.'
        )
      );
      return;
    }

    const ok = purchaseStoreItem(confirmTarget.id);
    if (ok) {
      setPreviewItem({ ...confirmTarget, owned: true, equipped: true });
      setConfirmTarget(null);
      setTxErrorText(null);
      showToast(
        `«${confirmTarget.titleFa}» خریداری و روی آواتار شما فعال شد!`,
        `"${confirmTarget.titleEn}" purchased and equipped!`,
        'success'
      );
    }
  };

  return (
    <AppShell roleOverride="student">
      <PageHeader
        lang={lang}
        icon={<ShoppingBag className="w-6 h-6" />}
        breadcrumbs={[
          { label: bi(lang, 'خانه', 'Home'), to: '/student' },
          { label: bi(lang, 'فروشگاه آواتار', 'Rewards Store') },
        ]}
        title={bi(lang, 'فروشگاه جوایز آواتار (P2)', 'Avatar Rewards Store (P2)')}
        subtitle={bi(
          lang,
          'شخصی‌سازی نماد هندسی پروفایل با سکه‌های حاصل از تمرین (بدون استفاده از تصویر چهره واقعی کودکان).',
          'Customize your geometric profile emblem using practice coins.'
        )}
        badge={<DemoBadge lang={lang} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Avatar Preview Stage */}
        <Card
          padding="lg"
          surfaceTone="cream"
          accentTop="accent"
          className="lg:col-span-4 space-y-4 text-center lg:sticky lg:top-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500 text-ink-900 text-sm font-bold shadow-xs">
            <Coins className="w-4 h-4" aria-hidden="true" />
            <span>
              {bi(lang, 'موجودی فعلی:', 'Balance:')} {fmtNum(coins, lang)}{' '}
              {bi(lang, 'سکه', 'coins')}
            </span>
          </div>

          <div className="py-5 px-4 rounded-card bg-surface border border-accent-200 flex flex-col items-center gap-3">
            <AvatarSymbolGraphic
              symbol={previewItem.previewSymbol}
              bgColor={previewItem.previewColor}
              size={112}
            />
            <div>
              <h2 className="typo-card-title text-lg">
                {bi(lang, DEMO_STUDENT_PROFILE.nameFa, DEMO_STUDENT_PROFILE.nameEn)}
              </h2>
              <p className="typo-caption mt-0.5">
                {bi(lang, 'پیش‌نمایش نماد:', 'Previewing:')}{' '}
                <strong className="text-brand-800">
                  {bi(lang, previewItem.titleFa, previewItem.titleEn)}
                </strong>
              </p>
            </div>
          </div>

          <div className="p-3 rounded-control bg-surface border border-border text-xs text-ink-600 text-start">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink-900">
              <input
                type="checkbox"
                checked={simulateTxError}
                onChange={(e) => {
                  setSimulateTxError(e.target.checked);
                  setTxErrorText(null);
                }}
                className="rounded border-border text-brand-700"
              />
              <span>
                {bi(
                  lang,
                  'شبیه‌سازی خطای تراکنش هنگام تأیید خرید (تست UX)',
                  'Simulate transaction failure on purchase (UX test)'
                )}
              </span>
            </label>
          </div>
        </Card>

        {/* Store Items Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {storeItems.map((item) => {
            const insufficient = !item.owned && coins < item.priceCoins;
            return (
              <Card
                key={item.id}
                padding="md"
                surfaceTone={item.equipped ? 'mint' : item.owned ? 'sky' : 'white'}
                accentTop={item.equipped ? 'success' : item.owned ? 'turquoise' : 'accent'}
                interactive
                className="flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <AvatarSymbolGraphic
                    symbol={item.previewSymbol}
                    bgColor={item.previewColor}
                    size={58}
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="typo-caption font-semibold">
                        {bi(lang, item.categoryFa, item.categoryEn)}
                      </span>
                      {item.owned ? (
                        <Badge tone={item.equipped ? 'success' : 'turquoise'}>
                          {item.equipped
                            ? bi(lang, 'فعال روی پروفایل', 'Equipped')
                            : bi(lang, 'دریافت‌شده', 'Owned')}
                        </Badge>
                      ) : (
                        <Badge tone={insufficient ? 'coral' : 'accent'}>
                          {fmtNum(item.priceCoins, lang)} {bi(lang, 'سکه', 'coins')}
                        </Badge>
                      )}
                    </div>
                    <h3 className="typo-card-title">{bi(lang, item.titleFa, item.titleEn)}</h3>
                    <p className="typo-caption">
                      {bi(lang, item.descriptionFa, item.descriptionEn)}
                    </p>
                  </div>
                </div>

                {insufficient && (
                  <div className="px-3 py-2 rounded-control bg-coral-50 border border-coral-200 text-xs text-coral-700 font-semibold">
                    {lang === 'fa'
                      ? `سکه کافی نیست (${fmtNum(item.priceCoins - coins, 'fa')} سکه دیگر با تمرین مهارت‌ها لازم است).`
                      : `Insufficient coins (${item.priceCoins - coins} more coins needed from practice).`}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2.5 border-t border-border">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewItem(item)}
                    icon={<Eye className="w-4 h-4" />}
                  >
                    {bi(lang, 'پیش‌نمایش', 'Preview')}
                  </Button>

                  {item.owned ? (
                    <Button
                      variant={item.equipped ? 'secondary' : 'turquoise'}
                      size="sm"
                      disabled={item.equipped}
                      className="flex-1"
                      onClick={() => {
                        equipStoreItem(item.id);
                        setPreviewItem({ ...item, equipped: true });
                        showToast(
                          `«${item.titleFa}» روی پروفایل فعال شد.`,
                          `"${item.titleEn}" equipped.`,
                          'info'
                        );
                      }}
                      icon={<Check className="w-4 h-4" />}
                    >
                      {item.equipped
                        ? bi(lang, 'در حال استفاده', 'Equipped')
                        : bi(lang, 'استفاده روی آواتار', 'Equip')}
                    </Button>
                  ) : (
                    <Button
                      variant="cta"
                      size="sm"
                      disabled={insufficient}
                      className="flex-1"
                      onClick={() => {
                        setTxErrorText(null);
                        setConfirmTarget(item);
                      }}
                      icon={<ShoppingBag className="w-4 h-4" />}
                    >
                      {bi(lang, 'دریافت با سکه', 'Redeem Item')}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <Modal
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        title={bi(lang, 'تأیید دریافت آیتم آواتار', 'Confirm Avatar Item Redemption')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmTarget(null)}>
              {bi(lang, 'انصراف', 'Cancel')}
            </Button>
            <Button variant="cta" onClick={handleConfirmPurchase}>
              {bi(lang, 'تأیید و کسر سکه', 'Confirm Purchase')}
            </Button>
          </>
        }
      >
        {confirmTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3.5 rounded-card bg-surface-cream border border-accent-200">
              <AvatarSymbolGraphic
                symbol={confirmTarget.previewSymbol}
                bgColor={confirmTarget.previewColor}
                size={58}
              />
              <div>
                <h4 className="typo-card-title">
                  {bi(lang, confirmTarget.titleFa, confirmTarget.titleEn)}
                </h4>
                <p className="typo-caption">
                  {bi(lang, 'بها:', 'Cost:')}{' '}
                  <strong>
                    {fmtNum(confirmTarget.priceCoins, lang)} {bi(lang, 'سکه', 'coins')}
                  </strong>{' '}
                  • {bi(lang, 'باقی‌مانده پس از خرید:', 'Remaining:')}{' '}
                  <strong>
                    {fmtNum(coins - confirmTarget.priceCoins, lang)} {bi(lang, 'سکه', 'coins')}
                  </strong>
                </p>
              </div>
            </div>

            {txErrorText && (
              <div
                role="alert"
                className="p-3.5 rounded-control bg-coral-100 border border-coral-200 text-coral-700 text-xs sm:text-sm font-semibold flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{txErrorText}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AppShell>
  );
};
