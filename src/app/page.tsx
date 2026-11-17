"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzedResume, setAnalyzedResume] = useState("");
  const [analyzedJobDescription, setAnalyzedJobDescription] = useState("");
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
        resume?: unknown;
        jobDescription?: unknown;
        error?: unknown;
      } = await response.json();

      if (!response.ok) {
        throw new Error(typeof result.error === "string" ? result.error : "Analysis failed.");
      }

      if (typeof result.resume !== "string" || typeof result.jobDescription !== "string") {
        throw new Error("Analysis returned an invalid response.");
      }

      setAnalyzedResume(result.resume);
      setAnalyzedJobDescription(result.jobDescription);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Analysis failed.");
      setAnalyzedResume("");
      setAnalyzedJobDescription("");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleResumeChange(value: string) {
    setResume(value);
    setAnalyzedResume("");
    setAnalyzedJobDescription("");
    setError("");
  }

  function handleJobDescriptionChange(value: string) {
    setJobDescription(value);
    setAnalyzedResume("");
    setAnalyzedJobDescription("");
    setError("");
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
            />
          </label>

          <label className="field">
            <span>Job Description</span>
            <textarea
              value={jobDescription}
              onChange={(event) => handleJobDescriptionChange(event.target.value)}
              placeholder="Paste the job description here"
              rows={12}
            />
          </label>
        </div>
        <p className="helper-text">Both inputs are required before analysis can continue.</p>
        <button type="button" onClick={handleAnalyze} disabled={!canAnalyze || isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </button>
        {error && <p role="alert">{error}</p>}
      </section>

      <section aria-labelledby="output-heading">
        <h2 id="output-heading">Output</h2>
        <div className="output-grid">
          <div className="output-panel">
            <h3>Resume Input</h3>
            <pre>{analyzedResume}</pre>
          </div>
          <div className="output-panel">
            <h3>Job Description</h3>
            <pre>{analyzedJobDescription}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
