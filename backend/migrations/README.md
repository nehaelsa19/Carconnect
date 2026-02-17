# Create tables (migrations)

Run the SQL files **in order**: `users` → `rides` → `ride_requests` (each table may reference the previous ones).

---

## Option A: pgAdmin

1. **Open pgAdmin** and connect to your server. Select your database (the one in `DATABASE_URL`).

2. **Open Query Tool**  
   Right‑click the database → **Query Tool**.

3. **Run each migration in order:**
   - **First:** Open `000_create_users_table.sql`, copy all, paste in Query Tool, run (F5 or Play).
   - **Second:** Open `001_create_rides_table.sql`, copy all, paste in Query Tool, run.
   - **Third:** Open `002_create_ride_requests_table.sql`, copy all, paste in Query Tool, run.

4. **Done.**  
   Tables `users`, `rides`, and `ride_requests` exist. The `User`, `Ride`, and `RideRequest` models use them.

---

## Option B: Command line (psql)

From the backend folder, run each file in order (replace `your_database_name` with your actual DB name, or use `DATABASE_URL`):

```bash
cd "CarConnect Backend/carconnect-be"
psql your_database_name -f migrations/000_create_users_table.sql
psql your_database_name -f migrations/001_create_rides_table.sql
psql your_database_name -f migrations/002_create_ride_requests_table.sql
```

If you use a connection URL:

```bash
psql "$DATABASE_URL" -f migrations/000_create_users_table.sql
psql "$DATABASE_URL" -f migrations/001_create_rides_table.sql
psql "$DATABASE_URL" -f migrations/002_create_ride_requests_table.sql
```
