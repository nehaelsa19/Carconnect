import { Logo } from "@/components/logo";
import { SignupCard } from "@/components/signup-card";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[color:var(--color-mint)] py-10">
      <div className="container flex flex-col items-center gap-8">
        <Logo
          shape="rounded-square"
          className="text-2xl"
          textClassName="text-2xl"
          aria-label="CarConnect home"
        />
        <SignupCard />
      </div>
    </main>
  );
}
