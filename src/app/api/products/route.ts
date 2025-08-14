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
