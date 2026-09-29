import ProductCard from "@/components/product-card/product-card";

export default function ProductFeatures({ allProducts }: any) {
  // Ensure we always have an array to map over
  const productsSafe = Array.isArray(allProducts?.items)
    ? allProducts.items
    : Array.isArray(allProducts)
      ? allProducts
      : [];

  return (
    <div className="mt-5">
      <h2 className="font-bold text-xl">جدیدترین ها:</h2>
      <div className="flex flex-wrap justify-between gap-4">
        {productsSafe.slice(0, 5).map((item: any, index: number) => (
          <ProductCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
