import userModel from "../dao/models/user.model.js";
import { GetUserDto } from "../dao/dto/userDto.js";
import { UserService } from "../repository/index.js";
import { deletedUserEmail } from "../config/nodemailer.config.js";

export const getUsers = async (req, res) => {
    try {
        const users = await UserService.getUsers()
        res.status(200).send({ status: "success", payload: users })
    } catch (error) {
        res.status(500).send({ status: "error", error: "error encontrando usuarios" })
    }
};

export const getUserById = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await UserService.getUserById(uid);

        res.status(200).json({
            status: "success",
            msg: "Usuario encontrado",
            user: user,
        });
    } catch (error) {
        res.status(404).json({
            status: "error",
            msg: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const newRole = req.body.role
        console.log(uid)
        console.log(newRole)
        const user = await UserService.getUserById(uid)

        if (newRole === user.role) {
            return res.status(404).send({ error: 'No se puede actualizar un usuario con un rol que ya poseia' });

        }

        user.role = newRole
        const result = await UserService.updateUser(uid, user);
        console.log(result)

        return res.status(200).send({ message: 'Usuario actualizado', result });
    } catch (error) {
        return res.status(500).send({ error: 'Error 500.Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await UserService.getUserById(uid)
        const deleteUser = await UserService.deleteUser(user)
        const userDeleted = await deletedUserEmail(user.email);

        res.status(200).send({ status: "success", payload: deleteUser })
    } catch (error) {
        res.status(500).send({ status: "error", error: "error eliminando usuario" })
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const inactiveTime = new Date();
        inactiveTime.setMinutes(inactiveTime.getMinutes() - 10);

        const inactiveUsers = await userModel.find({ last_connection: { $lt: inactiveTime } });

        await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

        inactiveUsers.forEach(async (user) => {
            await deletedUserEmail(user.email);
        });

        res.status(200).json({ status: "success", message: "Usuarios inactivos eliminados correctamente" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "error eliminando usuarios" })
    }
};