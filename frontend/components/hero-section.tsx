import { Car, Users } from "lucide-react";
import Link from "next/link";

/**
 * Hero banner featuring the primary CarConnect value proposition.
 */
export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] text-[var(--color-white)]"
    >
      <div className="container flex flex-col items-center justify-center gap-6 py-28 text-center md:py-32">
        <span className="animate-fade-up text-white-soft text-sm font-semibold tracking-[0.3em] uppercase">
          Workplace Carpooling
        </span>
        <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-[var(--color-white)] md:text-5xl">
          Share Rides Easily with{" "}
          <span className="text-[var(--color-primary-light)]">CarConnect</span>
        </h1>
        <p className="animate-fade-up text-white-muted max-w-2xl text-lg leading-relaxed md:text-xl">
          Connect with coworkers, save money, reduce your carbon footprint, and
          make your daily commute more enjoyable.
        </p>
        <div className="animate-fade-up flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="shadow-soft-hover flex items-center justify-center gap-3 rounded-full bg-[var(--color-white)] px-7 py-3 text-base font-semibold transition-transform"
          >
            <Car
              aria-hidden="true"
              className="h-5 w-5 text-[var(--color-primary)]"
            />
            <span className="text-heading">Sign up as Driver</span>
          </Link>
          <Link
            href="/auth/signup"
            className="shadow-soft-hover flex items-center justify-center gap-3 rounded-full bg-[var(--color-white)] px-7 py-3 text-base font-semibold transition-transform"
          >
            <Users
              aria-hidden="true"
              className="h-5 w-5 text-[var(--color-primary)]"
            />
            <span className="text-heading">Sign up as Rider</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
