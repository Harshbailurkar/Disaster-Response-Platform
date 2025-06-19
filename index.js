const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());
global.io = io;

// Load Routes
app.use("/disasters", require("./routes/disasters"));
app.use("/verify", require("./routes/verifyImage"));
app.use("/resources", require("./routes/resources"));
app.use("/disasters", require("./routes/socialMedia"));
app.use("/reports", require("./routes/reports"));
app.use("/disasters", require("./routes/updates"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
io.on("connection", (socket) => {
  console.log("WebSocket connected");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started at ${PORT}`));
