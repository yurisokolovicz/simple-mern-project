import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import NewProduct from './components/Products/NewProduct';
import ProductList from './components/Products/ProductList';
import './App.css';

// When loadedProducts changes, the component will be re-evaluated. The UI will be re-rendered and the new products will be displayed. This means that the useEffect function will be executed again.
function App() {
    const [loadedProducts, setLoadedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // When the component is rendered for the first time, the useEffect function will be executed. But when the component is re-evaluated, the useEffect function will not be executed again. This is because the useEffect function is only executed when the dependencies change. Since the dependencies are an empty array, they will never change. So the useEffect function will only be executed once.
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/products');

            const responseData = await response.json();

            setLoadedProducts(responseData.products);
            setIsLoading(false);
        };

        fetchProducts();
    }, []);
    // Here we build a product object and also send it to the back-end to a url (http://localhost:5000/product). We use POST (ir trigger the app.post function at the back-end server.js) because we are sending data to the back-end. We also set the Content-Type header to application/json because we are sending JSON data.
    const addProductHandler = async (productName, productPrice) => {
        try {
            const newProduct = {
                title: productName,
                price: +productPrice // "+" to convert string to number
            };
            let hasError = false;
            const response = await fetch('http://localhost:5000/product', {
                method: 'POST',
                // To attach the data to the request
                body: JSON.stringify(newProduct),
                // To tell the back-end that we are sending JSON data
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // We check if the response is ok or not. If it is not ok, we throw an error. We also parse (analise) the response data and store it in a variable.
            if (!response.ok) {
                hasError = true;
            }

            const responseData = await response.json();

            if (hasError) {
                throw new Error(responseData.message);
            }
            // If everything is fine then we update the state with the new product and re-rendering the component (UI)
            setLoadedProducts(prevProducts => {
                return prevProducts.concat({
                    ...newProduct,
                    id: responseData.product.id
                });
            });
        } catch (error) {
            alert(error.message || 'Something went wrong!');
        }
    };

    return (
        <React.Fragment>
            <Header />
            <main>
                <NewProduct onAddProduct={addProductHandler} />
                {isLoading && <p className="loader">Loading...</p>}
                {!isLoading && <ProductList items={loadedProducts} />}
            </main>
        </React.Fragment>
    );
}

export default App;
