import { useState } from 'react';
import type { WorkflowStage } from './workflow-types';

type InputSectionProps = {
  workflowStage: WorkflowStage;
  onAnalysisComplete: (
    needsClarification: boolean,
    clarification: { id: string; question: string } | null,
  ) => void;
};

export function InputSection({
  workflowStage,
  onAnalysisComplete,
}: InputSectionProps) {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputError, setInputError] = useState('');
  const canAnalyze =
    resume.trim().length > 0 && jobDescription.trim().length > 0;

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setIsAnalyzing(true);
    setInputError('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const result: {
        needsClarification?: unknown;
        clarification?: { id?: unknown; question?: unknown } | null;
        error?: unknown;
      } = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.error === 'string' ? result.error : 'Analysis failed.',
        );
      if (
        result.needsClarification === true &&
        (!result.clarification ||
          typeof result.clarification.id !== 'string' ||
          typeof result.clarification.question !== 'string')
      ) {
        throw new Error('Analysis returned an invalid response.');
      }
      if (
        result.needsClarification !== true &&
        result.needsClarification !== false
      ) {
        throw new Error('Analysis returned an invalid response.');
      }
      onAnalysisComplete(
        result.needsClarification,
        result.needsClarification
          ? {
              id: result.clarification!.id as string,
              question: result.clarification!.question as string,
            }
          : null,
      );
    } catch (requestError) {
      setInputError(
        requestError instanceof Error
          ? requestError.message
          : 'Analysis failed.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <section aria-labelledby="input-heading">
      <h2 id="input-heading">Inputs</h2>
      <div className="input-grid">
        <label className="field">
          <span>Resume Input</span>
          <textarea
            value={resume}
            onChange={(event) => {
              setResume(event.target.value);
              setInputError('');
            }}
            placeholder="Paste your resume content here"
            rows={12}
            disabled={workflowStage !== 'input' || isAnalyzing}
          />
        </label>
        <label className="field">
          <span>Job Description</span>
          <textarea
            value={jobDescription}
            onChange={(event) => {
              setJobDescription(event.target.value);
              setInputError('');
            }}
            placeholder="Paste the job description here"
            rows={12}
            disabled={workflowStage !== 'input' || isAnalyzing}
          />
        </label>
      </div>
      <p className="helper-text">
        Both inputs are required before analysis can continue.
      </p>
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!canAnalyze || isAnalyzing || workflowStage !== 'input'}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </button>
      {inputError && <p role="alert">{inputError}</p>}
    </section>
  );
}
