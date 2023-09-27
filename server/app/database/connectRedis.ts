import { createClient } from "redis";
export const client = createClient();

export const connectRedis = async () => {
  await client
    .on("error", (err) => console.log("Redis Client Error", err))
    .on("connect", () => console.log("Redis Client connect"))
    .on("ready", () => console.log("Redis Client ready"))
    .connect();
};
