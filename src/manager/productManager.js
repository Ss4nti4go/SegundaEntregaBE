import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productosPath = path.join(__dirname, '../data/productos.json');

export default class ProductManager {
    #jsonFilename;
    #socketIo;

    constructor(io) {
        this.#jsonFilename = "productos.json";
        this.#socketIo = io;
    }

    async readProducts() {
        try {   
            const data = await fs.promises.readFile(productosPath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('Error al leer productos');
        }
    }

    async writeProducts(productos) {
        try {
            await fs.promises.writeFile(productosPath, JSON.stringify(productos, null, 2), 'utf8');
        } catch (err) {
            throw new Error('Error al escribir productos');
        }
    }

    async getProducts() {
        try {
            return await this.readProducts();
        } catch (err) {
            throw new Error(`Error al obtener los productos: ${err.message}`);
        }
    }

    async addProduct(productData) {
        if (!productData || !productData.title || !productData.price) {
            throw new Error('El producto debe incluir al menos el nombre y el precio');
        }

        const productos = await this.readProducts();
        const newId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        const newProduct = { id: newId, ...productData };
        productos.push(newProduct);
        await this.writeProducts(productos);

        // Emitir la lista actualizada de productos
        if (this.#socketIo) {
            this.#socketIo.emit('updateProducts', productos);  // Emite la lista completa de productos
        }

        return newProduct;
    }
    async getProductById(id) {
        try {
            const productos = await this.readProducts();
            const producto = productos.find(p => p.id === id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            return producto;
        } catch (err) {
            throw new Error(`Error al obtener el producto: ${err.message}`);
        }
    }
    async deleteProduct(id) {
        const productos = await this.readProducts();
        const updatedProductos = productos.filter(p => p.id !=id);
        if (updatedProductos.length == productos.length) {
            throw new Error('Producto no encontrado');
        }
        await this.writeProducts(updatedProductos);

        // Emitir la lista actualizada de productos después de la eliminación
        if (this.#socketIo) {
            this.#socketIo.emit('updateProducts', updatedProductos);  // Emite la lista completa de productos
        }

        return true;
    }
}
