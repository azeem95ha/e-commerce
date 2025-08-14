import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/Badge';
import { ArrowRight } from 'lucide-react';

export interface Product {
  id: string;
  imageUrl: string;
  brand: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  slug: string; // Used for local navigation
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative border border-border-subtle rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="cursor-pointer">
        <div className="aspect-[3/4] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={400}
            height={533}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <Badge>-{product.discountPercentage}%</Badge>
        <div className="p-4">
          <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">{product.brand}</p>
          <h3 className="font-serif text-lg text-text-primary truncate mt-1">{product.title}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-xl font-bold text-accent-primary">
              ${product.discountedPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={`/products/${product.slug}`}
          className="flex items-center gap-2 bg-text-primary text-white px-4 py-2 rounded-md text-sm font-semibold">
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
