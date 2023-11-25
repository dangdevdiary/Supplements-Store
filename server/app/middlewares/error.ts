import { Response } from "express";
import { ErrorInterface } from "../utils/error";

const err = (err: ErrorInterface, res: Response) => {
  return res.status(err.statusCode).json({ error: err.error });
};

export default err;
