// ComboOrderSummary.tsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ComboItem {
    id: string;
    comboCode: string;
    price: number;
}

interface ComboOrderSummaryProps {
    cart: ComboItem[];
    userId: string;
    setIsCheckout: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirmOrder: (orderData: any) => Promise<void>;
}

const ComboOrderSummary: React.FC<ComboOrderSummaryProps> = ({ cart, userId, setIsCheckout }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userInfo, setUser] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState<0 | 1>(0); // 0: Tiền mặt, 1: chiển khoản
    const [showTransferImage, setShowTransferImage] = useState(false);


    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        }
    }, []);

    useEffect(() => {
        if (paymentMethod === 1) {
            setShowTransferImage(true);
        }
    }, [paymentMethod]);

    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

    const renderPaymentMethod = (method: 0 | 1) => (method === 0 ? "Tiền mặt" : "Chuyển khoản");

    const handleConfirmOrder = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://milkteashop-fmcufmfkaja8d6ec.southeastasia-01.azurewebsites.net/api/Order/create-combo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderNumber: Date.now().toString(),
                    totalAmount,
                    description: "Combo order",
                    paymentMethod,
                    userId,
                    storeId: "246f1b26-538e-43f5-ab34-08dd892d4d8b",
                    orderStatus: "Processing",
                    comboItems: cart.map((item) => item.id),
                }),
            });

            if (!res.ok) throw new Error("Order failed");

            alert("Order placed successfully!");
            setIsCheckout(false);
        } catch (error) {
            console.error(error);
            alert("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[30%] bg-white text-black p-4">
            <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
            {cart.map((item, idx) => (
                <div key={idx} className="mb-2">
                    <p>Combo: {item.comboCode}</p>
                    <p className="text-sm">{item.price.toLocaleString()}đ</p>
                </div>
            ))}
            <p className="font-bold mt-4">Tổng tiền thanh toán: {totalAmount.toLocaleString()}đ</p>

            <div className="mt-4">
                <p className="font-semibold mb-2">Bạn sẽ thanh toán bằng:</p>
                <label className="flex items-center gap-2 mb-2">
                    <input
                        type="radio"
                        name="payment"
                        value={0}
                        checked={paymentMethod === 0}
                        onChange={() => setPaymentMethod(0)}
                    />
                    Tiền mặt
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="payment"
                        value={1}
                        checked={paymentMethod === 1}
                        onChange={() => setPaymentMethod(1)}
                    />
                    Chuyển khoản
                </label>
            </div>

            {/* Popup Image if Chuyển khoản is selected */}
            {showTransferImage && paymentMethod === 1 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow-lg relative w-[90%] max-w-md">
                        <img
                            src="/qr.jpeg" 
                            alt="Chuyển khoản hướng dẫn"
                            className="w-full h-auto rounded"
                        />
                        <button
                            onClick={() => setShowTransferImage(false)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Đã chuyển khoản
                        </button>
                    </div>
                </div>
            )}

            {/* Show buttons only after popup is closed */}
            {paymentMethod === 0 || (paymentMethod === 1 && !showTransferImage) ? (
                <>
                    <button
                        onClick={handleConfirmOrder}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm Order"}
                    </button>
                    <button
                        onClick={() => setIsCheckout(false)}
                        className="w-full mt-2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
                    >
                        Back
                    </button>
                </>
            ) : null}


            {/* <div className="mt-4">
                <p className="font-semibold mb-2">Bạn sẽ thanh toán bằng:</p>
                <label className="flex items-center gap-2 mb-2">
                    <input
                        type="radio"
                        name="payment"
                        value={0}
                        checked={paymentMethod === 0}
                        onChange={() => setPaymentMethod(0)}
                    />
                    Tiền mặt
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="payment"
                        value={1}
                        checked={paymentMethod === 1}
                        onChange={() => setPaymentMethod(1)}
                    />
                    Chuyển khoản
                </label>
            </div>

            <button
                onClick={handleConfirmOrder}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Processing..." : "Confirm Order"}
            </button>
            <button
                onClick={() => setIsCheckout(false)}
                className="w-full mt-2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
                Back
            </button> */}
        </div>
    );
};

export default ComboOrderSummary;
