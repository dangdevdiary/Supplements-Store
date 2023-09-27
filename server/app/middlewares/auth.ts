/* eslint-disable @typescript-eslint/no-unsafe-return */
import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppDataSource } from "../database";
import { User } from "../entities/user.entity";
enum jwtError {
  expired = "Token has expried!",
  invalid = "Token is not valid!",
}
passport.use(
  "authz",
  new Strategy(
    {
      secretOrKey: process.env.JWT_ACCESS_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (payload, done) => {
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
    async (
      payload: {
        userId: number;
        firstName: string;
        lastName: string;
        role: string;
      },
      done
    ) => {
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
        return done(
          {
            status: 401,
            message: jwtError.invalid,
          },
          false
        );
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

export const verifyToken = () => {
  return passport.authenticate("jwt", { session: false });
};

export const require_admin = () => {
  return passport.authorize("authz", { failWithError: false });
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      userId: number;
      firstName: string;
      lastName: string;
      role: string;
    }
  }
}
