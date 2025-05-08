import { useEffect, useRef, useState } from "react";

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/top-selling-products"
        );
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.log("Error fetching top product: ", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-4 overflow-x-auto py-4 scroll-smooth overflow-x-auto scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[200px] flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 text-center font-semibold">
              {product.productName}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductCarousel;
