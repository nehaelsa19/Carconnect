"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { PasswordInput } from "@/components/password-input";
import { login, getCurrentUser, setAuthToken } from "@/services/auth";

type FormErrors = Partial<Record<"email" | "password", string>>;

export function LoginCard() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
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
    if (!formValues.email.trim()) {
      result.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      result.email = "Enter a valid email.";
    }
    if (!formValues.password.trim()) {
      result.password = "Password is required.";
    }
    return result;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: null, message: "" });
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      const token = response?.data?.token;
      if (typeof token === "string" && token) {
        setAuthToken(token);
      }

      // Call /api/auth/me to get current user details
      try {
        await getCurrentUser();
      } catch (meError) {
        // Log error but don't block login if token was stored successfully
        // eslint-disable-next-line no-console
        console.warn("Failed to fetch user details after login:", meError);
      }

      const role =
        typeof response?.data?.user?.role === "string"
          ? response.data.user.role.toLowerCase()
          : "";
      if (role === "driver") {
        router.push("/driver/dashboard");
      } else if (role === "rider") {
        router.push("/rider/dashboard");
      } else {
        setStatus({
          type: "error",
          message:
            "Login succeeded but the user role is missing. Please contact support.",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface shadow-soft w-full max-w-xl rounded-3xl p-8">
      <div className="space-y-2 text-center">
        <p className="text-heading text-3xl font-bold">Welcome Back</p>
        <p className="text-body text-base">
          Sign in to your CarConnect account
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
            placeholder="Enter your email"
            value={formValues.email}
            onChange={handleChange}
            required
            className={`bg-background text-body focus-visible:ring-primary/60 w-full rounded-2xl border px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:outline-none ${
              errors.email ? "border-primary" : "border-[var(--color-divider)]"
            }`}
          />
          {errors.email ? (
            <p className="text-primary mt-1 text-sm">{errors.email}</p>
          ) : null}
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
          placeholder="Enter your password"
          onChange={handleChange}
        />
        {errors.password ? (
          <p className="text-primary -mt-3 text-sm">{errors.password}</p>
        ) : null}

        {/* <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </div> */}

        {status.type ? (
          <p
            role={status.type === "error" ? "alert" : "status"}
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
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-body mt-8 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
