export type Clarification = {
  id: string;
  question: string;
};

export type WorkflowStage = 'input' | 'clarifying' | 'suggestions' | 'complete';
export type ReviewDecision = 'pending' | 'accepted' | 'rejected' | 'edited';
export type ReviewSubmissionStatus =
  | 'idle'
  | 'submitting'
  | 'succeeded'
  | 'failed';

export type Suggestion = {
  id: string;
  originalBullet: string;
  suggestedBullet: string;
  initialSuggestedBullet: string;
  savedSuggestedBullet?: string;
  decision: ReviewDecision;
  selectedBullet: string | null;
  isEditing: boolean;
};
