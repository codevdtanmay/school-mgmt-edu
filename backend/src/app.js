import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import authRoute from "./routes/authRoute.js"
import testRoute from "./routes/testRoute.js"
import studentRoute from "./routes/studentRoute.js"
import feeRoute from "./routes/feeRoute.js";
import tcRoutes from "./routes/tc.route.js";


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use('/api/auth', authRoute),
app.use('/api/test', testRoute),
app.use("/api/tc", tcRoutes);
app.use('/api/student',studentRoute),
app.use("/api/fees", feeRoute);


export default app;