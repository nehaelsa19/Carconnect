import { Car } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type LogoShape = "circle" | "rounded-square";

export interface LogoProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /**
   * When provided, renders the logo as a link to the supplied href.
   * Defaults to the home page when omitted.
   */
  href?: string;
  /**
   * Optional text className override for custom styling.
   */
  textClassName?: string;
  /**
   * Controls the shape of the logomark background.
   */
  shape?: LogoShape;
}

/**
 * Displays the CarConnect logomark and wordmark.
 */
export function Logo({
  href = "/",
  className,
  textClassName,
  shape = "circle",
  ...anchorProps
}: LogoProps) {
  const logomarkShape =
    shape === "rounded-square" ? "rounded-2xl" : "rounded-full";
  const content = (
    <span className="flex items-center gap-2">
      <span
        className={`bg-primary flex h-10 w-10 items-center justify-center ${logomarkShape} text-[var(--color-white)]`}
      >
        <Car aria-hidden="true" className="h-5 w-5" />
      </span>
      <span
        className={`text-heading text-lg font-semibold tracking-tight ${textClassName ?? ""}`}
      >
        CarConnect
      </span>
    </span>
  );

  if (anchorProps.onClick || anchorProps.target || href !== "/") {
    return (
      <Link href={href} className={className} {...anchorProps}>
        {content}
      </Link>
    );
  }

  return (
    <Link href="/" className={className} {...anchorProps}>
      {content}
    </Link>
  );
}
