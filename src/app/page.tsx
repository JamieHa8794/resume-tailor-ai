"use client";

import { useEffect, useRef, useState } from "react";

type Clarification = {
  id: string;
  question: string;
};

type WorkflowStage = "input" | "clarifying" | "complete";
type ReviewDecision = "pending" | "accepted" | "rejected" | "edited";
type ReviewSubmissionStatus = "idle" | "submitting" | "succeeded" | "failed";

type Suggestion = {
  id: string;
  originalBullet: string;
  suggestedBullet: string;
  decision: ReviewDecision;
  selectedBullet: string | null;
  isEditing: boolean;
};

const mockedSuggestions: Suggestion[] = [
  {
    id: "suggestion-1",
    originalBullet: "• Coordinated cross-functional projects to deliver work on schedule.",
    suggestedBullet:
      "• Led cross-functional projects from planning through delivery, consistently meeting deadlines.",
    decision: "pending",
    selectedBullet: null,
    isEditing: false,
  },
  {
    id: "suggestion-2",
    originalBullet: "• Created weekly reports for project stakeholders.",
    suggestedBullet: "• Delivered clear weekly project reports to keep stakeholders aligned.",
    decision: "pending",
    selectedBullet: null,
    isEditing: false,
  },
  {
    id: "suggestion-3",
    originalBullet: "• Improved the team's process for handling incoming requests.",
    suggestedBullet: "• Streamlined incoming request handling to improve team efficiency.",
    decision: "pending",
    selectedBullet: null,
    isEditing: false,
  },
];

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>("input");
  const [clarification, setClarification] = useState<Clarification | null>(null);
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const [clarificationSkipped, setClarificationSkipped] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockedSuggestions);
  const [reviewSubmissionStatus, setReviewSubmissionStatus] =
    useState<ReviewSubmissionStatus>("idle");
  const [reviewConfirmation, setReviewConfirmation] = useState("");
  const reviewSubmissionStarted = useRef(false);
  const [inputError, setInputError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const canAnalyze = resume.trim().length > 0 && jobDescription.trim().length > 0;

  async function handleAnalyze() {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setInputError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const result: {
        clarification?: { id?: unknown; question?: unknown };
        error?: unknown;
      } = await response.json();

      if (!response.ok) {
        throw new Error(typeof result.error === "string" ? result.error : "Analysis failed.");
      }

      if (
        !result.clarification ||
        typeof result.clarification.id !== "string" ||
        typeof result.clarification.question !== "string"
      ) {
        throw new Error("Analysis returned an invalid response.");
      }

      setClarification({
        id: result.clarification.id,
        question: result.clarification.question,
      });
      setClarificationAnswer("");
      setClarificationSkipped(false);
      setSuggestions(mockedSuggestions);
      setReviewSubmissionStatus("idle");
      setReviewConfirmation("");
      reviewSubmissionStarted.current = false;
      setWorkflowStage("clarifying");
    } catch (requestError) {
      setInputError(requestError instanceof Error ? requestError.message : "Analysis failed.");
      setClarification(null);
      setWorkflowStage("input");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleResumeChange(value: string) {
    setResume(value);
    setInputError("");
  }

  function handleJobDescriptionChange(value: string) {
    setJobDescription(value);
    setInputError("");
  }

  function handleSubmitClarification() {
    if (clarificationAnswer.trim().length === 0) return;

    setClarificationSkipped(false);
    setWorkflowStage("complete");
  }

  function handleSkipClarification() {
    setClarificationAnswer("");
    setClarificationSkipped(true);
    setWorkflowStage("complete");
  }

  function handleEditInputs() {
    setWorkflowStage("input");
    setClarification(null);
    setClarificationAnswer("");
    setClarificationSkipped(false);
    setSuggestions(mockedSuggestions);
    setReviewSubmissionStatus("idle");
    setReviewConfirmation("");
    setReviewError("");
    reviewSubmissionStarted.current = false;
    setInputError("");
  }

  function updateSuggestion(id: string, update: Partial<Suggestion>) {
    setSuggestions((currentSuggestions) =>
      currentSuggestions.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, ...update } : suggestion,
      ),
    );
  }

  function handleAcceptSuggestion(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      decision: "accepted",
      selectedBullet: suggestion.suggestedBullet,
    });
  }

  function handleRejectSuggestion(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      decision: "rejected",
      selectedBullet: suggestion.originalBullet,
    });
  }

  function handleEditSuggestion(id: string) {
    updateSuggestion(id, { isEditing: true });
  }

  function handleSaveSuggestion(suggestion: Suggestion) {
    if (suggestion.suggestedBullet.trim().length === 0) return;

    updateSuggestion(suggestion.id, {
      decision: "edited",
      selectedBullet: suggestion.suggestedBullet,
      isEditing: false,
    });
  }

  function handleCancelEditSuggestion(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      suggestedBullet: mockedSuggestions.find((item) => item.id === suggestion.id)!.suggestedBullet,
      decision: "pending",
      selectedBullet: null,
      isEditing: false,
    });
  }

  function handleChangeDecision(id: string) {
    updateSuggestion(id, { decision: "pending", selectedBullet: null });
  }

  useEffect(() => {
    const reviewIsComplete =
      workflowStage === "complete" &&
      suggestions.length > 0 &&
      suggestions.every((suggestion) => suggestion.decision !== "pending");

    if (
      !reviewIsComplete ||
      reviewSubmissionStatus !== "idle" ||
      reviewSubmissionStarted.current
    ) {
      return;
    }

    reviewSubmissionStarted.current = true;

    void (async () => {
      setReviewSubmissionStatus("submitting");
      setReviewError("");

      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            suggestions: suggestions.map(({ id, decision, selectedBullet }) => ({
              id,
              decision,
              selectedBullet,
            })),
          }),
        });
        const result: { message?: unknown; error?: unknown } = await response.json();
        if (!response.ok) {
          throw new Error(typeof result.error === "string" ? result.error : "Review submission failed.");
        }
        if (result.message !== "review complete") {
          throw new Error("Review returned an invalid response.");
        }
        setReviewConfirmation(result.message);
        setReviewSubmissionStatus("succeeded");
      } catch (requestError) {
        setReviewSubmissionStatus("failed");
        setReviewError(
          requestError instanceof Error ? requestError.message : "Review submission failed.",
        );
      }
    })();
  }, [reviewSubmissionStatus, suggestions, workflowStage]);

  function handleRetryReview() {
    reviewSubmissionStarted.current = false;
    setReviewConfirmation("");
    setReviewError("");
    setReviewSubmissionStatus("idle");
  }

  return (
    <main className="page-shell">
      <h1>Resume Tailor App</h1>

      <section aria-labelledby="input-heading">
        <h2 id="input-heading">Inputs</h2>
        <div className="input-grid">
          <label className="field">
            <span>Resume Input</span>
            <textarea
              value={resume}
              onChange={(event) => handleResumeChange(event.target.value)}
              placeholder="Paste your resume content here"
              rows={12}
              disabled={workflowStage !== "input" || isAnalyzing}
            />
          </label>

          <label className="field">
            <span>Job Description</span>
            <textarea
              value={jobDescription}
              onChange={(event) => handleJobDescriptionChange(event.target.value)}
              placeholder="Paste the job description here"
              rows={12}
              disabled={workflowStage !== "input" || isAnalyzing}
            />
          </label>
        </div>
        <p className="helper-text">Both inputs are required before analysis can continue.</p>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing || workflowStage !== "input"}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </button>
        {inputError && <p role="alert">{inputError}</p>}
      </section>

      <section aria-labelledby="clarification-heading">
        <h2 id="clarification-heading">Clarification</h2>
        {workflowStage === "input" && <p>Analyze your inputs to receive a clarification question.</p>}
        {workflowStage === "clarifying" && clarification && (
          <div className="clarification-panel">
            <p>{clarification.question}</p>
            <label className="field">
              <span>Your answer</span>
              <textarea
                value={clarificationAnswer}
                onChange={(event) => setClarificationAnswer(event.target.value)}
                placeholder="Enter an answer, or skip this question"
                rows={5}
              />
            </label>
            <div className="button-row">
              <button
                type="button"
                onClick={handleSubmitClarification}
                disabled={clarificationAnswer.trim().length === 0}
              >
                Submit
              </button>
              <button type="button" onClick={handleSkipClarification}>
                Skip
              </button>
            </div>
          </div>
        )}
        {workflowStage === "complete" && (
          <div className="clarification-panel">
            <p>Clarification complete</p>
            <p className="helper-text">
              {clarificationSkipped ? "The question was skipped." : "Your answer was recorded."}
            </p>
          </div>
        )}
        {workflowStage !== "input" && (
          <button type="button" onClick={handleEditInputs}>
            Edit Inputs
          </button>
        )}
      </section>

      {workflowStage === "complete" && (
        <section aria-labelledby="suggestion-heading">
          <h2 id="suggestion-heading">Suggested Changes</h2>
          <div className="suggestion-list">
            {suggestions.map((suggestion) => {
              const actionsDisabled = reviewSubmissionStatus !== "idle";

              return (
                <div className="suggestion-panel" key={suggestion.id}>
                  <div>
                    <h3>Original resume bullet</h3>
                    <p>{suggestion.originalBullet}</p>
                  </div>
                  <div>
                    <h3>Suggested replacement</h3>
                    {suggestion.isEditing ? (
                      <textarea
                        aria-label={`Suggested replacement for ${suggestion.id}`}
                        value={suggestion.suggestedBullet}
                        onChange={(event) =>
                          updateSuggestion(suggestion.id, { suggestedBullet: event.target.value })
                        }
                        rows={4}
                        disabled={actionsDisabled}
                      />
                    ) : (
                      <p>{suggestion.suggestedBullet}</p>
                    )}
                  </div>
                  <div className="button-row">
                    {suggestion.isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveSuggestion(suggestion)}
                          disabled={actionsDisabled || suggestion.suggestedBullet.trim().length === 0}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelEditSuggestion(suggestion)}
                          disabled={actionsDisabled}
                        >
                          Cancel Edit
                        </button>
                      </>
                    ) : suggestion.decision === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptSuggestion(suggestion)}
                          disabled={actionsDisabled}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectSuggestion(suggestion)}
                          disabled={actionsDisabled}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditSuggestion(suggestion.id)}
                          disabled={actionsDisabled}
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleChangeDecision(suggestion.id)}
                        disabled={actionsDisabled}
                      >
                        Change decision
                      </button>
                    )}
                  </div>
                  {suggestion.decision !== "pending" && (
                    <p className="helper-text">
                      Suggestion {suggestion.decision}. Selected result: {suggestion.selectedBullet}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {reviewSubmissionStatus === "submitting" && <p>Submitting review...</p>}
          {reviewError && <p role="alert">{reviewError}</p>}
          {reviewSubmissionStatus === "failed" && (
            <button type="button" onClick={handleRetryReview}>
              Retry
            </button>
          )}
          {reviewConfirmation && <p>{reviewConfirmation}</p>}
        </section>
      )}
    </main>
  );
}
