require('dotenv').config();

// Validate required env vars before starting (prevents 500 on login/signup)
const required = ['DATABASE_URL', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]?.trim());
if (missing.length) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('   Set them in Render → Environment');
  process.exit(1);
}

// Log why the process might exit (uncaught errors)
process.on('uncaughtException', err => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const startServer = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    // Keep process alive; avoid accidental exit
    server.on('error', err => {
      console.error('❌ Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

startServer();
