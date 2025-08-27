const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/leaves", require("./routes/leaves"));
app.use("/api/dropdowns", require("./routes/dropdowns"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`D-Nothi API running on port ${PORT}`));
