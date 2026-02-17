import { Calendar, MapPin, Users, Clock, Car } from "lucide-react";

export type DriverRideStatus = "scheduled" | "completed" | "cancelled";

export interface DriverRideSummary {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  /** Raw ride_time (e.g. "14:30") for sorting/filtering. */
  rideTimeRaw?: string;
  seats: number;
  status: DriverRideStatus;
  vehicleName?: string;
  vehicleNumber?: string;
}

export interface DriverRidesListProps {
  rides: DriverRideSummary[];
}

/**
 * List view for rides a driver has posted.
 * Expects data to be passed in; shows an empty state if there are no rides.
 */
export function DriverRidesList({ rides }: DriverRidesListProps) {
  if (!rides.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-divider)] bg-[var(--color-background)]/30 p-12 text-center backdrop-blur-sm">
        <div className="bg-primary/10 text-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <MapPin className="h-8 w-8" />
        </div>
        <p className="text-heading text-lg font-semibold">
          No rides posted yet
        </p>
        <p className="text-body mt-2 max-w-sm text-sm">
          Start by posting your first ride! Share your route and help riders
          reach their destinations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <div
          key={ride.id}
          className="group relative overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
        >
          <div className="bg-primary absolute top-0 left-0 h-full w-1 opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-heading text-base font-bold">
                      {ride.from}
                    </p>
                    <span className="text-body">→</span>
                    <p className="text-heading text-base font-bold">
                      {ride.to}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
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
                        {ride.seats} {ride.seats === 1 ? "seat" : "seats"}
                      </span>
                    </div>
                    {(ride.vehicleName || ride.vehicleNumber) && (
                      <div className="text-body flex items-center gap-1.5 text-sm">
                        <Car className="h-4 w-4 opacity-60" />
                        <span>
                          {[ride.vehicleName, ride.vehicleNumber]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                  ride.status === "scheduled"
                    ? "bg-primary/10 text-primary ring-1 ring-[var(--color-primary)]/20"
                    : ride.status === "completed"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-red-50 text-red-700 ring-1 ring-red-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    ride.status === "scheduled"
                      ? "bg-primary animate-pulse"
                      : ride.status === "completed"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                  }`}
                />
                {ride.status === "scheduled"
                  ? "Scheduled"
                  : ride.status === "completed"
                    ? "Completed"
                    : "Cancelled"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
