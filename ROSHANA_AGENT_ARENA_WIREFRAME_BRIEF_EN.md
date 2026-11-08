# ROSHANA — AI Wireframe & UI/UX Prototype Brief

**Version:** 0.1 — Exploratory Prototype  
**Date:** 8 November 2026  
**Target:** Agent Arena / AI Coding Agent  
**Deliverable:** A runnable, responsive, interactive sample website for evaluating Roshana's UX, UI, information architecture, and core user journeys.

---

## 1. Mission

Build an interactive UX/UI prototype for **Roshana**, an educational learning and skills-practice platform. This is an exploratory prototype, not the final product or a production implementation. The goal is to make the proposed experience tangible in a browser, test the primary journeys, inspect layouts, and discover usability problems before detailed design and engineering.

Use the supplied Roshana product brief, UX architecture, page inventory, and user flows as the primary source of truth. Do not copy IXL's interface. Roshana must have its own visual identity and interaction design.

**Core product principle**
- Students should immediately understand: “What should I do next?”
- Teachers should be able to move from “understanding performance” to “taking the next instructional action.”

## 2. Confirmed Product Rules and Scope

The following points are supported by the Roshana source documents:

- Roshana is a **responsive web application**. Do not build native iOS or Android apps.
- Primary audiences are students aged **9–15** and teachers.
- The MVP focuses on **Mathematics**. Language and Science are planned for later phases.
- After authentication, users land directly on the landing page for their detected role. The real product does not ask users to choose a role during sign-in.
- Students receive a school-provided username and password. A **Class Code** mechanism is planned for joining a class, but its exact rules and interaction are not finalized.
- Students can start practice from three entry points: a teacher-assigned skill, a system recommendation, or a skill independently selected from the **Skill Library**.
- **Skill Library** and **Practice Session** are separate experiences/pages.
- Teachers use existing platform content. They cannot create new questions or edit existing questions in the Question Bank.
- Teachers can generate quizzes using questions from the platform **Question Bank**. Exact quiz parameters and policies remain open.
- **Diagnostic Assessment** is out of scope for the MVP.
- Parent and School Administrator roles are mentioned in the product definition, but their page requirements and permission rules are not as fully specified as Student and Teacher. For this prototype, provide lightweight placeholders only.
- SmartScore formula, mastery criteria, recommendation logic, and some assignment status rules have not been approved. Do not present invented logic as confirmed product behavior.

### Page priorities

**P0 — Core**
- Student: Sign in, Student Landing Page, Skill Library, Practice/Question, Question Feedback.
- Teacher: Sign in, Teacher Landing Page, Skill Library, Class Management / Student List, Assignments, Performance Analytics.

**P1 — MVP completion**
- Student Recommendations and Student Performance Analytics.
- Teacher Quiz Generator and Timetable & Teaching Plan.

**P2 — Motivation**
- Student Honor Roll and Rewards Store.

Build P0 pages with the greatest detail. P1 pages should be navigable and demonstrable but can be simpler. P2 can be lightweight exploratory screens.

## 3. Language, RTL, and Typography

- Default interface language: **Persian (Farsi)**.
- The primary interface direction must be **true RTL**, not merely right-aligned text.
- Navigation order, breadcrumbs, sidebars, tables, form layouts, card alignment, column order, and directional icons must all behave correctly in RTL.
- Add a language toggle for FA / EN. English can be a simplified prototype, but the layout must support genuine LTR mode.
- Primary Persian typeface: **Abar**.
  - Use the supplied local files: `AbarMidFaNum-Regular.woff2` and `AbarMidFaNum-SemiBold.woff2`.
  - Load fonts locally with `@font-face`; do not depend on external font CDNs.
  - Use Regular for body text and SemiBold for headings and emphasis.
- Use a readable sans-serif for English technical labels, codes, and URLs. Handle mixed Persian/English strings with `dir="auto"` or `<bdi>`.
- Use Persian numerals in the Persian UI where appropriate. Keep codes, URLs, identifiers, and technical strings LTR.
- Prevent awkward Persian word wrapping, incorrect punctuation placement, and inconsistent spacing.

## 4. Proposed Design System

These tokens are **prototype recommendations**, not an approved final Roshana Design System. Centralize them in `tokens.css` or the project's theme configuration.

### 4.1 Art direction

Roshana should feel clear, precise, friendly, curious, and trustworthy. The audience includes students aged 9–15. The Student experience should be engaging without looking childish or visually noisy. The Teacher experience should be more professional, calm, and data-oriented while sharing the same design language.

Avoid direct competitor imitation, excessive gradients, glassmorphism, heavy shadows, decorative cards, and distracting animation. Gamification must not compete with the primary learning action.

### 4.2 Suggested color palette

| Token | Value | Intended use |
|---|---|---|
| `brand-700` | `#245B73` | Primary brand color and key navigation |
| `brand-600` | `#2F7891` | Primary interaction and links |
| `brand-100` | `#E7F2F5` | Selected and highlighted surfaces |
| `accent-500` | `#F2A541` | Highlights and achievements |
| `success-600` | `#27845D` | Successful actions and correct answers |
| `warning-600` | `#B97719` | Warnings and approaching deadlines |
| `danger-600` | `#B94A48` | Errors and critical states |
| `ink-900` | `#202B33` | Primary text |
| `ink-600` | `#5E6B73` | Secondary text |
| `surface` | `#FFFFFF` | Cards and panels |
| `canvas` | `#F5F7F8` | Main page background |
| `border` | `#DCE4E8` | Borders and dividers |

Do not communicate status through color alone. Pair color with a label, icon, or other understandable indicator.

### 4.3 Typography and layout

- Page title: 24–30px, Abar SemiBold.
- Section title: 18–22px, Abar SemiBold.
- Card title: 16–18px, Abar SemiBold.
- Body: 14–16px, Abar Regular.
- Caption/metadata: preferably at least 12–13px.
- Persian body line-height: approximately 1.7–1.9.
- Use a 4px spacing base: 4, 8, 12, 16, 24, 32, 40, 48px.
- Desktop content max-width: approximately 1440px.
- Desktop sidebar: approximately 240–260px; header: approximately 64–72px.
- Border radius: 8px for controls; 12–16px for cards.
- Use subtle borders. Reserve shadows for floating layers and dialogs.
- Check layouts at 1440px, 1024px, 768px, and 390px widths.

### 4.4 Core reusable components

Build reusable, RTL-aware components with meaningful states:
`AppShell`, `Topbar`, `Sidebar`, `Breadcrumbs`, `PageHeader`, `SectionHeader`, `Button` (primary/secondary/ghost/destructive/disabled/loading), `Card`, `StatCard`, `SkillCard`, `AssignmentCard`, `Badge`, `StatusPill`, `SearchInput`, `Select`, `Tabs`, `FilterBar`, `ProgressBar`, `Avatar`, `Tooltip`, `Table`, `Pagination`, `Modal`, `Drawer`, `Toast`, `EmptyState`, `ErrorState`, `Skeleton`, `QuestionOption`, `AnswerInput`, `FeedbackPanel`, and `ChartPanel`.

## 5. Information Architecture and Navigation

### Student navigation
- Home
- Skill Library
- Recommendations
- My Progress
- Achievements
- Store

During a Practice Session, minimize or hide primary navigation to protect focus. Keep a clear and safe exit action available.

### Teacher navigation
- Home
- Classes & Students
- Skill Library
- Assignments
- Quiz Generator
- Timetable & Teaching Plan
- Performance Analytics

### Learning content hierarchy

`Subject → Grade → Topic → Subtopic (if applicable) → Skill → Question`

The source model allows for Subtopics, but their presence may vary. Do not create empty hierarchy levels when no subtopic data exists.

### Prototype-only role switcher

Real role detection requires backend authentication. Add a **Prototype Role Switcher** in a clearly marked Preview/Development toolbar so reviewers can inspect Student and Teacher experiences. This switcher is only a testing convenience and must not look like a real product sign-in step.

## 6. Required Pages and UX Requirements

### 6.1 Sign in

Include Username and Password fields, show/hide password, invalid credentials/loading/success states, and a recovery/help path marked as a prototype where policy is undecided. Provide a separate Class Code path labelled **Join a Class**; do not confusingly merge it into the primary sign-in form. Do not invent public self-registration.

### 6.2 Student Landing Page — P0

**Goal:** Help the student understand the most important next action immediately.

Suggested hierarchy:
1. Short personalized greeting.
2. Primary Next Assignment card showing skill, teacher, due date, and status.
3. Clear Start Practice or Resume Practice CTA.
4. Continue an unfinished practice session.
5. Recommended skills with an explanation for each recommendation.
6. Progress summary, daily/weekly goal, recent activity, and latest achievement.
7. Coin balance as secondary information; it must not compete with the learning CTA.

Design states for no assignments, multiple assignments, overdue assignment, first visit, no recommendations, loading failure, and empty data.

### 6.3 Skill Library — P0

Include prominent search, Subject and Grade filters (Mathematics is the MVP subject), Topic and optional Subtopic browsing using a Navigation Tree / Accordion, and Skill Cards with title, optional description, practice status, progress indicator, and Start/Resume CTA. Include empty search and no-results filter states.

**Unresolved UX decision:** The source does not conclusively decide whether a Topic needs a separate detail page. Build both alternatives so the team can compare:
1. Expandable topic tree within the Skill Library.
2. Dedicated Topic Detail page containing its skills and progress.

Show `Not Started`, `In Progress`, `Mastered`, and `Needs Review` only as proposed demo labels. Mastery rules are not approved.

### 6.4 Practice Session — P0

Design a focused environment with one question at a time. Show Topic and Skill context, question number and progress, question content, answer controls, and a primary Submit Answer action. SmartScore may appear only if clearly labelled as illustrative demo data; do not imply its formula is finalized.

Feedback states:
- Correct answer: supportive confirmation, concise explanation, and Continue action.
- Incorrect answer: show the correct answer and a helpful solving method without shaming the student.

Include safe exit and a clear save-state indicator. Cover Empty Answer, Duplicate Submit, Network Error, Saving, and Completion. The supplied source does not fully define the supported question-type inventory; implement a small representative sample and do not claim full coverage.

### 6.5 Student Performance Analytics — P1

Include progress summary, subject/topic and time-range filters, simple readable charts, skill-level performance, and a clear suggested next step. Mark invented chart values as `DEMO DATA`. Avoid vague labels such as “weak”; explain metrics.

### 6.6 Recommendations — P1

Include Recommended Skill cards, the reason for each recommendation, related Topic, and Start action. Use fixed demo recommendations. Do not claim a real recommendation engine exists.

### 6.7 Honor Roll & Rewards Store — P2

Include badges and earning criteria, locked badge states, an Avatar item store with preview/coin price/balance, purchase confirmation, insufficient coins, and transaction error states. These features are secondary and must not dominate the Student Landing Page.

### 6.8 Teacher Landing Page — P0

Suggested hierarchy:
1. Today's classes and actions requiring attention.
2. Assignment and quiz deadlines, recent completion, and explainable learning alerts.
3. Class progress summary and upcoming teaching-plan items.
4. Quick Actions: Assign Skills, Generate Quiz, View Analytics, Open Timetable.

Always make the active class context explicit.

### 6.9 Class Management / Student List — P0

Include class selector, student roster, search and filters, activity/assignment status, and multi-select students for assignment recipients. Include empty class and no-activity states. Avoid unnecessary sensitive student information.

### 6.10 Teacher Skill Library — P0

Support Browse, Search, Filter, Preview, sample questions for inspection only, and multi-select skills for an Assignment or Quiz. Preserve active class context during selection and preview. Do not add question authoring or editing.

### 6.11 Assignments — P0

Build a clear multi-step wizard:
1. Select Skills.
2. Select a Class or individual students.
3. Set Due Date and Instructions.
4. Review a summary.
5. Publish.

Before publishing, clearly summarize **which skills, for whom, and by when**.

Suggested demo statuses: `Upcoming`, `Assigned`, `In Progress`, `Overdue`, `Completed`, `Completed Late`, and `Cancelled`. These are proposals subject to product approval. Include no-recipient-selected, invalid-date, duplicate-assignment, and publish-failure states. Do not assume policies for editing or cancelling an assignment after a student has started.

### 6.12 Teacher Performance Analytics — P0

Include Class, Student, Subject/Topic, and Time Range filters; class performance and completion summaries; student performance table; performance trend chart; “Skills Needing Attention” with an explainable basis; and a direct CTA from an insight to `Assign Remedial Practice`.

Include insufficient-data, new-class, and no-answers-for-skill states. Every metric must have an understandable definition. Do not invent the SmartScore formula.

### 6.13 Quiz Generator — P1

Include Skill/Topic selection, example parameters such as question count and difficulty clearly labelled **Demo Settings**, Generate Preview, review generated questions, and Save Draft / Publish actions. Questions must come from the platform Question Bank. Do not add question authoring or editing.

### 6.14 Timetable & Teaching Plan — P1

Include a simple weekly view, classes, planned Topics, and Assignment/Quiz deadlines. Visually distinguish scheduled classes from task deadlines. Provide shortcuts to related class and skill details. Editing permissions are unresolved; any edit controls must be clearly marked demo-only.

### 6.15 Parent / School Administrator

Provide only a placeholder explaining that requirements and permissions need further definition. Do not invent individual-level data access or permission rules.

## 7. Demo Data

Display a persistent `DEMO DATA` label in the prototype environment.

Suggested sample records:
- Student: Ava (آوا), Grade 6, Mathematics.
- Skills: Adding Fractions, Multiplying Decimals, Perimeter and Area.
- Assignment: Adding Fractions practice, status In Progress.
- Teacher: Ms. Ahmadi (خانم احمدی), Grade 6 Class A, 24 students.
- All chart values and performance metrics are fictional and must be labelled demo data.

These are illustrative records, not real product data.

## 8. Prototype Interactions

All primary controls must work:
- Sidebar and breadcrumbs navigate to relevant pages.
- Search and filters operate on demo data.
- Accordions expand/collapse; tabs switch content.
- Assignment Wizard advances through steps and validates required fields.
- Practice Session accepts a demo answer and displays the appropriate feedback state.
- Confirmation dialogs work for publish, purchase, and exit actions.
- Toasts communicate success and errors.
- Do not leave dead buttons or placeholder `#` links.

Use subtle, short animations only. Do not build a real backend, authentication service, payment system, or recommendation engine in this phase. Simulate frontend interactions locally.

## 9. Illustration and Visual Assets

The prototype must not look like a collection of generic empty rectangles.
- Use original, cohesive educational illustrations for Student UI: books, geometry, mathematical tools, discovery, and progress.
- Keep illustrations simple and consistent with the palette.
- Avoid real photographs or identifiable faces of children; abstract or stylized illustrations are preferred.
- Use illustrations sparingly in Teacher UI, mainly for empty states. Teacher screens should prioritize information and actions.
- Prefer local SVG assets or CSS illustrations. Avoid unstable third-party image URLs.
- Use one consistent icon family with consistent stroke weight and sizing.

## 10. Accessibility and Quality Baseline

Maintain adequate contrast, keyboard navigation, visible focus states, real form labels, and sufficiently large mobile touch targets. Do not communicate states through color alone. Provide legends and text labels for charts.

Do not claim WCAG 2.2 AA conformance in this exploratory prototype. Apply baseline accessibility practices; formal conformance scope and testing remain subject to approval.

## 11. Journeys to Demonstrate

### Student journeys
1. Sign in → Student Landing.
2. Landing → Assignment → Skill → Practice.
3. Landing → Resume Practice.
4. Landing → Skill Library → Topic → Skill → Practice.
5. Landing → Recommendation → Practice.
6. Practice → Submit → Feedback → Continue.
7. Practice → Safe Exit → Resume.
8. Landing → Analytics → Next Skill.
9. Landing → Honor Roll.
10. Landing → Rewards Store → Preview → Confirm Purchase.

### Teacher journeys
1. Sign in → Teacher Landing.
2. Landing → Class → Student List.
3. Skill Library → Preview → Select Skills.
4. Select Skills → Assignment Wizard → Preview → Publish.
5. Assignments → Assignment Detail → Status.
6. Analytics → Class/Student Filter → Learning Insight.
7. Analytics → Assign Remedial Practice.
8. Quiz Generator → Configure → Preview → Save/Publish.
9. Timetable → Class/Topic Detail.
10. Landing → Quick Action.

## 12. Technical Deliverables

- A runnable project with clear `npm install` and `npm run dev` instructions.
- If a project already exists, inspect its structure first. Do not replace its framework or core dependencies without a clear reason.
- If the project is empty, choose React + TypeScript + Vite or Next.js. Keep the architecture simple.
- Tailwind CSS is acceptable. Separate reusable components from demo data and centralize design tokens.
- Load Abar font files locally.
- Use real routing or a lightweight router so key pages can be opened directly.
- Create `README.md` (installation, run instructions, project structure, limitations), `DESIGN_DECISIONS.md` (assumptions, proposals, unresolved questions), and `QA_CHECKLIST.md` (journeys and responsive/RTL checks).
- Capture screenshots of Student Landing, Skill Library, Practice Session, Teacher Landing, Assignments, and Analytics.

### Suggested project structure

```text
src/
  app/
  components/
    ui/
    student/
    teacher/
    shared/
  data/
  pages/
  styles/
    tokens.css
    globals.css
public/
  fonts/
    AbarMidFaNum-Regular.woff2
    AbarMidFaNum-SemiBold.woff2
  illustrations/
README.md
DESIGN_DECISIONS.md
QA_CHECKLIST.md
```

## 13. Execution Sequence

1. Inspect supplied files and existing project structure.
2. Implement design tokens and the shared App Shell.
3. Build Student P0 pages.
4. Build Teacher P0 pages.
5. Add P1, then P2, at prototype fidelity.
6. Complete interactions and Empty/Error/Loading states.
7. Verify RTL behavior at all target viewport widths.
8. Capture screenshots of key pages.
9. Record assumptions and issues in the decision and QA files.
10. Report what genuinely works, what is mocked, and which product decisions remain open.

## 14. Prototype Acceptance Criteria

The prototype is ready for review when:
- Users can immediately understand their role and current location.
- A student can start an assignment, answer a question, and understand the feedback without guidance.
- A student can browse the Skill Library and independently choose a skill.
- A teacher can find a skill, assign it, and follow its results in Analytics.
- Teacher analytics lead to an understandable next action.
- Student and Teacher experiences are distinct but share a coherent Design System.
- Persian content is readable and correctly RTL across the application.
- No unapproved feature or business rule is presented as confirmed product behavior.
- Primary controls work and the project builds and runs without errors.

**Build this as a visible, clickable exploratory prototype. Do not over-engineer the backend or attempt to finalize every unresolved product detail. Prioritize visual quality, journey clarity, interaction coherence, and discovery of UX problems.**
