import * as auth from "../controllers/auth.controller";
import express, { Express } from "express";
import * as authMiddleware from "../middlewares/auth";
import passport from "passport";

export const AuthRoutes = (app: Express) => {
  const router = express.Router();

  router.post("/", auth.login);
  router.get(
    "/",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    auth.testLogin
  );
  router.post("/logout", authMiddleware.verifyToken(), auth.logOut);

  router.get("/google", authMiddleware.googleAuth());

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/api/auth/google/fail",
      successRedirect: "http://localhost:3001/login/google/success",
    })
  );
  router.get("/google/fail", (req, res) => {
    res.status(400).json({
      status: "fail",
      data: null,
    });
  });
  router.get("/google/success", auth.loginSuccessGoogle);

  // router.get("/test-redirect", (req, res) => {
  //   console.log(req.headers.cookie);
  //   // res.redirect("https://www.programiz.com/javascript/online-compiler/");
  //   return res.json({
  //     data: req.user,
  //   });
  // });

  app.use("/api/auth", router);
};
