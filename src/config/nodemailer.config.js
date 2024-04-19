import nodemailer from "nodemailer"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { options } from "./options.config.js";

const ADMIN_USER = options.admin.user
const ADMIN_PASS = options.admin.pass

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: ADMIN_USER,
        pass: ADMIN_PASS
    },
    secure: false,
    tls: { rejectUnauthorized: false }
});

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`
    await transporter.sendMail({
        from: options.gmail.ADMIN_USER,
        to: userEmail,
        subject: "Restablecimiento de contraseña",
        html: `
        <div>
            <h2>Has solicitado un cambio de contraseña</h2>
            <p>Haz click en el siguiente enlace para restablecer la contraseña</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
            <h1>Por favor, siempre chequea que el origen de estos emails sea del dueño y/o creador de la pagina que tratas de cambiar la contraseña. Ademas, ten en cuenta que nunca te pediremos informacion sensible a traves de email u otro entorno que no sea el de la plataforma oficial. Ten precaucion.</h1>
        </div>`
    })
}

export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
};

export const generateEmailToken = (email,expireTime)=>{
    const token = jwt.sign({email},ADMIN_PASS,{expiresIn:expireTime}); 
    return token;
};

export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token,ADMIN_PASS);
        console.log(info);
        return info.email;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};