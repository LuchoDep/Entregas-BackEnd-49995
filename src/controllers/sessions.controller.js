import passport from "passport";
import { GetUserDto } from "../dao/dto/userDto.js";
import userModel from "../dao/models/user.model.js";
import { sendRecoveryPass, verifyEmailToken, generateEmailToken } from "../config/nodemailer.config.js";

export const registerUser = async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" });
};

export const loginUser = async (req, res) => {

    if (!req.user) {
        res.status(400).send();
        return;
    }
    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
    };

    console.log(`carrito desde sessions.controller`, cart);

    res.send({ status: "success", payload: req.user });
};

export const logoutUser = async(req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({
                status: "error",
                error: "Error al cerrar sesión",
            });
        }

        res.redirect("/login");
    });
};

export const current = async (req, res) => {
    try {
        if (req.session && req.session.user) {
            const userDTO = new GetUserDto(req.session.user);
            res.status(200).json({
                status: "success",
                user: userDTO
            });
        } else {
            res.status(401).json({
                status: "error",
                message: "No hay sesión de usuario activa"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener el usuario actual"
        });
    }
};

export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.send(`<div>Error no existe el usuario, vuelva a intentar: <a href="/forgot-password">Intente de nuevo</a></div>`)
        }
        const token = generateEmailToken(email, 60 * 3);
        console.log(Object);
        await sendRecoveryPass(email, token);
        res.send("Se envio el correo de recuperacion.")
    } catch (error) {
        res.send(`<div>Error,<a href="/forgot-password">Intente de nuevo</a></div>`)
    }
};

export const resetPassword = async (req, res) => {
    try {
        const token = req.query.token;
        const { email, newPassword } = req.body;
        const validToken = verifyEmailToken(token);
        if (!validToken) {
            return res.send(`El token ya no es válido`);
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.send("El usuario no está registrado");
        }

        const newPasswordHashed = createHash(newPassword);
        user.password = newPasswordHashed;
        await user.save();

        res.render("login", { message: "Contraseña actualizada" });
        console.log("Contraseña actualizada");
    } catch (error) {
        console.log(error);
        res.send(`<div>Error, hable con el administrador.</div>`);
    }
};

export const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

export const githubAuthCallback = passport.authenticate("github", { failureRedirect: "/login" });

export const failRegister = async (req, res) => {
    res.send({ error: "Error al registrarse" });
};

export const failLogin = (req, res) => {
    res.send({ error: "Error al iniciar sesión" });
};
