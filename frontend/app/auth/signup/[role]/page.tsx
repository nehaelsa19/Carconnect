import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "@/components/signup-form";
import type { SignupRole } from "@/services/auth";

interface SignupRolePageProps {
  params: { role: string };
}

const isSignupRole = (value: string): value is SignupRole =>
  value === "driver" || value === "rider";

export default function SignupRolePage({ params }: SignupRolePageProps) {
  const roleParam = params.role?.toLowerCase();
  if (!roleParam || !isSignupRole(roleParam)) {
    notFound();
  }

  const heading =
    roleParam === "driver" ? "Sign up as a Driver" : "Sign up as a Rider";
  const subtitle =
    roleParam === "driver"
      ? "Share your commute and earn rewards for every seat you offer."
      : "Find dependable rides with coworkers heading the same way.";

  return (
    <AuthShell title={heading} subtitle={subtitle}>
      <SignupForm defaultRole={roleParam} lockedRole />
    </AuthShell>
  );
}
