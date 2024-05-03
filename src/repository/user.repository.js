import { CreateUserDto, GetUserDto } from "../dao/dto/userDto.js";

class UserRepository {
	constructor(dao) {
		this.dao = dao
	}

	async getUsers() {
		const users = await this.dao.getUsers();
        return users
	}

	async getUserById(uid) {
		try {
			const user = await this.dao.getUserById(uid);
			if (!user) {
				throw new Error(`No se encontró ningún usuario con el ID ${uid}`);
			}
			const userDTO = new CreateUserDto(user);
			const userDtoFront = new GetUserDto(userDTO);
			return userDtoFront;
		} catch (error) {
			throw new Error(`Error al obtener el usuario: ${error.message}`);
		}
	}

	async getUserByEmail(email) {
		try {
			const user = await this.dao.getUserByEmail(email);
			return user;
		} catch (error) {
			throw new Error(`Error al buscar usuario por email: ${error.message}`);
		}
	}

	async updateUser(userId, updatedUserData) {
		try {
		  return await this.dao.updateUser(userId, updatedUserData);
		} catch (error) {
		  throw new Error(`Error al actualizar el usuario: ${error.message}`);
		}
	  }
	
	  async deleteUser(userId) {
		try {
		  return await this.dao.deleteUser(userId);
		} catch (error) {
		  throw new Error(`Error al eliminar el usuario: ${error.message}`);
		}
	  }

}

export default UserRepository;