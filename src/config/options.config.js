import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

export const options = {
    server:{
        port: process.env.PORT
    },
    mongo:{
        url: process.env.MONGO_URL
    }
};