"use client";

import { useState } from "react";

type Clarification = {
  id: string;
  question: string;
};

type WorkflowStage = "input" | "clarifying" | "complete";
type ReviewDecision = "pending" | "accepted" | "rejected" | "edited";

const originalBullet = "• Coordinated cross-functional projects to deliver work on schedule.";
const mockedSuggestedBullet =
  "• Led cross-functional projects from planning through delivery, consistently meeting deadlines.";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>("input");
  const [clarification, setClarification] = useState<Clarification | null>(null);
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const [clarificationSkipped, setClarificationSkipped] = useState(false);
  const [suggestedBullet, setSuggestedBullet] = useState(mockedSuggestedBullet);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>("pending");
  const [selectedBullet, setSelectedBullet] = useState<string | null>(null);
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const canAnalyze = resume.trim().length > 0 && jobDescription.trim().length > 0;

  async function handleAnalyze() {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setError("");

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
      setSuggestedBullet(mockedSuggestedBullet);
      setReviewDecision("pending");
      setSelectedBullet(null);
      setIsEditingSuggestion(false);
      setWorkflowStage("clarifying");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Analysis failed.");
      setClarification(null);
      setWorkflowStage("input");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleResumeChange(value: string) {
    setResume(value);
    setError("");
  }

  function handleJobDescriptionChange(value: string) {
    setJobDescription(value);
    setError("");
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
    setSuggestedBullet(mockedSuggestedBullet);
    setReviewDecision("pending");
    setSelectedBullet(null);
    setIsEditingSuggestion(false);
    setError("");
  }

  function handleAcceptSuggestion() {
    setSelectedBullet(suggestedBullet);
    setReviewDecision("accepted");
  }

  function handleRejectSuggestion() {
    setSelectedBullet(originalBullet);
    setReviewDecision("rejected");
  }

  function handleEditSuggestion() {
    setIsEditingSuggestion(true);
  }

  function handleSaveSuggestion() {
    if (suggestedBullet.trim().length === 0) return;

    setSelectedBullet(suggestedBullet);
    setReviewDecision("edited");
    setIsEditingSuggestion(false);
  }

  function handleCancelEditSuggestion() {
    setSuggestedBullet(mockedSuggestedBullet);
    setSelectedBullet(null);
    setReviewDecision("pending");
    setIsEditingSuggestion(false);
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
        {error && <p role="alert">{error}</p>}
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
          <h2 id="suggestion-heading">Suggested Change</h2>
          <div className="suggestion-panel">
            <div>
              <h3>Original resume bullet</h3>
              <p>{originalBullet}</p>
            </div>
            <div>
              <h3>Suggested replacement</h3>
              {isEditingSuggestion ? (
                <textarea
                  aria-label="Suggested replacement"
                  value={suggestedBullet}
                  onChange={(event) => setSuggestedBullet(event.target.value)}
                  rows={4}
                />
              ) : (
                <p>{suggestedBullet}</p>
              )}
            </div>
            <div className="button-row">
              {isEditingSuggestion ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveSuggestion}
                    disabled={suggestedBullet.trim().length === 0}
                  >
                    Save
                  </button>
                  <button type="button" onClick={handleCancelEditSuggestion}>
                    Cancel Edit
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={handleAcceptSuggestion}>
                    Accept
                  </button>
                  <button type="button" onClick={handleRejectSuggestion}>
                    Reject
                  </button>
                  <button type="button" onClick={handleEditSuggestion}>
                    Edit
                  </button>
                </>
              )}
            </div>
            {reviewDecision !== "pending" && (
              <p className="helper-text">
                Suggestion {reviewDecision}. Selected result: {selectedBullet}
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
