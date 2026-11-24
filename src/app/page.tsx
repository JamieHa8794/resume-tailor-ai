'use client';

import { useState } from 'react';
import { ClarificationSection } from './components/ClarificationSection';
import { FinalOutputSection } from './components/FinalOutputSection';
import { InputSection } from './components/InputSection';
import { LandingSection } from './components/LandingSection';
import { SuggestionsSection } from './components/SuggestionsSection';
import { WorkflowHeader } from './components/WorkflowHeader';
import type {
  Clarification,
  ClarificationResult,
  WorkflowStage,
} from './components/workflow-types';

export default function ResumeTailor() {
  const [workflowStage, setWorkflowStage] =
    useState<WorkflowStage>('landing');
  const [clarifications, setClarifications] = useState<Clarification[]>([]);
  const [clarificationResults, setClarificationResults] = useState<
    ClarificationResult[]
  >([]);
  const [finalOutput, setFinalOutput] = useState('');
  const [suggestionCounts, setSuggestionCounts] = useState({
    applied: 0,
    total: 0,
  });

  function handleAnalysisComplete(
    needsClarification: boolean,
    nextClarifications: Clarification[],
  ) {
    setClarifications(nextClarifications);
    setClarificationResults([]);
    setFinalOutput('');
    setSuggestionCounts({ applied: 0, total: 0 });
    setWorkflowStage(needsClarification ? 'clarifying' : 'suggestions');
  }

  function handleClarificationComplete(results: ClarificationResult[]) {
    setClarificationResults(results);
    setWorkflowStage('suggestions');
  }

  function handleEditInputs() {
    setWorkflowStage('input');
    setClarifications([]);
    setClarificationResults([]);
    setFinalOutput('');
    setSuggestionCounts({ applied: 0, total: 0 });
  }

  function handleEditClarifications() {
    setWorkflowStage('clarifying');
    setFinalOutput('');
    setSuggestionCounts({ applied: 0, total: 0 });
  }

  function handleEditSuggestions() {
    setWorkflowStage('suggestions');
    setFinalOutput('');
    setSuggestionCounts({ applied: 0, total: 0 });
  }

  return (
    <main className="page-shell">
      <WorkflowHeader workflowStage={workflowStage} />
      {workflowStage === 'landing' && (
        <LandingSection onStart={() => setWorkflowStage('input')} />
      )}
      {workflowStage !== 'landing' && (
        <>
          <InputSection
            workflowStage={workflowStage}
            onAnalysisComplete={handleAnalysisComplete}
            onEdit={handleEditInputs}
          />
        </>
      )}
      {workflowStage !== 'landing' && workflowStage !== 'input' && (
        <ClarificationSection
          key={clarifications.map(({ id }) => id).join(',') || 'none'}
          workflowStage={workflowStage}
          clarifications={clarifications}
          onComplete={handleClarificationComplete}
          onEditClarifications={handleEditClarifications}
        />
      )}
      {(workflowStage === 'suggestions' || workflowStage === 'complete') && (
        <SuggestionsSection
          clarificationResults={clarificationResults}
          workflowStage={workflowStage}
          onEdit={handleEditSuggestions}
          onComplete={(output, appliedCount, totalCount) => {
            setFinalOutput(output);
            setSuggestionCounts({ applied: appliedCount, total: totalCount });
            setWorkflowStage('complete');
          }}
        />
      )}
      {workflowStage === 'complete' && (
        <FinalOutputSection
          finalOutput={finalOutput}
          appliedCount={suggestionCounts.applied}
          totalCount={suggestionCounts.total}
        />
      )}
    </main>
  );
}
