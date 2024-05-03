import userModel from "../dao/models/user.model.js";
import { UserService } from "../repository/index.js";
import { deletedUserEmail } from "../config/nodemailer.config.js";

export const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsers();
        req.logger.info("Obteniendo usuarios con éxito");
        res.status(200).json({
            status: "success",
            users: users
        });
    } catch (error) {
        const formattedError = customizeError('FETCHING_USERS', error.message, userErrorDictionary);
        req.logger.error(`Error al obtener usuarios: ${formattedError}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await UserService.getUserById(uid);

        req.logger.info("Usuario encontrado con éxito");
        res.status(200).json({
            status: "success",
            msg: "Usuario encontrado",
            user: user,
        });
    } catch (error) {
        const formattedError = customizeError('FETCHING_USER_BY_ID', error.message, userErrorDictionary);
        req.logger.error(`Error al obtener usuario: ${formattedError}`);
        res.status(404).json({
            status: "error",
            msg: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const updateData = req.body;
        const user = await UserService.getUserById(uid);

        if (!uid) {
            return res.status(400).json({ error: "No encontró el usuario" })
        }

        const updatedUser = await UserService.updateUser(user, updateData);
        res.status(200).json({
            status: "success",
            msg: `Usuario actualizado, ID: ${uid}`,
            user: updatedUser.msg,
        });
    } catch (error) {
        const formattedError = customizeError('UPDATE_USER', error.message, userErrorDictionary);
        req.logger.error(`Error al actualizar usuario: ${formattedError}`);
        res.status(404).json({
            status: "error",
            msg: error
        });
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const tenMinutesAgo = new Date();
        tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

        const inactiveUsers = await userModel.find({ last_connection: { $lt: tenMinutesAgo } });

        await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

        inactiveUsers.forEach(async (user) => {
            await deletedUserEmail(user.email);
        });

        res.status(200).json({ status: "success", message: "Usuarios inactivos eliminados correctamente" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "error eliminando usuarios" })
    }
};