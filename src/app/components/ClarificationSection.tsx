import { useState } from 'react';
import type {
  Clarification,
  ClarificationResult,
  WorkflowStage,
} from './workflow-types';

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
    <section aria-labelledby="clarification-heading">
      <h2 id="clarification-heading">Clarification</h2>
      {workflowStage === 'input' && (
        <p>Analyze your inputs to receive clarification questions.</p>
      )}
      {workflowStage === 'clarifying' && (
        <div className="clarification-list">
          {clarifications.map((question) => (
            <div className="clarification-panel" key={question.id}>
              <p>{question.question}</p>
              <label className="field">
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
                  rows={5}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
      {(workflowStage === 'suggestions' || workflowStage === 'complete') && (
        <div className="clarification-panel">
          <p>Clarification complete</p>
          <p className="helper-text">
            {clarifications.length > 0
              ? 'Your clarification responses were recorded.'
              : 'No clarification questions needed.'}
          </p>
        </div>
      )}
      {(workflowStage === 'suggestions' || workflowStage === 'complete') && (
        <button type="button" onClick={onEditClarifications}>
          Edit
        </button>
      )}
    </section>
  );
}
