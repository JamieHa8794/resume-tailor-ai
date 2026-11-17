# Technical Design

This document describes the lightweight technical direction for the MVP defined in [`mvp.md`](./mvp.md).

## Technical Direction

- Use TypeScript throughout.
- Use React for the browser UI.
- Use Next.js as the full-stack framework.
- Do not introduce a separate backend service for the MVP.
- Run AI calls and other secret-dependent work in server-side Next.js code.
- Use no database or persistent storage.

## Browser and Server Responsibilities

The browser handles the interactive experience: collecting pasted resume content and the job description, displaying analysis and clarification questions, presenting individual suggestions, accepting user review decisions, and showing the final copyable text.

The server handles AI requests and any operation requiring secrets. It receives only the information needed for the current interaction, coordinates analysis and suggestion generation, and returns results to the browser. AI API credentials and other secrets must never be exposed to browser code.

## High-Level Flow

1. The user enters resume content and a job description in the browser.
2. The server sends the relevant inputs for analysis and returns job requirements, matches, gaps, and optional clarification questions.
3. The user answers or skips clarification questions. Unanswered information remains unsupported.
4. The server generates grounded rewrite, addition, or removal suggestions using the original content and answered clarifications.
5. The browser presents each suggestion for acceptance, rejection, or manual editing.
6. The browser combines the approved changes into a clean, copyable final text result.

## Temporary Session State

Session state should exist only for the active user session and may be held conceptually between browser interactions. It includes the pasted inputs, clarification answers or skips, suggestions, and review decisions. It must not be treated as durable user data or survive as saved application history.

## Security and Privacy Boundaries

- Keep AI API credentials and all other secrets exclusively on the server.
- Send pasted resume content and job descriptions only to the server-side logic needed for the current task and the selected AI service.
- Do not persist resume content, job descriptions, clarification answers, or generated results.
- Treat all AI output as untrusted suggestions; preserve user review and evidence-grounding requirements.

## Intentionally Undecided

The MVP does not yet decide the specific AI provider, deployment provider, request/response schemas, prompt design, state-management mechanism, validation and rate-limit approach, or detailed error and retry behavior.
