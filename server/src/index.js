import express from "express";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors";

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/test", (req, res) => {
  res, send("Working fine");
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
