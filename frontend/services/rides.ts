const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const RIDES_ENDPOINT = "/api/drivers/rides";
const DRIVER_REQUESTS_ENDPOINT = "/api/drivers/requests";

const buildUrl = (path: string) =>
  API_BASE_URL.length > 0 ? `${API_BASE_URL}${path}` : path;

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

export interface DriverRide {
  id: number;
  driver_id: number;
  vehicle_name: string;
  vehicle_number: string;
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

export type DriverRequestStatus = "pending" | "approved" | "rejected";

export interface DriverRideRequest {
  id: number;
  ride_id: number;
  rider_id: number;
  status: DriverRequestStatus;
  requested_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  vehicle_name: string | null;
  vehicle_number: string | null;
  seats_available: number;
  seats_booked: number;
  rider_name: string;
  rider_email: string;
}

export interface GetDriverRequestsResponse {
  success: boolean;
  data: DriverRideRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateDriverRequestResponse {
  success: boolean;
  message?: string;
  data?: {
    request: DriverRideRequest;
    ride: DriverRide;
  };
}

export interface GetDriverRidesResponse {
  success: boolean;
  data: DriverRide[];
  meta?: {
    counts: { all: number; upcoming: number; completed: number };
  };
}

export interface PostRidePayload {
  vehicle_name: string;
  vehicle_number: string;
  from_location: string;
  to_location: string;
  ride_date: string;
  ride_time: string;
  seats_available: number;
  notes?: string;
}

export interface PostRideResponse {
  success: boolean;
  message?: string;
  data?: DriverRide;
}

export async function postRide(
  payload: PostRidePayload
): Promise<PostRideResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to post a ride.");
  }

  const response = await fetch(buildUrl(RIDES_ENDPOINT), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response) as Promise<PostRideResponse>;
}

export async function getDriverRides(
  filter?: "all" | "upcoming" | "completed"
): Promise<{
  rides: DriverRide[];
  counts: { all: number; upcoming: number; completed: number };
}> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to view your rides.");
  }

  const url =
    filter && filter !== "all"
      ? `${buildUrl(RIDES_ENDPOINT)}?filter=${filter}`
      : buildUrl(RIDES_ENDPOINT);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await handleJsonResponse(response)) as GetDriverRidesResponse;
  const rides = Array.isArray(data.data) ? data.data : [];
  const counts = data.meta?.counts ?? {
    all: rides.length,
    upcoming: 0,
    completed: 0,
  };
  return { rides, counts };
}

export async function getDriverRequests(): Promise<DriverRideRequest[]> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to view ride requests.");
  }

  const response = await fetch(buildUrl(DRIVER_REQUESTS_ENDPOINT), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await handleJsonResponse(
    response
  )) as GetDriverRequestsResponse;

  return Array.isArray(data.data) ? data.data : [];
}

export async function approveDriverRequest(
  requestId: string
): Promise<UpdateDriverRequestResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to update ride requests.");
  }

  const response = await fetch(
    buildUrl(`${DRIVER_REQUESTS_ENDPOINT}/${requestId}/approve`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleJsonResponse(response) as Promise<UpdateDriverRequestResponse>;
}

export async function rejectDriverRequest(
  requestId: string
): Promise<UpdateDriverRequestResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("You must be signed in to update ride requests.");
  }

  const response = await fetch(
    buildUrl(`${DRIVER_REQUESTS_ENDPOINT}/${requestId}/reject`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleJsonResponse(response) as Promise<UpdateDriverRequestResponse>;
}
