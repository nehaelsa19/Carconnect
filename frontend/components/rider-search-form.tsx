"use client";

import { Search, MapPin, Calendar, Clock } from "lucide-react";
import { useState } from "react";

type SearchFormState = {
  from: string;
  to: string;
  date: string;
  time: string;
};

export interface RiderSearchFormProps {
  onSearch: (values: SearchFormState) => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Search form for riders to find available rides
 */
export function RiderSearchForm({
  onSearch,
  loading = false,
  disabled = false,
}: RiderSearchFormProps) {
  const [formValues, setFormValues] = useState<SearchFormState>({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label
            htmlFor="from"
            className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            From
          </label>
          <div className="relative">
            <MapPin className="text-body pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              id="from"
              name="from"
              type="text"
              value={formValues.from}
              onChange={handleChange}
              placeholder="Pathanamthitta"
              disabled={disabled}
              className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] py-3 pr-4 pl-10 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </div>

        <div className="flex-1">
          <label
            htmlFor="to"
            className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            To
          </label>
          <div className="relative">
            <MapPin className="text-body pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              id="to"
              name="to"
              type="text"
              value={formValues.to}
              onChange={handleChange}
              placeholder="Kochi Infopark"
              disabled={disabled}
              className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] py-3 pr-4 pl-10 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </div>

        <div className="w-full lg:w-auto lg:min-w-[160px]">
          <label
            htmlFor="date"
            className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            Date
          </label>
          <div className="relative">
            <Calendar className="text-body pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              id="date"
              name="date"
              type="date"
              value={formValues.date}
              onChange={handleChange}
              disabled={disabled}
              className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] py-3 pr-4 pl-10 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </div>

        <div className="w-full lg:w-auto lg:min-w-[140px]">
          <label
            htmlFor="time"
            className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
          >
            Time
          </label>
          <div className="relative">
            <Clock className="text-body pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              id="time"
              name="time"
              type="time"
              value={formValues.time}
              onChange={handleChange}
              disabled={disabled}
              className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] py-3 pr-4 pl-10 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[var(--color-white)] shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 lg:min-w-[140px]"
        >
          {loading ? (
            <span className="animate-pulse">Searching...</span>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
