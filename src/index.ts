import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

async function main() {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log("✅ Database connection successful.");

    // Add middleware to parse JSON request bodies
    app.use(express.json());
    app.use(cookieParser());

    const corsOptions = {
      origin: 'http://localhost:3001',
      credentials: true,
    };

    app.use(cors(corsOptions));

    // Mount the authentication routes under the /api/auth prefix
    app.use('/api/auth',authRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to connect to the database");
    console.error(error);
    process.exit(1); // Exit the process with an error code
  }
}

main();