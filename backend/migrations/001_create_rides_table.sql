-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_name VARCHAR(255) NOT NULL,
  vehicle_number VARCHAR(50) NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  ride_date DATE NOT NULL,
  ride_time TIME NOT NULL,
  seats_available INTEGER NOT NULL,
  seats_booked INTEGER DEFAULT 0,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for common lookups
CREATE INDEX idx_rides_driver_id ON rides(driver_id);
CREATE INDEX idx_rides_ride_date ON rides(ride_date);
CREATE INDEX idx_rides_status ON rides(status);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_rides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rides_updated_at
  BEFORE UPDATE ON rides
  FOR EACH ROW
  EXECUTE PROCEDURE update_rides_updated_at();
