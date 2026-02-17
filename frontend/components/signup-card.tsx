"use client";

import { Car, UserRound } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { PasswordInput } from "@/components/password-input";
import { SignupRoleOption } from "@/components/signup-role-option";

type RoleValue = "drive" | "ride";

const roleOptions = [
  {
    value: "drive" as RoleValue,
    label: "Drive",
    description: "Offer seats to coworkers headed your way.",
    icon: <Car className="h-5 w-5" />,
  },
  {
    value: "ride" as RoleValue,
    label: "Ride",
    description: "Find a dependable commute buddy each day.",
    icon: <UserRound className="h-5 w-5" />,
  },
];

export function SignupCard() {
  const [role, setRole] = useState<RoleValue>("drive");
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for integration hook-in
    // eslint-disable-next-line no-console
    console.log("Sign-up submitted", { ...formValues, role });
  };

  return (
    <div className="bg-surface shadow-soft w-full max-w-3xl rounded-3xl p-8">
      <div className="space-y-2 text-center">
        <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase">
          Join CarConnect
        </p>
        <h1 className="text-heading text-3xl font-bold">
          Create your account to start carpooling
        </h1>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <SignupRoleOption
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            isActive={role === option.value}
            onClick={() => setRole(option.value)}
          />
        ))}
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-heading text-sm font-medium"
          >
            Full Name{" "}
            <span className="text-primary" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formValues.fullName}
            onChange={handleChange}
            required
            className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-2xl border border-[var(--color-divider)] px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-heading text-sm font-medium">
            Email{" "}
            <span className="text-primary" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your work email"
            value={formValues.email}
            onChange={handleChange}
            required
            className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-2xl border border-[var(--color-divider)] px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>

        <PasswordInput
          label={
            <>
              Password{" "}
              <span className="text-primary" aria-hidden="true">
                *
              </span>
            </>
          }
          name="password"
          value={formValues.password}
          placeholder="Create a password"
          onChange={handleChange}
        />

        <PasswordInput
          label={
            <>
              Confirm Password{" "}
              <span className="text-primary" aria-hidden="true">
                *
              </span>
            </>
          }
          name="confirmPassword"
          value={formValues.confirmPassword}
          placeholder="Re-enter your password"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 mt-4 w-full rounded-2xl px-6 py-3 text-base font-semibold text-[var(--color-white)] transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Create Account
        </button>
      </form>

      <p className="text-body mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
