import type { Suggestion } from './workflow-types';
import styles from './SuggestionsSection.module.css';

type SuggestionCardProps = {
  suggestion: Suggestion;
  actionsDisabled: boolean;
  onUpdate: (id: string, update: Partial<Suggestion>) => void;
  onAccept: (suggestion: Suggestion) => void;
  onReject: (suggestion: Suggestion) => void;
  onEdit: (id: string) => void;
  onSave: (suggestion: Suggestion) => void;
  onCancelEdit: (suggestion: Suggestion) => void;
  onChangeDecision: (id: string) => void;
  onRevert: (suggestion: Suggestion) => void;
};

export function SuggestionCard({
  suggestion,
  actionsDisabled,
  onUpdate,
  onAccept,
  onReject,
  onEdit,
  onSave,
  onCancelEdit,
  onChangeDecision,
  onRevert,
}: SuggestionCardProps) {
  return (
    <article className={styles.suggestionPanel}>
      <div className={styles.comparisonBlock}>
        <h3>Original resume bullet</h3>
        <p className={styles.originalWording}>{suggestion.originalBullet}</p>
      </div>
      <div className={styles.comparisonBlock}>
        <h3>Suggested replacement</h3>
        {suggestion.isEditing ? (
          <textarea
            className={styles.editingField}
            aria-label={`Suggested replacement for ${suggestion.id}`}
            value={suggestion.suggestedBullet}
            onChange={(event) =>
              onUpdate(suggestion.id, { suggestedBullet: event.target.value })
            }
            rows={4}
            disabled={actionsDisabled}
          />
        ) : (
          <p className={styles.suggestedWording}>{suggestion.suggestedBullet}</p>
        )}
      </div>
      <div className={styles.buttonRow}>
        {suggestion.isEditing ? (
          <>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => onSave(suggestion)}
              disabled={
                actionsDisabled ||
                suggestion.suggestedBullet.trim().length === 0
              }
            >
              Save
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => onCancelEdit(suggestion)}
              disabled={actionsDisabled}
            >
              Cancel Edit
            </button>
          </>
        ) : suggestion.decision === 'pending' ? (
          <>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => onAccept(suggestion)}
              disabled={actionsDisabled}
            >
              Accept
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => onReject(suggestion)}
              disabled={actionsDisabled}
            >
              Reject
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => onEdit(suggestion.id)}
              disabled={actionsDisabled}
            >
              Edit
            </button>
          </>
        ) : (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => onChangeDecision(suggestion.id)}
            disabled={actionsDisabled}
          >
            Change decision
          </button>
        )}
        {suggestion.suggestedBullet !== suggestion.initialSuggestedBullet && (
          <button
            className={styles.textButton}
            type="button"
            onClick={() => onRevert(suggestion)}
            disabled={actionsDisabled}
          >
            Revert Changes
          </button>
        )}
      </div>
      {suggestion.decision !== 'pending' && (
        <p className={styles.decisionStatus}>
          Suggestion {suggestion.decision}. Selected result:{' '}
          {suggestion.selectedBullet}
        </p>
      )}
    </article>
  );
}
