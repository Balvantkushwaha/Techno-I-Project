import express from "express";
import cors from "cors";
import mainRoutes from "./modules/index.js" // Import module router
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Sabhi feature routes yahan se handle honge
// Example URL: http://localhost:5000/api/v1/
app.use("/api/v1", mainRoutes);



app.get("/", (req, res) => {
  res.send("Lenskart Clone API is running with Modular Structure...");
});

export default app;