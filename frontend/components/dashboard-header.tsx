"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { Logo } from "@/components/logo";
import {
  getCurrentUser,
  logout,
  clearAuthToken,
  type User,
} from "@/services/auth";

/**
 * Simple application header shown on authenticated dashboards.
 * Left: CarConnect logo. Right: User profile avatar and Logout button.
 */
export function DashboardHeader() {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  const openConfirm = () => {
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const confirmLogout = async () => {
    setIsConfirmOpen(false);
    setIsProfileOpen(false);
    await logout();
    clearAuthToken();
    router.push("/login");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 w-full border-b border-[var(--color-divider)]/50 bg-[var(--color-surface)]/95 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo className="flex-shrink-0" />
          <div className="flex items-center gap-3">
            {/* User Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={toggleProfile}
                className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-white)] shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="User profile"
              >
                {loading ? (
                  <UserIcon className="h-5 w-5" />
                ) : user ? (
                  <span className="text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </button>

              {/* Profile Popover Card */}
              {isProfileOpen && user && (
                <div className="absolute top-12 right-0 z-50 w-72 overflow-hidden rounded-2xl border border-[var(--color-divider)]/50 bg-[var(--color-surface)] shadow-2xl">
                  <div className="border-b border-[var(--color-divider)]/50 bg-[var(--color-background)]/30 px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[var(--color-white)] shadow-md">
                        <span className="text-lg font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-heading truncate text-base font-bold">
                          {user.name}
                        </h3>
                        <p className="text-body truncate text-sm">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-body text-xs font-semibold tracking-wide uppercase">
                          Role
                        </p>
                        <p className="text-heading mt-1 text-sm capitalize">
                          {user.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-body text-xs font-semibold tracking-wide uppercase">
                          Member Since
                        </p>
                        <p className="text-heading mt-1 text-sm">
                          {new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[var(--color-divider)]/50 px-6 py-4">
                    <button
                      type="button"
                      onClick={openConfirm}
                      className="text-heading bg-background group flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-divider)] px-4 py-2.5 text-sm font-bold transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:outline-none"
                    >
                      <LogOut
                        className="h-4 w-4 transition-transform group-hover:scale-110"
                        aria-hidden="true"
                      />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-divider)]/50 shadow-2xl">
            <div className="border-b border-[var(--color-divider)]/50 bg-red-50 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <LogOut className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-heading text-lg font-bold">
                    Log out of CarConnect?
                  </h2>
                  <p className="text-body mt-1 text-sm">
                    You&apos;ll be taken back to the login screen.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-5">
              <button
                type="button"
                onClick={closeConfirm}
                className="text-heading hover:bg-background rounded-xl border-2 border-[var(--color-divider)] px-5 py-2.5 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="group flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <LogOut
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
