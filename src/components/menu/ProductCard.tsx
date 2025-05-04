import React, { useEffect, useState } from "react";

// ----------- INTERFACES -----------

interface Product {
  id: string;
  productName: string;
  description: string;
  categoryId: string;
  category: any;
  imageUrl: string;
  productType: string | null;
  productSizes: any[];
  price: number;
  isActive: boolean;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  toppings: Product[];
}

interface CategoryExtraMappings {
  MainCategoryId: string;
  ExtraCategoryId: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
}

interface ToppingModalProps {
  onClose: () => void;
  onConfirm: (mainProduct: Product, selectedToppings: Product[]) => void;
  onAddToCart: (item: CartItem) => void;
  selectedToppings: Product[];
  setSelectedToppings: (toppings: Product[]) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [toppings, setToppings] = useState<Product[]>([]);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const toggleTopping = (topping: Product) => {
    setSelectedToppings((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsRes, categoryMapRes] = await Promise.all([
          fetch("https://6801a85581c7e9fbcc430ea1.mockapi.io/swp391/Products"),
          fetch(
            "https://6804ddf079cb28fb3f5c082f.mockapi.io/swp391/CategoryExtraMappings"
          ),
        ]);

        const products = await productsRes.json();
        const categoryExtraMapping = await categoryMapRes.json();

        const linkedExtraCategoryIds = categoryExtraMapping
          .filter(
            (mapping: CategoryExtraMappings) =>
              mapping.MainCategoryId === product.categoryId
          )
          .map((mapping: CategoryExtraMappings) => mapping.ExtraCategoryId);

        const extraProducts = products.filter(
          (p: Product & { productType?: string }) =>
            p.productType === "Extra" &&
            linkedExtraCategoryIds.includes(p.categoryId)
        );

        setToppings(extraProducts);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    fetchProducts();
  }, [product.categoryId]);

  const ToppingModal: React.FC<ToppingModalProps> = ({
    onClose,
    onConfirm,
    onAddToCart,
    selectedToppings,
    setSelectedToppings,
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1c2c41] p-6 rounded shadow-md w-96 text-white">
        <div className="flex justify-center gap-2 mb-4">
          {product.productSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              className={`px-4 py-1 rounded ${
                selectedSize === size
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <h2 className="text-lg font-bold mb-4">
          Chọn topping cho: {product.productName}
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {toppings.map((topping) => (
            <div
              key={topping.id}
              className={`cursor-pointer p-2 rounded ${
                selectedToppings.some((t) => t.id === topping.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => toggleTopping(topping)}
            >
              <p className="text-black">
                {topping.productName} - {topping.price.toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-1 bg-gray-300 rounded text-black"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!selectedSize}
            onClick={() => {
              const cartItem: CartItem = {
                ...product,
                quantity: 1,
                selectedSize: selectedSize ?? product.productSizes[0],
                toppings: selectedToppings ?? [],
              };
              onConfirm(product, selectedToppings);
              onAddToCart(cartItem);
              onClose();
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#1c2c4a] p-4 rounded shadow-lg text-white">
      <img
        src={product.imageUrl}
        alt={product.productName}
        className="h-50 w-full object-cover rounded"
      />
      <h3 className="text-lg mt-2 font-semibold">{product.productName}</h3>
      <h4 className="text-md text-gray-300">{product.description}</h4>
      <p className="text-sm text-gray-400">
        {product.price.toLocaleString()} đ
      </p>
      <button
        className="mt-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 w-full"
        onClick={() => setShowToppingModal(true)}
      >
        +
      </button>

      {showToppingModal && (
        <ToppingModal
          onClose={() => setShowToppingModal(false)}
          onConfirm={() => {}}
          onAddToCart={onAddToCart}
          selectedToppings={selectedToppings}
          setSelectedToppings={setSelectedToppings}
        />
      )}
    </div>
  );
};

export default ProductCard;
