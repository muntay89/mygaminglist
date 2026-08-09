// env.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");

// if (process.env.NODE_ENV !== "production") {
//   const dotenv = await import("dotenv")
//   dotenv.config()
//   const result = dotenv.config({ path: envPath });
// }
const result = dotenv.config({ path: envPath });

