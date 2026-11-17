"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzedResume, setAnalyzedResume] = useState("");
  const [analyzedJobDescription, setAnalyzedJobDescription] = useState("");

  const canAnalyze = resume.trim().length > 0 && jobDescription.trim().length > 0;

  function handleAnalyze() {
    if (!canAnalyze) return;

    setAnalyzedResume(resume);
    setAnalyzedJobDescription(jobDescription);
  }

  function handleResumeChange(value: string) {
    setResume(value);
    setAnalyzedResume("");
    setAnalyzedJobDescription("");
  }

  function handleJobDescriptionChange(value: string) {
    setJobDescription(value);
    setAnalyzedResume("");
    setAnalyzedJobDescription("");
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
        <button type="button" onClick={handleAnalyze} disabled={!canAnalyze}>
          Analyze
        </button>
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
