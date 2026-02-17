const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const SEARCH_ENDPOINT = "/api/riders/rides/search";
const REQUEST_SEAT_ENDPOINT = (rideId: string) =>
  `/api/riders/rides/${rideId}/requests`;
const BOOKINGS_ENDPOINT = "/api/riders/bookings";

const buildUrl = (path: string, params?: Record<string, string>) => {
  const base = API_BASE_URL.length > 0 ? `${API_BASE_URL}${path}` : path;
  if (!params || Object.keys(params).length === 0) return base;
  const search = new URLSearchParams(params).toString();
  return `${base}?${search}`;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("carconnect_token");
}

async function handleJsonResponse(response: Response) {
  const data = await response
    .json()
    .catch(() => ({ message: "Unexpected response from server." }));

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

export interface ApiRide {
  id: number;
  driver_id: number;
  vehicle_name: string | null;
  vehicle_number: string | null;
  driver_name: string | null;
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  seats_available: number;
  seats_booked: number;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SearchRidesParams {
  from_location?: string;
  to_location?: string;
  ride_date?: string;
  ride_time?: string;
  page?: number;
  limit?: number;
}

export interface SearchRidesResponse {
  success: boolean;
  data: ApiRide[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function searchRiderRides(
  params: SearchRidesParams = {}
): Promise<SearchRidesResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to search rides.");
  }

  const queryParams: Record<string, string> = {};
  if (params.from_location?.trim())
    queryParams.from_location = params.from_location.trim();
  if (params.to_location?.trim())
    queryParams.to_location = params.to_location.trim();
  if (params.ride_date?.trim()) queryParams.ride_date = params.ride_date.trim();
  if (params.ride_time?.trim()) queryParams.ride_time = params.ride_time.trim();
  if (params.page != null) queryParams.page = String(params.page);
  if (params.limit != null) queryParams.limit = String(params.limit);

  const response = await fetch(buildUrl(SEARCH_ENDPOINT, queryParams), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleJsonResponse(response) as Promise<SearchRidesResponse>;
}

export interface RequestSeatResponse {
  success: boolean;
  data: {
    id: number;
    ride_id: number;
    rider_id: number;
    status: string;
    requested_at: string;
    approved_at: string | null;
    rejected_at: string | null;
  };
}

export async function requestSeat(
  rideId: string
): Promise<RequestSeatResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to request a seat.");
  }

  const response = await fetch(buildUrl(REQUEST_SEAT_ENDPOINT(rideId)), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleJsonResponse(response) as Promise<RequestSeatResponse>;
}

export interface ApiBooking {
  id: number;
  ride_id: number;
  rider_id: number;
  status: string;
  requested_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  vehicle_name: string | null;
  vehicle_number: string | null;
  driver_id: number;
  driver_name: string | null;
}

export interface GetRiderBookingsParams {
  status?: "pending" | "approved" | "rejected" | "accepted";
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface GetRiderBookingsResponse {
  success: boolean;
  data: ApiBooking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getRiderBookings(
  params: GetRiderBookingsParams = {}
): Promise<GetRiderBookingsResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to view your bookings.");
  }

  const queryParams: Record<string, string> = {};
  if (params.status) queryParams.status = params.status;
  if (params.from_date) queryParams.from_date = params.from_date;
  if (params.to_date) queryParams.to_date = params.to_date;
  if (params.page != null) queryParams.page = String(params.page);
  if (params.limit != null) queryParams.limit = String(params.limit);

  const response = await fetch(buildUrl(BOOKINGS_ENDPOINT, queryParams), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleJsonResponse(response) as Promise<GetRiderBookingsResponse>;
}
