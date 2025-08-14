#!/bin/bash

# ==============================================================================
# Aether Deals - FAKE DATA Project Bootstrapper
# ==============================================================================
# This script sets up the project to use dynamic, fake data generation.
# It removes the need for Amazon API keys or a database.
# ==============================================================================

echo "🚀 Starting Aether Deals project setup (Fake Data Mode)..."

# 0. Install Faker.js for data generation
echo "Installing @faker-js/faker..."
npm install @faker-js/faker

# 1. Create Core Directories
echo "Creating directory structure..."
mkdir -p src/app/api/products
mkdir -p src/app/products/[id] # For future Product Detail Pages
mkdir -p src/app/footwear
mkdir -p src/components/ui
mkdir -p src/components/shared
mkdir -p src/lib

# 2. Create Placeholder Files with Boilerplate Code
echo "Creating component and utility files..."

# --- lib/utils.ts (Unchanged) ---
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# --- components/ProductCard.tsx (MODIFIED) ---
# Link now points to a local page and button text is changed.
cat > src/components/ProductCard.tsx << 'EOF'
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
EOF

# --- components/shared/Header.tsx (Unchanged) ---
cat > src/components/shared/Header.tsx << 'EOF'
import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold">Aether Deals</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/footwear" className="transition-colors hover:text-accent-primary">Footwear</Link>
          <Link href="/eyewear" className="transition-colors hover:text-accent-primary">Eyewear</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 transition-colors hover:text-accent-primary"><User size={20} /></button>
          <button className="p-2 transition-colors hover:text-accent-primary"><ShoppingBag size={20} /></button>
        </div>
      </div>
    </header>
  );
}
EOF

# --- components/shared/Footer.tsx (MODIFIED) ---
# Removed affiliate disclosure.
cat > src/components/shared/Footer.tsx << 'EOF'
export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-white">
      <div className="container mx-auto py-8 px-4 text-center text-gray-500">
        <p className="text-sm">
          © {new Date().getFullYear()} Aether Deals. All Rights Reserved.
        </p>
        <p className="text-xs mt-4">
          This is a demonstration website. All products and prices are randomly generated.
        </p>
      </div>
    </footer>
  );
}
EOF

# 3. Create API Route with Faker.js (MODIFIED)
echo "Creating mock API route with Faker.js..."
cat > src/app/api/products/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

function createRandomProduct(category: 'footwear' | 'eyewear') {
  const discountedPrice = parseFloat(faker.commerce.price({ min: 25, max: 200 }));
  const discountPercentage = faker.number.int({ min: 15, max: 75 });
  const originalPrice = discountedPrice / (1 - discountPercentage / 100);
  const title = faker.commerce.productName();

  return {
    id: faker.string.uuid(),
    imageUrl: faker.image.urlLoremFlickr({ 
        category: category === 'footwear' ? 'shoes' : 'sunglasses',
        width: 400,
        height: 533,
    }),
    brand: faker.company.name(),
    title: title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    originalPrice: parseFloat(originalPrice.toFixed(2)),
    discountedPrice: discountedPrice,
    discountPercentage: discountPercentage,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get('count')) || 20;
  const categoryParam = searchParams.get('category') || 'all';

  const category = categoryParam === 'footwear' || categoryParam === 'eyewear' ? categoryParam : 'footwear';

  const products = Array.from({ length: count }, () => 
    createRandomProduct(categoryParam === 'all' ? (Math.random() > 0.5 ? 'footwear' : 'eyewear') : category)
  );

  return NextResponse.json(products);
}
EOF

# 4. Create Page files (Unchanged logic, just ensure they exist)
echo "Creating page files..."
touch src/app/footwear/page.tsx
touch src/app/products/[id]/page.tsx

# 5. Final Confirmation
echo "✅ Setup complete!"
echo "Your project is now running in FAKE DATA mode."
echo "Next steps:"
echo "1. Update 'src/app/layout.tsx' and 'src/app/page.tsx' to use the generated components and fetch from the API."
echo "2. Run 'npm run dev' to start the development server."