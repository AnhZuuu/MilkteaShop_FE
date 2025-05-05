import React, { useEffect, useState } from "react";

const sizeLabels = ["S", "M", "L"];

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: OrderItem) => void;
}

interface ToppingModalProps {
  onClose: () => void;
  onConfirm: (mainProduct: Product, selectedToppings: Product[]) => void;
  onAddToCart: (item: OrderItem) => void;
  selectedToppings: Product[];
  setSelectedToppings: (toppings: Product[]) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [toppings, setToppings] = useState<Product[]>([]);
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [productSize, setProductSize] = useState<ProductSize[]>([]);
  const [productSizePrice, setProductSizePrice] = useState<ProductSize[]>([]);

  const handleSizeClick = (size: ProductSize) => {
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
    const fetchToppings = async () => {
      try {
        const [productsRes, categoryMapRes] = await Promise.all([
          fetch(
            "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"
          ),
          fetch(
            "https://6804ddf079cb28fb3f5c082f.mockapi.io/swp391/CategoryExtraMappings"
          ),
        ]);

        const products = await productsRes.json();
        const categoryExtraMapping = await categoryMapRes.json();

        const linkedExtraCategoryIds = categoryExtraMapping
          .filter(
            (mapping: categoryExtraMapping) =>
              mapping.mainCategoryId === product.categoryId
          )
          .map((mapping: categoryExtraMapping) => mapping.extraCategoryId);

        const extraProducts = products.filter(
          (p: Product & { productType?: string }) =>
            p.productType === "Extra" &&
            linkedExtraCategoryIds.includes(p.categoryId)
        );
        console.log("show extraProduct: " + linkedExtraCategoryIds);
        setToppings(extraProducts);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    const fetchProductSize = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize"
        );
        const data = await res.json();
        setProductSize(data.filter((ps: any) => ps.productId == product.id));
        setProductSizePrice(data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchToppings();
    fetchProductSize();
  }, [product.categoryId]);

  const ToppingModal: React.FC<ToppingModalProps> = ({
    onClose,
    onConfirm,
    onAddToCart,
    selectedToppings,
    setSelectedToppings,
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1c2c41] p-6 rounded-2xl shadow-lg w-full max-w-md text-white space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">
            Chọn kích thước:{" "}
            <span className="text-blue-400">{product.productName}</span>
          </h2>
          <div className="flex justify-center gap-4">
            {productSize.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeClick(size)}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors duration-200 ${
                  selectedSize?.id === size.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-black hover:bg-blue-100"
                }`}
              >
                {sizeLabels[size.size]} - {size.price.toLocaleString()}₫
              </button>
            ))}
          </div>
        </div>

        <div>
          {toppings.length > 0 ? (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">
                Chọn Topping
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {toppings.map((topping) => {
                  const toppingSize = productSizePrice.find(
                    (ps) => ps.productId === topping.id
                  );
                  const toppingPrice = toppingSize?.price ?? 0;
                  console.log("topping : " + toppingPrice);
                  return (
                    <div
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 shadow-sm ${
                        selectedToppings.some((t) => t.id === topping.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-black hover:bg-blue-100"
                      }`}
                    >
                      <p className="font-medium">{topping.productName}</p>
                      <p className="text-sm text-gray-600">
                        {toppingPrice.toLocaleString()}₫
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!selectedSize}
            onClick={() => {
              if (!selectedSize) return;
              const orderItem: OrderItem = {
                id: crypto.randomUUID(),
                orderId: "",
                order: null,
                productSizeId: selectedSize.id,
                productSize: selectedSize,
                quantity: 1,
                price: selectedSize.price,
                description: `Order of ${product.productName}`,
                toppings: selectedToppings,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: "",
                createdBy: "min",
                updatedBy: "min",
              };
              onConfirm(product, selectedToppings);
              onAddToCart(orderItem);
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
        className="w-full aspect-square object-cover rounded"
      />
      <h3 className="text-lg mt-2 font-semibold">{product.productName}</h3>
      <h4 className="text-md text-gray-300">{product.description}</h4>
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
