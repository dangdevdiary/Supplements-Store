import jwt from "jsonwebtoken";
import { client } from "../database/connectRedis";
interface ItokenValue {
  userId: number;
  firstName: string;
  lastName: string;
  role: string;
  iat?: number;
  exp?: number;
}
export const signAccessToken = async (user: ItokenValue): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_ACCESS_KEY || "dangdevdiary",
      {
        expiresIn: "3h",
      },
      (err, token) => {
        if (err || !token) {
          reject(err);
        } else resolve(token);
      }
    );
  });
};
export const signRefreshToken = async (user: ItokenValue): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_REFRESH_KEY || "dangdevdiary",
      {
        expiresIn: "1y",
      },
      async (err, token) => {
        if (err || !token) {
          reject(err);
        } else {
          await client
            .set(user.userId.toString(), token, {
              EX: 365 * 24 * 60 * 60,
            })
            .catch((err) => {
              reject(err);
            });
          resolve(token);
        }
      }
    );
  });
};

export const verifyRefreshToken = async (
  refreshToken: string
): Promise<ItokenValue | null> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY || "dangdevdiary",
      async (err, payload) => {
        try {
          if (err) {
            return reject(err);
          }
          if (payload) {
            const userId = (payload as ItokenValue).userId;
            if (!userId) return reject("user id not found");
            await client
              .get(userId.toString())
              .then((rep) => {
                if (rep === refreshToken)
                  return resolve(payload as ItokenValue);
              })
              .catch((err) => {
                return reject(err);
              });
          }
          return reject("Unauthorized");
        } catch (error) {
          return reject(error);
        }
      }
    );
  });
};
