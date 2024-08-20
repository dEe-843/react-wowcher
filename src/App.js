import React, { useState, useEffect } from 'react';
import './App.css';

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branch1Response = await fetch('/branch1.json');
        const branch1 = await branch1Response.json();
        const branch1Products = branch1.products || [];

        const branch2Response = await fetch('/branch2.json');
        const branch2 = await branch2Response.json();
        const branch2Products = branch2.products || [];

        const branch3Response = await fetch('/branch3.json');
        const branch3 = await branch3Response.json();
        const branch3Products = branch3.products || [];

        // Combine products and sum up revenues
        const allProducts = [...branch1Products, ...branch2Products, ...branch3Products];
        const productMap = new Map();

        allProducts.forEach(product => {
          if (productMap.has(product.name)) {
            const existingProduct = productMap.get(product.name);
            existingProduct.sold += product.sold;
            existingProduct.unitPrice = (existingProduct.unitPrice + product.unitPrice) / 2; // Average price for simplicity
          } else {
            productMap.set(product.name, { ...product });
          }
        });

        const mergedProducts = Array.from(productMap.values());
        setProducts(mergedProducts);
        setFilteredProducts(mergedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const totalRevenue = filteredProducts.reduce((acc, product) => acc + (product.unitPrice * product.sold), 0);

  return (
    <div className="App">
      <header className="App-header">
        <div className="product-container">
          <div className="branch-section">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="products-grid">
              {filteredProducts.sort((a, b) => a.name.localeCompare(b.name)).map((product) => (
                <div key={product.id} className="product">
                  <h2>{product.name}</h2>
                  <p>Price: {formatNumber(product.unitPrice)}</p>
                  <p>Sold: {product.sold}</p>
                </div>
              ))}
            </div>
            <div className="total-revenue">
              <h2>Total Revenue: {formatNumber(totalRevenue)}</h2>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;
