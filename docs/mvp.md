# MVP Definition

## 1. Product Goal

Help a job seeker tailor existing resume content to a specific job description with AI assistance, while keeping the user in control of every change and preventing unsupported claims.

## 2. Target User Workflow

1. The user pastes existing resume text or selected resume bullets.
2. The user pastes a job description.
3. The system identifies relevant requirements and compares them with the provided resume content.
4. If important qualifications are missing or unclear, the AI asks targeted, optional clarification questions. The user may answer or skip them before recommendations are generated; skipped questions must not be treated as confirmation.
5. The AI presents suggested rewrites, additions, or removals as individual changes.
6. The user reviews each suggestion and accepts, rejects, or manually edits it.
7. The system produces one clean, copyable block of text containing only the approved changes and retained content needed for the tailored result.

## 3. MVP Requirements

- Accept pasted resume text or resume bullets as input.
- Accept a pasted job description as input.
- Analyze the job description for relevant qualifications, skills, responsibilities, and signals.
- Compare job requirements with the supplied resume content and identify matches, gaps, and unclear areas.
- Ask targeted, optional clarification questions when answers could materially improve the recommendations; proceed without assuming missing experience or qualifications when questions are skipped or unanswered.
- Generate suggested rewrites, additions, and removals grounded in the supplied resume and clarification answers.
- Present each suggested change as an individually reviewable item.
- Allow the user to accept, reject, or manually edit every suggested change.
- Produce a final clean block of copyable text based only on the user-approved result.
- Avoid inventing experience, technologies, metrics, responsibilities, or qualifications.

## 4. Out of Scope

- Authentication or user accounts
- Persistent storage, databases, or saved sessions
- PDF or DOCX uploads
- Document parsing
- Resume templates
- PDF or DOCX export
- Page-length management
- Application history

## 5. Success Criteria

- A user can move from pasted resume content and a pasted job description to a tailored, copyable result in one session.
- The system surfaces meaningful alignment opportunities and important gaps without requiring the user to inspect the entire job description manually.
- Clarification questions are targeted and only asked when they can improve the result.
- Every proposed change is independently understandable and reviewable.
- The user can produce the final result without accepting any change blindly.
- The final output contains no unsupported claims introduced by the AI.

## 6. Product Principles / Constraints

- **User control:** Suggestions are proposals; the user makes the final decision on every change.
- **Evidence-grounded assistance:** The AI may use only the original resume content and the user's clarification answers as evidence for claims.
- **No fabrication:** When evidence is absent or ambiguous, the AI must clarify, leave the matter uncertain, or omit the claim rather than infer it.
- **Skipped clarifications:** If the user skips a clarification question, the unanswered information remains unsupported and must not be treated as confirmed.
- **Experience context:** Personal, academic, and other non-professional experience must not be represented as professional experience.
- **Explainable changes:** Each suggestion should make clear what is being changed and why it is relevant to the target role.
- **Focused scope:** The MVP optimizes resume-content tailoring for one session, not end-to-end application management.
- **Clean handoff:** The approved result must be easy to copy into the user's existing resume workflow.
