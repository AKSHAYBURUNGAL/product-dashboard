import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(upload.single('image'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(upload.single('image'), updateProduct) 
  .delete(deleteProduct);

export default router;