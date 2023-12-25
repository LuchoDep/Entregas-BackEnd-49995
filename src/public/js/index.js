const socketClient = io();

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const codeInput = document.getElementById('code');
    const stockInput = document.getElementById('stock');
    const descriptionInput = document.getElementById('description');
    const thumbnailInput = document.getElementById('thumbnail'); //placeholder, no integré multer
    const productList = document.getElementById('products-list');
  
    const submitProductForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;
        const price = priceInput.value;
        const code = codeInput.value;
        const stock = stockInput.value;
        const description = descriptionInput.value;
        const thumbnail = thumbnailInput.value;
  
        socketClient.emit('addProduct', { title, description, price, thumbnail, code, stock }); 
        addProductForm.reset();
    };

    addProductForm.addEventListener('submit', submitProductForm);

    socketClient.on('newProduct', (productData) => {
        console.log('Nuevo producto agregado en tiempo real:', productData);
        const listItem = document.createElement('li');
        listItem.textContent += `Nombre: ${productData.title}, Precio: ${productData.price}, Código: ${productData.code}, Descripción: ${productData.description}`;
        productList.appendChild(listItem);
    });
});