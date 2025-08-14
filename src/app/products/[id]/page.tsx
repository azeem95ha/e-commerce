import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button'; // Make sure you created this file

// Define the complete product type, including description
interface Product {
  id: string;
  imageUrl: string;
  brand: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  slug: string;
}

// Fetch a single product by its slug (the 'id' from the URL)
async function getProductDetails(slug: string): Promise<Product | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Fetch a larger list to have a high chance of finding our product by slug
  const res = await fetch(`${baseUrl}/api/products?count=100`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product list');
  }

  const products: Product[] = await res.json();
  // Find the specific product that matches the slug from the URL
  return products.find(p => p.slug === slug);
}


// The page component receives `params` from the dynamic route
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  // If the product isn't found, show a 404 page
  if (!product) {
    notFound();
  }
  
  const savings = product.originalPrice - product.discountedPrice;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image */}
        <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-4">
          <p className="text-sm uppercase font-semibold text-gray-500">{product.brand}</p>
          <h1 className="font-serif text-4xl font-bold">{product.title}</h1>

          <div className="flex items-baseline gap-4 mt-2 p-4 bg-yellow-50 border-l-4 border-accent-primary rounded-r-lg">
            <div>
              <p className="text-3xl font-bold text-accent-primary">${product.discountedPrice.toFixed(2)}</p>
              <p className="text-md text-gray-500 line-through">
                Original Price: ${product.originalPrice.toFixed(2)}
              </p>
            </div>
            <div className="font-semibold text-green-700">
              <p>You Save ${savings.toFixed(2)} ({product.discountPercentage}%)!</p>
            </div>
          </div>
          
          <div className="prose prose-lg mt-4 text-gray-700">
            <h3 className="font-serif">Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="mt-6">
             <Button size="lg" className="w-full">Add to Cart</Button>
             <p className="text-center text-xs text-gray-500 mt-2">This is a demo. No purchase will be made.</p>
          </div>
        </div>
      </div>
    </div>
  );
}