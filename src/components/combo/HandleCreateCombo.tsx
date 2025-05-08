"use client";
import React, { useEffect, useState } from "react";

interface ProductSize {
    id: string;
    productId: string;
    size: number;
    price: number;
}

interface Product {
    id: string;
    productName: string;
}

interface ComboItem {
    comboCode: string;
    description: string;
    productSizes: ProductSize[];
    price: number;
}

interface HandleCreateComboProps {
    onClose: () => void;
    onComboCreated: (combo: ComboItem) => void;
}

const HandleCreateCombo: React.FC<HandleCreateComboProps> = ({
    onClose,
    onComboCreated,
}) => {
    const [comboCode, setComboCode] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProductSizeIds, setSelectedProductSizeIds] = useState<string[]>([]);
    const [comboPrice, setComboPrice] = useState<number>(0);

    const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const sizeLabel = (size: number): string => {
        switch (size) {
            case 0:
                return "S";
            case 1:
                return "M";
            case 2:
                return "L";
            default:
                return "Unknown";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const [productSizeRes, productRes] = await Promise.all([
                fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ProductSize"),
                fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Product"),
            ]);

            const psData = await productSizeRes.json();
            const pData = await productRes.json();

            setProductSizes(psData);
            setProducts(pData);
        };

        fetchData();
    }, []);

    const getProductNameById = (productId: string) => {
        const product = products.find((p) => p.id === productId);
        return product ? product.productName : "Unknown Product";
    };

    // const handleSubmit = async () => {
    //     const selectedProductSizes = productSizes.filter((ps) =>
    //         selectedProductSizeIds.includes(ps.id)
    //     ).map((ps) => ({
    //         ...ps,
    //         productName: getProductNameById(ps.productId),
    //     }));

    //     const newCombo: ComboItem = {
    //         comboCode,
    //         description,
    //         productSizes: selectedProductSizes,
    //         price: comboPrice,
    //     };

    //     try {
    //         const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(newCombo),
    //         });

    //         if (!res.ok) throw new Error("Failed to create combo");

    //         onComboCreated(newCombo);
    //         onClose();
    //     } catch (error) {
    //         console.error("Error creating combo:", error);
    //     }
    // };

    const handleSubmit = async () => {
        const newCombo = {
            comboCode,
            description,
            productSizeIds: selectedProductSizeIds,
            price: comboPrice,
        };

        try {
            const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/ComboItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCombo),
            });

            if (!res.ok) throw new Error("Failed to create combo");

            // Only parse JSON if there's content
            const text = await res.text();
            const createdCombo = text ? JSON.parse(text) : newCombo;

            onComboCreated(createdCombo);
            onClose();
        } catch (error) {
            console.error("Error creating combo:", error);
        }
    };



    const toggleProductSizeSelection = (id: string) => {
        setSelectedProductSizeIds((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-xl space-y-4">
                <h2 className="text-xl font-bold">Tạo Combo mới</h2>

                <div>
                    <label className="block font-medium">Mã Combo</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={comboCode}
                        onChange={(e) => setComboCode(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium">Mô tả</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium">Chọn sản phẩm</label>
                    <div className="max-h-40 overflow-y-auto border p-2 rounded">
                        {productSizes.map((ps) => (
                            <div key={ps.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedProductSizeIds.includes(ps.id)}
                                    onChange={() => toggleProductSizeSelection(ps.id)}
                                />
                                <span>{getProductNameById(ps.productId)} -
                                    {sizeLabel(ps.size) !== "Unknown" && (
                                        <span>Size {sizeLabel(ps.size)}</span>
                                    )} - {ps.price}đ</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Giá combo</label>
                    <input
                        type="number"
                        className="w-full border p-2 rounded"
                        value={comboPrice}
                        onChange={(e) => setComboPrice(Number(e.target.value))}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Tạo Combo</button>
                </div>
            </div>
        </div>
    );
};

export default HandleCreateCombo;
