import type { WorkflowStage } from './workflow-types';
import styles from './WorkflowHeader.module.css';

type WorkflowHeaderProps = {
  workflowStage: WorkflowStage;
};

const stages: { label: string; stage: WorkflowStage }[] = [
  { label: 'Inputs', stage: 'input' },
  { label: 'Clarify', stage: 'clarifying' },
  { label: 'Suggestions', stage: 'suggestions' },
  { label: 'Results', stage: 'complete' },
];

function getActiveStage(workflowStage: WorkflowStage) {
  return workflowStage === 'landing' ? 'input' : workflowStage;
}

export function WorkflowHeader({ workflowStage }: WorkflowHeaderProps) {
  const activeStage = getActiveStage(workflowStage);

  return (
    <header id="workflow-header" className={styles.header}>
      <p className={styles.wordmark}>Resume Tailor AI</p>
      <nav className={styles.progress} aria-label="Workflow progress">
        {stages.map(({ label, stage }, index) => (
          <span key={stage} className={styles.progressItem}>
            <span
              className={stage === activeStage ? styles.active : undefined}
              aria-current={stage === activeStage ? 'step' : undefined}
            >
              {label}
            </span>
            {index < stages.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                &gt;
              </span>
            )}
          </span>
        ))}
      </nav>
    </header>
  );
}
