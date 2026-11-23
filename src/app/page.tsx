'use client';

import { useState } from 'react';
import { ClarificationSection } from './components/ClarificationSection';
import { FinalOutputSection } from './components/FinalOutputSection';
import { InputSection } from './components/InputSection';
import { LandingSection } from './components/LandingSection';
import { SuggestionsSection } from './components/SuggestionsSection';
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

  function handleAnalysisComplete(
    needsClarification: boolean,
    nextClarifications: Clarification[],
  ) {
    setClarifications(nextClarifications);
    setClarificationResults([]);
    setFinalOutput('');
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
  }

  function handleEditClarifications() {
    setWorkflowStage('clarifying');
    setFinalOutput('');
  }

  function handleEditSuggestions() {
    setWorkflowStage('suggestions');
    setFinalOutput('');
  }

  return (
    <main className="page-shell">
      {workflowStage === 'landing' && (
        <LandingSection onStart={() => setWorkflowStage('input')} />
      )}
      {workflowStage !== 'landing' && (
        <>
          <h1>Resume Tailor App</h1>
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
          onComplete={(output) => {
            setFinalOutput(output);
            setWorkflowStage('complete');
          }}
        />
      )}
      {workflowStage === 'complete' && (
        <FinalOutputSection
          finalOutput={finalOutput}
        />
      )}
    </main>
  );
}
