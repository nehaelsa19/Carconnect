"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-background)] p-1.5 text-[var(--color-body)] shadow-sm ring-1 ring-[var(--color-divider)]/50",
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({
  value: triggerValue,
  children,
  className,
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }
  const { value, onValueChange } = context;
  const isActive = value === triggerValue;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onValueChange(triggerValue)}
      className={cn(
        "focus-visible:ring-primary/60 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-primary text-[var(--color-white)] shadow-md"
          : "text-[var(--color-body)] hover:bg-[var(--color-surface)]/60 hover:text-[var(--color-heading)]",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value: contentValue,
  children,
  className,
}: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }
  const { value } = context;

  if (value !== contentValue) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={cn("mt-2 focus-visible:outline-none", className)}
    >
      {children}
    </div>
  );
}
