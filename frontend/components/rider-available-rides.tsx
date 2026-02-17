import { MapPin, Calendar, Clock, Users, User } from "lucide-react";

export interface AvailableRide {
  id: string;
  driverName?: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seatsAvailable: number;
  vehicleModel?: string;
  vehicleNumber?: string;
}

export interface RiderAvailableRidesProps {
  rides: AvailableRide[];
  onRequest?: (rideId: string) => void;
}

/**
 * List of available rides that riders can request
 */
export function RiderAvailableRides({
  rides,
  onRequest,
}: RiderAvailableRidesProps) {
  if (!rides.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-divider)] bg-[var(--color-background)]/30 p-12 text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <MapPin className="h-8 w-8" />
        </div>
        <p className="text-heading text-lg font-semibold">No rides found</p>
        <p className="text-body mt-2 max-w-sm text-sm">
          Try adjusting your search criteria. Available rides matching your
          route and time will appear here.
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
            <div className="flex flex-1 items-start gap-4">
              <div className="bg-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[var(--color-white)] shadow-md">
                <span className="text-lg font-bold">
                  {(ride.driverName ?? "D").charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="text-body space-y-0.5 text-sm">
                  {ride.driverName && (
                    <p>
                      <span className="font-semibold">Driver name:</span>{" "}
                      {ride.driverName}
                    </p>
                  )}
                  {ride.vehicleModel && (
                    <p>
                      <span className="font-semibold">Vehicle name:</span>{" "}
                      {ride.vehicleModel}
                    </p>
                  )}
                  {ride.vehicleNumber && (
                    <p>
                      <span className="font-semibold">Vehicle number:</span>{" "}
                      {ride.vehicleNumber}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
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
                        {ride.seatsAvailable === 1 ? "seat" : "seats"} available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:flex-shrink-0">
              <button
                type="button"
                onClick={() => onRequest?.(ride.id)}
                className="bg-primary hover:bg-primary-dark focus-visible:ring-primary/60 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--color-white)] shadow-md transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <User className="h-4 w-4" />
                Request Seat
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
