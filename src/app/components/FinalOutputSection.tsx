import styles from './FinalOutputSection.module.css';

type FinalOutputSectionProps = { finalOutput: string };

export function FinalOutputSection({ finalOutput }: FinalOutputSectionProps) {
  async function handleCopyFinalOutput() {
    await navigator.clipboard.writeText(finalOutput);
  }

  return (
    <section className={styles.section} aria-labelledby="final-output-heading">
      <h2 id="final-output-heading">Final Output</h2>
      <p className={styles.subtitle}>
        A complete, edited résumé is ready to copy as a single document.
      </p>
      <div className={styles.documentSurface}>
        <div className={styles.documentToolbar}>
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
