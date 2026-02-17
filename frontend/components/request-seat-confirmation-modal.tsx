"use client";

import { X, MapPin, Calendar, Clock, Users, User } from "lucide-react";
import type { AvailableRide } from "./rider-available-rides";

interface RequestSeatConfirmationModalProps {
  isOpen: boolean;
  ride: AvailableRide | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation modal for requesting a seat on a ride
 */
export function RequestSeatConfirmationModal({
  isOpen,
  ride,
  onConfirm,
  onCancel,
}: RequestSeatConfirmationModalProps) {
  if (!isOpen || !ride) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-divider)]/50 bg-[var(--color-surface)] shadow-2xl">
        {/* Header */}
        <div className="border-b border-[var(--color-divider)]/50 bg-[var(--color-surface)] px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-heading flex items-center gap-2 text-2xl font-bold">
                <User className="text-primary h-6 w-6" />
                Confirm Seat Request
              </h2>
              <p className="text-body mt-1 text-sm">
                Please confirm your ride request details
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-body hover:bg-background/60 flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Ride Details */}
            <div className="rounded-xl border border-[var(--color-divider)]/50 bg-[var(--color-background)]/30 p-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[var(--color-white)] shadow-md">
                  <span className="text-lg font-bold">
                    {(ride.driverName ?? "D").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    {ride.driverName && (
                      <p className="text-heading text-base font-bold">
                        {ride.driverName}
                      </p>
                    )}
                    {ride.vehicleModel && (
                      <p className="text-body text-xs">{ride.vehicleModel}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-body h-4 w-4 flex-shrink-0" />
                      <p className="text-body text-sm">
                        {ride.from} → {ride.to}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <div className="text-body flex items-center gap-1.5 text-sm">
                        <Calendar className="h-4 w-4 opacity-60" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="text-body flex items-center gap-1.5 text-sm">
                        <Clock className="h-4 w-4 opacity-60" />
                        <span>{ride.time}</span>
                      </div>
                      <div className="text-body flex items-center gap-1.5 text-sm">
                        <Users className="h-4 w-4 opacity-60" />
                        <span>
                          {ride.seatsAvailable}{" "}
                          {ride.seatsAvailable === 1 ? "seat" : "seats"}{" "}
                          available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-body text-sm">
              Are you sure you want to request a seat on this ride? The driver
              will be notified and can approve or reject your request.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-heading hover:bg-background rounded-xl border-2 border-[var(--color-divider)] px-5 py-2.5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[var(--color-white)] shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <User className="h-4 w-4" />
              Confirm Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
