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
