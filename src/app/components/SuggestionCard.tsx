import type { Suggestion } from './workflow-types';

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
    <div className="suggestion-panel">
      <div>
        <h3>Original resume bullet</h3>
        <p>{suggestion.originalBullet}</p>
      </div>
      <div>
        <h3>Suggested replacement</h3>
        {suggestion.isEditing ? (
          <textarea
            aria-label={`Suggested replacement for ${suggestion.id}`}
            value={suggestion.suggestedBullet}
            onChange={(event) =>
              onUpdate(suggestion.id, { suggestedBullet: event.target.value })
            }
            rows={4}
            disabled={actionsDisabled}
          />
        ) : (
          <p>{suggestion.suggestedBullet}</p>
        )}
      </div>
      <div className="button-row">
        {suggestion.isEditing ? (
          <>
            <button
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
              type="button"
              onClick={() => onAccept(suggestion)}
              disabled={actionsDisabled}
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onReject(suggestion)}
              disabled={actionsDisabled}
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onEdit(suggestion.id)}
              disabled={actionsDisabled}
            >
              Edit
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onChangeDecision(suggestion.id)}
            disabled={actionsDisabled}
          >
            Change decision
          </button>
        )}
        {suggestion.suggestedBullet !== suggestion.initialSuggestedBullet && (
          <button
            type="button"
            onClick={() => onRevert(suggestion)}
            disabled={actionsDisabled}
          >
            Revert Changes
          </button>
        )}
      </div>
      {suggestion.decision !== 'pending' && (
        <p className="helper-text">
          Suggestion {suggestion.decision}. Selected result:{' '}
          {suggestion.selectedBullet}
        </p>
      )}
    </div>
  );
}
