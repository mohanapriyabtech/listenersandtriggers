import express from "express";
import { connectDB } from "./config/db";
import { router } from "./router/router";
import http from "http";
import { socket } from "./config/socket";


const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
const server = http.createServer(app);


connectDB();
socket(server)

app.use("/", router);

server.listen(PORT, () => {
  console.log("Server is up and running " + PORT);
});

module.exports = app;
