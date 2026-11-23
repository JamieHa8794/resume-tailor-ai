import styles from './LandingSection.module.css';

type LandingSectionProps = { onStart: () => void };

export function LandingSection({ onStart }: LandingSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="landing-heading">
      <header className={styles.header}>
        <p className={styles.wordmark}>Resume Tailor AI</p>
      </header>
      <div className={styles.content}>
        <h1 id="landing-heading">Tailor your resume</h1>
        <p className={styles.supportingText}>
          Start with your resume and job description. You choose what edits to
          keep.
        </p>
        <button className={styles.start} type="button" onClick={onStart}>
          Start
        </button>
      </div>
    </section>
  );
}
