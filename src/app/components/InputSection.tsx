import { useState } from 'react';
import type { Clarification, WorkflowStage } from './workflow-types';
import styles from './InputSection.module.css';

type InputSectionProps = {
  workflowStage: WorkflowStage;
  onAnalysisComplete: (
    needsClarification: boolean,
    clarifications: Clarification[],
  ) => void;
  onEdit: () => void;
};

export function InputSection({
  workflowStage,
  onAnalysisComplete,
  onEdit,
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
        clarifications?: unknown;
        error?: unknown;
      } = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.error === 'string' ? result.error : 'Analysis failed.',
        );
      if (
        result.needsClarification === true &&
        (!Array.isArray(result.clarifications) ||
          result.clarifications.some(
            (clarification) =>
              !clarification ||
              typeof clarification !== 'object' ||
              typeof clarification.id !== 'string' ||
              typeof clarification.question !== 'string',
          ))
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
          ? (result.clarifications as Clarification[])
          : [],
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
    <section className={styles.section} aria-labelledby="input-heading">
      <div className={styles.headingRow}>
        <h2 id="input-heading">Inputs</h2>
        {workflowStage !== 'input' && (
          <button className={styles.editButton} type="button" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      <div className={styles.inputGrid}>
        <label className={styles.field}>
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
        <label className={styles.field}>
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
        className={styles.analyzeButton}
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
