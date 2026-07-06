import express from "express"
import cookieParser from "cookie-parser"
import authRoute from "./routes/authRoute.js"
import testRoute from "./routes/testRoute.js"
import studentRoute from "./routes/studentRoute.js"
import transportRoutes from "./routes/transport.route.js";

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute),
app.use('/api/test', testRoute),

app.use('/student',studentRoute)
app.use("/api/transports", transportRoutes);

export default app;