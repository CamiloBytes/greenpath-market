import { ProductCard } from "../../ui/Cards";
import { getProducts } from "@/src/data/products";

export const ProductSection = async () => {
  const products = await getProducts();

  return (
    <section className="flex flex-col mt-12">
      <div className="flex flex-col items-start justify-center pt-6 gap-4">
        <h2 className="text-3xl font-bold tracking-wider text-white ">
          Products
        </h2>
      </div>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id_product} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-300 italic">
          No hay productos disponibles.
        </p>
      )}
    </section>
  );
};
