import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Fetched products:', products.length);
    res.status(200).json(products); 
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};


export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    
    console.log('Creating product with data:', {
      name, description, price, category, inStock
    });
    console.log('Uploaded file:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      inStock: inStock === 'true',
      image: req.file.filename 
    });

    const savedProduct = await product.save();
    console.log('Product created successfully:', savedProduct._id);
    
    res.status(201).json(savedProduct); 
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, inStock } = req.body;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      inStock: inStock === 'true'
    };

    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Deleted old image:', product.image);
        }
      }
      updateData.image = req.file.filename;
      console.log('Updated image to:', req.file.filename);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProduct); 
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Deleted image file:', product.image);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted:', req.params.id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};