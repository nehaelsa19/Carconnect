import type { ReactNode } from "react";

import { Logo } from "@/components/logo";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[color:var(--color-mint)] py-12">
      <div className="container flex flex-col items-center gap-10">
        <Logo
          shape="rounded-square"
          className="text-2xl"
          textClassName="text-2xl"
          aria-label="CarConnect home"
        />
        <div className="bg-surface shadow-soft w-full max-w-4xl rounded-[32px] p-8">
          <div className="text-center">
            <p className="text-heading text-3xl font-bold">{title}</p>
            <p className="text-body mt-2 text-base">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
