const socket = io();
   const idInput = document.getElementById('productId');
  // Escuchar cuando se actualiza la lista de productos
 
    socket.on('updateProducts', async (data) => {
      const productList = document.getElementById('productList');
      const productos = data || [];
      console.log(productos );
      productList.innerHTML = ''; // Limpiar la lista antes de agregar los productos actualizados

      productos.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('product-card');
        li.innerHTML = `
          <strong>${producto.title}</strong> - $${producto.price} <br>
          <small>${producto.description}</small><br>
          Código: ${producto.code} <br>
          Estado: ${producto.status} <br>
          Stock: ${producto.stock} <br>
          Categoría: ${producto.category} <br>
          <div>
            ${producto.thumbnails.map(thumbnail => `<img src="${thumbnail}" alt="Thumbnail de ${producto.title}" width="100" height="100">`).join('')}
          </div>
           ID: ${producto.id}
        `;
        productList.appendChild(li);
      });
    });
    function addProduct() {
    const title = document.getElementById('productTitle').value;
    const description = document.getElementById('productDescription').value;
    const code = document.getElementById('productCode').value;
    const price = document.getElementById('productPrice').value;
    const status = document.getElementById('productStatus').checked;
    const stock = document.getElementById('productStock').value;
    const category = document.getElementById('productCategory').value;
    const thumbnails = [
      document.getElementById('productThumbnail1').value,
      document.getElementById('productThumbnail2').value
    ];

    socket.emit('newProduct', { title, description, code, price, status: status || "off", stock, category, thumbnails });
  }

  function deleteProduct() {
    socket.emit('deleteProduct', { id: idInput.value });
  }