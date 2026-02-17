-- Create ride_requests table (booking lifecycle: pending → approved/rejected)
CREATE TABLE IF NOT EXISTS ride_requests (
  id SERIAL PRIMARY KEY,
  ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  rider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  rejected_at TIMESTAMP NULL,
  UNIQUE (ride_id, rider_id)
);

-- Indexes for common lookups
CREATE INDEX idx_ride_requests_ride_id ON ride_requests(ride_id);
CREATE INDEX idx_ride_requests_rider_id ON ride_requests(rider_id);
CREATE INDEX idx_ride_requests_status ON ride_requests(status);
