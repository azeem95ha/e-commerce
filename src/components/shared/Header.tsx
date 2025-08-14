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
