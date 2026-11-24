'use client';

import { useEffect, useRef, useState } from 'react';
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

function scrollToWorkflowHeading(workflowStage: WorkflowStage) {
  const headingIds: Record<WorkflowStage, string> = {
    landing: 'landing-heading',
    input: 'input-heading',
    clarifying: 'clarification-heading',
    suggestions: 'suggestion-heading',
    complete: 'final-output-heading',
  };
  const heading = document.getElementById(headingIds[workflowStage]);
  const header = document.getElementById('workflow-header');
  if (!heading || !header) return;

  const headerOffset = header.getBoundingClientRect().height + 16;
  const headingTop = heading.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: Math.max(0, headingTop - headerOffset),
    behavior: 'smooth',
  });
}

export default function ResumeTailor() {
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>('landing');
  const [clarifications, setClarifications] = useState<Clarification[]>([]);
  const [clarificationResults, setClarificationResults] = useState<
    ClarificationResult[]
  >([]);
  const [finalOutput, setFinalOutput] = useState('');
  const [suggestionCounts, setSuggestionCounts] = useState({
    applied: 0,
    total: 0,
  });
  const previousWorkflowStage = useRef<WorkflowStage | null>(null);

  useEffect(() => {
    if (previousWorkflowStage.current === null) {
      previousWorkflowStage.current = workflowStage;
      return;
    }

    if (previousWorkflowStage.current === workflowStage) {
      return;
    }

    previousWorkflowStage.current = workflowStage;
    const frame = window.requestAnimationFrame(() => {
      scrollToWorkflowHeading(workflowStage);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [workflowStage]);

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
          onLoaded={() => {
            if (workflowStage === 'suggestions') {
              scrollToWorkflowHeading('suggestions');
            }
          }}
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
