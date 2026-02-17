import { Car, Users } from "lucide-react";
import Link from "next/link";

export interface CtaBannerProps {
  /**
   * Allows overriding the primary headline.
   */
  heading?: string;
  /**
   * Allows overriding the supporting copy.
   */
  subheading?: string;
}

/**
 * Persuasive call-to-action inviting visitors to join CarConnect.
 */
export function CtaBanner({
  heading = "Ready to Transform Your Commute?",
  subheading = "Join CarConnect today and start experiencing the benefits of shared transportation.",
}: CtaBannerProps) {
  return (
    <section id="cta" className="py-12 text-[var(--color-heading)]">
      <div className="container flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{heading}</h2>
        <p className="text-body max-w-2xl text-lg">{subheading}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="shadow-soft-hover flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-[var(--color-on-primary)] transition-transform"
          >
            <Car aria-hidden="true" className="h-5 w-5" />
            Become a Driver
          </Link>
          <Link
            href="/auth/signup"
            className="shadow-soft-hover flex items-center justify-center gap-2 rounded-full bg-[var(--color-white)] px-6 py-3 text-base font-semibold transition-transform"
          >
            <Users
              aria-hidden="true"
              className="h-5 w-5 text-[var(--color-primary)]"
            />
            <span className="text-[var(--color-on-white)]">Become a Rider</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
