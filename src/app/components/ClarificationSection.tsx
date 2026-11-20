import { useEffect, useState } from 'react';
import { ClarificationCard } from './ClarificationCard';
import type {
  Clarification,
  ClarificationStatus,
  WorkflowStage,
} from './workflow-types';

type ClarificationState = Clarification & {
  answer: string;
  status: ClarificationStatus;
};
type ClarificationSectionProps = {
  workflowStage: WorkflowStage;
  clarifications: Clarification[];
  onComplete: () => void;
  onEditInputs: () => void;
};

export function ClarificationSection({
  workflowStage,
  clarifications,
  onComplete,
  onEditInputs,
}: ClarificationSectionProps) {
  const [questions, setQuestions] = useState<ClarificationState[]>(() =>
    clarifications.map((clarification) => ({
      ...clarification,
      answer: '',
      status: 'pending',
    })),
  );

  useEffect(() => {
    if (
      workflowStage === 'clarifying' &&
      questions.length > 0 &&
      questions.every(({ status }) => status !== 'pending')
    )
      onComplete();
  }, [onComplete, questions, workflowStage]);

  function updateQuestion(id: string, update: Partial<ClarificationState>) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === id ? { ...question, ...update } : question,
      ),
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
          {questions.map((question) => (
            <ClarificationCard
              key={question.id}
              question={question}
              onAnswerChange={(answer) =>
                updateQuestion(question.id, { answer })
              }
              onSubmit={() =>
                updateQuestion(question.id, { status: 'answered' })
              }
              onSkip={() => updateQuestion(question.id, { status: 'skipped' })}
              onEdit={() =>
                updateQuestion(
                  question.id,
                  question.status === 'skipped'
                    ? { status: 'pending', answer: '' }
                    : { status: 'pending' },
                )
              }
            />
          ))}
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
      {workflowStage !== 'input' && (
        <button type="button" onClick={onEditInputs}>
          Edit Inputs
        </button>
      )}
    </section>
  );
}
