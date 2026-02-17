"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  DriverRideRequests,
  type RideRequest,
} from "@/components/driver-ride-requests";
import {
  DriverRidesList,
  type DriverRideSummary,
} from "@/components/driver-rides-list";
import { PostRideModal } from "@/components/post-ride-modal";
import type {
  PostRideResponse,
  DriverRide,
  DriverRideRequest,
} from "@/services/rides";
import {
  getDriverRides,
  getDriverRequests,
  approveDriverRequest,
  rejectDriverRequest,
} from "@/services/rides";
import { getCurrentUser } from "@/services/auth";
import { useToast } from "@/components/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Format API ride_time (e.g. "14:30" or "14:30:00") to "02:30 PM" */
function formatRideTime(rideTime: string): string {
  const [h, m] = rideTime.split(":").map(Number);
  const hour = h ?? 0;
  const min = m ?? 0;
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${period}`;
}

function apiRideToSummary(ride: DriverRide): DriverRideSummary {
  return {
    id: String(ride.id),
    from: ride.from_location,
    to: ride.to_location,
    date: ride.ride_date,
    time: formatRideTime(ride.ride_time),
    rideTimeRaw: ride.ride_time,
    seats: ride.seats_available,
    status:
      ride.status === "active"
        ? "scheduled"
        : ride.status === "cancelled"
          ? "cancelled"
          : "completed",
    vehicleName: ride.vehicle_name,
    vehicleNumber: ride.vehicle_number,
  };
}

export default function DriverDashboardPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("rides");
  const [ridesFilterTab, setRidesFilterTab] = useState<
    "all" | "upcoming" | "completed"
  >("all");
  const [rides, setRides] = useState<DriverRideSummary[]>([]);
  const [ridesCounts, setRidesCounts] = useState({
    all: 0,
    upcoming: 0,
    completed: 0,
  });
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState<boolean>(true);
  const [ridesError, setRidesError] = useState<string | null>(null);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const fetchRides = async (filter?: "all" | "upcoming" | "completed") => {
    try {
      setIsLoadingRides(true);
      setRidesError(null);
      const { rides: apiRides, counts } = await getDriverRides(filter ?? "all");
      if (!isMountedRef.current) return;
      setRides(apiRides.map(apiRideToSummary));
      setRidesCounts(counts);
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Failed to load driver rides:", error);
      setRidesError(
        error instanceof Error
          ? error.message
          : "Failed to load rides. Please try again."
      );
    } finally {
      if (isMountedRef.current) {
        setIsLoadingRides(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        if (!isMountedRef.current) return;
        setUserName(res.data.user.name);
      } catch {
        if (!isMountedRef.current) return;
      }
    };

    const fetchRequests = async () => {
      try {
        setIsLoadingRequests(true);
        setRequestsError(null);
        const apiRequests: DriverRideRequest[] = await getDriverRequests();
        if (!isMountedRef.current) return;
        setRequests(
          apiRequests.map((req) => ({
            id: String(req.id),
            riderName: req.rider_name,
            from: req.from_location,
            to: req.to_location,
            time: formatRideTime(req.ride_time),
            status:
              req.status === "approved" || req.status === "rejected"
                ? (req.status as "approved" | "rejected")
                : "pending",
          }))
        );
      } catch (error) {
        if (!isMountedRef.current) return;
        console.error("Failed to load ride requests:", error);
        setRequestsError(
          error instanceof Error
            ? error.message
            : "Failed to load ride requests. Please try again."
        );
      } finally {
        if (isMountedRef.current) {
          setIsLoadingRequests(false);
        }
      }
    };

    fetchRides("all");
    fetchRequests();
    fetchUser();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRidePosted = (data: PostRideResponse["data"]) => {
    if (data) {
      toast.success("Ride posted successfully!");
      fetchRides(ridesFilterTab);
    }
  };

  const handleRidesFilterChange = (
    filter: "all" | "upcoming" | "completed"
  ) => {
    setRidesFilterTab(filter);
    fetchRides(filter);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveDriverRequest(id);
      // Refresh requests after backend update
      setIsLoadingRequests(true);
      const apiRequests: DriverRideRequest[] = await getDriverRequests();
      setRequests(
        apiRequests.map((req) => ({
          id: String(req.id),
          riderName: req.rider_name,
          from: req.from_location,
          to: req.to_location,
          time: formatRideTime(req.ride_time),
          status:
            req.status === "approved" || req.status === "rejected"
              ? (req.status as "approved" | "rejected")
              : "pending",
        }))
      );
      setRequestsError(null);
    } catch (error) {
      console.error("Failed to approve ride request:", error);
      setRequestsError(
        error instanceof Error
          ? error.message
          : "Failed to approve request. Please try again."
      );
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectDriverRequest(id);
      // Refresh requests after backend update
      setIsLoadingRequests(true);
      const apiRequests: DriverRideRequest[] = await getDriverRequests();
      setRequests(
        apiRequests.map((req) => ({
          id: String(req.id),
          riderName: req.rider_name,
          from: req.from_location,
          to: req.to_location,
          time: formatRideTime(req.ride_time),
          status:
            req.status === "approved" || req.status === "rejected"
              ? (req.status as "approved" | "rejected")
              : "pending",
        }))
      );
      setRequestsError(null);
    } catch (error) {
      console.error("Failed to reject ride request:", error);
      setRequestsError(
        error instanceof Error
          ? error.message
          : "Failed to reject request. Please try again."
      );
    } finally {
      setIsLoadingRequests(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background)] to-[var(--color-mint)]/10 pt-20 pb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <section className="mt-6">
            <div className="bg-surface shadow-soft rounded-3xl px-6 py-8">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase">
                Driver Dashboard
              </p>
              <h1 className="text-heading mt-3 text-3xl font-bold">
                Welcome to your driver dashboard
                {userName ? `, ${userName}` : ""}!
              </h1>
              <p className="text-body mt-2 text-base">
                Manage your posted rides and review rider requests all in one
                place.
              </p>
            </div>
          </section>

          {/* Main Content */}
          <section className="mt-10">
            <div className="overflow-hidden rounded-3xl border border-[var(--color-divider)]/50 bg-[var(--color-surface)] shadow-lg">
              <div className="border-b border-[var(--color-divider)]/50 bg-[var(--color-surface)] px-6 py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-[var(--color-background)]/80">
                      <TabsTrigger value="rides">My Rides</TabsTrigger>
                      <TabsTrigger value="requests">
                        <span className="flex items-center gap-2">
                          Ride Requests
                          {requests.filter((r) => r.status === "pending")
                            .length > 0 && (
                            <span className="bg-primary inline-flex h-5 w-5 animate-pulse items-center justify-center rounded-full text-xs font-bold text-[var(--color-white)]">
                              {
                                requests.filter((r) => r.status === "pending")
                                  .length
                              }
                            </span>
                          )}
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {activeTab === "rides" && (
                    <PostRideModal onSuccess={handleRidePosted} />
                  )}
                </div>
              </div>

              <div className="px-6 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="rides">
                    {isLoadingRides ? (
                      <div className="text-body text-sm">
                        Loading your rides...
                      </div>
                    ) : ridesError ? (
                      <div className="text-sm text-red-600">{ridesError}</div>
                    ) : (
                      <>
                        <div className="mb-4 flex justify-end">
                          <select
                            value={ridesFilterTab}
                            onChange={(e) =>
                              handleRidesFilterChange(
                                e.target.value as
                                  | "all"
                                  | "upcoming"
                                  | "completed"
                              )
                            }
                            className="bg-background text-heading focus-visible:ring-primary/60 w-full max-w-xs rounded-xl border border-[var(--color-divider)] px-4 py-2.5 text-sm font-medium shadow-sm transition-all focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:outline-none sm:w-auto"
                          >
                            <option value="all">
                              All Rides ({ridesCounts.all})
                            </option>
                            <option value="upcoming">
                              Upcoming ({ridesCounts.upcoming})
                            </option>
                            <option value="completed">
                              Completed ({ridesCounts.completed})
                            </option>
                          </select>
                        </div>
                        <DriverRidesList rides={rides} />
                      </>
                    )}
                  </TabsContent>
                  <TabsContent value="requests">
                    {isLoadingRequests ? (
                      <div className="text-body text-sm">
                        Loading ride requests...
                      </div>
                    ) : requestsError ? (
                      <div className="text-sm text-red-600">
                        {requestsError}
                      </div>
                    ) : (
                      <DriverRideRequests
                        requests={requests}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
