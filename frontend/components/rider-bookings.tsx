import {
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

export type BookingStatus = "pending" | "approved" | "rejected";

export interface RiderBooking {
  id: string;
  driverName: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: BookingStatus;
  vehicleModel?: string;
}

export interface RiderBookingsProps {
  bookings: RiderBooking[];
}

/**
 * List of rider's bookings (pending, approved, rejected)
 */
export function RiderBookings({ bookings }: RiderBookingsProps) {
  if (!bookings.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-divider)] bg-[var(--color-background)]/30 p-12 text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <MapPin className="h-8 w-8" />
        </div>
        <p className="text-heading text-lg font-semibold">No bookings yet</p>
        <p className="text-body mt-2 max-w-sm text-sm">
          Your requested and confirmed rides will appear here. Search for
          available rides to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="group relative overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
        >
          <div
            className={`absolute top-0 left-0 h-full w-1 transition-opacity ${
              booking.status === "pending"
                ? "bg-orange-500 opacity-100"
                : booking.status === "approved"
                  ? "bg-emerald-600 opacity-100"
                  : "bg-red-600 opacity-100"
            }`}
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-start gap-4">
              <div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[var(--color-white)] shadow-md">
                <span className="text-lg font-bold">
                  {booking.driverName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="text-heading text-base font-bold">
                    {booking.driverName}
                  </p>
                  {booking.vehicleModel && (
                    <p className="text-body text-xs">{booking.vehicleModel}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-body h-4 w-4 flex-shrink-0" />
                    <p className="text-body text-sm">
                      {booking.from} → {booking.to}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <div className="text-body flex items-center gap-1.5 text-sm">
                      <Calendar className="h-4 w-4 opacity-60" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="text-body flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4 opacity-60" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:flex-shrink-0">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase ${
                  booking.status === "pending"
                    ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                    : booking.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-red-50 text-red-700 ring-1 ring-red-200"
                }`}
              >
                {booking.status === "pending" ? (
                  <>
                    <Clock3 className="h-4 w-4" />
                    Pending
                  </>
                ) : booking.status === "approved" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Approved
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Rejected
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
