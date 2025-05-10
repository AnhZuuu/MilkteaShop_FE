import React from "react";

interface ComboCartPanelProps {
  cart: ComboItem[];
  onRemove: (index: number) => void;
  isCheckout: boolean;
  setIsCheckout: React.Dispatch<React.SetStateAction<boolean>>;
}

const ComboCartPanel: React.FC<ComboCartPanelProps> = ({
  cart,
  onRemove,
  setIsCheckout,
}) => {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  function getSizeLabel(size: number): string {
    switch (size) {
      case 0:
        return "size S";
      case 1:
        return "size M";
      case 2:
        return "size L";
      case -1:
        return "Topping";
      default:
        return "Unknown Size";
    }
  }

  const groupCombos = (combos: ComboItem[]) => {
    const groups: { key: string; item: ComboItem; count: number }[] = [];

    combos.forEach((combo) => {
      const key = JSON.stringify({
        comboCode: combo.comboCode,
        products: combo.products
          .map((p) => ({
            productId: p.productId,
            size: p.productSize.size,
          }))
          .sort((a, b) =>
            a.productId.localeCompare(b.productId) || a.size - b.size
          ),
      });

      const found = groups.find((g) => g.key === key);
      if (found) {
        found.count += 1;
      } else {
        groups.push({ key, item: combo, count: 1 });
      }
    });

    return groups;
  };

  const groupedCombos = groupCombos(cart);

  return (
    <div className="w-[30%] bg-white text-black p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">🛒 Giỏ hàng</h2>
      <div className="flex-1 overflow-y-auto">
        {groupedCombos.map(({ item, count }, index) => (
          <div
            key={index}
            className="relative border-b py-2 px-1 shadow-sm bg-white rounded"
          >
            {count > 1 && (
              <div className="absolute bottom-2 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded-bl">
                x{count}
              </div>
            )}

            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Combo: {item.comboCode}</p>
                <p>{item.price.toLocaleString()}đ</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.products.map((p) => (
                    <div
                      key={p.productId + p.productSize.size}
                      className="flex items-center bg-gray-100 rounded p-1"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.productName}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="ml-2">
                        <p>{p.productName}</p>
                        <p>{getSizeLabel(p.productSize.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onRemove(index)} // Optional: could adjust to remove ALL of this group
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <p className="text-lg font-bold">
          Tổng tiền: {total.toLocaleString()}đ
        </p>
        <button
          onClick={() => setIsCheckout(true)}
          className="w-full mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default ComboCartPanel;
