import { ProductCard } from '@/components/ProductCard';

// Define the type for our product
interface Product {
  id: string;
  imageUrl: string;
  brand: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  slug: string;
}

// Data fetching function
async function getFootwearDeals(): Promise<Product[]> {
  // For a real app, use an environment variable for the base URL
  // For now, this is fine for Vercel deployment if the API is in the same project.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products?category=footwear&count=12`, {
    // Cache the data for a certain amount of time
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!res.ok) {
    // This will be caught by the Error Boundary
    throw new Error('Failed to fetch footwear data');
  }

  return res.json();
}

// This is the essential part: exporting a default function
export default async function FootwearPage() {
  const products = await getFootwearDeals();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-left mb-12">
        <h1 className="font-serif text-4xl font-bold">Footwear Finds</h1>
        <p className="text-lg text-gray-600 mt-2">The best deals on shoes, sneakers, and boots.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}