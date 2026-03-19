import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});

/* ----- REMOVED FOR DEPLOYMENT ----- */
// base:
//   process.env.NODE_ENV === "production"
//     ? "/TrpTn-Final-Project-Frontend/"
//     : "/",
