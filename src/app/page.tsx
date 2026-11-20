'use client';

import { useState } from 'react';
import { ClarificationSection } from './components/ClarificationSection';
import { FinalOutputSection } from './components/FinalOutputSection';
import { InputSection } from './components/InputSection';
import { SuggestionsSection } from './components/SuggestionsSection';
import type { Clarification, WorkflowStage } from './components/workflow-types';

export default function ResumeTailor() {
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>('input');
  const [clarifications, setClarifications] = useState<Clarification[]>([]);
  const [finalOutput, setFinalOutput] = useState('');

  function handleAnalysisComplete(
    needsClarification: boolean,
    nextClarifications: Clarification[],
  ) {
    setClarifications(nextClarifications);
    setFinalOutput('');
    setWorkflowStage(needsClarification ? 'clarifying' : 'suggestions');
  }

  function handleClarificationComplete() {
    setWorkflowStage('suggestions');
  }

  function handleEditInputs() {
    setWorkflowStage('input');
    setClarifications([]);
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
        key={clarifications.map(({ id }) => id).join(',') || 'none'}
        workflowStage={workflowStage}
        clarifications={clarifications}
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
