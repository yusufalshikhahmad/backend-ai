# Architecture Proposal

## Stack
Frontend: Next.js + TypeScript; accessible component primitives; RTL-aware styles.
Backend: FastAPI + Pydantic + SQLAlchemy async + Alembic.
Database: PostgreSQL. Vector extension only when RAG tutor/search justified.
Cache/jobs: Redis; queue technology decided after small prototype.
Content: versioned Markdown/JSON in repo, validated and compiled into lesson blocks.
Storage: S3-compatible uploads with signed URLs.
Auth: trusted provider or reviewed auth library; secure HTTP-only cookies; role authorization.
Observability: structured redacted logs, metrics, tracing/error reporting.
Dev: Docker Compose; deployment strategy selected after cost and workload estimates.

## Context
Student browser → Next.js learning interface → FastAPI → PostgreSQL / Redis / worker. Versioned course content is loaded through validated content pipeline. Instructor/editor uses authoring preview.

## Main entities
User, Profile, Course, Module, Lesson, ContentVersion, Skill, Prerequisite, Enrollment, LessonProgress, SkillMastery, Question, Attempt, Answer, ReviewItem, Project, ProjectMilestone, Submission, Rubric, MediaAsset.

## API proposal
GET /api/v1/courses
GET /api/v1/courses/{slug}/map
GET /api/v1/lessons/{slug}
POST /api/v1/lessons/{id}/attempts
GET /api/v1/review/queue
POST /api/v1/review/{item_id}
GET /api/v1/me/progress
Admin APIs separated and protected.

## Security
Auth/session and CSRF controls as appropriate; rate limits; schema validation; resource-level authorization; sanitize Markdown; validate asset links; audit admin changes; secrets outside repo.
Code runner must be separate, disposable, non-root, CPU/RAM/time/PID limits, blocked network, isolated filesystem, no secrets, output limits, cleanup. Never run learner code in API container.
AI tutor: prompt injection controls, source grounding, privacy boundary, evaluations, quotas.

## Proposed repo structure
apps/web, apps/api, services/code-runner (future), content/curriculum, content/courses, packages/ui, packages/schemas, docs/adr, infra, tests.

## Decisions open
Monorepo vs split (lean monorepo initially); auth provider; sandbox technology; AI tutor timing; hosting/cost; content schema. Write ADRs when decided.
