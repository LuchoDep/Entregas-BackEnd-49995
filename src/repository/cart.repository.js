class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts() {
        const carts = await this.dao.getCarts({});
        return carts;
    }

    async getCartByID(cid) {
        try {
            const cart = await this.dao.getCartByID(cid);
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


    async addProductInCart(cid, productId, quantity) {
        try {
            const result = await this.dao.addProductInCart(cid, productId, quantity);
            return result;
        } catch (error) {
            throw error;
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
            const cart = await this.dao.findById(cid);
            if (!cart) {

                throw new Error(`El carrito con el ID ${cid} no existe`);
            }

            const productIndex = cart.products.findIndex(prod => prod.product.toString() === pid);

            if (productIndex === -1) {

                throw new Error(`El producto con el ID ${pid} no está en el carrito`);
            }

            cart.products[productIndex].quantity = quantity;

            if (quantity <= 0) {

                cart.products.splice(productIndex, 1);
            }

            await cart.save();

            return cart;

        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
        }

    }

}

export default CartRepository;