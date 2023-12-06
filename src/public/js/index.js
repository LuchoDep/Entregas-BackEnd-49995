const socketClient = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const codeInput = document.getElementById('code');
    const stockInput = document.getElementById('stock');
    const descriptionInput = document.getElementById('description');
    const imageInput = document.getElementById('image'); //placeholder, no integré multer
    const productList = document.getElementById('products-list');
  
    const submitProductForm = (event) => {
        event.preventDefault();

        const nombre = titleInput.value;
        const precio = priceInput.value;
        const codigo = codeInput.value;
        const stock = stockInput.value;
        const descripcion = descriptionInput.value;
        const imagen = imageInput.value;
  
        socketClient.emit('addProduct', { nombre, descripcion, precio, imagen, codigo, stock }); 
        addProductForm.reset();
    };

    addProductForm.addEventListener('submit', submitProductForm);

    socketClient.on('newProduct', (productData) => {
        console.log('Nuevo producto agregado en tiempo real:', productData);
        const listItem = document.createElement('li');
        listItem.textContent += `Nombre: ${productData.nombre}, Precio: ${productData.precio}, Código: ${productData.codigo}, Descripción: ${productData.descripcion}`;
        productList.appendChild(listItem);
    });
});