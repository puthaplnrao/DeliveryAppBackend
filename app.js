require("dotenv").config();
const express = require("express");
const commonRoutes = require("./routes/commonRoutes");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const client = require("./routes/client");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./middlewares/requestLogger");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: false,
      message: "Invalid JSON payload",
    });
  }
  next(); // Forward to other error handlers if not a JSON issue
});

app.use("/", commonRoutes);
app.use("/client", client);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || http;
const SERVER = process.env.SERVER || localhost;
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${HTTP_PROTOCOL}://${SERVER}:${PORT}`);
  });
});
