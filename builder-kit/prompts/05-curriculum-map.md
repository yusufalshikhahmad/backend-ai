# 05 — Curriculum Map Prompt

Build a clear visual map of the supplied AI Backend Engineering curriculum.

## Source rules
Read the PDF and docs/03-curriculum-map.md. Preserve official course codes and sequence. Verify title, duration, prerequisites and project details from the source PDF before making them definitive. If unclear, mark "بحاجة إلى مراجعة المصدر".

## UX
- Show four semesters in a navigable progression.
- Each course card shows code, verified title, status and short verified purpose.
- Differentiate required prerequisite from recommended prerequisite.
- Selecting a course opens details and its modules.
- Current/next course receives focus without hiding the full map.
- Accessible alternative: structured list and text description, not map alone.

## States
Not started, available, in progress, practiced, mastered, locked by prerequisite (only if source supports lock), completed. Never rely on color alone; include label/icon/text.

## Mobile
Use vertical progression with semester accordion; no tiny nodes or forced zoom.

## Deliver
Course map, course detail panel/page, prerequisite explanation, responsive states, and a content source mapping table.
