import fs from 'fs';
import path from 'path';

// Obtener el __dirname usando import.meta.url
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo carrito.json
const carritoPath = path.join(__dirname, '../data/carrito.json');

export default class CartManager {
    #jsonFilename;

    constructor() {
        this.#jsonFilename = "carrito.json";
    }

    // Método para leer los carritos
    async readCarritos() {
        try {
            const data = await fs.promises.readFile(carritoPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('Error al leer carritos');
        }
    }

    // Método para escribir los carritos
    async writeCarritos(carritos) {
        try {
            await fs.promises.writeFile(carritoPath, JSON.stringify(carritos, null, 2), 'utf8');
        } catch (err) {
            throw new Error('Error al escribir carritos');
        }
    }

    // Método para obtener un carrito por su id
    async getCartById(id) {
        const carritos = await this.readCarritos();
        return carritos.find(c => c.id === id);
    }

    // Método para agregar un producto al carrito
    async addProductToCart(cartId, productId, quantity = 1) {
        const carritos = await this.readCarritos();
        const carrito = carritos.find(c => c.id === cartId);
        if (!carrito) throw new Error('Carrito no encontrado');

        // Comprobamos si el producto ya está en el carrito
        const productIndex = carrito.products.findIndex(p => p.product === productId);
        if (productIndex === -1) {
            carrito.products.push({ product: productId, quantity });
        } else {
            carrito.products[productIndex].quantity += quantity;
        }

        await this.writeCarritos(carritos);
        return carrito;
    }

    // Método para crear un nuevo carrito
    async createCart() {
        const carritos = await this.readCarritos();
        const newId = carritos.length ? Math.max(...carritos.map(c => c.id)) + 1 : 1; // Generar un id único
        const newCart = { id: newId, products: [] };
        carritos.push(newCart);
        await this.writeCarritos(carritos);
        return newCart;
    }
}
