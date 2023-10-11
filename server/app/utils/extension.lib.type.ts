import { Profile } from "passport-google-oauth20";
import { User } from "./user";

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: User | Profile;
  }
}
