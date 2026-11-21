type LandingSectionProps = { onStart: () => void };

export function LandingSection({ onStart }: LandingSectionProps) {
  return (
    <section aria-labelledby="landing-heading">
      <h2 id="landing-heading">Tailor your resume</h2>
      <p>
        Start with your resume and job description. You choose what edits to
        keep.
      </p>
      <button type="button" onClick={onStart}>
        Start
      </button>
    </section>
  );
}
