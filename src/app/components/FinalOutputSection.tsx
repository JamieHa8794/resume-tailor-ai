import styles from './FinalOutputSection.module.css';

type FinalOutputSectionProps = {
  finalOutput: string;
  appliedCount: number;
  totalCount: number;
};

export function FinalOutputSection({
  finalOutput,
  appliedCount,
  totalCount,
}: FinalOutputSectionProps) {
  async function handleCopyFinalOutput() {
    await navigator.clipboard.writeText(finalOutput);
  }

  return (
    <section
      id="complete-section"
      className={styles.section}
      aria-labelledby="final-output-heading"
    >
      <h2 id="final-output-heading">Your tailored résumé is ready</h2>
      <p className={styles.subtitle}>
        Copy the full text into your résumé document.
      </p>
      <div className={styles.documentSurface}>
        <div className={styles.documentToolbar}>
          <span className={styles.count}>
            {appliedCount} of {totalCount} suggested changes applied
          </span>
          <button type="button" onClick={handleCopyFinalOutput}>
            Copy
          </button>
        </div>
        <textarea
          className={styles.document}
          value={finalOutput}
          readOnly
          rows={12}
          aria-label="Final resume output"
        />
      </div>
    </section>
  );
}
