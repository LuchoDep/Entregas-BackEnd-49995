import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const ADMIN_USER = process.env.ADMIN_USER
const ADMIN_PASS = process.env.ADMIN_PASS

export const options = {
    server:{
        port: process.env.PORT
    },
    mongo:{
        url: process.env.MONGO_URL
    },
    admin:{
        user: ADMIN_USER,
        password: ADMIN_PASS
    }
};