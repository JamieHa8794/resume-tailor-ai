type FinalOutputSectionProps = { finalOutput: string };

export function FinalOutputSection({ finalOutput }: FinalOutputSectionProps) {
  async function handleCopyFinalOutput() {
    await navigator.clipboard.writeText(finalOutput);
  }

  return (
    <section aria-labelledby="final-output-heading">
      <h2 id="final-output-heading">Final Output</h2>
      <textarea
        value={finalOutput}
        readOnly
        rows={12}
        aria-label="Final resume output"
      />
      <button type="button" onClick={handleCopyFinalOutput}>
        Copy
      </button>
    </section>
  );
}
