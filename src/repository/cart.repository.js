class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts() {
        const carts = await this.dao.getCarts({});
        return carts;
    }

    async getCartById(cid) {
        try {
            const cart = await this.dao.getCartById(cid);
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    async createCart({ products, quantity }) {
        try {
            const cart = await this.dao.createCart({ products, quantity });
            return cart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }


    async addProductToCart(uid, cid, pid, quantity) {
        try {
            const result = await this.dao.addProductToCart(uid, cid, pid, quantity);
            return result;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`); 
        }
    }

    async deleteCart(cid) {
        try {
            const deletedCart = await CartModel.findByIdAndDelete(cid);
            return deletedCart;
        } catch (error) {
            throw new Error(`Error al eliminar el carrito: ${error.message}`); 
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const result = await this.dao.deleteProductFromCart(cid, pid);
            return result;
        } catch (error) {
            throw new Error(`Error al quitar el producto: ${error.message}`);
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await this.dao.updateProductQuantity(cid, pid, quantity);
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
        }

    }

}

export default CartRepository;