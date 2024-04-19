import { Router } from "express";
import passport from 'passport';
import { 
    registerUser,
    loginUser,
    logoutUser,
    githubAuthCallback,
    githubAuth, 
    current,
    forgotPassword,
    resetPassword
} from "../controllers/sessions.controller.js";


const router = Router();


router.post("/register", passport.authenticate("register", { failureRedirect: "/api/session/failregister" }), registerUser);

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }), loginUser);

router.get("/logout", logoutUser);

router.get("/github", githubAuth);

router.get("/githubcallback", githubAuthCallback, async (req, res) => {
  req.session.user = req.user;
  res.redirect("/");
});

router.get("/failregister", async (req, res) => {
  console.log('Fallo el registro');
  res.send({ error: 'fallo en el registro' });
});

router.get("/faillogin",(req,res)=>{
  res.send({error:"fail login"})
});

router.get("/current", current );


router.post("/forgot-password", forgotPassword );

router.post("/reset-password", resetPassword );

export default router;
