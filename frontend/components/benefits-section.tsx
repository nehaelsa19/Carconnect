import { Clock3, DollarSign, Leaf, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

export interface BenefitItem {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  accent?: "primary" | "medium" | "light" | "dark";
}

export interface BenefitsSectionProps {
  /**
   * Supply a custom set of benefit cards; defaults to the CarConnect copy.
   */
  items?: BenefitItem[];
}

const defaultItems: BenefitItem[] = [
  {
    icon: DollarSign,
    title: "Save Money",
    description:
      "Split fuel costs and reduce your monthly transportation expenses significantly.",
    accent: "primary",
  },
  {
    icon: Leaf,
    title: "Reduce Pollution",
    description:
      "Lower your carbon footprint by sharing rides and contributing to a greener planet.",
    accent: "medium",
  },
  {
    icon: Clock3,
    title: "Commute Smarter",
    description:
      "Use HOV lanes, reduce traffic stress, and arrive at work refreshed and ready.",
    accent: "light",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "Verified workplace connections ensure you're riding with trusted colleagues.",
    accent: "dark",
  },
];

const accentClasses: Record<NonNullable<BenefitItem["accent"]>, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-white)]",
  medium: "bg-[#cfe6c4] text-[var(--color-primary-dark)]",
  light: "bg-[var(--color-primary-light)] text-[var(--color-heading)]",
  dark: "bg-[var(--color-primary-dark)] text-[var(--color-white)]",
};

/**
 * Feature grid highlighting top CarConnect benefits.
 */
export function BenefitsSection({
  items = defaultItems,
}: BenefitsSectionProps) {
  return (
    <section id="about" className="bg-background pt-32 pb-24">
      <div className="container flex flex-col items-center gap-12 text-center">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-heading text-3xl font-semibold md:text-4xl">
            Why Choose CarConnect?
          </h2>
          <p className="text-body text-lg">
            Experience the future of workplace transportation with our
            comprehensive carpooling platform.
          </p>
        </div>
        <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map(({ title, description, icon: Icon, accent }) => (
            <article
              key={title}
              className="shadow-soft shadow-soft-hover flex flex-col items-center gap-6 rounded-3xl bg-[var(--color-surface)] px-8 py-12 text-center transition-transform"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent ? accentClasses[accent] : accentClasses.primary}`}
              >
                <Icon aria-hidden className="h-6 w-6" />
              </span>
              <div className="space-y-3">
                <h3 className="text-heading text-xl font-semibold">{title}</h3>
                <p className="text-body text-base">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
