import { Router } from "express";
import passport from 'passport';
import { 
    registerUser,
    loginUser,
    logoutUser,
    failRegister,
    failLogin,
    githubAuthCallback,
    githubAuth 
} from "../controllers/sessions.controller.js"


const router = Router();


router.post("/register", passport.authenticate("register", { failureRedirect: "/api/session/failregister" }), registerUser);

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }), loginUser);

router.get("/logout", logoutUser);

router.get("/github", githubAuth);

router.get("/githubcallback", githubAuthCallback, async (req, res) => {
  req.session.user = req.user;
  res.redirect("/");
});

router.get("/failregister", failRegister);

router.get("/faillogin", failLogin);

export default router;
