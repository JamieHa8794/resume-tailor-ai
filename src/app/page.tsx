'use client';

import { useState } from 'react';
import { ClarificationSection } from './components/ClarificationSection';
import { FinalOutputSection } from './components/FinalOutputSection';
import { InputSection } from './components/InputSection';
import { SuggestionsSection } from './components/SuggestionsSection';
import type { Clarification, WorkflowStage } from './components/workflow-types';

export default function ResumeTailor() {
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>('input');
  const [clarification, setClarification] = useState<Clarification | null>(
    null,
  );
  const [finalOutput, setFinalOutput] = useState('');

  function handleAnalysisComplete(
    needsClarification: boolean,
    nextClarification: Clarification | null,
  ) {
    setClarification(nextClarification);
    setFinalOutput('');
    setWorkflowStage(needsClarification ? 'clarifying' : 'suggestions');
  }

  function handleClarificationComplete() {
    setWorkflowStage('suggestions');
  }

  function handleEditInputs() {
    setWorkflowStage('input');
    setClarification(null);
    setFinalOutput('');
  }

  return (
    <main className="page-shell">
      <h1>Resume Tailor App</h1>
      <InputSection
        workflowStage={workflowStage}
        onAnalysisComplete={handleAnalysisComplete}
      />
      <ClarificationSection
        key={clarification?.id ?? 'none'}
        workflowStage={workflowStage}
        clarification={clarification}
        onComplete={handleClarificationComplete}
        onEditInputs={handleEditInputs}
      />
      {workflowStage === 'suggestions' && (
        <SuggestionsSection
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
