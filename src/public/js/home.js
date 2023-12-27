document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const addToCartBtn = document.getElementById('addToCart');

    addToCartBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const stockInput = document.getElementById('stock');
        const stock = parseInt(stockInput.value) || 1;
        const pid = `${pid}`;
        const cid = `${cid}`; 

        try {
            const response = await fetch(`/api/cart/${cid}/product/${pid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ stock })
            });

            if (response.ok) {
                alert('Producto agregado al carrito correctamente');
            } else {
                alert('Error al agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            alert('Error al agregar el producto al carrito');
        }
    });
});

