import { useState } from 'react';
import type { Clarification, WorkflowStage } from './workflow-types';

type ClarificationSectionProps = {
  workflowStage: WorkflowStage;
  clarification: Clarification | null;
  onComplete: () => void;
  onEditInputs: () => void;
};

export function ClarificationSection({ workflowStage, clarification, onComplete, onEditInputs }: ClarificationSectionProps) {
  const [answer, setAnswer] = useState('');
  const [skipped, setSkipped] = useState(false);

  function handleSubmit() {
    if (answer.trim().length === 0) return;
    setSkipped(false);
    onComplete();
  }

  function handleSkip() {
    setAnswer('');
    setSkipped(true);
    onComplete();
  }

  return (
    <section aria-labelledby="clarification-heading">
      <h2 id="clarification-heading">Clarification</h2>
      {workflowStage === 'input' && <p>Analyze your inputs to receive a clarification question.</p>}
      {workflowStage === 'clarifying' && clarification && (
        <div className="clarification-panel">
          <p>{clarification.question}</p>
          <label className="field">
            <span>Your answer</span>
            <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Enter an answer, or skip this question" rows={5} />
          </label>
          <div className="button-row">
            <button type="button" onClick={handleSubmit} disabled={answer.trim().length === 0}>Submit</button>
            <button type="button" onClick={handleSkip}>Skip</button>
          </div>
        </div>
      )}
      {(workflowStage === 'suggestions' || workflowStage === 'complete') && (
        <div className="clarification-panel">
          <p>Clarification complete</p>
          <p className="helper-text">{clarification ? (skipped ? 'The question was skipped.' : 'Your answer was recorded.') : 'No clarification questions needed.'}</p>
        </div>
      )}
      {workflowStage !== 'input' && <button type="button" onClick={onEditInputs}>Edit Inputs</button>}
    </section>
  );
}

