import userModel from "../models/user.model.js";

class userManagerDb {

    async getUsers() {
        
        try {
          const users = await userModel.find({});
          return { status: "success", msg: "Usuarios encontrados", users: users };
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
          throw { status: "error", msg: "Error al obtener usuarios" };
        }
      }
  
    async createUser(userData) {
        try {
            const user = await userModel.create(userData);
            return user;
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

   
    async getUserById(uid) {
        try {
            const user = await userModel.findById(uid);
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    }

    
    async getUserByEmail(email) {
        try {
            const user = await userModel.findOne({ email });
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario por correo electrónico: ${error.message}`);
        }
    }

    
    async updateUser(uid, newData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(uid, newData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    }

    async deleteUser(uid) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(uid);
            return deletedUser;
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    }
}

export default userManagerDb;