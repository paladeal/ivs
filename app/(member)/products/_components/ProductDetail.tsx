import Image from "next/image";
import {Product} from "../_types/Product";
type Props = {
  product: Product;
  onClose: () => void;
}
export const ProductDetail: React.FC<Props> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="w-full md:w-1/2 h-64 object-cover rounded-xl shadow-md" />
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {product.name}
            </h2>
            <p className="text-blue-600 font-bold text-2xl mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {product.price}
            </p>
            <p className="text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {product.description}
            </p>
            <p className="text-gray-600 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong className="font-semibold">詳細:</strong> {product.details}
            </p>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md" style={{ fontFamily: 'Inter, sans-serif' }}>
                カートに入れる
              </button>
              <button className="bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-md" style={{ fontFamily: 'Inter, sans-serif' }}>
                お気に入り
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
