import express from "express"
import cookieParser from "cookie-parser"
import authRoute from "./routes/authRoute.route.js"
import testRoute from "./routes/testRoute.js"

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute),
app.use('/api/test', testRoute)

export default app;