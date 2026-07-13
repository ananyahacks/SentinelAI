const express= require('express');
const cors= require('cors')
const cookieParser= require('cookie-parser')
const authRoutes= require('./routes/auth.routes')
const userRoutes=require('./routes/user.routes')
const activityRoutes= require('./routes/activity.routes')
const anomalyRoutes = require("./routes/anomaly.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const riskRoutes = require("./routes/risk.routes");

const app= express();
app.use(express.json());
app.use(cors());


app.use(cookieParser())


app.use("/api/risk", riskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/anomaly", anomalyRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/activity',activityRoutes)
module.exports= app;



