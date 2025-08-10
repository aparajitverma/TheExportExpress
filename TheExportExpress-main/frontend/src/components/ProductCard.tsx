import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { INITIAL_UPLOADS_URL } from '../config';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product._id}`} className="card group relative block overflow-hidden transition-transform hover:-translate-y-0.5">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md">
        <img
          src={product.images[0] ? `${INITIAL_UPLOADS_URL}/${product.images[0]}` : '/placeholder-product.jpg'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {typeof product.category === 'string' ? product.category : product.category?.name || 'Uncategorized'}
            </p>
            {product.shortDescription && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-medium text-[var(--color-primary-dark)]">Origin</p>
            <p className="text-sm text-gray-600">{product.origin}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}