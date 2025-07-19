import type { Product } from "@/types";
import { ProductCard } from "./product-card";

async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }
        return res.json();
    } catch (error) {
        console.error(error);
        // In a real app, you'd want to handle this more gracefully
        return [];
    }
}


export default async function ProductList() {
    const products = await getProducts();

    if (products.length === 0) {
        return <p>No products found. Please try again later.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
