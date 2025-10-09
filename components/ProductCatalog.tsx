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
          className="w-full mt-auto bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-900 focus:ring-red-600 transition"
        >
          Consultar Oferta
        </button>
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  title: string;
  highlightedTitle: string;
  description: string;
  products: Product[];
  backgroundColor: string;
  accentColor: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ title, highlightedTitle, description, products, backgroundColor, accentColor }) => {
  const renderTitle = () => {
    return (
      <>
        <span style={{ color: accentColor }}>{highlightedTitle}</span> {title}
      </>
    );
  };

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor }}>
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