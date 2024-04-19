import { Router } from "express";
import {
    products,
    realTimeProducts,
    home,
    chat,
    register,
    profile,
    login,
    forgotPassword,
    resetPassword
} from "../controllers/views.controller.js";

const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

router.get('/products', privateAccess, products);

router.get('/', privateAccess, realTimeProducts);

router.get('/', privateAccess, home);

router.get("/chat", publicAccess, chat);

router.get('/register', publicAccess, register);

router.get('/login', publicAccess, login);

router.get('/profile', privateAccess, profile);

router.get(`/forgot-password`, forgotPassword);

router.get(`/reset-password`, resetPassword);

export default router