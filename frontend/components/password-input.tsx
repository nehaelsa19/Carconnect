"use client";

import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

type PasswordInputProps = {
  label: ReactNode;
  name: string;
  value: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "name">;

export function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = true,
  ...rest
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-heading text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-2xl border border-[var(--color-divider)] px-4 py-3 pr-12 text-base shadow-sm focus-visible:ring-2 focus-visible:outline-none"
          {...rest}
        />
        <button
          type="button"
          aria-pressed={isVisible}
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((prev) => !prev)}
          className="text-body/70 hover:text-heading focus-visible:ring-primary/50 absolute inset-y-0 right-3 inline-flex items-center justify-center rounded-full p-2 focus-visible:ring-2 focus-visible:outline-none"
        >
          {isVisible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
