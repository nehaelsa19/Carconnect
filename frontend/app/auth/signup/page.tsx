import { AuthShell } from "@/components/auth-shell";
import { SignupForm } from "@/components/signup-form";

export default function AuthSignupPage() {
  return (
    <AuthShell
      title="Join CarConnect"
      subtitle="Create your account to start carpooling"
    >
      <SignupForm />
    </AuthShell>
  );
}
