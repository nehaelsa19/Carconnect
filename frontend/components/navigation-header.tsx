"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/logo";

export interface NavigationHeaderProps {
  /**
   * Optional offset used to determine when to add the shadow once the user scrolls.
   */
  shadowOffset?: number;
}

/**
 * Fixed navigation bar with responsive menu for the CarConnect landing page.
 */
export function NavigationHeader({ shadowOffset = 16 }: NavigationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isElevated, setIsElevated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsElevated(window.scrollY > shadowOffset);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [shadowOffset]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`bg-[color-mix(in_lab,var(--color-surface) 92%,transparent 8%)] fixed inset-x-0 top-0 z-50 border-b border-transparent backdrop-blur transition-shadow ${isElevated ? "border-[color:var(--color-divider)] shadow-sm" : ""}`}
      aria-label="Primary"
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo className="flex-shrink-0" href="#home" />
        <nav className="text-body hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-primary focus-visible:ring-primary/40 focus-visible:ring-offset-surface transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary/40 focus-visible:ring-offset-surface rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/40 focus-visible:ring-offset-surface rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-white)] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Sign Up
          </Link>
        </div>
        <button
          type="button"
          className="bg-surface text-primary shadow-soft flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      <div
        className={`md:hidden ${isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} bg-surface shadow-soft absolute inset-x-0 top-full origin-top transition-all duration-200`}
      >
        <nav className="text-heading container flex flex-col gap-4 py-6 text-base font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-primary/10 focus-visible:ring-primary/40 focus-visible:ring-offset-surface rounded-lg px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="border-primary text-primary hover:bg-primary/10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary hover:bg-primary-dark rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-white)] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
