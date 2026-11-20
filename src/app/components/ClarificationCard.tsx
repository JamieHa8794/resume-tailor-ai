import type { ClarificationStatus } from './workflow-types';

type ClarificationCardProps = {
  question: { question: string; answer: string; status: ClarificationStatus };
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onEdit: () => void;
};

export function ClarificationCard({
  question,
  onAnswerChange,
  onSubmit,
  onSkip,
  onEdit,
}: ClarificationCardProps) {
  const isPending = question.status === 'pending';
  return (
    <div className="clarification-panel">
      <p>{question.question}</p>
      {question.status !== 'skipped' && (
        <label className="field">
          <span>Your answer</span>
          <textarea
            value={question.answer}
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Enter an answer, or skip this question"
            rows={5}
            disabled={!isPending}
          />
        </label>
      )}
      <div className="button-row">
        {isPending ? (
          <>
            <button
              type="button"
              onClick={onSubmit}
              disabled={question.answer.trim().length === 0}
            >
              Submit Answer
            </button>
            <button type="button" onClick={onSkip}>
              Skip
            </button>
          </>
        ) : <>
          <span>{question.status === 'answered' ? 'Answered' : 'Skipped'}</span>
          <button type="button" onClick={onEdit}>Edit</button>
        </>}
      </div>
    </div>
  );
}
