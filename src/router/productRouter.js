import express from 'express';
import ProductManager from '../manager/productManager.js';
const productManagerInstance = new ProductManager();
const router = express.Router();


// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await productManagerInstance.getProducts();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor al obtener los productos');
    }
});

// Ruta para obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = await productManagerInstance.getProductById(pid);

        res.status(200).json(producto);
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${pid}:`, error);
        res.status(404).send(error.message);
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const nuevoProducto = await productManagerInstance.addProduct(productData);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(400).send(error.message);
    }
});

// Ruta para actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    try {
        const productoActualizado = await productManagerInstance.updateProduct(pid, updatedData);
        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error(`Error al actualizar el producto con ID ${pid}:`, error);
        res.status(400).send(error.message);
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        await productManagerInstance.deleteProduct(pid);
        res.status(200).send(`Producto con ID ${pid} eliminado exitosamente`);
    } catch (error) {
        console.error(`Error al eliminar el producto con ID ${pid}:`, error);
        res.status(404).send(error.message);
    }
});

export default router;
