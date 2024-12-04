import express from 'express';
import CartManager from '../manager/cartManager.js';

const router = express.Router();
const cartManager = new CartManager();

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carritos = await cartManager.readCarritos();
        if (!carritos || carritos.length === 0) {
            return res.status(404).send('No se encontraron carritos en la base de datos');
        }
        res.status(200).json(carritos);
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).send('Error interno del servidor al obtener los carritos');
    }
});

// Ruta para obtener un carrito por id
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carrito = await cartManager.getCartById(parseInt(cid));
        if (!carrito) {
            return res.status(404).send(`Carrito con ID ${cid} no encontrado`);
        }
        res.json(carrito);
    } catch (error) {
        console.error(`Error al obtener el carrito con ID ${cid}:`, error);
        res.status(500).send('Error interno del servidor al obtener el carrito');
    }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        if (!newCart) {
            return res.status(400).send('Error al crear el carrito');
        }
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        res.status(500).send('Error interno del servidor al crear el carrito');
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    try {
        // Validación de cantidad
        if (quantity <= 0) {
            return res.status(400).send('La cantidad debe ser un número positivo');
        }

        const carrito = await cartManager.addProductToCart(parseInt(cid), parseInt(pid), quantity);
        if (!carrito) {
            return res.status(404).send(`Carrito con ID ${cid} o producto con ID ${pid} no encontrado`);
        }
        res.status(200).json(carrito);
    } catch (error) {
        console.error(`Error al agregar el producto con ID ${pid} al carrito con ID ${cid}:`, error);
        res.status(500).send('Error interno del servidor al agregar el producto al carrito');
    }
});

export default router;
