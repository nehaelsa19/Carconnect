"use client";

import {
  PlusCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  X,
  Car,
} from "lucide-react";
import { useState } from "react";
import { postRide } from "@/services/rides";
import type { PostRideResponse } from "@/services/rides";

type PostRideFormState = {
  vehicleName: string;
  vehicleNumber: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string;
  notes: string;
};

const initialFormState: PostRideFormState = {
  vehicleName: "",
  vehicleNumber: "",
  from: "",
  to: "",
  date: "",
  time: "",
  seats: "",
  notes: "",
};

interface PostRideModalProps {
  onSuccess?: (data: PostRideResponse["data"]) => void;
}

/**
 * Button + modal for drivers to post a new ride.
 * Submits to POST /api/drivers/rides with JWT authorization.
 */
export function PostRideModal({ onSuccess }: PostRideModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] =
    useState<PostRideFormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = () => {
    setError(null);
    setFormValues(initialFormState);
    setIsOpen(true);
  };
  const close = () => {
    if (!isSubmitting) {
      setError(null);
      setIsOpen(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const getMinDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const seatsNum = parseInt(formValues.seats, 10);
    if (isNaN(seatsNum) || seatsNum < 1) {
      setError("Seats must be at least 1.");
      return;
    }
    if (formValues.date < getMinDate()) {
      setError("Please select today's date or a future date.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await postRide({
        vehicle_name: formValues.vehicleName.trim(),
        vehicle_number: formValues.vehicleNumber.trim(),
        from_location: formValues.from.trim(),
        to_location: formValues.to.trim(),
        ride_date: formValues.date,
        ride_time: formValues.time,
        seats_available: seatsNum,
        notes: formValues.notes.trim() || undefined,
      });
      close();
      onSuccess?.(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post ride.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 group flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[var(--color-white)] shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <PlusCircle
          className="h-5 w-5 transition-transform group-hover:rotate-90"
          aria-hidden="true"
        />
        Post New Ride
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-divider)]/50 bg-[var(--color-surface)] shadow-2xl">
            {/* Header */}
            <div className="border-b border-[var(--color-divider)]/50 bg-[var(--color-surface)] px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-heading flex items-center gap-2 text-2xl font-bold">
                    <MapPin className="text-primary h-6 w-6" />
                    Post a New Ride
                  </h2>
                  <p className="text-body mt-1 text-sm">
                    Share your vehicle details, route, and available seats with
                    riders
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="text-body hover:bg-background/60 flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Vehicle Details Section */}
                <div className="space-y-4">
                  <div className="text-heading flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                    <Car className="h-4 w-4" />
                    Vehicle Details
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="vehicleName"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Vehicle Name
                      </label>
                      <input
                        id="vehicleName"
                        name="vehicleName"
                        type="text"
                        value={formValues.vehicleName}
                        onChange={handleChange}
                        placeholder="e.g. Toyota Innova"
                        required
                        className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="vehicleNumber"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Vehicle Number
                      </label>
                      <input
                        id="vehicleNumber"
                        name="vehicleNumber"
                        type="text"
                        value={formValues.vehicleNumber}
                        onChange={handleChange}
                        placeholder="e.g. KL-01-AB-1234"
                        required
                        className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Route Section */}
                <div className="space-y-4">
                  <div className="text-heading flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                    <MapPin className="h-4 w-4" />
                    Route Details
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="from"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Starting Point
                      </label>
                      <input
                        id="from"
                        name="from"
                        type="text"
                        value={formValues.from}
                        onChange={handleChange}
                        placeholder="e.g. Pathanamthitta"
                        required
                        className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="to"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Destination
                      </label>
                      <input
                        id="to"
                        name="to"
                        type="text"
                        value={formValues.to}
                        onChange={handleChange}
                        placeholder="e.g. Kochi Infopark"
                        required
                        className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="space-y-4">
                  <div className="text-heading flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label
                        htmlFor="date"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Date
                      </label>
                      <div className="relative">
                        <input
                          id="date"
                          name="date"
                          type="date"
                          min={getMinDate()}
                          value={formValues.date}
                          onChange={handleChange}
                          required
                          className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="time"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Time
                      </label>
                      <div className="relative">
                        <input
                          id="time"
                          name="time"
                          type="time"
                          value={formValues.time}
                          onChange={handleChange}
                          required
                          className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="seats"
                        className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                      >
                        Seats
                      </label>
                      <div className="relative">
                        <Users className="text-body pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                          id="seats"
                          name="seats"
                          type="number"
                          min={1}
                          max={8}
                          value={formValues.seats}
                          onChange={handleChange}
                          placeholder="3"
                          required
                          className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] py-3 pr-4 pl-10 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="bg-primary/10 text-primary rounded-xl px-4 py-3 text-sm"
                  >
                    {error}
                  </p>
                ) : null}

                {/* Notes Section */}
                <div>
                  <label
                    htmlFor="notes"
                    className="text-body mb-1.5 block text-xs font-semibold tracking-wide uppercase"
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formValues.notes}
                    onChange={handleChange}
                    placeholder="Add any timing details, pickup instructions, or preferences..."
                    className="bg-background text-body focus-visible:ring-primary/60 w-full rounded-xl border border-[var(--color-divider)] px-4 py-3 text-sm shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  disabled={isSubmitting}
                  className="text-heading hover:bg-background rounded-xl border-2 border-[var(--color-divider)] px-5 py-2.5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 disabled:bg-primary/60 group flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[var(--color-white)] shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
                >
                  <PlusCircle
                    className="h-4 w-4 transition-transform group-hover:rotate-90"
                    aria-hidden="true"
                  />
                  {isSubmitting ? "Posting..." : "Post Ride"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
