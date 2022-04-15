import bcrypt from "bcryptjs";
import {
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
