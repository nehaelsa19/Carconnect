import { AuthGuard } from "@/components/auth-guard";

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
