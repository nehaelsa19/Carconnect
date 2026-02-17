export interface StepItem {
  title: string;
  description: string;
  number: number;
  accent?: "primary" | "medium" | "light";
}

export interface HowItWorksSectionProps {
  /**
   * Allows customizing the default step content.
   */
  steps?: StepItem[];
}

const badgeClasses: Record<NonNullable<StepItem["accent"]>, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-white)]",
  medium: "bg-[var(--color-primary-dark)] text-[var(--color-white)]",
  light: "bg-[var(--color-primary-light)] text-[var(--color-heading)]",
};

const defaultSteps: StepItem[] = [
  {
    number: 1,
    title: "Create Your Profile",
    description:
      "Sign up and tell us about your commute preferences, whether you're a driver or rider.",
    accent: "primary",
  },
  {
    number: 2,
    title: "Find Your Match",
    description:
      "Browse available rides or post your own. Our smart matching connects you with compatible commuters.",
    accent: "medium",
  },
  {
    number: 3,
    title: "Start Carpooling",
    description:
      "Confirm your ride, meet your carpool partners, and enjoy a better commute experience.",
    accent: "light",
  },
];

/**
 * Process overview highlighting the CarConnect onboarding flow.
 */
export function HowItWorksSection({
  steps = defaultSteps,
}: HowItWorksSectionProps) {
  return (
    <section className="bg-background py-24">
      <div className="container flex flex-col items-center gap-12 text-center">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-heading text-3xl font-semibold md:text-4xl">
            How It Works
          </h2>
          <p className="text-body text-lg">
            Getting started is simple and takes just a few minutes.
          </p>
        </div>
        <div className="relative grid w-full gap-12 md:grid-cols-3">
          <div className="pointer-events-none absolute top-[52px] right-0 left-0 hidden h-[2px] -translate-y-1/2 bg-[var(--color-divider)] md:block" />
          {steps.map((step) => (
            <article
              key={step.number}
              className="shadow-soft shadow-soft-hover relative flex flex-col items-center gap-4 rounded-3xl bg-[var(--color-surface)] px-8 py-10 text-center transition-transform md:px-6"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold ${step.accent ? badgeClasses[step.accent] : badgeClasses.primary}`}
              >
                {step.number}
              </span>
              <div className="space-y-3">
                <h3 className="text-heading text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="text-body text-base">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
