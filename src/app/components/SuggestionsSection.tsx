import { useEffect, useState } from 'react';
import { SuggestionCard } from './SuggestionCard';
import type {
  ClarificationResult,
  SuggestionResponseSubmissionStatus,
  Suggestion,
} from './workflow-types';

type SuggestionResponse = Pick<
  Suggestion,
  'id' | 'originalBullet' | 'suggestedBullet'
>;
type SuggestionsSectionProps = {
  clarificationResults: ClarificationResult[];
  onComplete: (finalOutput: string) => void;
};

export function SuggestionsSection({
  clarificationResults,
  onComplete,
}: SuggestionsSectionProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [suggestionResponseSubmissionStatus, setSuggestionResponseSubmissionStatus] =
    useState<SuggestionResponseSubmissionStatus>('idle');
  const [suggestionResponseError, setSuggestionResponseError] = useState('');
  const [suggestionResponseConfirmation, setSuggestionResponseConfirmation] =
    useState('');

  async function loadSuggestions() {
    setIsLoadingSuggestions(true);
    setSuggestionsError('');
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clarificationResults }),
      });
      const result: { suggestions?: SuggestionResponse[]; error?: unknown } =
        await response.json();
      if (!response.ok || !Array.isArray(result.suggestions))
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'Suggestions failed.',
        );
      setSuggestions(
        result.suggestions.map((suggestion) => ({
          ...suggestion,
          initialSuggestedBullet: suggestion.suggestedBullet,
          decision: 'pending',
          selectedBullet: null,
          isEditing: false,
        })),
      );
    } catch (requestError) {
      setSuggestionsError(
        requestError instanceof Error
          ? requestError.message
          : 'Suggestions failed.',
      );
    } finally {
      setIsLoadingSuggestions(false);
    }
  }

  useEffect(() => {
    // Loading begins when this stage mounts; the component is remounted for a new workflow run.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSuggestions();
  }, []);

  function updateSuggestion(id: string, update: Partial<Suggestion>) {
    setSuggestions((current) =>
      current.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, ...update } : suggestion,
      ),
    );
  }
  function handleAccept(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      decision: 'accepted',
      selectedBullet: suggestion.suggestedBullet,
    });
  }
  function handleReject(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      decision: 'rejected',
      selectedBullet: suggestion.originalBullet,
    });
  }
  function handleSave(suggestion: Suggestion) {
    if (suggestion.suggestedBullet.trim().length === 0) return;
    updateSuggestion(suggestion.id, {
      savedSuggestedBullet: suggestion.suggestedBullet,
      decision: 'edited',
      selectedBullet: suggestion.suggestedBullet,
      isEditing: false,
    });
  }
  function handleCancelEdit(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      suggestedBullet:
        suggestion.savedSuggestedBullet ?? suggestion.initialSuggestedBullet,
      isEditing: false,
    });
  }
  function handleRevert(suggestion: Suggestion) {
    updateSuggestion(suggestion.id, {
      suggestedBullet: suggestion.initialSuggestedBullet,
      savedSuggestedBullet: suggestion.initialSuggestedBullet,
      decision: 'pending',
      selectedBullet: null,
      isEditing: false,
    });
  }

  async function submitSuggestionResponses() {
    setSuggestionResponseSubmissionStatus('submitting');
    setSuggestionResponseError('');
    try {
      const response = await fetch('/api/suggestion-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestions: suggestions.map(
            ({ id, decision, selectedBullet }) => ({
              id,
              decision,
              selectedBullet,
            }),
          ),
        }),
      });
      const result: {
        message?: unknown;
        finalOutput?: unknown;
        error?: unknown;
      } = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'Review submission failed.',
        );
      if (
        result.message !== 'review complete' ||
        typeof result.finalOutput !== 'string'
      )
        throw new Error(
          result.message !== 'review complete'
            ? 'Review returned an invalid response.'
            : 'Review returned an invalid final output.',
        );
      setSuggestionResponseConfirmation(result.message);
      setSuggestionResponseSubmissionStatus('succeeded');
      onComplete(result.finalOutput);
    } catch (requestError) {
      setSuggestionResponseSubmissionStatus('failed');
      setSuggestionResponseError(
        requestError instanceof Error
          ? requestError.message
          : 'Review submission failed.',
      );
    }
  }

  function handleContinue() {
    if (
      suggestions.length === 0 ||
      suggestions.some((suggestion) => suggestion.decision === 'pending') ||
      suggestionResponseSubmissionStatus !== 'idle'
    )
      return;
    void submitSuggestionResponses();
  }

  function handleRetrySuggestionResponse() {
    setSuggestionResponseConfirmation('');
    setSuggestionResponseError('');
    setSuggestionResponseSubmissionStatus('idle');
    void submitSuggestionResponses();
  }

  return (
    <section aria-labelledby="suggestion-heading">
      <h2 id="suggestion-heading">Suggested Changes</h2>
      {isLoadingSuggestions && <p>Generating suggestions...</p>}
      {suggestionsError && <p role="alert">{suggestionsError}</p>}
      {suggestionsError && !isLoadingSuggestions && (
        <button type="button" onClick={() => void loadSuggestions()}>
          Retry
        </button>
      )}
      {!isLoadingSuggestions && suggestions.length > 0 && (
        <div className="suggestion-list">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              actionsDisabled={suggestionResponseSubmissionStatus !== 'idle'}
              onUpdate={updateSuggestion}
              onAccept={handleAccept}
              onReject={handleReject}
              onEdit={(id) => updateSuggestion(id, { isEditing: true })}
              onSave={handleSave}
              onCancelEdit={handleCancelEdit}
              onChangeDecision={(id) =>
                updateSuggestion(id, {
                  decision: 'pending',
                  selectedBullet: null,
                })
              }
              onRevert={handleRevert}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleContinue}
        disabled={
          suggestions.length === 0 ||
          suggestions.some((suggestion) => suggestion.decision === 'pending') ||
          suggestionResponseSubmissionStatus !== 'idle'
        }
      >
        Continue
      </button>
      {suggestionResponseSubmissionStatus === 'submitting' && <p>Submitting review...</p>}
      {suggestionResponseError && <p role="alert">{suggestionResponseError}</p>}
      {suggestionResponseSubmissionStatus === 'failed' && (
        <button type="button" onClick={handleRetrySuggestionResponse}>
          Retry
        </button>
      )}
      {suggestionResponseConfirmation && <p>{suggestionResponseConfirmation}</p>}
    </section>
  );
}
