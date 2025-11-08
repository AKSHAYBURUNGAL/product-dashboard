import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from backend...');
      const response = await axios.get('http://localhost:5000/api/products');
      console.log('Products fetched:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
        console.log('Product deleted:', productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Product Dashboard</h1>
        <Link to="/add-product" className="add-product-btn">
          Add New Product
        </Link>
      </header>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found. Add your first product!</p>
            <Link to="/add-product" className="btn-primary">
              Add Product
            </Link>
          </div>
        ) : (
          products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;