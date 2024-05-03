const form = document.getElementById('addProductForm');

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
    .then(response => {
        if (response.status === 200) {
            console.log("producto agregado", obj)
        } else {
            console.log(response);
        }
    })

});

