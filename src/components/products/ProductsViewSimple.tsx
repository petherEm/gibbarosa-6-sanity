import ProductThumb from "./ProductThumb";
import type { Product } from "../../../sanity.types";

interface ProductsViewProps {
  products: Product[];
  lang: string;
}

export default function ProductsViewWithFilters({
  products,
  lang,
}: ProductsViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductThumb key={product._id} product={product} lang={lang} />
        ))}
      </div>
    </div>
  );
}
