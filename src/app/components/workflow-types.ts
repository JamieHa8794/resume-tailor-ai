export type Clarification = {
  id: string;
  question: string;
};

export type ClarificationStatus = 'pending' | 'answered' | 'skipped';

export type ClarificationResult = Clarification & {
  answer: string;
  status: Exclude<ClarificationStatus, 'pending'>;
};

export type WorkflowStage =
  | 'landing'
  | 'input'
  | 'clarifying'
  | 'suggestions'
  | 'complete';
export type ReviewDecision = 'pending' | 'accepted' | 'rejected' | 'edited';
export type SuggestionResponseSubmissionStatus =
  | 'idle'
  | 'submitting'
  | 'succeeded'
  | 'failed';

export type Suggestion = {
  id: string;
  title: string;
  originalBullet: string;
  suggestedBullet: string;
  initialSuggestedBullet: string;
  savedSuggestedBullet?: string;
  decision: ReviewDecision;
  selectedBullet: string | null;
  isEditing: boolean;
};
