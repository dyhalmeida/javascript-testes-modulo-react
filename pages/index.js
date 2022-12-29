import { useState, useEffect } from 'react';
import ProductCard from '../components/product-card'
import Search from '../components/search'
import { useFetchProducts } from '../hooks/use-fetch-products'

export default function Home() {

  const { products, error } = useFetchProducts()
  const [term, setTerm] = useState('');
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    if (!term) {
      setLocalProducts(products);
    } else {
      setLocalProducts(
        products.filter(({ description }) => {
          return description.toLowerCase().indexOf(term.toLowerCase()) > -1;
        }),
      );
    }
  }, [products, term]);

  return (
    <main data-testid="product-list" className="my-8">
      <Search doSearch={(term) => setTerm(term)} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">
          {localProducts.length === 1 ? ('1 Product') : (`${localProducts.length} Products`)}
        </span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {
            localProducts.length
            ? ( localProducts.map(product => <ProductCard product={product} key={product.id} />) )
            : !error 
            ? ( <h4 data-testid="no-products">No products</h4> ) 
            : null
          }
          {
            error ? <h4 data-testid="server-error">Server is down</h4> : null
          }
        </div>
      </div>
    </main>
  );
}
