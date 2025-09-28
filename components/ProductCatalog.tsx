import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, image } = product;

  const handleScrollToForm = () => {
    document.getElementById('lead-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-red-900 rounded-lg shadow-xl overflow-hidden border border-red-800 flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-4 flex-grow">{name}</h3>
        <button
          onClick={handleScrollToForm}
          className="w-full mt-auto bg-amber-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition"
        >
          Consultar Oferta
        </button>
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  title: string;
  description: string;
  products: Product[];
  accentColor: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ title, description, products, accentColor }) => {
  // A simple way to inject a span with the accent color into the title
  const renderTitle = () => {
    const parts = title.split(/(\sImperdíveis|\sImbatíveis|\sExclusivas)/i);
    return (
      <>
        {parts[0]}
        {parts[1] && <span style={{ color: accentColor }}>{parts[1]}</span>}
        {parts.slice(2).join('')}
      </>
    );
  };

  return (
    <section className="bg-red-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {renderTitle()}
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;