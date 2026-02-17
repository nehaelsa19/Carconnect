"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hasAuthToken } from "@/services/auth";

/**
 * Client-side guard that redirects to /login if user has no auth token.
 * Handles back-button/bfcache: when page is restored from cache, re-check and redirect.
 * Renders nothing until verified, so protected content never flashes.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const hasChecked = useRef(false);

  const redirectToLogin = () => {
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  const checkAuth = () => {
    if (!hasAuthToken()) {
      redirectToLogin();
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    if (checkAuth()) {
      setAllowed(true);
    }
  }, []);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        if (!hasAuthToken()) {
          setAllowed(false);
          redirectToLogin();
        }
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [pathname]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
