import { User, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";

export type RideRequestStatus = "pending" | "approved" | "rejected";

export interface RideRequest {
  id: string;
  riderName: string;
  from: string;
  to: string;
  time: string;
  status: RideRequestStatus;
}

export interface DriverRideRequestsProps {
  requests: RideRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

/**
 * Ride requests view for drivers to approve/reject riders.
 * Currently expects data and handlers to be passed in from the page.
 */
export function DriverRideRequests({
  requests,
  onApprove,
  onReject,
}: DriverRideRequestsProps) {
  if (!requests.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-divider)] bg-[var(--color-background)]/30 p-12 text-center backdrop-blur-sm">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <User className="h-8 w-8" />
        </div>
        <p className="text-heading text-lg font-semibold">No ride requests</p>
        <p className="text-body mt-2 max-w-sm text-sm">
          When riders request seats on your rides, they&apos;ll appear here for
          you to review and approve.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="group relative overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
        >
          <div
            className={`absolute top-0 left-0 h-full w-1 transition-opacity ${
              request.status === "pending"
                ? "bg-orange-500 opacity-100"
                : request.status === "approved"
                  ? "bg-emerald-600 opacity-100"
                  : "bg-red-600 opacity-100"
            }`}
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-[var(--color-white)] shadow-md">
                  <span className="text-lg font-bold">
                    {request.riderName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="text-heading text-base font-bold">
                    {request.riderName}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <MapPin className="text-body h-4 w-4 flex-shrink-0" />
                    <p className="text-body truncate text-sm">
                      {request.from} → {request.to}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="text-body h-4 w-4 flex-shrink-0" />
                    <p className="text-body text-sm">{request.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:flex-shrink-0">
              {request.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove?.(request.id)}
                    className="group/btn flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject?.(request.id)}
                    className="group/btn flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition-all hover:scale-105 hover:border-red-300 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase ${
                    request.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-red-50 text-red-700 ring-1 ring-red-200"
                  }`}
                >
                  {request.status === "approved" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {request.status === "approved" ? "Approved" : "Rejected"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
