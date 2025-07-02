import { ProductCard } from "./ProductCard";
import { Product } from "../_types/Product";

type Props = {
  products: Product[];
  onProductClick: (product: Product) => void;
};

export const ProductList: React.FC<Props> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};
