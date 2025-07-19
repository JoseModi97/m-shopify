import { Suspense } from 'react';
import { Header } from '@/components/header';
import ProductList from '@/components/product-list';
import { Skeleton } from '@/components/ui/skeleton';

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold font-headline mb-8">Products</h1>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductList />
        </Suspense>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} M-Shopify. All rights reserved.</p>
      </footer>
    </div>
  );
}
