# ROSHANA --- AI Wireframe & UI/UX Prototype Brief

**نسخه:** ۰.۱ \| **تاریخ:** ۱۶ آبان ۱۴۰۵\
**مخاطب:** Agent Arena / AI Coding Agent\
**هدف:** ساخت یک وب‌سایت نمونه قابل اجرا و قابل کلیک برای ارزیابی اولیه
UX، چیدمان، مسیرهای کاربر و کشف ایرادها؛ نه محصول نهایی.

## 1. مأموریت

یک Prototype تعاملی برای پلتفرم آموزشی روشنا بساز. طراحی باید بر اساس
بریف محصول و جریان‌های اصلی دانش‌آموز و معلم باشد. از تقلید مستقیم IXL
خودداری کن؛ فقط از الگوهای عمومی و قابل توجیه محصولات آموزشی استفاده کن.

اصل راهبردی: - دانش‌آموز باید بداند «الان چه کاری انجام بدهم؟» - معلم
باید بتواند «از مشاهده عملکرد به اقدام آموزشی بعدی» برسد.

## 2. قواعد محصول قطعی در منابع

-   محصول Responsive Web Application است؛ Native App نساز.
-   مخاطب اصلی دانش‌آموزان ۹ تا ۱۵ سال و معلمان هستند.
-   MVP روی Mathematics متمرکز است؛ زبان و علوم برای فازهای بعدی‌اند.
-   پس از Authentication، کاربر مستقیم به Landing Page نقش خودش می‌رود؛
    در محصول واقعی Role Selection وجود ندارد.
-   حساب دانش‌آموز با Username و Password مدرسه فعال می‌شود؛ Class Code
    برای پیوستن به کلاس در نظر گرفته شده اما جزئیاتش باز است.
-   شروع تمرین از سه مسیر: Teacher Assignment، System Recommendation یا
    انتخاب مستقل از Skill Library.
-   Skill Library و Practice Session دو تجربه/صفحه جدا هستند.
-   معلم از محتوای آماده سامانه استفاده می‌کند و نمی‌تواند سؤال جدید بسازد
    یا سؤال بانک را ویرایش کند.
-   معلم می‌تواند از Question Bank آزمون بسازد؛ جزئیات پارامترها هنوز
    نهایی نیست.
-   Diagnostic Assessment در MVP وجود ندارد.
-   نقش‌های Parent و School Admin در تعریف محصول آمده‌اند، اما جزئیات
    صفحات و مجوزهایشان کامل نیست؛ در این Prototype فقط Placeholder ارائه
    شود.
-   فرمول SmartScore، معیار Mastery، الگوریتم Recommendation و بعضی
    وضعیت‌های Assignment هنوز تصویب نشده‌اند. هیچ عدد یا منطق ساختگی را
    واقعیت قطعی جلوه نده.

### اولویت صفحات

**P0 --- هسته اصلی** - Student: Sign in، Student Landing، Skill Library،
Practice/Question، Feedback - Teacher: Sign in، Teacher Landing، Skill
Library، Class Management / Student List، Assignments، Performance
Analytics

**P1 --- تکمیل MVP** - Student Recommendations و Performance Analytics -
Teacher Quiz Generator و Timetable & Teaching Plan

**P2 --- انگیزش** - Student Honor Roll و Rewards Store

ابتدا P0 را با جزئیات بساز؛ P1 قابل کلیک اما ساده باشد؛ P2 در حد اتود
کافی است.

## 3. زبان، RTL و فونت

-   زبان پیش‌فرض فارسی و جهت تمام صفحات RTL واقعی باشد؛ فقط
    `text-align:right` کافی نیست.
-   ناوبری، Breadcrumb، Sidebar، جدول‌ها، فرم‌ها، ترتیب ستون‌ها و آیکون‌های
    جهت‌دار باید RTL باشند.
-   یک Language Toggle برای FA/EN بگذار؛ نسخه انگلیسی می‌تواند ساده باشد
    اما ساختار باید LTR واقعی را پشتیبانی کند.
-   فونت فارسی: **Abar** با فایل‌های `AbarMidFaNum-Regular.woff2` و
    `AbarMidFaNum-SemiBold.woff2`.
-   فونت‌ها را داخل پروژه و با `@font-face` بارگذاری کن؛ وابستگی خارجی
    نداشته باش.
-   Regular برای متن و SemiBold برای عنوان‌ها.
-   متن ترکیبی فارسی/انگلیسی، کدها و اعداد را با `dir="auto"` یا `bdi`
    درست نمایش بده.
-   از شکستن کلمات فارسی و فاصله‌گذاری نامناسب جلوگیری کن.

## 4. Design System پیشنهادی

این سیستم طراحی **پیشنهاد Prototype** است و هنوز Design System رسمی و
مصوب روشنا نیست. توکن‌ها را در `tokens.css` یا Theme مرکزی تعریف کن.

### جهت هنری

روشن، دقیق، دوستانه، کنجکاوی‌برانگیز و قابل اعتماد. مخاطب ۹ تا ۱۵ سال
است؛ جذاب باشد اما کودکانه و شلوغ نباشد. Student UI می‌تواند تصویرسازی و
رنگ‌های شاد کنترل‌شده داشته باشد؛ Teacher UI حرفه‌ای‌تر، خلوت‌تر و داده‌محور
باشد. از گرادیان زیاد، Glassmorphism، سایه سنگین و انیمیشن مزاحم پرهیز
کن.

### پالت رنگ

  Token         مقدار     کاربرد
  ------------- --------- -----------------
  brand-700     #245B73   رنگ اصلی
  brand-600     #2F7891   لینک و تعامل
  brand-100     #E7F2F5   سطح انتخاب‌شده
  accent-500    #F2A541   تأکید و دستاورد
  success-600   #27845D   موفقیت
  warning-600   #B97719   هشدار
  danger-600    #B94A48   خطا
  ink-900       #202B33   متن اصلی
  ink-600       #5E6B73   متن ثانویه
  surface       #FFFFFF   کارت
  canvas        #F5F7F8   پس‌زمینه
  border        #DCE4E8   مرزها

رنگ به‌تنهایی نباید تنها نشانه انتقال وضعیت باشد؛ متن یا آیکون هم استفاده
کن.

### تایپوگرافی و ابعاد

-   Page title: ۲۴--۳۰px SemiBold
-   Section title: ۱۸--۲۲px SemiBold
-   Card title: ۱۶--۱۸px SemiBold
-   Body: ۱۴--۱۶px Regular
-   Caption: حداقل ۱۲--۱۳px
-   Line-height فارسی: حدود ۱.۷ تا ۱.۹
-   Spacing بر مبنای ۴px: ۴، ۸، ۱۲، ۱۶، ۲۴، ۳۲، ۴۰، ۴۸
-   حداکثر عرض محتوای Desktop: حدود ۱۴۴۰px
-   Sidebar: حدود ۲۴۰--۲۶۰px؛ Header: حدود ۶۴--۷۲px
-   Radius: کنترل‌ها ۸px، کارت‌ها ۱۲--۱۶px
-   در عرض‌های ۱۴۴۰، ۱۰۲۴، ۷۶۸ و ۳۹۰ تست کن.

### کامپوننت‌های پایه

`AppShell`, `Topbar`, `Sidebar`, `Breadcrumbs`, `PageHeader`, `Button`,
`Card`, `StatCard`, `SkillCard`, `AssignmentCard`, `Badge`,
`StatusPill`, `SearchInput`, `Select`, `Tabs`, `FilterBar`,
`ProgressBar`, `Avatar`, `Table`, `Pagination`, `Modal`, `Drawer`,
`Toast`, `EmptyState`, `ErrorState`, `Skeleton`, `QuestionOption`,
`FeedbackPanel`, `ChartPanel`.

همه کامپوننت‌ها RTL-aware و قابل استفاده مجدد باشند.

## 5. معماری اطلاعات

### Student Navigation

خانه، کتابخانه مهارت‌ها، پیشنهادها، پیشرفت من، دستاوردها، فروشگاه.

### Teacher Navigation

خانه، کلاس‌ها و دانش‌آموزان، کتابخانه مهارت‌ها، تکالیف، آزمون‌ساز، برنامه
تدریس، تحلیل عملکرد.

### Content Hierarchy

`Subject → Grade → Topic → Subtopic (در صورت وجود) → Skill → Question`

Subtopic در مدل مفهومی ممکن است وجود داشته باشد؛ اگر داده ندارد، سطح
خالی نساز.

**نکته Prototype:** چون Role Detection واقعی به Backend نیاز دارد، یک
Role Switcher فقط در نوار ابزار Preview/Development قرار بده تا Student
و Teacher را بتوان بررسی کرد. این ابزار جزو UI نهایی محصول نیست.

## 6. صفحات موردنیاز

### 6.1 Sign in

Username، Password، نمایش/پنهان‌سازی رمز، خطای ورود، Loading و راهنمای
بازیابی. Class Code را مسیر جدا با عنوان «پیوستن به کلاس» نمایش بده، نه
بخشی از فرم ورود. ثبت‌نام عمومی نساز.

### 6.2 Student Landing --- P0

ترتیب پیشنهادی: 1. Greeting کوتاه 2. کارت اصلی تکلیف بعدی: مهارت، معلم،
موعد، وضعیت 3. CTA واضح شروع/ادامه تمرین 4. ادامه تمرین نیمه‌تمام 5.
پیشنهادهای مهارتی همراه دلیل 6. خلاصه پیشرفت، هدف روزانه/هفتگی، فعالیت
اخیر و آخرین دستاورد 7. موجودی سکه به‌عنوان عنصر ثانویه

حالت‌ها: بدون تکلیف، چند تکلیف، تکلیف دیرشده، اولین ورود، بدون پیشنهاد،
Loading و Error.

### 6.3 Skill Library --- P0

Search، فیلتر Subject و Grade، مرور Topic و Subtopic با Navigation
Tree/Accordion، Skill Card با عنوان و وضعیت و CTA. برای بررسی UX دو الگو
بساز: - مرور درختی در همان صفحه - صفحه مستقل Topic Detail با مهارت‌ها و
پیشرفت

وضعیت‌های Not Started / In Progress / Mastered / Needs Review صرفاً نمونه
پیشنهادی‌اند؛ قواعد Mastery مصوب نیست. Empty Search و فیلتر بدون نتیجه را
نیز بساز.

### 6.4 Practice Session --- P0

محیط خلوت، یک سؤال در هر لحظه، نمایش Topic، Skill، شماره سؤال و
Progress. SmartScore فقط با برچسب «نمونه نمایشی» نمایش داده شود. CTA ثبت
پاسخ. پاسخ درست: تأیید، توضیح و ادامه. پاسخ نادرست: پاسخ صحیح و روش حل
با لحن حمایتی. خروج امن و وضعیت ذخیره‌سازی واضح باشد. حالت‌های Empty
Answer، Duplicate Submit، Network Error، Saving و Completion را بساز.
فهرست رسمی انواع سؤال در منابع کامل نیست؛ ادعا نکن همه انواع را پیاده
کرده‌ای.

### 6.5 Student Analytics --- P1

خلاصه پیشرفت، فیلتر موضوع/بازه زمانی، نمودار ساده، عملکرد مهارت‌ها و
اقدام بعدی. داده ساختگی با برچسب «داده نمونه» مشخص شود. از برچسب مبهم
«ضعیف» استفاده نکن.

### 6.6 Recommendations --- P1

کارت مهارت، دلیل پیشنهاد، موضوع و CTA شروع. الگوریتم واقعی نساز؛ داده و
منطق ثابت Demo باشد.

### 6.7 Honor Roll & Rewards Store --- P2

Badgeها و معیار دریافت، Badge قفل‌شده، فروشگاه آیتم Avatar، Preview، قیمت
سکه، تأیید خرید، سکه ناکافی و خطای تراکنش.

### 6.8 Teacher Landing --- P0

اول: کلاس‌های امروز و کارهای نیازمند توجه. دوم: موعد تکالیف و آزمون‌ها،
تکمیل و هشدارهای آموزشی. سوم: خلاصه پیشرفت کلاس و برنامه آینده. Quick
Actions: Assign Skills، Generate Quiz، View Analytics، Open Timetable.
کلاس فعال در تمام اطلاعات مشخص باشد.

### 6.9 Class Management / Student List --- P0

انتخاب کلاس، فهرست دانش‌آموزان، جست‌وجو، فیلتر، وضعیت فعالیت و انتخاب چند
دانش‌آموز برای تخصیص. حالت کلاس خالی و دانش‌آموز بدون فعالیت را بساز.

### 6.10 Teacher Skill Library --- P0

Browse، Search، Filter، Preview، نمونه سؤال فقط برای مشاهده و انتخاب چند
Skill برای Assignment یا Quiz. Context کلاس حفظ شود. امکان ساخت یا
ویرایش سؤال اضافه نکن.

### 6.11 Assignments --- P0

Wizard پنج‌مرحله‌ای: 1. انتخاب Skillها 2. انتخاب Class یا دانش‌آموزان 3.
تعیین Due Date و Instructions 4. Preview 5. Publish

پیش از انتشار خلاصه «چه مهارت‌هایی، برای چه کسانی و تا چه زمانی» نمایش
داده شود. وضعیت‌های پیشنهادی: Upcoming، Assigned، In Progress، Overdue،
Completed، Completed Late، Cancelled؛ این‌ها تا تأیید قابل تغییرند. حالت
عدم انتخاب گیرنده، تاریخ نامعتبر، انتشار ناموفق و تکلیف تکراری را بساز.
قواعد ویرایش/لغو بعد از شروع دانش‌آموز را قطعی فرض نکن.

### 6.12 Teacher Analytics --- P0

فیلتر Class، Student، Subject/Topic و Time Range؛ خلاصه عملکرد و تکمیل؛
جدول دانش‌آموزان؛ روند؛ Skills Needing Attention با معیار توضیح‌پذیر؛ CTA
مستقیم Assign Remedial Practice. حالت داده ناکافی، کلاس جدید و مهارت
بدون پاسخ را بساز. فرمول SmartScore را اختراع نکن.

### 6.13 Quiz Generator --- P1

انتخاب Skill/Topic، پارامترهای نمونه مثل تعداد سؤال و دشواری با برچسب
«تنظیمات نمایشی»، Generate Preview و Save/Publish. سؤال‌ها فقط از
Question Bank انتخاب شوند؛ Author/Edit Question اضافه نکن.

### 6.14 Timetable & Teaching Plan --- P1

نمای هفتگی، کلاس‌ها، Topicهای برنامه‌ریزی‌شده و موعد Assignment/Quiz. کلاس
زمان‌بندی‌شده از موعد تکلیف متمایز باشد. مجوز ویرایش برنامه باز است؛ کنترل
ویرایش فقط Demo باشد.

### 6.15 Parent / School Admin

فقط Placeholder با پیام «نیازمند تکمیل نیازمندی‌ها و مجوزها». دسترسی یا
داده فردی اختراع نکن.

## 7. داده‌های Demo

بالای Preview برچسب `DEMO DATA` قرار بده. - دانش‌آموز نمونه: آوا، پایه
ششم، ریاضی - مهارت‌ها: جمع کسرها، ضرب اعداد اعشاری، محیط و مساحت - تکلیف:
تمرین جمع کسرها، وضعیت در حال انجام - معلم نمونه: خانم احمدی، کلاس ششم
الف، ۲۴ دانش‌آموز - اعداد نمودارها ساختگی‌اند و باید برچسب داده نمونه
داشته باشند. این داده‌ها واقعی نیستند.

## 8. تعاملات

تمام CTAها کار کنند؛ Sidebar و Breadcrumb فعال باشند؛ Search و Filter
روی داده Demo عمل کنند؛ Accordion و Tabs کار کنند؛ Assignment Wizard
مرحله‌به‌مرحله باشد؛ Practice Session پاسخ نمایشی را بررسی کند؛ Modal و
Toast کار کنند؛ هیچ دکمه بی‌عمل یا لینک `#` نماند. Backend،
Authentication واقعی، Payment و Recommendation Engine نساز؛ فقط Frontend
Prototype تعاملی باشد.

## 9. تصویرسازی

Prototype نباید مجموعه‌ای از مستطیل‌های خالی باشد. برای Student UI از
Illustrationهای اختصاصی آموزشی (کتاب، هندسه، ابزار ریاضی، رشد و کشف) با
پالت محدود استفاده کن. تصویر چهره واقعی کودک استفاده نکن؛ Illustration
انتزاعی و امن ترجیح دارد. در Teacher UI تصویرسازی فقط در Empty State
باشد. از SVG محلی یا CSS illustration استفاده کن و به URLهای خارجی
ناپایدار وابسته نباش. آیکون‌ها یک خانواده و Stroke یکسان داشته باشند.

## 10. Accessibility پایه

کنتراست مناسب، Keyboard Navigation، Focus واضح، Label واقعی فرم، انتقال
وضعیت با متن/آیکون علاوه بر رنگ، هدف لمسی مناسب، Legend و برچسب متنی
نمودارها. ادعای WCAG 2.2 AA Conformance نکن؛ فقط اصول پایه رعایت شود.

## 11. مسیرهای تست

### Student

Sign in → Landing؛ Landing → Assignment → Skill → Practice؛ Resume
Practice؛ Skill Library → Topic → Skill؛ Recommendation → Practice؛
Submit → Feedback → Continue؛ Exit → Resume؛ Analytics → Next Skill؛
Honor Roll؛ Rewards Store → Confirm.

### Teacher

Sign in → Landing؛ Landing → Class → Student List؛ Skill Library →
Preview → Select Skills؛ Assignment Wizard → Preview → Publish؛
Assignment Detail → Status؛ Analytics → Filter → Insight؛ Analytics →
Assign Remedial Practice؛ Quiz Generator → Configure → Preview؛
Timetable → Class/Topic؛ Quick Actions.

## 12. خروجی فنی

-   پروژه قابل اجرا با `npm install` و `npm run dev`.
-   اگر پروژه موجود است ابتدا ساختارش را بررسی کن و Framework را بی‌دلیل
    تغییر نده.
-   اگر خالی است React + TypeScript + Vite یا Next.js انتخاب کن.
-   Tailwind CSS مناسب است؛ کامپوننت و داده از هم جدا باشند.
-   فونت‌ها محلی در `public/fonts/` باشند.
-   Routing واقعی یا Router سبک استفاده کن.
-   فایل‌های `README.md`، `DESIGN_DECISIONS.md` و `QA_CHECKLIST.md` بساز.
-   از صفحات Student Landing، Skill Library، Practice Session، Teacher
    Landing، Assignments و Analytics Screenshot بگیر.

ساختار پیشنهادی:

``` text
src/
  app/
  components/ui/
  components/student/
  components/teacher/
  components/shared/
  data/
  pages/
  styles/tokens.css
  styles/globals.css
public/fonts/
README.md
DESIGN_DECISIONS.md
QA_CHECKLIST.md
```

## 13. روش اجرا

1.  فایل‌ها و ساختار موجود را بررسی کن.
2.  Design Tokens و App Shell را بساز.
3.  Student P0 را پیاده‌سازی کن.
4.  Teacher P0 را پیاده‌سازی کن.
5.  P1 و سپس P2 را در حد Prototype اضافه کن.
6.  حالت‌های Empty/Error/Loading و تعامل‌ها را کامل کن.
7.  RTL را در تمام صفحات و اندازه‌ها بررسی کن.
8.  Screenshot صفحات کلیدی بگیر.
9.  فرض‌ها و ایرادها را در فایل‌های تصمیم و QA ثبت کن.
10. گزارش بده چه چیزهایی واقعاً کار می‌کنند، چه چیزهایی Mock هستند و چه
    تصمیم‌هایی بازند.

## 14. معیار موفقیت

-   کاربر فوراً نقش و موقعیت خود را بفهمد.
-   دانش‌آموز بدون راهنمایی Assignment را شروع کند، پاسخ بدهد و Feedback
    بگیرد.
-   دانش‌آموز بتواند Skill Library را مرور و مهارت انتخاب کند.
-   معلم Skill را پیدا کند، تخصیص دهد و نتیجه را در Analytics دنبال کند.
-   گزارش معلم به اقدام بعدی قابل فهم ختم شود.
-   Student و Teacher تجربه‌های متناسب اما Design System مشترک داشته
    باشند.
-   فارسی در تمام صفحات درست و واقعاً RTL باشد.
-   هیچ قابلیت تأییدنشده‌ای به‌عنوان قانون قطعی نمایش داده نشود.

**این خروجی را به‌عنوان اتود قابل مشاهده و قابل کلیک بساز؛ فعلاً کمال
نهایی، Backend واقعی و تکمیل تمام جزئیات محصول اولویت نیست. کیفیت تجربه،
وضوح مسیرها و کشف ایرادها اولویت اصلی است.**
