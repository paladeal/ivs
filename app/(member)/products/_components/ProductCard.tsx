import Image from "next/image";
import { Product } from "../_types/Product";
type Props = {
  product: Product;
  onClick: (product: Product) => void;
};

export const ProductCard: React.FC<Props> = ({
  product,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
      onClick={() => onClick(product)}
    >
      <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="w-full h-48 object-cover rounded-t-xl" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.description}
        </p>
        <p className="text-blue-600 font-bold text-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.price}
        </p>
      </div>
    </div>
  );
};
