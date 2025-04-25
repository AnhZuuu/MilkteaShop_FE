import React, { useEffect, useState } from "react";

// Define types for Product and CartItem
interface Product {
  ProductName: string;
  CategoryId: string;
  Description: string;
  ImageUrl: string;
  Price: number;
  Size: string[];
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date;
  CreatedBy: string;
  UpdatedBy: string;
  Id: string;
}

interface CategoryExtraMappings {
  MainCategoryId: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

interface ToppingModalProps {
  onClose: () => void;
  onConfirm: (mainProduct: Product, selectedToppings: Product[]) => void;
  onAddToCart: (product: Product) => void;
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
  // Function to toggle topping selection
  const toggleTopping = (topping: Product) => {
    setSelectedToppings((prev: Product[]) =>
      prev.find((t) => t.Id === topping.Id)
        ? prev.filter((t) => t.Id !== topping.Id)
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

        console.log("extra ", categoryExtraMapping);

        // Find all extra category IDs linked to this main category
        const linkedExtraCategoryIds = categoryExtraMapping
          .filter((mapping: any) => mapping.MainCategoryId === product.CategoryId)
          .map((mapping: any) => mapping.ExtraCategoryId);

        // Filter products where ProductType === "Extra" and CategoryId is in linkedExtraCategoryIds
        const extraProducts = products.filter((product: any) =>
            product.ProductType === "Extra" &&
            linkedExtraCategoryIds.includes(product.CategoryId)
        );

        console.log("Filtered Products:", extraProducts);
        setToppings(extraProducts);
        // setToppings(extraProducts && extraProducts.filter((p: any) => p.CategoryId == categoryExtra.MainCategoryId));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    onAddToCart(product); // Call the passed function
  };

  // ToppingModal component
  const ToppingModal: React.FC<ToppingModalProps> = ({
    onClose,
    onConfirm,
    onAddToCart,
    selectedToppings,
    setSelectedToppings,
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1c2c41] p-6 rounded shadow-md w-96">
        {/* Size Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          {product.Size.map((size: string) => (
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
        <h2 className="text-lg font-bold mb-4 text-white">
          Chọn topping cho: {product.ProductName}
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {toppings.map((topping) => (
            <div
              key={topping.Id}
              className={`cursor-pointer p-2 rounded ${
                selectedToppings.some((t) => t.Id === topping.Id)
                  ? "bg-green-200"
                  : "bg-gray-200"
              }`}
              onClick={() => toggleTopping(topping)}
            >
              <p className="text-black">
                {topping.ProductName} - {topping.Price.toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-1 bg-gray-300 rounded" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded"
            onClick={() => {
              onConfirm(product, selectedToppings); // Confirm selection
              // onAddToCart(product); // Add main product to cart
              onAddToCart({ ...product });
              onClose(); // Close modal
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#1c2c4a] p-4 rounded shadow-lg">
      <img
        src={product.ImageUrl}
        alt={product.ImageUrl}
        className="h-50 w-full object-cover rounded"
      />
      <h3 className="text-lg mt-2 font-semibold">{product.ProductName}</h3>
      <h4 className="text-md text-gray-300">{product.Description}</h4>
      <p className="text-sm text-gray-400">
        {product.Price.toLocaleString()} đ
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
          onConfirm={(mainProduct, selectedToppings) => {
            console.log(mainProduct, selectedToppings); // Handle confirmation
          }}
          onAddToCart={handleAddToCart}
          selectedToppings={selectedToppings}
          setSelectedToppings={setSelectedToppings}
        />
      )}
    </div>
  );
};

export default ProductCard;
