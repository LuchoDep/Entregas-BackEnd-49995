import productModel from "../dao/models/product.model.js";
import ProductRepository from "../repository/product.repository.js";
import cartModel from "../dao/models/carts.model.js";
import { UserService } from "../repository/index.js";
import { GetUserDto } from "../dao/dto/userDto.js";
import { options } from "../config/options.config.js";
import { ticketsModel } from "../dao/models/ticket.model.js";
import userModel from "../dao/models/user.model.js";

const ADMIN_USER = options.admin.user;

const renderProducts = async (req, res, viewName) => {
    try {
        const { limit, page, sort, query, category } = req.query;

        const sortObjectMapper = {
            asc: { price: 1 },
            desc: { price: -1 },
        };

        const sortOption = sort ? sortObjectMapper[sort] : undefined;

        const modelQuery = query ? { $text: { $search: query } } : {};

        if (category) {
            modelQuery.category = category;
        }

        const modelLimit = limit ? parseInt(limit, 9) : 9;
        const modelPage = page ? parseInt(page, 10) : 1;

        const products = await productModel.paginate(modelQuery, {
            limit: modelLimit,
            page: modelPage,
            sort: sortOption,
        });

        if (products.docs.length === 0) {
            return res.status(404).json({ error: 'No se encontraron resultados' });
        }

        const uid = req.session.user.email;
        const user = await UserService.getUserByEmail(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        let cid = null;
        if (user.cart) {
            cid = user.cart._id;
        }

        if (!cid) {
            return res.status(404).send('Carrito no encontrado para este usuario');
        }
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render(viewName, { products, cart, user: req.session.user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Hubo un problema al obtener los productos' });
    }
};

export const products = async (req, res) => {
    await renderProducts(req, res, "home");
};

export const realTimeProducts = async (req, res) => {
    await renderProducts(req, res, "realTimeProducts");
};

export const home = async (req, res) => {
    try {
        const products = await ProductRepository.getProducts();
        res.render('home', { products, user: req.session.user });
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
};

export const chat = (req, res) => {
    res.render('chat', {});
};

export const register = (req, res) => {
    res.render('register');
};

export const login = (req, res) => {
    res.render('login');
};

export const profile = async (req, res) => {
    try {
        const uid = req.session.user.email;
        const user = await UserService.getUserByEmail(uid);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        let cid = null;
        if (user.cart) {
            cid = user.cart._id;
        }

        if (!cid) {
            return res.status(404).send('Carrito no encontrado para este usuario');
        }

        const cart = await cartModel.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('profile', { user: req.session.user, cart, products: cart.products });
    } catch (error) {
        console.error(`Error al obtener el perfil del usuario: ${error.message}`);
        res.status(500).send('Error interno del servidor');
    }
};

export const ticketView = async (req, res) => {
    try {
        const purchaser = req.session.user.email;

        const tickets = await ticketsModel.find({ purchaser: purchaser }).populate('products.product');
        // console.log(`Tickets encontrados:`, tickets);

        res.render('ticket', { tickets });
    } catch (error) {
        console.error(`Error al obtener el ticket: ${error.message}`);
        res.status(500).send('Error interno del servidor');
    }
};

export const forgotPassword = async (req, res) => {
    res.render("forgotPassword")
};

export const resetPassword = async (req, res) => {
    const token = req.query.token;
    res.render("resetPassword", { token })
};

export const adminUser = async (req, res) => {
    try {
        const users = await userModel.find();
        const admin = req.user;
        const adminEmail = ADMIN_USER; 

        if (admin.email === adminEmail) {
            const adminUser = users.find(user => user.email === adminEmail);
            if (adminUser) {
                adminUser.role = 'admin';
                await adminUser.save();
            }
        }

        res.render("adminUsers", { admin, users });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener usuarios");
    }
};

export const addProducts = async (req, res) => {
    res.render(`addProducts`)
};