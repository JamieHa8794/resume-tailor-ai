import { useEffect, useRef, useState } from 'react';
import { SuggestionCard } from './SuggestionCard';
import type { ReviewSubmissionStatus, Suggestion } from './workflow-types';

type SuggestionResponse = Pick<
  Suggestion,
  'id' | 'originalBullet' | 'suggestedBullet'
>;
type SuggestionsSectionProps = { onComplete: (finalOutput: string) => void };

export function SuggestionsSection({ onComplete }: SuggestionsSectionProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [reviewSubmissionStatus, setReviewSubmissionStatus] =
    useState<ReviewSubmissionStatus>('idle');
  const [reviewError, setReviewError] = useState('');
  const [reviewConfirmation, setReviewConfirmation] = useState('');
  const reviewSubmissionStarted = useRef(false);

  async function loadSuggestions() {
    setIsLoadingSuggestions(true);
    setSuggestionsError('');
    try {
      const response = await fetch('/api/suggestions', { method: 'POST' });
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

  useEffect(() => {
    const reviewIsComplete =
      suggestions.length > 0 &&
      suggestions.every((suggestion) => suggestion.decision !== 'pending');
    if (
      !reviewIsComplete ||
      reviewSubmissionStatus !== 'idle' ||
      reviewSubmissionStarted.current
    )
      return;
    reviewSubmissionStarted.current = true;
    void (async () => {
      setReviewSubmissionStatus('submitting');
      setReviewError('');
      try {
        const response = await fetch('/api/review', {
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
        setReviewConfirmation(result.message);
        setReviewSubmissionStatus('succeeded');
        onComplete(result.finalOutput);
      } catch (requestError) {
        setReviewSubmissionStatus('failed');
        setReviewError(
          requestError instanceof Error
            ? requestError.message
            : 'Review submission failed.',
        );
      }
    })();
  }, [onComplete, reviewSubmissionStatus, suggestions]);

  function handleRetryReview() {
    reviewSubmissionStarted.current = false;
    setReviewConfirmation('');
    setReviewError('');
    setReviewSubmissionStatus('idle');
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
              actionsDisabled={reviewSubmissionStatus !== 'idle'}
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
      {reviewSubmissionStatus === 'submitting' && <p>Submitting review...</p>}
      {reviewError && <p role="alert">{reviewError}</p>}
      {reviewSubmissionStatus === 'failed' && (
        <button type="button" onClick={handleRetryReview}>
          Retry
        </button>
      )}
      {reviewConfirmation && <p>{reviewConfirmation}</p>}
    </section>
  );
}
