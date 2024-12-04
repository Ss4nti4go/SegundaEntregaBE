import express from 'express';
import productManager from '../manager/productManager.js';
const productManagerInstance = new productManager();
const router = express.Router();

// Ruta para renderizar todos los productos
router.get('/realtimeproducts', async (req, res) => {
  try {

    if (!products) {
      throw new Error('No se encontraron productos');
    }
    res.render('realtimeproducts');
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});
router.get('/', async (req, res) => {
  try {
    const products = await productManagerInstance.getProducts();
    if (!products) {
      throw new Error('No se encontraron productos');
    }
    res.status(200).render('home', { products });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`<h1>${error.message}</h1>`);
  }
});
// Ruta para renderizar un producto por id
router.get('/product/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManagerInstance.getProductById(pid);
    res.status(200).render('product', { product });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`<h1>${error.message}</h1>`);

  }
});

export default router;
