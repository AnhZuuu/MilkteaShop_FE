"use client";
import React, { useState, useEffect } from "react";

export interface CreateProductPayload {
  productName: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  productType: "Main" | "Extra";
}

interface HandleCreateProductProps {
  onClose: () => void;
  userInfo: any;
  onProductCreated: (newProduct: any) => void;
}

const HandleCreateProduct: React.FC<HandleCreateProductProps> = ({
  onClose,
  userInfo,
  onProductCreated,
}) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState<"Main" | "Extra">("Main");

  const [priceS, setPriceS] = useState<number | null>(null);
  const [priceM, setPriceM] = useState<number | null>(null);
  const [priceL, setPriceL] = useState<number | null>(null);
  const [extraPrice, setExtraPrice] = useState<number | null>(null);

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Category",
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [userInfo?.token]);

  const handleSubmit = async () => {
    // e.preventDefault();

    // if (!productName.trim() || !description.trim() || !imageUrl.trim() || !categoryId) return;

    // const productPayload: CreateProductPayload = {
    //   productName,
    //   description,
    //   imageUrl,
    //   categoryId,
    //   productType,
    // };

    try {
      const res = await fetch(
        "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          // body: JSON.stringify(productPayload),
          body: JSON.stringify({
            productName: productName,
            description: description,
            imageUrl: imageUrl,
            categoryId: categoryId,
            productType: productType
          }),

        }
      );

      if (!res.ok) throw new Error("Lỗi tạo sản phẩm");
      console.log("product new created: " + res)

      // const createdProduct = await res.json();
      // const createdProduct = text.json();
      const text = await res.text();
      const createdProduct = text ? JSON.parse(text) : null;

      console.log("productid new created: " + createdProduct.id)
      if (!createdProduct || !createdProduct.id) {
        throw new Error("Không nhận được dữ liệu sản phẩm từ server.");
      }

      if (productType === "Main") {
        const sizePayloads = [
          { size: 0, price: priceS },
          { size: 1, price: priceM },
          { size: 2, price: priceL },
        ];

        for (const entry of sizePayloads) {
          if (entry.price !== null) {
            await fetch(
              "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo?.token}`,
                },
                body: JSON.stringify({
                  productId: createdProduct.id,
                  productName: `${productName} size ${["S", "M", "L"][entry.size]}`,
                  size: entry.size,
                  price: entry.price,
                }),
              }
            );
          }
        }
        // } else if (extraPrice !== null) {
      } else if (productType === "Extra") {
        console.log("set gia cho san pham" + createdProduct.id)
        await fetch(
          "https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo?.token}`,
            },
            body: JSON.stringify({
              productId: createdProduct.id,
              productName: `${productName} (Topping)`,
              size: -1,
              price: extraPrice,
            }),
          }
        );
      }

      onProductCreated(createdProduct);
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm hoặc giá:", error);
    } finally {
      onClose();
      setProductName("");
      setDescription("");
      setImageUrl("");
      setCategoryId("");
      setProductType("Main");
      setPriceS(null);
      setPriceM(null);
      setPriceL(null);
      setExtraPrice(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-center">Tạo sản phẩm mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Tên sản phẩm *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Mô tả</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Ảnh (URL)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Loại sản phẩm *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Chọn loại --</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Loại (Main hoặc Extra)</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as "Main" | "Extra")}
              className="w-full p-2 border rounded"
            >
              <option value="Main">Main</option>
              <option value="Extra">Extra</option>
            </select>
          </div>

          {productType === "Main" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium">Giá size S</label>
                <input
                  type="number"
                  value={priceS ?? ""}
                  onChange={(e) => setPriceS(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Giá size M</label>
                <input
                  type="number"
                  value={priceM ?? ""}
                  onChange={(e) => setPriceM(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Giá size L</label>
                <input
                  type="number"
                  value={priceL ?? ""}
                  onChange={(e) => setPriceL(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-medium">Giá topping</label>
              <input
                type="number"
                value={extraPrice ?? ""}
                onChange={(e) => setExtraPrice(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tạo sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandleCreateProduct;
