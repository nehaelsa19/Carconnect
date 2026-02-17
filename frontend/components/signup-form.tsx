"use client";

import { Car, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { PasswordInput } from "@/components/password-input";
import { SignupRoleOption } from "@/components/signup-role-option";
import { signup, SignupPayload, SignupRole } from "@/services/auth";

interface SignupFormProps {
  defaultRole?: SignupRole;
  lockedRole?: boolean;
}

type FormState = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState | "role", string>>;

const roleOptions: Array<{
  value: SignupRole;
  label: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    value: "driver",
    label: "Drive",
    description: "Offer seats to coworkers heading to work.",
    icon: <Car className="h-5 w-5" />,
  },
  {
    value: "rider",
    label: "Ride",
    description: "Find reliable rides with teammates nearby.",
    icon: <Users className="h-5 w-5" />,
  },
];

export function SignupForm({
  defaultRole = "driver",
  lockedRole = false,
}: SignupFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>(defaultRole);
  const [formValues, setFormValues] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): FormErrors => {
    const result: FormErrors = {};
    if (!formValues.name.trim()) {
      result.name = "Full name is required.";
    }
    if (!formValues.email.trim()) {
      result.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      result.email = "Enter a valid email address.";
    }
    if (!formValues.password.trim()) {
      result.password = "Password is required.";
    } else if (formValues.password.length < 6) {
      result.password = "Password must be at least 6 characters.";
    }
    if (!role) {
      result.role = "Role is required.";
    }
    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setStatus({
        type: "error",
        message: "Please review the highlighted fields.",
      });
      return;
    }

    const payload: SignupPayload = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
      role,
      home_location: null,
      work_location: null,
      timings: null,
    };

    try {
      setIsSubmitting(true);
      await signup(payload);
      setStatus({
        type: "success",
        message: "Account created! You can now sign in to CarConnect.",
      });
      setFormValues({
        name: "",
        email: "",
        password: "",
      });
      setErrors({});
      if (!lockedRole) {
        setRole(defaultRole);
      }
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to complete sign up.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        {roleOptions.map((option) => (
          <SignupRoleOption
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            isActive={role === option.value}
            disabled={lockedRole && option.value !== role}
            onClick={() => {
              if (!lockedRole) {
                setRole(option.value);
              }
            }}
          />
        ))}
      </div>
      {errors.role ? (
        <p className="text-primary text-sm">{errors.role}</p>
      ) : null}

      <div className="grid gap-5">
        <div>
          <label htmlFor="name" className="text-heading text-sm font-medium">
            Full Name{" "}
            <span className="text-primary" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Eg:  John Smith"
            required
            className={`bg-background text-body focus-visible:ring-primary/60 mt-2 w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:outline-none ${
              errors.name ? "border-primary" : "border-[var(--color-divider)]"
            }`}
          />
          {errors.name ? (
            <p className="text-primary mt-1 text-sm">{errors.name}</p>
          ) : null}
        </div>

        <div>
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
            value={formValues.email}
            onChange={handleChange}
            placeholder="john@gmail.com"
            required
            className={`bg-background text-body focus-visible:ring-primary/60 mt-2 w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:outline-none ${
              errors.email ? "border-primary" : "border-[var(--color-divider)]"
            }`}
          />
          {errors.email ? (
            <p className="text-primary mt-1 text-sm">{errors.email}</p>
          ) : null}
        </div>

        <div>
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
            placeholder="Enter a password (min 6 characters)"
            onChange={handleChange}
          />
          {errors.password ? (
            <p className="text-primary mt-1 text-sm">{errors.password}</p>
          ) : null}
        </div>
      </div>

      {status.type ? (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm ${
            status.type === "success"
              ? "bg-primary/10 text-heading"
              : "text-primary bg-[var(--color-mint)]"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 disabled:bg-primary/60 w-full rounded-2xl px-6 py-3 text-base font-semibold text-[var(--color-white)] transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
