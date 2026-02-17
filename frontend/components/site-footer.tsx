import Link from "next/link";

import { Logo } from "@/components/logo";

export interface SiteFooterLink {
  label: string;
  href: string;
}

export interface SiteFooterProps {
  /**
   * Customize the quick link column.
   */
  quickLinks?: SiteFooterLink[];
  /**
   * Customize the legal link column.
   */
  legalLinks?: SiteFooterLink[];
}

const defaultQuickLinks: SiteFooterLink[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Get Started", href: "#cta" },
  { label: "Contact", href: "#contact" },
];

const defaultLegalLinks: SiteFooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Safety Guidelines", href: "/safety" },
];

/**
 * Multi-column footer providing navigation, legal, and contact information.
 */
export function SiteFooter({
  quickLinks = defaultQuickLinks,
  legalLinks = defaultLegalLinks,
}: SiteFooterProps) {
  return (
    <footer
      className="bg-[var(--color-primary-dark)] text-[var(--color-white)]"
      aria-labelledby="footer-heading"
    >
      <div className="container grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo
            href="#home"
            textClassName="text-[var(--color-white)]"
            className="inline-flex"
          />
          <p className="text-white-muted text-sm">
            Connecting commuters for a greener, more efficient workplace
            transportation solution.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-white)]">
            Quick Links
          </h3>
          <ul className="text-white-muted space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  className="hover:text-[var(--color-white)]"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--color-white)]">
            Legal
          </h3>
          <ul className="text-white-muted space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  className="hover:text-[var(--color-white)]"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4" id="contact">
          <h3 className="text-lg font-semibold text-[var(--color-white)]">
            Contact
          </h3>
          <ul className="text-white-muted space-y-2 text-sm">
            <li>
              <a
                className="hover:text-[var(--color-white)]"
                href="mailto:support@carconnect.com"
              >
                support@carconnect.com
              </a>
            </li>
            <li>
              <a
                className="hover:text-[var(--color-white)]"
                href="tel:+15551234567"
              >
                +1 (555) 123-4567
              </a>
            </li>
            <li>San Francisco, CA</li>
          </ul>
        </div>
      </div>
      <div className="bg-[color-mix(in_lab,var(--color-primary-dark) 85%,rgb(var(--color-shadow)) 15%)] border-t border-[color:var(--color-divider)]">
        <div className="text-white-soft container py-6 text-center text-xs">
          © 2024 CarConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
