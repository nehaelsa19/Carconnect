"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { RiderSearchForm } from "@/components/rider-search-form";
import {
  RiderAvailableRides,
  type AvailableRide,
} from "@/components/rider-available-rides";
import { RiderBookings, type RiderBooking } from "@/components/rider-bookings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestSeatConfirmationModal } from "@/components/request-seat-confirmation-modal";
import {
  searchRiderRides,
  requestSeat,
  getRiderBookings,
  type ApiRide,
  type ApiBooking,
} from "@/services/rider-rides";
import { getCurrentUser } from "@/services/auth";

function formatTime24to12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function apiRideToAvailableRide(ride: ApiRide): AvailableRide {
  return {
    id: String(ride.id),
    driverName: ride.driver_name ?? "Driver",
    from: ride.from_location,
    to: ride.to_location,
    date: ride.ride_date,
    time: formatTime24to12(ride.ride_time),
    seatsAvailable: ride.seats_available - ride.seats_booked,
    vehicleModel: ride.vehicle_name ?? "",
    vehicleNumber: ride.vehicle_number ?? "",
  };
}

function apiBookingToRiderBooking(booking: ApiBooking): RiderBooking {
  return {
    id: String(booking.id),
    driverName: booking.driver_name ?? "Driver",
    from: booking.from_location,
    to: booking.to_location,
    date: booking.ride_date,
    time: formatTime24to12(booking.ride_time),
    status:
      booking.status === "approved" || booking.status === "accepted"
        ? "approved"
        : booking.status === "rejected"
          ? "rejected"
          : "pending",
    vehicleModel: booking.vehicle_name ?? undefined,
  };
}

export default function RiderDashboardPage() {
  const [activeTab, setActiveTab] = useState("search");
  const [availableRides, setAvailableRides] = useState<AvailableRide[]>([]);
  const [bookings, setBookings] = useState<RiderBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<AvailableRide | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const fetchRides = async (params?: {
    from_location?: string;
    to_location?: string;
    ride_date?: string;
    ride_time?: string;
  }) => {
    setSearchError(null);
    setLoading(true);
    try {
      const res = await searchRiderRides({ ...params, page: 1, limit: 20 });
      setAvailableRides(
        Array.isArray(res.data) ? res.data.map(apiRideToAvailableRide) : []
      );
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed.");
      setAvailableRides([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await getRiderBookings();
      setBookings(
        Array.isArray(res.data) ? res.data.map(apiBookingToRiderBooking) : []
      );
    } catch {
      // For now, silently ignore booking fetch errors on dashboard load
      setBookings([]);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        setUserName(res.data.user.name);
      } catch {
        // ignore
      }
    };
    fetchRides();
    fetchBookings();
    loadUser();
  }, []);

  const handleSearch = async (values: {
    from: string;
    to: string;
    date: string;
    time: string;
  }) => {
    await fetchRides({
      from_location: values.from || undefined,
      to_location: values.to || undefined,
      ride_date: values.date || undefined,
      ride_time: values.time || undefined,
    });
  };

  const handleRequestSeat = (rideId: string) => {
    const requestedRide = availableRides.find((r) => r.id === rideId);
    if (requestedRide) {
      setSelectedRide(requestedRide);
      setConfirmModalOpen(true);
    }
  };

  const handleConfirmRequest = async () => {
    if (!selectedRide) return;

    // Call API to request a seat
    await requestSeat(selectedRide.id);
    // Refresh bookings from API
    await fetchBookings();
    setConfirmModalOpen(false);
    setSelectedRide(null);
    // Switch to bookings tab
    setActiveTab("bookings");
  };

  const handleCancelRequest = () => {
    setConfirmModalOpen(false);
    setSelectedRide(null);
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-[var(--color-background)] to-[var(--color-mint)]/10 pt-20 pb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <section className="mt-6">
            <div className="bg-surface shadow-soft rounded-3xl px-6 py-8">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase">
                Rider Dashboard
              </p>
              <h1 className="text-heading mt-3 text-3xl font-bold">
                Welcome to your rider dashboard
                {userName ? `, ${userName}` : ""}!
              </h1>
              <p className="text-body mt-2 text-base">
                Search for available rides and manage your bookings all in one
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
                      <TabsTrigger value="search">Search Rides</TabsTrigger>
                      <TabsTrigger value="bookings">
                        <span className="flex items-center gap-2">
                          My Bookings
                          {pendingCount > 0 && (
                            <span className="bg-primary inline-flex h-5 w-5 animate-pulse items-center justify-center rounded-full text-xs font-bold text-[var(--color-white)]">
                              {pendingCount}
                            </span>
                          )}
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="px-6 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="search">
                    <div className="space-y-6">
                      <RiderSearchForm
                        onSearch={handleSearch}
                        loading={loading}
                        disabled={loading}
                      />
                      {searchError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {searchError}
                        </div>
                      )}
                      <div>
                        <h3 className="text-heading mb-4 text-lg font-bold">
                          Available Rides
                        </h3>
                        {loading ? (
                          <p className="text-body py-8 text-center text-sm">
                            Searching...
                          </p>
                        ) : (
                          <RiderAvailableRides
                            rides={availableRides}
                            onRequest={handleRequestSeat}
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="bookings">
                    <RiderBookings bookings={bookings} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </section>
        </div>
      </main>
      <RequestSeatConfirmationModal
        isOpen={confirmModalOpen}
        ride={selectedRide}
        onConfirm={handleConfirmRequest}
        onCancel={handleCancelRequest}
      />
    </>
  );
}
