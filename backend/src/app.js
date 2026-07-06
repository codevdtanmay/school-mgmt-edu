import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";
import studentRoute from "./routes/studentRoute.js";
import transportRoutes from "./routes/transport.route.js";

import teacherRoute from "./routes/teacherRoute.route.js";
import feeStructureRoute from "./routes/feeStructureRoute.route.js";
import feeRoute from "./routes/feeRoute.route.js";
import dashboardRoute from "./routes/dashboardRoute.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true
  })
);

// Authentication
app.use("/api/auth", authRoute);

// Test
app.use("/api/test", testRoute);

// Students
app.use("/api/student", studentRoute);

// Transport
app.use("/api/transports", transportRoutes);

// Teachers
app.use("/api/teachers", teacherRoute);

// Fee Structure
app.use("/api/fee-structures", feeStructureRoute);

// Fee Module
app.use("/api/fees", feeRoute);

// Dashboard
app.use("/api/dashboard", dashboardRoute);

export default app;