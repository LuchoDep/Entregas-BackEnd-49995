import { Router } from "express";
import passport from 'passport';


const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failregister' }), async (req, res) => {
    res.send({status:"success", message:"User registrado"});
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) {
        res.status(400).send();
    };

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    };
    res.send({ status: "success", payload: req.user });

});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                error: 'Error al cerrar sesión'
            });

        };

        res.redirect('/login');

    });

});

router.get("/github", passport.authenticate("github", {scope:['user:email']}), async (req,res)=>{});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:'/login'}), async (req,res)=>{
    req.session.user = req.user;
    res.redirect("/")
});

router.get("/failregister", async (req,res)=>{
    res.send({error: 'Error al registrarse'});
});

router.get("/faillogin", (req,res)=>{
    res.send({error: 'Error al iniciar sesion'});
});

export default router;