"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SignupRoleOptionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  label: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
}

export function SignupRoleOption({
  label,
  description,
  icon,
  isActive,
  className,
  ...props
}: SignupRoleOptionProps) {
  return (
    <button
      type="button"
      className={`focus-visible:ring-primary/40 flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none ${
        isActive
          ? "border-primary bg-primary/10"
          : "bg-surface border-[var(--color-divider)]"
      } ${className ?? ""}`}
      aria-pressed={isActive}
      {...props}
    >
      <span
        className={`text-primary bg-[color-mix(in_lab,var(--color-primary) 10%,transparent 90%)] flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${
          isActive ? "shadow-soft" : ""
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>
        <span className="text-heading block text-base font-semibold">
          {label}
        </span>
        <span className="text-body block text-sm">{description}</span>
      </span>
    </button>
  );
}
