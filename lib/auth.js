
import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

import { client, db } from "../config/db.js";

export const createAuth = ({ allowSignUp = true } = {}) => {
  return betterAuth({
    appName: "VAYRO",

    database: mongodbAdapter(db, {
      client,
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    trustedOrigins: [
      process.env.CLIENT_URL,
    ],

    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
    },

    plugins: [
      admin(),
    ],
  });
};

// Public Signup is disabled by default
export const auth = createAuth();
