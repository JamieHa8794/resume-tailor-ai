import { useState } from 'react';
import type {
  Clarification,
  ClarificationResult,
  WorkflowStage,
} from './workflow-types';
import styles from './ClarificationSection.module.css';

type ClarificationSectionProps = {
  workflowStage: WorkflowStage;
  clarifications: Clarification[];
  onComplete: (results: ClarificationResult[]) => void;
  onEditClarifications: () => void;
};

export function ClarificationSection({
  workflowStage,
  clarifications,
  onComplete,
  onEditClarifications,
}: ClarificationSectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function handleContinue() {
    onComplete(
      clarifications.map((clarification) => {
        const answer = answers[clarification.id] ?? '';
        return {
          ...clarification,
          answer,
          status: answer.trim().length > 0 ? 'answered' : 'skipped',
        };
      }),
    );
  }

  return (
    <section
      id="clarifying-section"
      className={styles.section}
      aria-labelledby="clarification-heading"
    >
      <div className={styles.headingRow}>
        <h2 id="clarification-heading">Clarification</h2>
        {(workflowStage === 'suggestions' || workflowStage === 'complete') &&
          clarifications.length > 0 && (
            <button
              className={styles.editButton}
              type="button"
              onClick={onEditClarifications}
            >
              Edit
            </button>
          )}
      </div>
      {workflowStage === 'input' && (
        <p className={styles.emptyMessage}>
          Analyze your inputs to receive clarification questions.
        </p>
      )}
      {workflowStage === 'clarifying' && (
        <div className={styles.clarificationList}>
          {clarifications.map((question) => (
            <div className={styles.questionGroup} key={question.id}>
              <p className={styles.question}>{question.question}</p>
              <label className={styles.answerField}>
                <span>Your answer</span>
                <textarea
                  value={answers[question.id] ?? ''}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: event.target.value,
                    }))
                  }
                  placeholder="Enter an answer, or leave blank to skip"
                  rows={1}
                />
              </label>
            </div>
          ))}
          <button
            className={styles.continueButton}
            type="button"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      )}
      {(workflowStage === 'suggestions' || workflowStage === 'complete') &&
        clarifications.length > 0 && (
          <div className={styles.completedList}>
            {clarifications.map((question) => {
              const answer = answers[question.id] ?? '';
              return (
                <div className={styles.completedQuestion} key={question.id}>
                  <p className={styles.question}>{question.question}</p>
                  <p
                    className={`${styles.completedAnswer} ${
                      answer ? '' : styles.skippedAnswer
                    }`}
                  >
                    {answer || 'Skipped'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      {(workflowStage === 'suggestions' || workflowStage === 'complete') &&
        clarifications.length === 0 && (
        <div className={`${styles.completedPanel} ${styles.noQuestionsPanel}`}>
          <p>Clarification complete</p>
          <p className="helper-text">
            {clarifications.length > 0
              ? 'Your clarification responses were recorded.'
              : 'No clarification questions needed.'}
          </p>
        </div>
      )}
    </section>
  );
}
