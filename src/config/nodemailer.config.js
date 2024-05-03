import nodemailer from "nodemailer"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { options } from "./options.config.js";

const ADMIN_USER = options.admin.user;
const ADMIN_PASS = options.admin.password;

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

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`
    await transporter.sendMail({
        from: ADMIN_USER,
        to: userEmail,
        subject: "Restablecimiento de contraseña",
        html: `
        <div>
            <h2>Has solicitado un cambio de contraseña</h2>
            <p>Haz click en el siguiente enlace para restablecer la contraseña</p>
            <a href="${link}">
                <button>Restablecer contraseña</button>
            </a>
        </div>`
    })
};

export const deletedUserEmail = async (userEmail) => {
    const link = `http://localhost:8080/register`
    await transporter.sendMail({
        from: ADMIN_USER,
        to: userEmail,
        subject: "Cuenta eliminada por inactividad",
        html: `
        <div>
            <h2>Tu cuenta ha sido eliminada por inactividad</h2>
            <p>Haz click en el siguiente enlace para crearla de nuevo</p>
            <a href="${link}">
                <button>Crear cuenta</button>
            </a>
        </div>`
    })
};

export const deletedProductEmail = async (userEmail, productData) =>{
    const link = `http://localhost:8080/login`
    const {title,description,code,_id} = productData
    await transporter.sendMail({
        from: ADMIN_USER,
        to: userEmail,
        subject: `El producto que usted ha publicado con el nombre ${title} ha sido eliminado`,
        html: `
        <div>
            <h2>Su producto con el nombre ha sido eliminado</h2>
            <h3>Detalle del producto:</h3>
            <p>Nombre: ${title}
            Descripcion:${description}
            Codigo:${code}
            ID: ${_id}
            </p>
            <p>Haz click en el siguiente enlace para iniciar sesion y publicarlo de nuevo.</p>
            <a href="${link}">
                <button>Crear producto</button>
            </a>
        </div>`
    })
};

export const ticketEmail = async (userEmail, ticket) =>{
    const link = `http://localhost:8080/login`
    
    await transporter.sendMail({
        from: ADMIN_USER,
        to: userEmail,
        subject: `Compra realizada`,
        html: `
        <div>
            <h2>Detalle de la compra:</h2>
            <p><strong>Fecha:</strong>${ticket.purchase_datetime}</p>
            <p><strong>Codigo del ticket:</strong> ${ticket.code}</p>
            <p><strong>Comprador:</strong> ${ticket.purchaser}</p>
        </div>`
    })
};