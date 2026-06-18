import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import testRoute from "./routes/testRoute.js"
import studentRoute from "./routes/studentRoute.js"
import teacherRoute from "./routes/teacherRoute.route.js"
import feeStructureRoute from "./routes/feeStructureRoute.route.js";
import feeRoute from "./routes/feeRoute.route.js";
import dashboardRoute from "./routes/dashboardRoute.js"

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3001', // your React frontend URL
  credentials: true

}));
app.use('/api/auth', authRoute)
app.use('/api/test', testRoute)

app.use('/api/student', studentRoute)
app.use('/api/teachers', teacherRoute)

app.use("/api/fee-structures", feeStructureRoute);
app.use("/api/fees", feeRoute);

app.use("/api/dashboard", dashboardRoute)

export default app;