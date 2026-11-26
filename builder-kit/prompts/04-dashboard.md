# 04 — Learner Dashboard Prompt

Create the student dashboard as an action-oriented learning cockpit, not a KPI wall. Use assets/mockups/dashboard.svg.

## Content hierarchy
- Personalized greeting (no invented name).
- Continue learning: one dominant course/lesson card with real course code, title and progress from data.
- Today's learning plan: one short recommended sequence.
- Review queue: due concepts and estimated effort.
- Current project: milestone and next deliverable.
- Curriculum journey preview: semesters and next milestone.
- Optional skill mastery: show evidence and sample size, not unsupported percentages.

## Behaviors
Continue button opens the current lesson. Review card starts a review session. Project card opens project milestone. Course map opens curriculum route. Progress is based on actual local attempt state or clearly identified demo data.

## States
New learner with no progress; learner in progress; review due; completed lesson; no project yet; loading/error. Do not fabricate student count, streaks, testimonials or rankings.

## Mobile
Single column; Continue Learning first; secondary cards stacked; charts become compact lists; no horizontal overflow.
