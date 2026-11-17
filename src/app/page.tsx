"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

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
              onChange={(event) => setResume(event.target.value)}
              placeholder="Paste your resume content here"
              rows={12}
            />
          </label>

          <label className="field">
            <span>Job Description</span>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here"
              rows={12}
            />
          </label>
        </div>
      </section>

      <section aria-labelledby="output-heading">
        <h2 id="output-heading">Output</h2>
        <div className="output-grid">
          <div className="output-panel">
            <h3>Resume Input</h3>
            <pre>{resume}</pre>
          </div>
          <div className="output-panel">
            <h3>Job Description</h3>
            <pre>{jobDescription}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
