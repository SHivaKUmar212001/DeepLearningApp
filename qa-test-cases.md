---
name: qa-test-cases
description: Use this skill whenever the user is doing QA work — preparing test case documents from a PRD/spec, building a test plan or test suite, generating test scenarios for a feature, or reviewing test cases and marking pass/fail status. Triggers on phrases like "write test cases", "test plan", "QA document", "review test cases", "test coverage for [feature]", "test scenarios", "test suite", or any request that involves preparing an industry-grade test case document tied to project requirements. Also use when the user has uploaded a PRD, spec, or requirements doc and wants comprehensive test coverage, or when they say things like "I'm the QA on this, help me write cases". Approaches test case design from a senior QA developer's perspective — covering positive, negative, boundary, edge, integration, security, and non-functional cases — and produces a color-coded Excel (.xlsx) deliverable with pass/fail status and failure reasons captured during a review pass.
---

# QA Test Cases

A workflow for preparing industry-grade test case documents from a PRD/spec, reviewing each case with the tester, and producing a color-coded Excel deliverable.

## Why this skill exists

A test case document is only valuable if (1) it's grounded in the actual product — its real use cases and functionality, not a generic template — and (2) it captures execution status with enough context that a future reader (or auditor) can understand what was tested, what passed, and exactly why anything failed. This skill encodes the workflow a senior QA developer would follow: read the spec carefully, design coverage with intent, walk through execution case by case, and produce a deliverable that holds up in a review meeting.

## The four phases

1. **Ingest** the project context from the uploaded PRD/spec
2. **Generate** comprehensive test cases anchored to extracted requirements
3. **Review** each test case with the user, capturing pass/fail and failure reasons
4. **Deliver** a color-coded `.xlsx` with status, reasons, summary, and traceability

Do these in order. Don't skip Phase 1 — generating test cases without grounding them in the real document is the single biggest failure mode of generic QA work and is what the user is explicitly asking to avoid.

---

## Phase 1: Ingest project context

The user will have uploaded a PRD, spec, requirements doc, or similar. Read it using the appropriate skill: `pdf-reading` for `.pdf`, `docx` for `.docx`, `file-reading` for other formats. Then extract a structured project frame *before* writing a single test case.

### What to extract

- **Project / feature name and scope** — what's being tested and what's explicitly out of scope
- **User roles / personas** — who interacts with the system (admin, end user, guest, API consumer, etc.)
- **Modules / functional areas** — logical groupings (e.g., Auth, Profile, Payments, Search)
- **Use cases** — the user-facing flows ("user logs in with email", "admin approves request")
- **Functional requirements** — specific behaviors the system must exhibit
- **Non-functional requirements** — performance, security, accessibility, compliance, audit
- **Business rules / constraints** — validation rules, limits, dependencies
- **External dependencies / integrations** — third-party services, APIs, data sources
- **Edge cases the spec already calls out** — anything the PRD explicitly flags as tricky

### Confirm the frame before generating

Show the user a concise project-frame summary (3–8 lines) and ask if anything is missing or off. This catches ambiguity early, when it's cheap to fix.

**Example:**
> Based on the PRD, here's what I'm testing against:
> - **Feature**: User authentication (login + signup + password reset)
> - **Roles**: Anonymous visitor, registered user, admin
> - **Modules**: Email login, OAuth (Google, GitHub), MFA setup, password reset flow
> - **Key NFRs**: Sessions expire after 30 min idle; passwords meet OWASP guidelines; account lockout after 5 failed attempts
> - **Integrations**: SendGrid for emails, Auth0 for OAuth
>
> Anything missing, or should I adjust the scope before generating cases?

If the PRD is thin on some areas (e.g., no NFRs mentioned, no error-handling specified), call it out — a senior QA wouldn't silently assume coverage; they'd flag the gap and propose reasonable coverage with an explicit "this is inferred, please confirm" note.

---

## Phase 2: Generate test cases

Design coverage like a senior QA would — methodically, with intent, and traceable to the spec.

### Coverage dimensions

For every module/use case, think through each dimension below. Skip ones that genuinely don't apply, but consider each.

| Dimension | What it catches | Example |
|---|---|---|
| **Positive / happy path** | Core flow works as specified | Valid email + password logs user in |
| **Negative** | System rejects bad input cleanly | Wrong password shows correct error message |
| **Boundary** | Off-by-one and limit issues | Password exactly 8 chars (min), 128 (max), 7, 129 |
| **Equivalence partitioning** | Representative cases per input class | One test per: alphanumeric, special chars, unicode, empty |
| **Edge / unusual** | Real-world weirdness | Login during password rotation; concurrent sessions |
| **Error handling** | Graceful failure | Network drops mid-submit; backend returns 500 |
| **Security / authorization** | Privilege & data protection | Non-admin hits admin endpoint directly |
| **Integration** | Cross-module / cross-service | Login triggers welcome email via SendGrid |
| **State transitions** | Behavior across states | Login while account locked / pending verification / disabled |
| **Performance** (if in scope) | Latency / load thresholds | Login completes <500ms p95 under N concurrent users |
| **Usability / accessibility** (if in scope) | Real human factors | Keyboard-only login flow; screen-reader labels present |

### Test case structure (these become Excel columns)

| Column | Purpose | Example |
|---|---|---|
| `TC_ID` | Stable identifier | `TC_AUTH_001` |
| `Module` | Functional area | `Authentication` |
| `Title` | One-line summary | `Login with valid email and password` |
| `Type` | Coverage dimension | `Positive` / `Negative` / `Boundary` / etc. |
| `Priority` | P0 (blocker) – P3 (nice to have) | `P0` |
| `Requirement_Ref` | Traceability to PRD section | `PRD §3.1.2` |
| `Preconditions` | State needed before the test | `User account exists and is verified` |
| `Test_Steps` | Numbered, atomic actions | `1. Open /login\n2. Enter email\n3. ...` |
| `Test_Data` | Specific values used | `email: test@x.com, pw: Valid1Pass!` |
| `Expected_Result` | What should happen | `Redirect to /dashboard within 2s; session cookie set` |
| `Actual_Result` | Filled during execution | (empty initially) |
| `Status` | Filled during execution | `Pass` / `Fail` / `Blocked` / `Skipped` / `Not Executed` |
| `Failure_Reason` | Required if Fail or Blocked | `500 returned; backend log: DB timeout. Repro 3/3.` |
| `Tester` | Who executed it | `Shiba` |
| `Date` | Execution date | `2026-05-21` |
| `Notes` | Anything else worth recording | `Browser: Chrome 124` |

### TC_ID convention

Use `TC_<MODULE>_<NNN>` where MODULE is a short uppercase code (3–5 letters) and NNN is zero-padded. Examples: `TC_AUTH_001`, `TC_PAY_014`, `TC_SRCH_032`. Stable IDs make defect reports and re-runs easy.

### Quality bar for steps and expected results

Steps must be atomic and unambiguous — anyone on the team could execute them without asking questions.

**Weak step:** `Try to log in with bad data`
**Strong step:**
```
1. Navigate to /login
2. Enter "test@x.com" in Email field
3. Enter "wrongpass" in Password field
4. Click "Sign In" button
```

Expected results must be observable and specific.

**Weak:** `Login should fail`
**Strong:** `Page stays on /login. Error "Invalid email or password" appears below Password field within 1s. No session cookie set. Password field cleared, Email field retains input.`

### How many cases?

A small feature (single form) might warrant 8–15 cases. A module (e.g., full auth) might warrant 40–80. A whole product might warrant hundreds. Don't pad with low-value variations to hit a number — every case should earn its place by covering a distinct risk.

### Before moving on

After generating, show the user a compact table of contents (cases grouped by module, with TC_ID + Title + Priority + Type) so they can scan for gaps or anything mis-scoped. Then ask: "Looks good to start the review, or want me to add/remove anything first?"

---

## Phase 3: Review with the tester

Walk the user through the cases to capture execution status. This is where a *real* test document is born — a generated template without a review pass is half the deliverable.

### Presentation pattern (default: one-by-one)

For each case, present it compactly:

```
[TC_AUTH_003] Login with empty password  (Negative, P1)
Steps:
  1. Open /login
  2. Enter valid email
  3. Leave password blank
  4. Click Sign In
Expected: Inline error "Password is required" shown; no network request fired.

Status? (Pass / Fail / Blocked / Skipped)
```

Wait for the user's response. If they say **Fail** or **Blocked**, ask for the reason / error / blocker — this becomes the `Failure_Reason` cell. Be brief; don't over-prompt.

### Batching for long suites

For suites longer than ~20 cases, offer at the start: *"Want to go one-by-one, or should I list 10 at a time and you tell me which failed (others default to Pass)?"* Adapt to what the user prefers. Default to one-by-one when in doubt.

### Status taxonomy

- **Pass** — observed result matches expected
- **Fail** — observed result diverges from expected; capture the reason
- **Blocked** — couldn't execute (environment down, dependency missing); capture the blocker
- **Skipped** — intentionally not run this cycle (out of scope for this build, deferred)
- **Not Executed** — default before review; should be empty by the end of the review pass

### Capturing failure reasons well

A senior QA writes failure reasons that another engineer can act on without follow-up questions. Include: what was observed, where it diverged from expected, any error message or code, and reproducibility if known.

**Weak:** `Doesn't work`
**Strong:** `Returns 500 on submit instead of 401. Console: "TypeError: Cannot read property 'role' of undefined" in auth-controller.js:142. Reproducible 3/3 in Chrome 124.`

If the user gives a thin failure reason, *gently* ask for one more detail (error message, repro rate, or where the divergence happened) — once, not repeatedly.

---

## Phase 4: Deliver the Excel document

Use the `xlsx` skill (read `/mnt/skills/public/xlsx/SKILL.md` first) to build the file. Don't hand-roll openpyxl from memory — that skill has the current patterns for this environment.

### Workbook structure (three sheets)

1. **Summary** — Counts and pass rate at the top, then per-module breakdown
2. **Test Cases** — Full table, one row per case, all columns from Phase 2
3. **Traceability** — Matrix mapping `Requirement_Ref` → list of `TC_ID`s that cover it; flag any requirement with zero coverage in red

### Color coding (required)

Apply fills to the `Status` column on the Test Cases sheet:

| Status | Fill | Font |
|---|---|---|
| Pass | Green `#C6EFCE` | Dark green `#006100` |
| Fail | Red `#FFC7CE` | Dark red `#9C0006` |
| Blocked | Amber `#FFEB9C` | Dark amber `#9C5700` |
| Skipped | Light gray `#D9D9D9` | Dark gray `#595959` |
| Not Executed | No fill | Default |

These are the standard Excel "Good / Bad / Neutral" palette — the convention QA reports use in industry, so they're instantly readable.

Also fill the `Failure_Reason` cell with a lighter version of the Status color on Fail/Blocked rows, so a reviewer can scan the sheet and spot what went wrong without reading every row.

### Formatting details

- **Header row**: bold, frozen pane below row 1, autofilter enabled on the table
- **Column widths**: sized so `Test_Steps` and `Expected_Result` are readable (60–80 chars), wrap text on for those columns
- **TC_ID column**: bold, narrower (~14 chars)
- **Borders**: thin grid throughout the table area
- **Summary sheet**: large pass-rate percentage at top (e.g., `88% Pass (22/25)`), then a per-module breakdown table

### Naming and presenting the file

Name the file `TestCases_<Project>_<YYYY-MM-DD>.xlsx`. Save to `/mnt/user-data/outputs/`. Use `present_files` to share with the user. Brief one-line summary after — pass rate and any P0 failures worth flagging immediately.

---

## Anti-patterns to avoid

- **Generic cases that ignore the spec.** "Test that login works" with no `Requirement_Ref`. Every case must trace to something concrete in the PRD or to a flagged inferred-NFR.
- **Padding with trivial variations.** Five separate cases for "login with email length 5, 6, 7, 8, 9" when boundary analysis says you only need min−1, min, max, max+1.
- **Vague expected results.** "Should work" / "should show error" can't be objectively passed or failed.
- **Skipping non-functional coverage.** If the PRD mentions perf / security / accessibility, you need cases. If it doesn't, raise the gap rather than silently omitting.
- **Marking Fail without a reason.** A red cell with no explanation is worthless in a review meeting.
- **Producing the Excel before the review pass.** A pre-filled "Not Executed" template is half a deliverable — the user explicitly wants status captured, so the review pass is non-negotiable.
- **Spamming the user with every status option each time.** After the first case, they know the options — just ask "Status?" and parse their answer.
