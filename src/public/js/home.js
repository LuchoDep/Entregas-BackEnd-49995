// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('productForm');
//     const addToCart = document.getElementById('addToCart');

//     addToCart.addEventListener('click', async (event) => {
//         event.preventDefault();

//         const quantityInput = document.getElementById('stock');
//         const quantity = parseInt(quantityInput.value) || 1;
//         const pid = document.getElementById('pid').value;
//         const cid = document.getElementById('cid').value;
         

//         try {
//             const response = await fetch(`/api/cart/${cid}/product/${pid}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ quantity })
//             });

//             if (response.ok) {
//                 alert('Producto agregado al carrito correctamente');
//             } else {
//                 alert('Error al agregar el producto al carrito');
//             }
//         } catch (error) {
//             console.error('Error al agregar el producto al carrito:', error);
//             alert('Error al agregar el producto al carrito');
//         }
//     });
// });

