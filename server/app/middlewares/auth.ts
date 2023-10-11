/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { AppDataSource } from "../database";
import { User } from "../entities/user.entity";
import { User as IUser } from "../utils/user";

passport.use(
  "authz",
  new Strategy(
    {
      secretOrKey: process.env.JWT_ACCESS_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (payload: IUser, done) => {
      const { userId, role } = payload;
      if (!userId || !role) {
        return done("token is not valid!");
      }
      if (role === "admin") return done(null, payload);
      return done("you dont have permission to do this", false);
    }
  )
);

passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_ACCESS_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: IUser, done) => {
      const { userId, firstName, lastName, role } = payload;
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });
      if (
        !userId ||
        !firstName ||
        !lastName ||
        !role ||
        !user ||
        user.id != userId ||
        user.role != role
      ) {
        return done(null, false);
      }
      return done(null, {
        userId,
        firstName,
        lastName,
        role,
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dasdasdasd",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dasdasdasd",
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    function (_accessToken, _refreshToken, profile, cb) {
      cb(null, {
        userId: Number(profile.id),
        firstName: profile._json.family_name,
        lastName: profile._json.given_name,
        role: "member",
        avatar: profile._json.picture,
        email: profile._json.email,
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(
  (obj: IUser | Profile | Partial<Profile> | Partial<IUser>, done) => {
    done(null, obj);
  }
);

export const verifyToken = () => {
  return passport.authenticate("jwt", { session: false });
};
export const googleAuth = () => {
  return passport.authenticate("google", {
    session: true,
    scope: ["profile", "email"],
  });
};

export const requireAdmin = () => {
  return passport.authorize("authz", { failWithError: false });
};
